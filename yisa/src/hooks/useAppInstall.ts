import { useState, useEffect } from 'react'

export const useAppInstall = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches

      const installed = isStandalone || isInWebAppiOS || isInWebAppChrome
      setIsInstalled(installed)

      // Check if install prompt is available
      const hasDeferredPrompt = 'deferredPrompt' in window
      setIsInstallable(hasDeferredPrompt && !installed)

      // Check if install was previously dismissed
      const dismissed = localStorage.getItem('yisa_install_dismissed')
      if (dismissed) {
        setShowInstallPrompt(false)
      } else {
        setShowInstallPrompt(hasDeferredPrompt && !installed)
      }
    }

    checkIfInstalled()

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      window.deferredPrompt = e as BeforeInstallPromptEvent
      setIsInstallable(true)

      const dismissed = localStorage.getItem('yisa_install_dismissed')
      if (!dismissed) {
        setShowInstallPrompt(true)
      }
    }

    // Listen for app install
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setIsInstallable(false)
      delete window.deferredPrompt
      localStorage.removeItem('yisa_install_dismissed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = async () => {
    if (!window.deferredPrompt) {
      console.warn('Install prompt not available')
      return
    }

    try {
      // Show the install prompt
      await window.deferredPrompt?.prompt()

      // Wait for the user to respond to the prompt
      const choiceResult = await window.deferredPrompt?.userChoice

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }

      // Clear the deferred prompt
      window.deferredPrompt = null
      setShowInstallPrompt(false)
      setIsInstallable(false)

    } catch (error) {
      console.error('Error during app installation:', error)
    }
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('yisa_install_dismissed', 'true')
  }

  return {
    showInstallPrompt,
    isInstalled,
    isInstallable,
    installApp,
    dismissInstallPrompt
  }
}
