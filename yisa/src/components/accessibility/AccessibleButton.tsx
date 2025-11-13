import React, { forwardRef, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes } from 'react'
import { useAccessibility } from '../../hooks/useAccessibility'

export interface AccessibleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  announceClick?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  type?: 'button' | 'submit' | 'reset'
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      announceClick,
      ariaLabel,
      ariaDescribedBy,
      onClick,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const { announce } = useAccessibility()

    // Combine refs
    const setRefs = (element: HTMLButtonElement | null) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(element)
        } else {
          ;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = element
        }
      }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return

      // Announce click for screen readers if specified
      if (announceClick) {
        announce(announceClick, 'polite')
      }

      // Call original onClick handler
      onClick?.(event)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle Space and Enter keys
      if ((event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') && !disabled && !loading) {
        event.preventDefault()
        ;(event.target as HTMLButtonElement).click()
      }
    }

    // Get base classes based on variant
    const getVariantClasses = () => {
      switch (variant) {
        case 'primary':
          return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border-transparent'
        case 'secondary':
          return 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border-gray-300'
        case 'ghost':
          return 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border-transparent'
        case 'danger':
          return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent'
        default:
          return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border-transparent'
      }
    }

    // Get size classes
    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'px-3 py-1.5 text-xs font-medium'
        case 'lg':
          return 'px-6 py-3 text-base font-medium'
        default:
          return 'px-4 py-2 text-sm font-medium'
      }
    }

    // Build button classes
    const buttonClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-lg',
      'border',
      'font-medium',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:shadow-none',
      fullWidth ? 'w-full' : '',
      getVariantClasses(),
      getSizeClasses(),
      className
    ].filter(Boolean).join(' ')

    // Generate unique ID for accessibility
    const buttonId = React.useId()

    return (
      <motion.button
        ref={setRefs}
        id={buttonId}
        type={type}
        disabled={disabled || loading}
        className={buttonClasses}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
        whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      >
        {/* Left Icon */}
        {leftIcon && (
          <span className="mr-2 flex-shrink-0" aria-hidden="true">
            {loading ? (
              <div className="animate-spin w-4 h-4" />
            ) : (
              leftIcon
            )}
          </span>
        )}

        {/* Loading State */}
        {loading && (
          <span className="mr-2" aria-hidden="true">
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          </span>
        )}

        {/* Button Content */}
        <span className="text-center whitespace-nowrap">
          {children}
        </span>

        {/* Right Icon */}
        {rightIcon && !loading && (
          <span className="ml-2 flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}

        {/* Screen reader only text for loading state */}
        {loading && (
          <span className="sr-only">
            Loading, please wait
          </span>
        )}
      </motion.button>
    )
  }
)

// Set display name for debugging
AccessibleButton.displayName = 'AccessibleButton'

export default AccessibleButton