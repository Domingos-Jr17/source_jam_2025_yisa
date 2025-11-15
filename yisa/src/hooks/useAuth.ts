import { useEffect, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'

export const useAuth = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    verifyPin,
    changePin,
    lockSession,
    checkSessionStatus,
    setLoading
  } = useAuthStore()

  const sessionId = user?.sessionId

  // Use useCallback to prevent infinite re-renders
  const initAuth = useCallback(async () => {
    console.log('[useAuth] Initializing authentication...')
    try {
      // Skip session checking for user-based authentication
      // Just check if user is already authenticated from persisted state
      if (isAuthenticated || user?.sessionId) {
        console.log('[useAuth] User already authenticated, skipping session check')
      } else {
        console.log('[useAuth] No active session found')
      }
      console.log('[useAuth] Authentication check completed')
    } catch (error) {
      console.error('[useAuth] Authentication initialization failed:', error)
    } finally {
      // Always set loading to false after initialization
      setLoading(false)
    }
  }, [isAuthenticated, user?.sessionId])

  useEffect(() => {
    // Initialize authentication on mount
    initAuth()
  }, [initAuth])

  return {
    isAuthenticated,
    isLoading,
    user,
    sessionId,
    login,
    logout,
    verifyPin,
    changePin,
    lockSession
  }
}