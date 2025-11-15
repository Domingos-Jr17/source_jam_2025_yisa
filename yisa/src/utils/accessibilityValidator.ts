/**
 * Accessibility validator for WCAG 2.1 AA compliance testing
 * Provides automated checks for common accessibility issues
 */

export interface ValidationIssue {
  type: 'error' | 'warning'
  rule: string
  description: string
  element: HTMLElement
  suggestion: string
}

export interface ValidationResult {
  passed: boolean
  score: number // 0-100
  issues: ValidationIssue[]
  summary: {
    errors: number
    warnings: number
    totalChecks: number
  }
}

export class AccessibilityValidator {
  private static instance: AccessibilityValidator

  public static getInstance(): AccessibilityValidator {
    if (!AccessibilityValidator.instance) {
      AccessibilityValidator.instance = new AccessibilityValidator()
    }
    return AccessibilityValidator.instance
  }

  /**
   * Run comprehensive accessibility validation on the current page
   */
  public validatePage(): ValidationResult {
    const issues: ValidationIssue[] = []

    // Run all validation checks
    issues.push(...this.checkImageAltText())
    issues.push(...this.checkFormLabels())
    issues.push(...this.checkButtonLabels())
    issues.push(...this.checkHeadingHierarchy())
    issues.push(...this.checkContrast())
    issues.push(...this.checkFocusManagement())
    issues.push(...this.checkARIALandmarks())
    issues.push(...this.checkLanguageAttributes())
    issues.push(...this.checkLinkText())
    issues.push(...this.checkKeyboardNavigation())

    const errors = issues.filter(issue => issue.type === 'error').length
    const warnings = issues.filter(issue => issue.type === 'warning').length
    const totalChecks = 50 // Approximate number of checks performed
    const score = Math.max(0, 100 - (errors * 10) - (warnings * 2))

    return {
      passed: errors === 0,
      score,
      issues,
      summary: {
        errors,
        warnings,
        totalChecks
      }
    }
  }

  /**
   * Check for missing alt text on images
   */
  private checkImageAltText(): ValidationIssue[] {
    const issues: ValidationIssue[] = []
    const images = document.querySelectorAll('img')

    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        issues.push({
          type: 'error',
          rule: 'WCAG 1.1.1 - Non-text Content',
          description: 'Image missing alt attribute',
          element: img as HTMLElement,
          suggestion: 'Add descriptive alt text or alt="" for decorative images'
        })
      }
    })

    return issues
  }

  /**
   * Check for form inputs with proper labels
   */
  private checkFormLabels(): ValidationIssue[] {
    const issues: ValidationIssue[] = []
    const inputs = document.querySelectorAll('input, textarea, select')

    inputs.forEach(input => {
      const hasLabel = input.hasAttribute('aria-label') ||
                      input.hasAttribute('aria-labelledby') ||
                      input.id && document.querySelector(`label[for="${input.id}"]`)

      if (!hasLabel && (input as HTMLInputElement).type !== 'hidden') {
        issues.push({
          type: 'error',
          rule: 'WCAG 3.3.2 - Labels or Instructions',
          description: 'Form input missing associated label',
          element: input as HTMLElement,
          suggestion: 'Add a label element or aria-label/aria-labelledby attribute'
        })
      }
    })

    return issues
  }

  /**
   * Check for buttons with accessible names
   */
  private checkButtonLabels(): ValidationIssue[] {
    const issues: ValidationIssue[] = []
    const buttons = document.querySelectorAll('button')

    buttons.forEach(button => {
      const hasText = button.textContent?.trim()
      const hasAriaLabel = button.hasAttribute('aria-label')
      const hasAriaLabelledBy = button.hasAttribute('aria-labelledby')
      const hasTitle = button.hasAttribute('title')

      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
        issues.push({
          type: 'error',
          rule: 'WCAG 4.1.2 - Name, Role, Value',
          description: 'Button missing accessible name',
          element: button,
          suggestion: 'Add text content, aria-label, or aria-labelledby attribute'
        })
      }
    })

    return issues
  }

  /**
   * Check for proper heading hierarchy
   */
  private checkHeadingHierarchy(): ValidationIssue[] {
    const issues: ValidationIssue[] = []
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0

    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1))

      if (index === 0 && currentLevel !== 1) {
        issues.push({
          type: 'warning',
          rule: 'WCAG 1.3.1 - Info and Relationships',
          description: 'Page should start with h1 heading',
          element: heading as HTMLElement,
          suggestion: 'Use h1 for the main page heading'
        })
      }

      if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        issues.push({
          type: 'warning',
          rule: 'WCAG 1.3.1 - Info and Relationships',
          description: `Heading level skipped (h${previousLevel} to h${currentLevel})`,
          element: heading as HTMLElement,
          suggestion: 'Maintain proper heading hierarchy without skipping levels'
        })
      }

      previousLevel = currentLevel
    })

    return issues
  }

  /**
   * Check for color contrast issues (basic implementation)
   */
  private checkContrast(): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    // This is a simplified check - real implementation would use a color contrast library
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, label')

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element)
      const color = styles.color
      const backgroundColor = styles.backgroundColor

      // Check for gray text on light backgrounds or vice versa
      if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
        issues.push({
          type: 'warning',
          rule: 'WCAG 1.4.3 - Contrast (Minimum)',
          description: 'Low contrast text detected',
          element: element as HTMLElement,
          suggestion: 'Increase text color contrast ratio to at least 4.5:1'
        })
      }
    })

    return issues
  }

  /**
   * Check for focus management issues
   */
  private checkFocusManagement(): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    // Check for tabindex values > 0
    const elementsWithTabIndex = document.querySelectorAll('[tabindex]')

    elementsWithTabIndex.forEach(element => {
      const tabindex = element.getAttribute('tabindex')
      if (tabindex && parseInt(tabindex) > 0) {
        issues.push({
          type: 'warning',
          rule: 'WCAG 2.4.3 - Focus Order',
          description: 'Positive tabindex value may disrupt focus order',
          element: element as HTMLElement,
          suggestion: 'Use tabindex="0" for focusable elements or tabindex="-1" for programmatic focus'
        })
      }
    })

    return issues
  }

  /**
   * Check for ARIA landmarks
   */
  private checkARIALandmarks(): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    const hasMainLandmark = document.querySelector('main, [role="main"]')
    const hasNavLandmark = document.querySelector('nav, [role="navigation"]')
    const hasHeaderLandmark = document.querySelector('header, [role="banner"]')
    const hasFooterLandmark = document.querySelector('footer, [role="contentinfo"]')

    if (!hasMainLandmark) {
      issues.push({
        type: 'warning',
        rule: 'WCAG 1.3.6 - Identify Purpose',
        description: 'Missing main landmark',
        element: document.body,
        suggestion: 'Add <main> element or role="main" to identify main content area'
      })
    }

    if (!hasNavLandmark) {
      issues.push({
        type: 'warning',
        rule: 'WCAG 1.3.6 - Identify Purpose',
        description: 'Missing navigation landmark',
        element: document.body,
        suggestion: 'Add <nav> element or role="navigation" for navigation areas'
      })
    }

    return issues
  }

  /**
   * Check for language attributes
   */
  private checkLanguageAttributes(): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    if (typeof document !== 'undefined' && !document.documentElement.hasAttribute('lang')) {
      issues.push({
        type: 'warning',
        rule: 'WCAG 3.1.1 - Language of Page',
        description: 'Missing lang attribute on html element',
        element: document.documentElement,
        suggestion: 'Add lang attribute to identify the primary language (e.g., lang="pt")'
      })
    }

    return issues
  }

  /**
   * Check for descriptive link text
   */
  private checkLinkText(): ValidationIssue[] {
    const issues: ValidationIssue[] = []
    const links = document.querySelectorAll('a')

    links.forEach(link => {
      const text = link.textContent?.trim().toLowerCase()

      if (text === 'click here' || text === 'read more' || text === 'learn more') {
        issues.push({
          type: 'warning',
          rule: 'WCAG 2.4.4 - Link Purpose (In Context)',
          description: 'Non-descriptive link text',
          element: link as HTMLElement,
          suggestion: 'Use more descriptive link text that indicates the link destination'
        })
      }
    })

    return issues
  }

  /**
   * Check for keyboard navigation issues
   */
  private checkKeyboardNavigation(): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    // Check for elements that might be missing keyboard access
    const interactiveElements = document.querySelectorAll('[onclick], [role="button"]')

    interactiveElements.forEach(element => {
      const isNativelyFocusable = element.tagName === 'A' ||
                                element.tagName === 'BUTTON' ||
                                element.tagName === 'INPUT' ||
                                element.tagName === 'SELECT' ||
                                element.tagName === 'TEXTAREA' ||
                                element.hasAttribute('tabindex')

      if (!isNativelyFocusable) {
        issues.push({
          type: 'warning',
          rule: 'WCAG 2.1.1 - Keyboard',
          description: 'Interactive element may not be keyboard accessible',
          element: element as HTMLElement,
          suggestion: 'Add tabindex="0" to make element focusable, or use natively focusable elements'
        })
      }
    })

    return issues
  }

  /**
   * Generate accessibility report
   */
  public generateReport(): string {
    const result = this.validatePage()

    let report = '# Accessibility Audit Report\n\n'
    report += `## Overall Score: ${result.score}/100\n\n`
    report += `## Summary\n`
    report += `- ✅ **Passed**: ${result.passed ? 'Yes' : 'No'}\n`
    report += `- ❌ **Errors**: ${result.summary.errors}\n`
    report += `- ⚠️ **Warnings**: ${result.summary.warnings}\n\n`

    if (result.issues.length > 0) {
      report += '## Issues Found\n\n'

      const errors = result.issues.filter(i => i.type === 'error')
      const warnings = result.issues.filter(i => i.type === 'warning')

      if (errors.length > 0) {
        report += '### Errors\n\n'
        errors.forEach((issue, index) => {
          report += `#### ${index + 1}. ${issue.rule}\n`
          report += `**Description**: ${issue.description}\n`
          report += `**Element**: ${issue.element.tagName.toLowerCase()}\n`
          report += `**Suggestion**: ${issue.suggestion}\n\n`
        })
      }

      if (warnings.length > 0) {
        report += '### Warnings\n\n'
        warnings.forEach((issue, index) => {
          report += `#### ${index + 1}. ${issue.rule}\n`
          report += `**Description**: ${issue.description}\n`
          report += `**Element**: ${issue.element.tagName.toLowerCase()}\n`
          report += `**Suggestion**: ${issue.suggestion}\n\n`
        })
      }
    } else {
      report += '## ✅ No accessibility issues found!\n\n'
      report += 'Great job! The page appears to meet basic accessibility standards.'
    }

    return report
  }

  /**
   * Run validation and log results to console
   */
  public audit(): ValidationResult {
    const result = this.validatePage()

    console.group('🔍 Accessibility Audit Results')
    console.log(`Score: ${result.score}/100`)
    console.log(`Errors: ${result.summary.errors}`)
    console.log(`Warnings: ${result.summary.warnings}`)
    console.log(`Passed: ${result.passed}`)

    if (result.issues.length > 0) {
      console.group('Issues Found')
      result.issues.forEach((issue, index) => {
        const icon = issue.type === 'error' ? '❌' : '⚠️'
        console.log(`${icon} ${index + 1}. ${issue.rule}`)
        console.log(`   ${issue.description}`)
        console.log(`   Element:`, issue.element)
        console.log(`   Suggestion: ${issue.suggestion}`)
      })
      console.groupEnd()
    }

    console.groupEnd()

    // Return the result for further processing
    return result
  }
}

// Export singleton instance
export const accessibilityValidator = AccessibilityValidator.getInstance()

// Add global function for easy access
declare global {
  interface Window {
    accessibilityAudit: () => ValidationResult
  }
}

// Make audit available globally for debugging
if (typeof window !== 'undefined') {
  window.accessibilityAudit = () => accessibilityValidator.audit()
}
