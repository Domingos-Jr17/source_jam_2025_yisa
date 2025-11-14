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
    checkSessionStatus
  } = useAuthStore()

  const sessionId = user?.sessionId

  // Use useCallback to prevent infinite re-renders
  const initAuth = useCallback(async () => {
    console.log('[useAuth] Initializing authentication...')
    try {
      await checkSessionStatus()
      console.log('[useAuth] Authentication check completed')
    } catch (error) {
      console.error('[useAuth] Authentication initialization failed:', error)
    }
  }, []) // Empty dependency array - checkSessionStatus is stable from zustand

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