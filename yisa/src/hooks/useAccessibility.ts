import { useState, useEffect, useCallback, useRef } from 'react'
import { a11y } from '../utils/accessibility'

export interface AccessibilitySettings {
  reducedMotion: boolean
  highContrast: boolean
  largeText: boolean
  screenReaderOptimized: boolean
  keyboardNavigation: boolean
  focusVisible: boolean
  announcementsEnabled: boolean
}

interface UseAccessibilityReturn {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void
  announce: (message: string, politeness?: 'polite' | 'assertive' | 'off') => void
  generateId: (prefix?: string) => string
  trapFocus: (element: HTMLElement) => () => void
  skipToContent: () => void
  setFocusManagement: (enabled: boolean) => void
  isNavigatingWithKeyboard: boolean
  currentFocusElement: HTMLElement | null
}

export const useAccessibility = (): UseAccessibilityReturn => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderOptimized: true,
    keyboardNavigation: true,
    focusVisible: true,
    announcementsEnabled: true
  })

  const [isNavigatingWithKeyboard, setIsNavigatingWithKeyboard] = useState(false)
  const [currentFocusElement, setCurrentFocusElement] = useState<HTMLElement | null>(null)
  const [focusManagementEnabled, setFocusManagementEnabled] = useState(true)

  const lastInteractionWasKeyboard = useRef(false)
  const mouseTimeoutRef = useRef<NodeJS.Timeout>()

  // Detect system preferences
  useEffect(() => {
    const detectPreferences = () => {
      setSettings(prev => ({
        ...prev,
        reducedMotion: a11y.prefersReducedMotion(),
        highContrast: a11y.prefersHighContrast()
      }))
    }

    detectPreferences()

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')

    motionQuery.addEventListener('change', detectPreferences)
    contrastQuery.addEventListener('change', detectPreferences)

    return () => {
      motionQuery.removeEventListener('change', detectPreferences)
      contrastQuery.removeEventListener('change', detectPreferences)
    }
  }, [])

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('yisa-accessibility-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error)
    }
  }, [])

  // Save preferences to localStorage
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value }

      // Save to localStorage
      try {
        localStorage.setItem('yisa-accessibility-settings', JSON.stringify(newSettings))
      } catch (error) {
        console.warn('Failed to save accessibility settings:', error)
      }

      return newSettings
    })
  }, [])

  // Keyboard navigation detection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab key indicates keyboard navigation
      if (event.key === 'Tab') {
        setIsNavigatingWithKeyboard(true)
        lastInteractionWasKeyboard.current = true

        // Clear any existing mouse timeout
        if (mouseTimeoutRef.current) {
          clearTimeout(mouseTimeoutRef.current)
        }
      }

      // Escape key for modal closing
      if (event.key === 'Escape') {
        announce('Escaped pressed', 'polite')
      }

      // Enter and Space for interactive elements
      if (event.key === 'Enter' || event.key === ' ') {
        const target = event.target as HTMLElement
        if (target && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          announce(`${target.textContent || target.tagName} activated`, 'polite')
        }
      }
    }

    const handleMouseDown = () => {
      setIsNavigatingWithKeyboard(false)
      lastInteractionWasKeyboard.current = false

      // Set a timeout to reset keyboard detection after a delay
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }

      mouseTimeoutRef.current = setTimeout(() => {
        setIsNavigatingWithKeyboard(false)
      }, 100)
    }

    const handleFocus = (event: FocusEvent) => {
      if (focusManagementEnabled) {
        setCurrentFocusElement(event.target as HTMLElement)

        // Announce focus changes for screen readers if enabled
        if (settings.announcementsEnabled && lastInteractionWasKeyboard.current) {
          const element = event.target as HTMLElement
          const label = element.getAttribute('aria-label') ||
                        element.getAttribute('title') ||
                        element.textContent ||
                        element.tagName.toLowerCase()

          if (label && label.trim()) {
            announce(`Focused on ${label}`, 'polite')
          }
        }
      }
    }

    const handleBlur = () => {
      if (focusManagementEnabled) {
        setCurrentFocusElement(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('focus', handleFocus, true)
    document.addEventListener('blur', handleBlur, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('focus', handleFocus, true)
      document.removeEventListener('blur', handleBlur, true)

      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }
    }
  }, [settings.announcementsEnabled, focusManagementEnabled])

  // Create skip to content functionality
  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector('main, [role="main"], #main')
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1')
      mainContent.focus()

      // Announce the skip
      announce('Skipped to main content', 'polite')

      // Remove tabindex after focus
      setTimeout(() => {
        mainContent.removeAttribute('tabindex')
      }, 100)
    }
  }, [])

  // Focus trap utility
  const trapFocus = useCallback((element: HTMLElement) => {
    return a11y.trapFocus(element)
  }, [])

  // Announce wrapper
  const announce = useCallback((message: string, politeness?: 'polite' | 'assertive' | 'off') => {
    if (settings.announcementsEnabled) {
      a11y.announce(message, politeness)
    }
  }, [settings.announcementsEnabled])

  // Generate ID wrapper
  const generateId = useCallback((prefix?: string) => {
    return a11y.generateId(prefix)
  }, [])

  // Set focus management
  const setFocusManagement = useCallback((enabled: boolean) => {
    setFocusManagementEnabled(enabled)
  }, [])

  // Generate CSS classes based on settings
  const getAccessibilityClasses = useCallback(() => {
    const classes: string[] = []

    if (settings.reducedMotion) {
      classes.push('reduce-motion')
    }

    if (settings.highContrast) {
      classes.push('high-contrast')
    }

    if (settings.largeText) {
      classes.push('large-text')
    }

    if (settings.focusVisible && isNavigatingWithKeyboard) {
      classes.push('focus-visible')
    }

    return classes.join(' ')
  }, [settings, isNavigatingWithKeyboard])

  // Validate accessibility of an element
  const validateElement = useCallback((element: HTMLElement): {
    errors: string[]
    warnings: string[]
    passed: boolean
  } => {
    const errors: string[] = []
    const warnings: string[] = []

    // Check for alt text on images
    if (element.tagName === 'IMG' && !element.getAttribute('alt')) {
      errors.push('Image missing alt text')
    }

    // Check for proper button labeling
    if (element.tagName === 'BUTTON') {
      const hasText = element.textContent?.trim()
      const hasAriaLabel = element.getAttribute('aria-label')
      const hasAriaLabelledBy = element.getAttribute('aria-labelledby')

      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        errors.push('Button missing accessible label')
      }
    }

    // Check for form inputs with labels
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.id && document.querySelector(`label[for="${element.id}"]`)

      if (!hasLabel) {
        warnings.push('Form input missing associated label')
      }
    }

    // Check for proper heading hierarchy (simplified)
    if (element.tagName.match(/^H[1-6]$/)) {
      const headingLevel = parseInt(element.tagName.charAt(1))
      if (headingLevel > 1 && element.previousElementSibling) {
        const prevHeading = element.previousElementSibling.tagName.match(/^H([1-6])$/)
        if (prevHeading && parseInt(prevHeading[1]) > headingLevel) {
          warnings.push('Heading level skipped - maintain proper hierarchy')
        }
      }
    }

    // Check for proper ARIA attributes
    const role = element.getAttribute('role')
    if (role) {
      // Validate common ARIA roles
      const validRoles = [
        'button', 'link', 'navigation', 'main', 'complementary', 'contentinfo',
        'search', 'dialog', 'alert', 'status', 'progressbar', 'checkbox', 'radio',
        'tabpanel', 'tablist', 'menu', 'menubar', 'tooltip'
      ]

      if (!validRoles.includes(role)) {
        warnings.push(`Unknown or invalid ARIA role: ${role}`)
      }
    }

    return {
      errors,
      warnings,
      passed: errors.length === 0
    }
  }, [])

  // Return comprehensive accessibility interface
  return {
    settings,
    updateSetting,
    announce,
    generateId,
    trapFocus,
    skipToContent,
    setFocusManagement,
    isNavigatingWithKeyboard,
    currentFocusElement,
    getAccessibilityClasses,
    validateElement
  }
}

// Hook for managing focus within components
export const useFocusManagement = (enabled: boolean = true) => {
  const elementRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const trapFocus = useCallback(() => {
    if (!enabled || !elementRef.current) return

    previousFocusRef.current = document.activeElement as HTMLElement

    return a11y.trapFocus(elementRef.current)
  }, [enabled])

  const releaseFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [])

  const setFocusElement = useCallback((element: HTMLElement | null) => {
    elementRef.current = element
  }, [])

  return {
    elementRef,
    trapFocus,
    releaseFocus,
    setFocusElement
  }
}

// Hook for managing announcements
export const useAnnouncer = () => {
  const announce = useCallback((message: string, politeness?: 'polite' | 'assertive' | 'off') => {
    a11y.announce(message, politeness)
  }, [])

  const announceSuccess = useCallback((action: string, details?: string) => {
    a11y.announceSuccess(action, details)
  }, [])

  const announceError = useCallback((component: string, error: string) => {
    a11y.announceFormError(component, error)
  }, [])

  const announceLoading = useCallback((action: string) => {
    a11y.announceLoading(action)
  }, [])

  const announcePageChange = useCallback((title: string, description?: string) => {
    a11y.announcePageChange(title, description)
  }, [])

  return {
    announce,
    announceSuccess,
    announceError,
    announceLoading,
    announcePageChange
  }
}