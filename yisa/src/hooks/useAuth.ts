import { useEffect } from 'react'
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

  useEffect(() => {
    // Initialize authentication on mount
    const initAuth = async () => {
      await checkSessionStatus()
    }

    initAuth()
  }, [checkSessionStatus])

  return {
    isAuthenticated,
    isLoading,
    user,
    sessionId,
    deviceId,
    login,
    logout,
    verifyPin,
    changePin,
    lockSession
  }
}