/**
 * Accessibility utilities and WCAG compliance helpers
 */

export interface A11yAnnouncement {
  message: string
  politeness?: 'polite' | 'assertive' | 'off'
  timeout?: number
}

export class AccessibilityManager {
  private static instance: AccessibilityManager
  private liveRegion: HTMLElement | null = null
  private announcementQueue: A11yAnnouncement[] = []
  private isAnnouncing = false

  private constructor() {
    this.initializeLiveRegion()
  }

  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager()
    }
    return AccessibilityManager.instance
  }

  private initializeLiveRegion(): void {
    // Create live region for screen reader announcements
    if (typeof document !== 'undefined') {
      this.liveRegion = document.createElement('div')
      this.liveRegion.setAttribute('aria-live', 'polite')
      this.liveRegion.setAttribute('aria-atomic', 'true')
      this.liveRegion.setAttribute('class', 'sr-only')
      this.liveRegion.style.position = 'absolute'
      this.liveRegion.style.left = '-10000px'
      this.liveRegion.style.width = '1px'
      this.liveRegion.style.height = '1px'
      this.liveRegion.style.overflow = 'hidden'
      document.body.appendChild(this.liveRegion)
    }
  }

  /**
   * Announce a message to screen readers
   */
  announce(message: string, politeness: 'polite' | 'assertive' | 'off' = 'polite', timeout = 0): void {
    if (!this.liveRegion) return

    const announcement: A11yAnnouncement = {
      message,
      politeness,
      timeout
    }

    if (timeout > 0) {
      // Add to queue for delayed announcement
      this.announcementQueue.push(announcement)
      setTimeout(() => {
        this.processAnnouncement(announcement)
      }, timeout)
    } else {
      this.processAnnouncement(announcement)
    }
  }

  private processAnnouncement(announcement: A11yAnnouncement): void {
    if (!this.liveRegion || this.isAnnouncing) return

    this.isAnnouncing = true
    this.liveRegion.setAttribute('aria-live', announcement.politeness || 'polite')
    this.liveRegion.textContent = announcement.message

    // Clear announcement after delay to allow screen readers to process
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = ''
        this.liveRegion.setAttribute('aria-live', 'polite')
      }
      this.isAnnouncing = false
      this.processQueue()
    }, 1000)
  }

  private processQueue(): void {
    if (this.announcementQueue.length > 0 && !this.isAnnouncing) {
      const nextAnnouncement = this.announcementQueue.shift()
      if (nextAnnouncement) {
        this.processAnnouncement(nextAnnouncement)
      }
    }
  }

  /**
   * Trap focus within a container element
   */
  trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            event.preventDefault()
            lastFocusable?.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            event.preventDefault()
            firstFocusable?.focus()
          }
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)

    // Focus first element
    firstFocusable?.focus()

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }

  /**
   * Generate unique IDs for accessibility purposes
   */
  generateId(prefix = 'yisa'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Check if reduced motion is preferred
   */
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Check if high contrast mode is preferred
   */
  prefersHighContrast(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches
  }

  /**
   * Get color scheme preference
   */
  getColorScheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  /**
   * Validate color contrast ratio
   */
  validateColorContrast(foreground: string, background: string): {
    ratio: number
    wcagAA: boolean
    wcagAAA: boolean
    level: 'FAIL' | 'AA' | 'AAA'
  } {
    // Simple contrast ratio calculation
    const getLuminance = (hex: string): number => {
      const rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
      if (!rgb) return 0

      const r = parseInt(rgb[1], 16) / 255
      const g = parseInt(rgb[2], 16) / 255
      const b = parseInt(rgb[3], 16) / 255

      const [R, G, B] = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * R + 0.7152 * G + 0.0722 * B
    }

    const fgLuminance = getLuminance(foreground)
    const bgLuminance = getLuminance(background)

    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
                  (Math.min(fgLuminance, bgLuminance) + 0.05)

    const wcagAA = ratio >= 4.5
    const wcagAAA = ratio >= 7

    let level: 'FAIL' | 'AA' | 'AAA' = 'FAIL'
    if (wcagAAA) level = 'AAA'
    else if (wcagAA) level = 'AA'

    return { ratio, wcagAA, wcagAAA, level }
  }

  /**
   * Validate font size for accessibility
   */
  validateFontSize(fontSize: string, isBold = false): {
    wcagAA: boolean
    wcagAAA: boolean
    recommendation: string
  } {
    const size = parseFloat(fontSize)
    const pixels = size * 16 // Convert rem to pixels approximately

    const wcagAA = pixels >= 16 || (pixels >= 14 && isBold)
    const wcagAAA = pixels >= 18 || (pixels >= 14 && isBold)

    let recommendation = ''
    if (!wcagAA) {
      recommendation = `Increase font size to at least ${isBold ? '14px' : '16px'} for WCAG AA compliance`
    } else if (!wcagAAA) {
      recommendation = `Consider increasing to ${isBold ? '14px' : '18px'} for WCAG AAA compliance`
    }

    return { wcagAA, wcagAAA, recommendation }
  }

  /**
   * Check if element is visible to screen readers
   */
  isScreenReaderVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element)
    const isVisible = style.display !== 'none' &&
                     style.visibility !== 'hidden' &&
                     !element.getAttribute('aria-hidden') &&
                     element.getAttribute('tabindex') !== '-1'

    return isVisible
  }

  /**
   * Set up keyboard navigation for custom components
   */
  setupKeyboardNavigation(
    container: HTMLElement,
    options: {
      onEnter?: (element: HTMLElement) => void
      onSpace?: (element: HTMLElement) => void
      onEscape?: () => void
      onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right', element: HTMLElement) => void
    } = {}
  ): () => void {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement

      switch (event.key) {
        case 'Enter':
          if (options.onEnter) {
            event.preventDefault()
            options.onEnter(target)
          }
          break

        case ' ':
        case 'Spacebar':
          if (options.onSpace) {
            event.preventDefault()
            options.onSpace(target)
          }
          break

        case 'Escape':
          if (options.onEscape) {
            event.preventDefault()
            options.onEscape()
          }
          break

        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          if (options.onArrowKeys) {
            event.preventDefault()
            const direction = event.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right'
            options.onArrowKeys(direction, target)
          }
          break
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  /**
   * Announce page changes to screen readers
   */
  announcePageChange(title: string, description?: string): void {
    const message = description ? `${title}. ${description}` : title
    this.announce(message, 'polite')
  }

  /**
   * Announce form errors to screen readers
   */
  announceFormError(fieldName: string, errorMessage: string): void {
    this.announce(`Error in ${fieldName}: ${errorMessage}`, 'assertive')
  }

  /**
   * Announce successful actions
   */
  announceSuccess(action: string, details?: string): void {
    const message = details ? `${action} successful. ${details}` : `${action} successful`
    this.announce(message, 'polite')
  }

  /**
   * Announce loading states
   */
  announceLoading(action: string): void {
    this.announce(`${action} loading`, 'polite')
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion)
      this.liveRegion = null
    }
    this.announcementQueue = []
  }
}

// Export singleton instance
export const a11y = AccessibilityManager.getInstance()

// Export convenience functions
export const announce = (message: string, politeness?: 'polite' | 'assertive' | 'off') => {
  a11y.announce(message, politeness)
}

export const generateId = (prefix?: string) => {
  return a11y.generateId(prefix)
}

export const prefersReducedMotion = () => {
  return a11y.prefersReducedMotion()
}

export const prefersHighContrast = () => {
  return a11y.prefersHighContrast()
}

export const getColorScheme = () => {
  return a11y.getColorScheme()
}

// Export validator for WCAG compliance testing
export { accessibilityValidator } from './accessibilityValidator'