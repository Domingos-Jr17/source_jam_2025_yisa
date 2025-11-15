import React, { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useAccessibility } from '../../hooks/useAccessibility'

export interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  preventBodyScroll?: boolean
  showCloseButton?: boolean
  children: React.ReactNode
  ariaLabel?: string
  ariaDescribedBy?: string
  className?: string
  overlayClassName?: string
  initialFocus?: React.RefObject<HTMLElement>
  restoreFocus?: React.RefObject<HTMLElement>
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventBodyScroll = true,
  showCloseButton = true,
  children,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  overlayClassName = '',
  initialFocus,
  restoreFocus
}) => {
  const { announce, trapFocus, generateId } = useAccessibility()
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const releaseFocusRef = useRef<(() => void) | null>(null)

  // Generate unique IDs
  const modalId = generateId('modal')
  const titleId = title ? generateId('modal-title') : undefined
  const descriptionId = description ? generateId('modal-description') : undefined

  // Get size classes
  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4'
    }
    return sizeMap[size]
  }

  // Handle overlay click
  const handleOverlayClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose()
      announce('Modal closed', 'polite')
    }
  }, [closeOnOverlayClick, onClose, announce])

  // Handle escape key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && closeOnEscape) {
      event.preventDefault()
      onClose()
      announce('Modal closed', 'polite')
    }
  }, [closeOnEscape, onClose, announce])

  // Handle close button click
  const handleCloseClick = () => {
    onClose()
    announce('Modal closed', 'polite')
  }

  // Setup focus trap and event listeners
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    // Store current focus element if restoreFocus not provided
    if (!restoreFocus || !restoreFocus.current) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }

    // Set up focus trap
    const focusElement = initialFocus?.current || modalRef.current
    releaseFocusRef.current = trapFocus(focusElement)

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown)

    // Prevent body scroll
    if (preventBodyScroll) {
      document.body.style.overflow = 'hidden'
    }

    // Announce modal opening for screen readers
    if (title) {
      announce(`Modal opened: ${title}`, 'polite')
    } else {
      announce('Modal opened', 'polite')
    }

    // Set focus to initial element or modal
    setTimeout(() => {
      if (initialFocus?.current) {
        initialFocus.current.focus()
      } else {
        modalRef.current?.focus()
      }
    }, 100)

    return () => {
      // Clean up event listeners
      document.removeEventListener('keydown', handleKeyDown)

      // Restore focus trap
      if (releaseFocusRef.current) {
        releaseFocusRef.current()
        releaseFocusRef.current = null
      }

      // Restore body scroll
      if (preventBodyScroll) {
        document.body.style.overflow = ''
      }

      // Restore focus
      const focusToRestore = restoreFocus?.current || previousFocusRef.current
      if (focusToRestore) {
        setTimeout(() => {
          focusToRestore.focus()
        }, 100)
      }
    }
  }, [isOpen, trapFocus, handleKeyDown, preventBodyScroll, initialFocus, restoreFocus, announce, title])

  // Don't render if not open
  if (!isOpen) return null

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Overlay */}
        <motion.div
          className={`fixed inset-0 bg-black bg-opacity-50 ${overlayClassName}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            ref={modalRef}
            id={modalId}
            className={`relative w-full ${getSizeClasses()} bg-white rounded-lg shadow-xl ${className}`}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            aria-labelledby={titleId}
            aria-describedby={ariaDescribedBy || descriptionId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Close Button */}
            {showCloseButton && (
              <button
                type="button"
                onClick={handleCloseClick}
                className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Modal Header */}
            {(title || description) && (
              <div className="px-6 py-4 border-b border-gray-200">
                {title && (
                  <h2
                    id={titleId}
                    className="text-xl font-semibold text-gray-900 pr-8"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={descriptionId}
                    className="mt-1 text-sm text-gray-500"
                  >
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className="px-6 py-4">
              {children}
            </div>

            {/* Modal Footer (if needed) */}
            {/* Footer should be part of children content */}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )

  // Use portal to render at document.body level
  return createPortal(modalContent, document.body)
}

export default AccessibleModal