import { SECURITY_CONFIG } from '../utils/constants'
import type {
  SecurityConfig,
  DeviceFingerprint,
  AuthCredentials,
  HashedData,
  EncryptedData
} from '../types'

/**
 * Cryptographic service for secure data handling
 * Serviço criptográfico para manipulação segura de dados
 */
export class CryptoService {
  private static instance: CryptoService

  private constructor() {}

  public static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService()
    }
    return CryptoService.instance
  }

  /**
   * Generate cryptographically secure random bytes
   */
  private async generateRandomBytes(length: number): Promise<Uint8Array> {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return array
  }

  /**
   * Convert string to Uint8Array
   */
  private stringToArrayBuffer(str: string): Uint8Array {
    return new TextEncoder().encode(str)
  }

  /**
   * Convert Uint8Array to string
   */
  private arrayBufferToString(buffer: ArrayBuffer): string {
    return new TextDecoder().decode(buffer)
  }

  /**
   * Convert Uint8Array to base64 string
   */
  private arrayBufferToBase64(buffer: Uint8Array): string {
    const binary = Array.from(buffer)
      .map(byte => String.fromCharCode(byte))
      .join('')
    return btoa(binary)
  }

  /**
   * Convert base64 string to Uint8Array
   */
  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }

  /**
   * Generate PBKDF2 key from password and salt
   */
  public async deriveKey(
    password: string,
    salt: Uint8Array,
    iterations: number = SECURITY_CONFIG.PBKDF2.ITERATIONS
  ): Promise<CryptoKey> {
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      this.stringToArrayBuffer(password) as BufferSource,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations,
        hash: 'SHA-256'
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Hash PIN using PBKDF2
   */
  public async hashPin(pin: string): Promise<HashedData> {
    try {
      const salt = await this.generateRandomBytes(SECURITY_CONFIG.PBKDF2.SALT_LENGTH)
      const iterations = SECURITY_CONFIG.PBKDF2.ITERATIONS

      const passwordKey = await crypto.subtle.importKey(
        'raw',
        this.stringToArrayBuffer(pin) as BufferSource,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      )

      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt as unknown as BufferSource,
          iterations,
          hash: 'SHA-256'
        },
        passwordKey,
        SECURITY_CONFIG.PBKDF2.KEY_LENGTH * 8
      )

      const hash = new Uint8Array(derivedBits)

      return {
        hash: this.arrayBufferToBase64(hash),
        salt: this.arrayBufferToBase64(salt),
        iterations,
        algorithm: 'SHA-256'
      }
    } catch (error) {
      console.error('PIN hashing error:', error)
      throw new Error('Failed to hash PIN')
    }
  }

  
  /**
   * Encrypt data using AES-256-GCM
   */
  public async encrypt(
    data: string,
    key: CryptoKey,
    additionalData?: string
  ): Promise<EncryptedData> {
    try {
      const iv = await this.generateRandomBytes(SECURITY_CONFIG.AES.IV_LENGTH)
      const encodedData = this.stringToArrayBuffer(data)

      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv as any,
          additionalData: additionalData ? this.stringToArrayBuffer(additionalData) as any : undefined
        },
        key,
        encodedData as any
      )

      const encryptedArray = new Uint8Array(encrypted)
      const combined = new Uint8Array(iv.length + encryptedArray.length)
      combined.set(iv)
      combined.set(encryptedArray, iv.length)

      return {
        data: this.arrayBufferToBase64(combined),
        iv: this.arrayBufferToBase64(iv),
        salt: '', // Not used for AES-GCM encryption
        algorithm: 'AES-256-GCM'
      }
    } catch (error) {
      console.error('Encryption error:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  public async decrypt(
    encryptedData: EncryptedData,
    key: CryptoKey,
    additionalData?: string
  ): Promise<string> {
    try {
      const combined = this.base64ToArrayBuffer(encryptedData.data)
      const iv = this.base64ToArrayBuffer(encryptedData.iv)

      const encrypted = combined.slice(iv.length)

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv as any,
          additionalData: additionalData ? this.stringToArrayBuffer(additionalData) as any : undefined
        },
        key,
        encrypted as any
      )

      return this.arrayBufferToString(decrypted)
    } catch (error) {
      console.error('Decryption error:', error)
      throw new Error('Failed to decrypt data')
    }
  }

  /**
   * Generate SHA-256 hash of data
   */
  public async hashData(data: string): Promise<string> {
    try {
      const encodedData = this.stringToArrayBuffer(data) as BufferSource
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData)
      const hashArray = new Uint8Array(hashBuffer)
      return this.arrayBufferToBase64(hashArray)
    } catch (error) {
      console.error('Data hashing error:', error)
      throw new Error('Failed to hash data')
    }
  }

  /**
   * Verify data integrity using SHA-256 hash
   */
  public async verifyHash(data: string, expectedHash: string): Promise<boolean> {
    try {
      const computedHash = await this.hashData(data)
      return computedHash === expectedHash
    } catch (error) {
      console.error('Hash verification error:', error)
      return false
    }
  }

  /**
   * Generate HMAC-SHA256 signature
   */
  public async generateHMAC(data: string, key: CryptoKey): Promise<string> {
    try {
      const encodedData = this.stringToArrayBuffer(data) as BufferSource
      const signature = await crypto.subtle.sign('HMAC', key, encodedData)
      const signatureArray = new Uint8Array(signature)
      return this.arrayBufferToBase64(signatureArray)
    } catch (error) {
      console.error('HMAC generation error:', error)
      throw new Error('Failed to generate HMAC')
    }
  }

  /**
   * Verify HMAC-SHA256 signature
   */
  public async verifyHMAC(data: string, signature: string, key: CryptoKey): Promise<boolean> {
    try {
      const encodedData = this.stringToArrayBuffer(data) as BufferSource
      const signatureArray = this.base64ToArrayBuffer(signature) as BufferSource
      return await crypto.subtle.verify('HMAC', key, signatureArray, encodedData)
    } catch (error) {
      console.error('HMAC verification error:', error)
      return false
    }
  }

  /**
   * Generate device fingerprint for security
   */
  public async generateDeviceFingerprint(): Promise<DeviceFingerprint> {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // Draw text to canvas for fingerprinting
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('YISA Device Fingerprint 🏫', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('Device Fingerprint 🏫', 4, 17)

      const canvasData = canvas.toDataURL()
      const canvasHash = await this.hashData(canvasData)

      // Get WebGL fingerprint
      const webglCanvas = document.createElement('canvas')
      const gl = webglCanvas.getContext('webgl') || webglCanvas.getContext('experimental-webgl') as WebGLRenderingContext | null
      let webglData = ''

      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          webglData = `${gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)}|${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`
        }
      }

      // Get available fonts
      const fonts = [
        'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
        'Helvetica', 'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana'
      ]

      const availableFonts: string[] = []
      const testString = 'mmmmmmmmmmlli'
      const testSize = '72px'
      const h = document.getElementsByTagName('body')[0]

      for (const font of fonts) {
        const span = document.createElement('span')
        span.style.fontSize = testSize
        span.style.fontFamily = font
        span.innerHTML = testString
        h.appendChild(span)
        const width = span.offsetWidth
        h.removeChild(span)

        // Test if font is actually loaded
        const testSpan = document.createElement('span')
        testSpan.style.fontSize = testSize
        testSpan.innerHTML = testString
        h.appendChild(testSpan)
        const defaultWidth = testSpan.offsetWidth
        h.removeChild(testSpan)

        if (width !== defaultWidth) {
          availableFonts.push(font)
        }
      }

      return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        hardware: `${navigator.hardwareConcurrency || 'unknown'} cores`,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio || 1
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvas: canvasHash,
        webgl: webglData || 'unavailable',
        fonts: availableFonts,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Device fingerprinting error:', error)
      // Fallback fingerprint
      return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        hardware: 'unknown',
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio || 1
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvas: 'fallback',
        webgl: 'unavailable',
        fonts: [],
        timestamp: Date.now()
      }
    }
  }

  /**
   * Generate secure random PIN
   */
  public generateSecurePin(length: number = SECURITY_CONFIG.PIN.LENGTH): string {
    const digits = '0123456789'
    let pin = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.getRandomValues(new Uint8Array(1))[0] % digits.length
      pin += digits[randomIndex]
    }

    return pin
  }

  /**
   * Generate UUID v4
   */
  public generateUUID(): string {
    return crypto.randomUUID()
  }

  /**
   * Constant-time comparison to prevent timing attacks
   */
  public constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }

    return result === 0
  }

  /**
   * Clear sensitive data from memory
   */
  public clearSensitiveData(data: Uint8Array): void {
    for (let i = 0; i < data.length; i++) {
      data[i] = 0
    }
  }

  /**
   * Verify PIN against hash
   */
  public async verifyPin(pin: string, hash: string, salt: string): Promise<boolean> {
    try {
      const saltBuffer = this.base64ToArrayBuffer(salt)
      const hashedPin = await this.hashPin(pin)
      return hashedPin.hash === hash && hashedPin.salt === salt
    } catch {
      return false
    }
  }

  /**
   * Generate checksum for QR codes
   */
  public async checksum(data: string): Promise<string> {
    return this.hashData(data)
  }
}
