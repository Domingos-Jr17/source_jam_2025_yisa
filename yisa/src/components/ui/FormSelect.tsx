import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface FormSelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface FormSelectProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: FormSelectOption[]
  placeholder?: string
  required?: boolean
  error?: string
  helper?: string
  disabled?: boolean
  className?: string
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error,
  helper,
  disabled = false,
  className = ''
}) => {
  const hasError = !!error
  const hasValue = value.length > 0

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            form-input
            appearance-none
            ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${hasValue && !hasError ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}
            ${disabled ? 'bg-gray-50 text-gray-500' : ''}
          `}
          aria-describedby={error ? `${name}-error` : helper ? `${name}-helper` : undefined}
          aria-invalid={hasError}
          required={required}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDownIcon
            className={`h-5 w-5 ${hasError ? 'text-red-500' : hasValue ? 'text-green-500' : 'text-gray-400'}`}
            aria-hidden="true"
          />
        </div>
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

export default FormSelect