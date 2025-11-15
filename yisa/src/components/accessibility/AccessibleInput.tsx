import React, { forwardRef, useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { InputHTMLAttributes } from 'react'
import { useAccessibility } from '../../hooks/useAccessibility'

export interface AccessibleInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'search' | 'url'
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  maxLength?: number
  mask?: (value: string) => string
  validate?: (value: string) => string | null
  announceChanges?: boolean
  fullWidth?: boolean
}

const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      label,
      type = 'text',
      error,
      helperText,
      required = false,
      disabled = false,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      maxLength,
      mask,
      validate,
      announceChanges = true,
      fullWidth = true,
      onChange,
      onBlur,
      onFocus,
      value,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const { announce, generateId } = useAccessibility()
    const internalRef = useRef<HTMLInputElement>(null)
    const [inputType, setInputType] = useState(type)
    const [isFocused, setIsFocused] = useState(false)
    const [internalValue, setInternalValue] = useState(value || '')
    const [validationError, setValidationError] = useState<string | null>(error || null)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    // Generate unique IDs
    const inputId = id || generateId('input')
    const errorId = error ? generateId('error') : undefined
    const helperId = helperText ? generateId('helper') : undefined
    const descriptionId = [errorId, helperId].filter(Boolean).join(' ') || undefined

    // Combine refs properly
    const setRefs = (element: HTMLInputElement | null) => {
            if (ref) {
        if (typeof ref === 'function') {
          ref(element)
        } else if (ref.current !== undefined) {
          try {
            ref.current = element
          } catch {
            // Ignore readonly ref errors
          }
        }
      }
    }

    // Update internal value when prop changes
    useEffect(() => {
      setInternalValue(value || '')
    }, [value])

    // Update validation error when prop changes
    useEffect(() => {
      setValidationError(error || null)
    }, [error])

    // Handle input changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value

      // Apply mask if provided
      if (mask) {
        const maskedValue = mask(newValue)
        event.target.value = maskedValue
        setInternalValue(maskedValue)
      } else {
        setInternalValue(newValue)
      }

      // Validate if validation function provided
      if (validate) {
        const validationError = validate(event.target.value)
        setValidationError(validationError)
      }

      // Announce changes for screen readers if enabled
      if (announceChanges && !disabled) {
        if (mask) {
          announce(`Input value: ${mask(newValue)}`, 'polite')
        } else {
          announce(`Input value: ${newValue}`, 'polite')
        }
      }

      // Call original onChange handler
      onChange?.(event)
    }

    // Handle focus events
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)

      // Announce focus for screen readers
      if (announceChanges && !disabled) {
        const fieldType = type === 'password' ? 'password field' : type || 'text field'
        announce(`Focused on ${label || fieldType}${required ? ', required' : ''}`, 'polite')
      }

      onFocus?.(event)
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)

      // Validate on blur if validation function provided
      if (validate && !validationError) {
        const validationError = validate(event.target.value)
        setValidationError(validationError)
      }

      onBlur?.(event)
    }

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible)
      setInputType(isPasswordVisible ? 'password' : 'text')
      announce(`Password ${isPasswordVisible ? 'hidden' : 'visible'}`, 'polite')
    }

    // Get input classes based on state
    const getInputClasses = () => {
      const baseClasses = [
        'flex',
        'items-center',
        'px-4',
        'py-3',
        'text-sm',
        'font-medium',
        'border',
        'rounded-lg',
        'transition-all',
        'duration-200',
        'ease-in-out',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        'disabled:bg-gray-50',
        fullWidth ? 'w-full' : '',
        leftIcon ? 'pl-12' : '',
        rightIcon || showPasswordToggle ? 'pr-12' : '',
        className
      ].filter(Boolean).join(' ')

      if (validationError) {
        return `${baseClasses} border-error-500 text-error-900 focus:ring-error-500 bg-error-50`
      }

      if (isFocused) {
        return `${baseClasses} border-primary-500 focus:ring-primary-500`
      }

      return `${baseClasses} border-gray-300 focus:border-primary-500 focus:ring-primary-500`
    }

    // Get character count display
    const getCharacterCount = () => {
      if (!maxLength) return null

      const count = String(internalValue).length
      const percentage = (count / maxLength) * 100

      let colorClass = 'text-gray-500'
      if (percentage >= 90) colorClass = 'text-error-500'
      else if (percentage >= 80) colorClass = 'text-warning-500'

      return (
        <span className={`text-xs ${colorClass} ml-2`}>
          {count}/{maxLength}
        </span>
      )
    }

    return (
      <div className={`space-y-2 ${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && (
              <span className="text-error-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <motion.input
            ref={setRefs}
            id={inputId}
            type={inputType}
            value={value}
            disabled={disabled}
            maxLength={maxLength}
            className={getInputClasses()}
            aria-label={label}
            aria-describedby={descriptionId}
            aria-required={required}
            aria-invalid={!!validationError}
            aria-disabled={disabled}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ duration: 0.1 }}
            {...Object.fromEntries(Object.entries(props).filter(([key]) => !['onAnimationStart', 'onAnimationEnd'].includes(key)))}
          />

          {/* Right Icon or Password Toggle */}
          {(rightIcon || showPasswordToggle) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {showPasswordToggle ? (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-primary-600 transition-colors p-1 rounded"
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                  disabled={disabled}
                >
                  {isPasswordVisible ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              ) : (
                <div className="text-gray-400">
                  {rightIcon}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Helper Text and Error */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Error Message */}
            {validationError && (
              <motion.div
                id={errorId}
                className="text-sm text-error-600 font-medium"
                role="alert"
                aria-live="polite"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {validationError}
              </motion.div>
            )}

            {/* Helper Text */}
            {helperText && !validationError && (
              <div
                id={helperId}
                className="text-sm text-gray-500"
              >
                {helperText}
              </div>
            )}
          </div>

          {/* Character Count */}
          {getCharacterCount()}
        </div>
      </div>
    )
  }
)

// Set display name for debugging
AccessibleInput.displayName = 'AccessibleInput'

export default AccessibleInput