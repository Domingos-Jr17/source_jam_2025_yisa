import { useState, useEffect } from 'react'

export interface NetworkStatus {
  isOnline: boolean
  isOffline: boolean
  connectionType?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [connectionInfo, setConnectionInfo] = useState<Partial<NetworkStatus>>({})

  useEffect(() => {
    // Update connection info if Network Information API is available
    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setConnectionInfo({
          connectionType: connection.type,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        })
      }
    }

    const handleOnline = () => {
      setIsOnline(true)
      updateConnectionInfo()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    const handleConnectionChange = () => {
      updateConnectionInfo()
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connection.addEventListener('change', handleConnectionChange)
    }

    // Initial connection info
    updateConnectionInfo()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)

      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  return {
    isOnline,
    isOffline: !isOnline,
    ...connectionInfo
  }
}