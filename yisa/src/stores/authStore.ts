import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { CryptoService } from '../services/crypto'
import { DatabaseService } from '../services/database'
import type {
  AuthCredentials,
  DeviceFingerprint,
  SecurityEvent,
  SecurityEventType,
  SecuritySeverity
} from '../types'
import type { SessionEntity } from '../types/database'

interface AuthState {
  // Authentication state
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    deviceId: string
    sessionId?: string
    securityLevel: string
    lastLoginAt?: Date
  }

  // Session management
  session: SessionEntity | null
  deviceId: string
  pinAttempts: number
  lockedUntil: Date | null

  // Security
  deviceFingerprint: DeviceFingerprint | null
  securityEvents: SecurityEvent[]

  // Actions
  login: (credentials: AuthCredentials) => Promise<boolean>
  logout: () => Promise<void>
  verifyPin: (pin: string) => Promise<boolean>
  changePin: (oldPin: string, newPin: string) => Promise<boolean>
  lockSession: (duration?: number) => void
  checkSessionStatus: () => Promise<void>
  clearSecurityEvents: () => void
  addSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void
  _initializeDevice: () => Promise<string>
  _createSession: (deviceId: string) => Promise<SessionEntity>
  _validateSession: (session: SessionEntity) => Promise<boolean>
  _recordSecurityEvent: (type: string, description: string, metadata?: any) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: true,
      user: {
        deviceId: '',
        securityLevel: 'medium'
      },
      session: null,
      deviceId: '',
      pinAttempts: 0,
      lockedUntil: null,
      deviceFingerprint: null,
      securityEvents: [],

      // Initialize device on first load
      login: async (credentials: AuthCredentials) => {
        try {
          set(state => { state.isLoading = true })

          // Check if currently locked
          const state = get()
          if (state.lockedUntil && new Date() < state.lockedUntil) {
            await get()._recordSecurityEvent(
              'login_attempt',
              'Login attempted while account is locked',
              { deviceId: state.deviceId }
            )
            return false
          }

          // Initialize device if not already done
          await get()._initializeDevice()

          // Get stored session data
          const db = DatabaseService.getInstance()
          let sessions = await db.getSessionsByDevice(state.deviceId)
          let session: SessionEntity
          let isNewUser = false

          if (sessions.length === 0) {
            // Create new session for first-time user
            isNewUser = true
            session = await get()._createSession(state.deviceId)

            // Hash the PIN and store in session
            const cryptoService = CryptoService.getInstance()
            const { hash: pinHash, salt: pinSalt } = await cryptoService.hashPin(credentials.pin)

            await db.updateSession(session.id, { pinHash, pinSalt })

            await get()._recordSecurityEvent(
              'account_created',
              'New user account created',
              { deviceId: state.deviceId, sessionId: session.id }
            )
          } else {
            session = sessions[0]
          }

          // Verify PIN (skip for new users as PIN was just set)
          const cryptoService = CryptoService.getInstance()
          let pinValid = true

          if (!isNewUser) {
            pinValid = await cryptoService.verifyPin(
              credentials.pin,
              session.pinHash,
              session.pinSalt
            )
          }

          if (!pinValid) {
            set(state => {
              state.pinAttempts += 1
              if (state.pinAttempts >= 5) {
                state.lockedUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
              }
            })

            await get()._recordSecurityEvent(
              'login_failure',
              `Invalid PIN. Attempt ${state.pinAttempts + 1} of 5`,
              { deviceId: state.deviceId }
            )
            return false
          }

          // Reset failed attempts on successful login
          set(state => {
            state.pinAttempts = 0
            state.lockedUntil = null
            state.session = session
            state.isAuthenticated = true
            state.user = {
              deviceId: state.deviceId,
              sessionId: session.id,
              securityLevel: session.securityLevel,
              lastLoginAt: new Date()
            }
          })

          // Update session last activity
          await db.updateSession(session.id, {
            lastLoginAt: new Date(),
            failedAttempts: 0,
            lockedUntil: undefined
          })

          await get()._recordSecurityEvent(
            isNewUser ? 'first_login' : 'login_success',
            isNewUser ? 'First-time user authenticated successfully' : 'User authenticated successfully',
            { deviceId: state.deviceId, sessionId: session.id }
          )

          return true

        } catch (error) {
          console.error('Login error:', error)
          await get()._recordSecurityEvent(
            'login_failure',
            'Unexpected error during login',
            { error: String(error) }
          )
          return false
        } finally {
          set(state => { state.isLoading = false })
        }
      },

      logout: async () => {
        try {
          const state = get()

          // Record logout event
          if (state.session) {
            await get()._recordSecurityEvent(
              'logout',
              'User logged out',
              { deviceId: state.deviceId, sessionId: state.session.id }
            )

            // Deactivate session in database
            const db = DatabaseService.getInstance()
            await db.updateSession(state.session.id, { isActive: false })
          }

          // Clear authentication state
          set(state => {
            state.isAuthenticated = false
            state.session = null
            state.user = {
              deviceId: state.deviceId,
              securityLevel: 'medium'
            }
            state.pinAttempts = 0
            state.lockedUntil = null
          })

        } catch (error) {
          console.error('Logout error:', error)
        }
      },

      verifyPin: async (pin: string) => {
        try {
          const state = get()

          if (!state.session) {
            return false
          }

          const cryptoService = CryptoService.getInstance()
          return await cryptoService.verifyPin(
            pin,
            state.session.pinHash,
            state.session.pinSalt
          )
        } catch (error) {
          console.error('PIN verification error:', error)
          return false
        }
      },

      changePin: async (oldPin: string, newPin: string) => {
        try {
          const state = get()

          if (!state.session) {
            return false
          }

          // Verify old PIN
          const cryptoService = CryptoService.getInstance()
          const oldPinValid = await cryptoService.verifyPin(
            oldPin,
            state.session.pinHash,
            state.session.pinSalt
          )

          if (!oldPinValid) {
            await get()._recordSecurityEvent(
              'pin_change_failure',
              'Invalid old PIN provided',
              { deviceId: state.deviceId }
            )
            return false
          }

          // Hash new PIN
          const { hash: newPinHash, salt: newPinSalt } = await cryptoService.hashPin(newPin)

          // Update session in database
          const db = DatabaseService.getInstance()
          await db.updateSession(state.session.id, {
            pinHash: newPinHash,
            pinSalt: newPinSalt
          })

          // Update local state
          set(state => {
            if (state.session) {
              state.session.pinHash = newPinHash
              state.session.pinSalt = newPinSalt
            }
          })

          await get()._recordSecurityEvent(
            'pin_change',
            'PIN changed successfully',
            { deviceId: state.deviceId, sessionId: state.session?.id }
          )

          return true

        } catch (error) {
          console.error('PIN change error:', error)
          return false
        }
      },

      lockSession: (duration = 15 * 60 * 1000) => { // Default 15 minutes
        set(state => {
          state.lockedUntil = new Date(Date.now() + duration)
          state.isAuthenticated = false
        })

        get()._recordSecurityEvent(
          'suspicious_activity',
          'Session locked due to suspicious activity',
          { deviceId: get().deviceId, duration }
        )
      },

      checkSessionStatus: async () => {
        try {
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Session check timeout')), 5000)
          })

          await Promise.race([
            get()._initializeDevice(),
            timeoutPromise
          ])

          const state = get()
          if (!state.deviceId) {
            set(state => { state.isLoading = false })
            return
          }

          const db = DatabaseService.getInstance()
          const sessions = await db.getSessionsByDevice(state.deviceId)

          if (sessions.length === 0) {
            set(state => {
              state.isLoading = false
              state.isAuthenticated = false
            })
            return
          }

          const session = sessions[0]
          const isValid = await get()._validateSession(session)

          if (isValid) {
            set(state => {
              state.session = session
              state.isAuthenticated = true
              state.user = {
                deviceId: state.deviceId,
                sessionId: session.id,
                securityLevel: session.securityLevel,
                lastLoginAt: session.lastLoginAt
              }
              state.isLoading = false
            })
          } else {
            // Session expired or invalid
            await db.updateSession(session.id, { isActive: false })
            set(state => {
              state.session = null
              state.isAuthenticated = false
              state.user = {
                deviceId: state.deviceId,
                securityLevel: 'medium'
              }
              state.isLoading = false
            })
          }

        } catch (error) {
          console.error('Session check error:', error)
          set(state => {
            state.isLoading = false
            state.isAuthenticated = false
          })
        }
      },

      clearSecurityEvents: () => {
        set(state => {
          state.securityEvents = []
        })
      },

      addSecurityEvent: (event) => {
        set(state => {
          state.securityEvents.push({
            ...event,
            id: crypto.randomUUID(),
            timestamp: new Date()
          })
        })
      },

      // Private helper methods
      _initializeDevice: async () => {
        try {
          let deviceId = get().deviceId

          if (!deviceId) {
            // Try device fingerprint with fallback
            try {
              const cryptoService = CryptoService.getInstance()

              // Add timeout for device fingerprint generation
              const fingerprintPromise = cryptoService.generateDeviceFingerprint()
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Fingerprint generation timeout')), 8000)
              })

              const fingerprint = await Promise.race([fingerprintPromise, timeoutPromise]) as DeviceFingerprint

              set(state => {
                state.deviceId = fingerprint.canvas.slice(0, 32) // Use canvas hash as device ID
                state.deviceFingerprint = fingerprint
              })

            } catch (fingerprintError) {
              console.warn('Device fingerprint failed, using fallback:', fingerprintError)

              // Use crypto.randomUUID() as fallback
              const fallbackId = crypto.randomUUID()
              set(state => {
                state.deviceId = fallbackId
                state.deviceFingerprint = {
                  userAgent: navigator.userAgent,
                  language: navigator.language,
                  hardware: navigator.hardwareConcurrency?.toString() || 'unknown',
                  platform: navigator.platform,
                  screen: {
                    width: screen.width,
                    height: screen.height,
                    colorDepth: screen.colorDepth,
                    pixelRatio: window.devicePixelRatio || 1
                  },
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  canvas: fallbackId,
                  webgl: '',
                  fonts: [],
                  timestamp: Date.now()
                }
              })
            }

            deviceId = get().deviceId
          }

          return deviceId
        } catch (error) {
          console.error('Device initialization error:', error)
          // Ultimate fallback to random ID
          const fallbackId = crypto.randomUUID()
          set(state => {
            state.deviceId = fallbackId
          })
          return fallbackId
        }
      },

      _createSession: async (deviceId: string) => {
        const sessionId = crypto.randomUUID()
        const session: SessionEntity = {
          id: sessionId,
          deviceId,
          pinHash: '', // Will be set during PIN setup
          pinSalt: '',
          isActive: true,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          securityLevel: 'medium',
          failedAttempts: 0
        }

        const db = DatabaseService.getInstance()
        await db.addSession(session)

        return session
      },

      _validateSession: async (session: SessionEntity) => {
        try {
          // Check if session is active
          if (!session.isActive) {
            return false
          }

          // Check if session has expired
          if (new Date() > session.expiresAt) {
            return false
          }

          // Check if session is locked
          if (session.lockedUntil && new Date() < session.lockedUntil) {
            return false
          }

          return true
        } catch (error) {
          console.error('Session validation error:', error)
          return false
        }
      },

      _recordSecurityEvent: async (type: string, description: string, metadata?: any) => {
        try {
          const event = {
            type: type as SecurityEventType,
            severity: (type.includes('failure') ? 'medium' : 'low') as SecuritySeverity,
            deviceId: get().deviceId,
            sessionId: get().session?.id,
            description,
            metadata: metadata || {},
            resolved: false
          }

          get().addSecurityEvent(event)

          // Store in database for persistence
          const db = DatabaseService.getInstance()
          await db.addSecurityEvent(event)

        } catch (error) {
          console.error('Security event recording error:', error)
        }
      }
    })),
    {
      name: 'yisa-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        deviceId: state.deviceId,
        deviceFingerprint: state.deviceFingerprint,
        securityEvents: state.securityEvents.slice(-50) // Keep only last 50 events
      })
    }
  )
)
