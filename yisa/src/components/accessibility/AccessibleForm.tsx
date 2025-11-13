import React, { forwardRef, useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FormHTMLAttributes } from 'react'
import { useAccessibility } from '../../hooks/useAccessibility'

interface FormField {
  name: string
  value: any
  required?: boolean
  validate?: (value: any) => string | null
  label?: string
}

export interface AccessibleFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: Record<string, any>, isValid: boolean) => void | Promise<void>
  onValidationError?: (errors: Record<string, string>) => void
  fields?: FormField[]
  validateOnChange?: boolean
  validateOnBlur?: boolean
  showErrors?: boolean
  submitButton?: React.ReactNode
  submitText?: string
  submitLoading?: boolean
  submitDisabled?: boolean
  announceFormChanges?: boolean
  resetOnSubmit?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
}

const AccessibleForm = forwardRef<HTMLFormElement, AccessibleFormProps>(
  (
    {
      children,
      onSubmit,
      onValidationError,
      fields = [],
      validateOnChange = true,
      validateOnBlur = true,
      showErrors = true,
      submitButton,
      submitText = 'Submit',
      submitLoading = false,
      submitDisabled = false,
      announceFormChanges = true,
      resetOnSubmit = false,
      ariaLabel,
      ariaDescribedBy,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const { announce, generateId, trapFocus } = useAccessibility()
    const formRef = useRef<HTMLFormElement>(null)
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [isValid, setIsValid] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    // Generate unique IDs
    const formId = id || generateId('form')
    const statusId = generateId('form-status')
    const descriptionId = generateId('form-description')

    const internalRef = useRef<HTMLFormElement>(null)

    // Combine refs properly
    const setRefs = (element: HTMLFormElement | null) => {
      internalRef.current = element
      if (ref) {
        if (typeof ref === 'function') {
          ref(element)
        } else if ('current' in ref) {
          try {
            (ref as React.MutableRefObject<HTMLFormElement | null>).current = element
          } catch {
            // Ignore readonly ref errors
          }
        }
      }
    }

    // Initialize form data from fields
    useEffect(() => {
      const initialData: Record<string, any> = {}
      fields.forEach(field => {
        initialData[field.name] = field.value || ''
      })
      setFormData(initialData)
    }, [fields])

    // Validate a single field
    const validateField = (fieldName: string, value: any): string | null => {
      const field = fields.find(f => f.name === fieldName)
      if (!field) return null

      // Required field validation
      if (field.required && (!value || value.toString().trim() === '')) {
        return `${field.label || fieldName} is required`
      }

      // Custom validation
      if (field.validate && value) {
        return field.validate(value)
      }

      return null
    }

    // Validate all fields
    const validateForm = (data: Record<string, any>): Record<string, string> => {
      const newErrors: Record<string, string> = {}

      fields.forEach(field => {
        const error = validateField(field.name, data[field.name])
        if (error) {
          newErrors[field.name] = error
        }
      })

      return newErrors
    }

    // Check if form is valid
    const checkFormValidity = (data: Record<string, any>, errorList: Record<string, string>) => {
      const hasErrors = Object.keys(errorList).length > 0
      const hasRequiredFields = fields.every(field => {
        if (!field.required) return true
        return data[field.name] && data[field.name].toString().trim() !== ''
      })

      return !hasErrors && hasRequiredFields
    }

    // Handle field value changes
    const handleFieldChange = (fieldName: string, value: any) => {
      const newData = { ...formData, [fieldName]: value }
      setFormData(newData)

      if (validateOnChange && touched[fieldName]) {
        const newErrors = { ...errors }
        const error = validateField(fieldName, value)

        if (error) {
          newErrors[fieldName] = error
        } else {
          delete newErrors[fieldName]
        }

        setErrors(newErrors)

        const valid = checkFormValidity(newData, newErrors)
        setIsValid(valid)
      }

      // Announce field changes if enabled
      if (announceFormChanges && touched[fieldName]) {
        const fieldLabel = fields.find(f => f.name === fieldName)?.label || fieldName
        announce(`${fieldLabel} updated`, 'polite')
      }
    }

    // Handle field blur
    const handleFieldBlur = (fieldName: string, value: any) => {
      setTouched(prev => ({ ...prev, [fieldName]: true }))

      if (validateOnBlur) {
        const error = validateField(fieldName, value)
        const newErrors = { ...errors }

        if (error) {
          newErrors[fieldName] = error
          announce(`Error in ${fields.find(f => f.name === fieldName)?.label || fieldName}: ${error}`, 'assertive')
        } else {
          delete newErrors[fieldName]
        }

        setErrors(newErrors)

        const valid = checkFormValidity({ ...formData, [fieldName]: value }, newErrors)
        setIsValid(valid)

        if (Object.keys(newErrors).length > 0) {
          onValidationError?.(newErrors)
        }
      }
    }

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (isSubmitting || submitLoading) return

      // Validate all fields
      const formErrors = validateForm(formData)
      const formIsValid = Object.keys(formErrors).length === 0

      if (!formIsValid) {
        setErrors(formErrors)

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {}
        fields.forEach(field => {
          allTouched[field.name] = true
        })
        setTouched(allTouched)

        // Focus first error field
        const firstErrorField = Object.keys(formErrors)[0]
        if (firstErrorField) {
          const errorElement = internalRef.current?.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
          errorElement?.focus()
        }

        // Announce validation errors
        const errorCount = Object.keys(formErrors).length
        announce(`Form has ${errorCount} error${errorCount !== 1 ? 's' : ''}. Please correct and try again.`, 'assertive')

        onValidationError?.(formErrors)
        return
      }

      setIsSubmitting(true)
      announce('Submitting form...', 'assertive')

      try {
        await onSubmit(formData, formIsValid)

        if (resetOnSubmit) {
          handleReset()
        }

        announce('Form submitted successfully', 'polite')
      } catch (error) {
        announce('Form submission failed. Please try again.', 'assertive')
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    // Handle form reset
    const handleReset = () => {
      const initialData: Record<string, any> = {}
      fields.forEach(field => {
        initialData[field.name] = field.value || ''
      })

      setFormData(initialData)
      setErrors({})
      setTouched({})
      setIsValid(false)
      announce('Form reset', 'polite')
    }

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
      // Ctrl/Cmd + Enter to submit
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && isValid && !isSubmitting) {
        event.preventDefault()
        internalRef.current?.dispatchEvent(new Event('submit', { cancelable: true }))
      }

      // Escape to reset form
      if (event.key === 'Escape') {
        const hasData = fields.some(field => formData[field.name] && formData[field.name].toString().trim() !== '')
        if (hasData) {
          event.preventDefault()
          handleReset()
        }
      }
    }

    // Get form status for screen readers
    const getFormStatus = () => {
      if (isSubmitting) return 'Submitting'
      if (Object.keys(errors).length > 0) return `${Object.keys(errors).length} errors`
      if (isValid) return 'Ready to submit'
      return 'Incomplete'
    }

    return (
      <motion.form
        ref={setRefs}
        id={formId}
        className={className}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy || descriptionId}
        aria-busy={isSubmitting}
        noValidate
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Form status for screen readers */}
        <div
          id={statusId}
          className="sr-only aria-live-polite"
          aria-live="polite"
          aria-atomic="true"
        >
          Form status: {getFormStatus()}
        </div>

        {/* Form description */}
        <div
          id={descriptionId}
          className="sr-only"
        >
          Use Tab key to navigate between fields, Enter or Space to interact, Ctrl+Enter to submit when ready, Escape to reset form.
        </div>

        {/* Form fields */}
        <div className="space-y-6">
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                formData,
                errors,
                touched,
                focusedField,
                onFieldChange: handleFieldChange,
                onFieldBlur: handleFieldBlur,
                onFieldFocus: setFocusedField,
                ...child.props
              })
            }
            return child
          })}
        </div>

        {/* Error summary */}
        <AnimatePresence>
          {showErrors && Object.keys(errors).length > 0 && (
            <motion.div
              className="mt-6 p-4 bg-error-50 border border-error-200 rounded-lg"
              role="alert"
              aria-labelledby={`${formId}-error-summary`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 id={`${formId}-error-summary`} className="text-sm font-medium text-error-800 mb-2">
                Please correct the following {Object.keys(errors).length} error{Object.keys(errors).length !== 1 ? 's' : ''}:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(errors).map(([fieldName, error]) => (
                  <li key={fieldName}>
                    <button
                      type="button"
                      className="text-sm text-error-600 hover:text-error-800 underline text-left"
                      onClick={() => {
                        const fieldElement = internalRef.current?.querySelector(`[name="${fieldName}"]`) as HTMLElement
                        fieldElement?.focus()
                      }}
                    >
                      {fields.find(f => f.name === fieldName)?.label || fieldName}: {error}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        {submitButton || (
          <motion.button
            type="submit"
            disabled={submitDisabled || !isValid || isSubmitting || submitLoading}
            className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: isValid && !isSubmitting && !submitLoading ? 1.02 : 1 }}
          >
            {isSubmitting || submitLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Submitting...
              </>
            ) : (
              submitText
            )}
          </motion.button>
        )}
      </motion.form>
    )
  }
)

// Set display name for debugging
AccessibleForm.displayName = 'AccessibleForm'

export default AccessibleForm