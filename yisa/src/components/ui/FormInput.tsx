import React from 'react'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface FormInputProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'number' | 'tel'
  placeholder?: string
  required?: boolean
  error?: string
  helper?: string
  disabled?: boolean
  maxLength?: number
  className?: string
  mask?: (value: string) => string
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  helper,
  disabled = false,
  maxLength,
  className = '',
  mask
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    if (mask) {
      newValue = mask(newValue)
    }

    onChange(newValue)
  }

  const hasError = !!error
  const hasValue = value.length > 0

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            form-input
            ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${hasValue && !hasError ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}
            ${disabled ? 'bg-gray-50 text-gray-500' : ''}
          `}
          aria-describedby={error ? `${name}-error` : helper ? `${name}-helper` : undefined}
          aria-invalid={hasError}
          required={required}
        />

        {/* Status icons */}
        {hasValue && !hasError && !disabled && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p id={`${name}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}

      {/* Helper text */}
      {helper && !hasError && (
        <p id={`${name}-helper`} className="form-help">
          {helper}
        </p>
      )}
    </div>
  )
}

export default FormInput