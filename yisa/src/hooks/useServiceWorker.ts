import { useEffect, useState, useCallback } from 'react'

interface ServiceWorkerStatus {
  supported: boolean
  enabled: boolean
  updateAvailable: boolean
  installing: boolean
  controlling: boolean
  registration: ServiceWorkerRegistration | null
}

interface UpdateStatus {
  checking: boolean
  available: boolean
  installing: boolean
  activated: boolean
  error: string | null
}

export const useServiceWorker = () => {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    supported: false,
    enabled: false,
    updateAvailable: false,
    installing: false,
    controlling: false,
    registration: null
  })

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    checking: false,
    available: false,
    installing: false,
    activated: false,
    error: null
  })

  const checkServiceWorkerSupport = useCallback(() => {
    const supported = 'serviceWorker' in navigator
    setStatus(prev => ({ ...prev, supported }))
    return supported
  }, [])

  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker is not supported')
      return
    }

    try {
      setUpdateStatus(prev => ({ ...prev, checking: true, error: null }))

      // Register the service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registered:', registration)

      setStatus(prev => ({
        ...prev,
        enabled: true,
        registration
      }))

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          console.log('New Service Worker found')

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New Service Worker ready')
              setStatus(prev => ({ ...prev, updateAvailable: true }))
              setUpdateStatus(prev => ({ ...prev, available: true, checking: false }))
            }
          })
        }
      })

      // Check if there's already a controller
      if (navigator.serviceWorker.controller) {
        setStatus(prev => ({ ...prev, controlling: true }))
      }

      // Listen for controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed')
        setStatus(prev => ({ ...prev, controlling: true }))
        setUpdateStatus(prev => ({ ...prev, activated: true }))

        // Reload the page to get the new version
        window.location.reload()
      })

      // Periodic update check
      const checkInterval = setInterval(async () => {
        try {
          await registration.update()
        } catch (error) {
          console.warn('Service Worker update check failed:', error)
        }
      }, 60 * 60 * 1000) // Check every hour

      // Cleanup interval on unmount
      return () => clearInterval(checkInterval)

    } catch (error) {
      console.error('Service Worker registration failed:', error)
      setUpdateStatus(prev => ({
        checking: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      }))
    }
  }, [])

  const applyUpdate = useCallback(async () => {
    if (!status.registration || !status.registration.waiting) {
      console.warn('No update available to apply')
      return
    }

    try {
      setUpdateStatus(prev => ({ ...prev, installing: true }))

      // Send message to the waiting service worker to skip waiting
      status.registration.waiting.postMessage({ type: 'SKIP_WAITING' })

      console.log('Update application initiated')
    } catch (error) {
      console.error('Failed to apply update:', error)
      setUpdateStatus(prev => ({
        installing: false,
        error: error instanceof Error ? error.message : 'Update failed'
      }))
    }
  }, [status.registration])

  const unregisterServiceWorker = useCallback(async () => {
    if (!status.registration) {
      console.warn('No Service Worker registration found')
      return
    }

    try {
      const result = await status.registration.unregister()
      console.log('Service Worker unregistered:', result)

      setStatus({
        supported: true,
        enabled: false,
        updateAvailable: false,
        installing: false,
        controlling: false,
        registration: null
      })

      setUpdateStatus({
        checking: false,
        available: false,
        installing: false,
        activated: false,
        error: null
      })

      // Reload the page to clear any controlled state
      window.location.reload()
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
    }
  }, [status.registration])

  const clearCache = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !status.registration) {
      console.warn('Service Worker not available for cache clearing')
      return
    }

    try {
      // Send message to service worker to clear caches
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
        console.log('Cache clear request sent to Service Worker')
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }, [status.registration])

  const getCacheInfo = useCallback(async () => {
    if (!('caches' in window)) {
      return null
    }

    try {
      const cacheNames = await caches.keys()
      const cacheInfo = []

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const keys = await cache.keys()
        cacheInfo.push({
          name: cacheName,
          size: keys.length,
          urls: keys.map(request => request.url)
        })
      }

      return cacheInfo
    } catch (error) {
      console.error('Failed to get cache info:', error)
      return null
    }
  }, [])

  // Initialize service worker
  useEffect(() => {
    const init = async () => {
      if (checkServiceWorkerSupport()) {
        await registerServiceWorker()
      }
    }

    init()
  }, [checkServiceWorkerSupport, registerServiceWorker])

  return {
    status,
    updateStatus,
    actions: {
      applyUpdate,
      unregisterServiceWorker,
      clearCache,
      getCacheInfo,
      registerServiceWorker
    }
  }
}