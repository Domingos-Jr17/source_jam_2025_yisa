/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1e40af',
          700: '#1e3a8a',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // Accessibility utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
        },
        '.not-sr-only': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: '0',
          margin: '0',
          overflow: 'visible',
          clip: 'auto',
          whiteSpace: 'normal',
        },
        // Focus visible for keyboard navigation
        '.focus-visible': {
          'outline': '2px solid currentColor',
          'outline-offset': '2px',
        },
        // Reduced motion
        '.reduce-motion *': {
          'animation-duration': '0.01ms !important',
          'animation-iteration-count': '1 !important',
          'transition-duration': '0.01ms !important',
        },
        '.reduce-motion': {
          'animation-duration': '0.01ms !important',
          'animation-iteration-count': '1 !important',
          'transition-duration': '0.01ms !important',
        },
        // High contrast mode
        '.high-contrast': {
          '--tw-bg-opacity': '1',
        },
        '.high-contrast button': {
          'border-width': '2px',
        },
        '.high-contrast a': {
          'text-decoration': 'underline',
          'font-weight': '600',
        },
        // Large text mode
        '.large-text': {
          'font-size': '120%',
          'lineHeight': '1.5',
        },
        '.large-text p': {
          'font-size': 'inherit',
        },
        // Skip links
        '.skip-link': {
          'position': 'absolute',
          'top': '-40px',
          'left': '6px',
          'background': theme('colors.primary.600'),
          'color': 'white',
          'padding': '8px',
          'text-decoration': 'none',
          'z-index': '100',
          'borderRadius': '0 0 4px 0',
        },
        '.skip-link:focus': {
          'top': '6px',
        },
        // Screen reader only text
        '.sr-only-text': {
          'position': 'absolute',
          'left': '-10000px',
          'top': 'auto',
          'width': '1px',
          'height': '1px',
          'overflow': 'hidden',
        },
        // ARIA live regions
        '.aria-live': {
          'position': 'absolute',
          'left': '-10000px',
          'width': '1px',
          'height': '1px',
          'overflow': 'hidden',
        },
        '.aria-live-polite': {
          'aria-live': 'polite',
          'aria-atomic': 'true',
        },
        '.aria-live-assertive': {
          'aria-live': 'assertive',
          'aria-atomic': 'true',
        },
        // Focus indicators
        '.focus-ring': {
          'boxShadow': `0 0 0 3px ${theme('colors.primary.500')}`,
        },
        '.focus-ring-offset': {
          'boxShadow': `0 0 0 3px ${theme('colors.primary.500')}, 0 0 0 6px rgba(59, 130, 246, 0.1)`,
        },
        // Touch targets (minimum 44px)
        '.touch-target-min': {
          'minWidth': '44px',
          'minHeight': '44px',
        },
        '.touch-target-lg': {
          'minWidth': '48px',
          'minHeight': '48px',
        },
        // Link states for accessibility
        '.link-accessible': {
          'textDecoration': 'underline',
          'textUnderlineOffset': '2px',
          'transition': 'textDecorationColor 0.2s',
        },
        '.link-accessible:hover': {
          'textDecorationThickness': '2px',
        },
        '.link-accessible:focus': {
          'outline': '2px solid currentColor',
          'outlineOffset': '2px',
          'borderRadius': '4px',
        },
        // Error and validation states
        '.error-state': {
          'borderColor': theme('colors.error.500'),
          'outline': '2px solid transparent',
          'outlineColor': theme('colors.error.500'),
        },
        '.success-state': {
          'borderColor': theme('colors.success.500'),
          'outline': '2px solid transparent',
          'outlineColor': theme('colors.success.500'),
        },
        '.warning-state': {
          'borderColor': theme('colors.warning.500'),
          'outline': '2px solid transparent',
          'outlineColor': theme('colors.warning.500'),
        },
        // Navigation indicators
        '.nav-indicator': {
          'position': 'relative',
        },
        '.nav-indicator::after': {
          'content': '',
          'position': 'absolute',
          'bottom': '-2px',
          'left': '0',
          'right': '0',
          'height': '2px',
          'background': 'currentColor',
        },
      }

      addUtilities(newUtilities)
    },
  ],
  darkMode: 'class',
}