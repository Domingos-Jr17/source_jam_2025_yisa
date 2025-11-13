import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccessibility } from '../../hooks/useAccessibility'

interface SkipLinkProps {
  href?: string
  targetId?: string
  label?: string
  className?: string
}

const SkipLink: React.FC<SkipLinkProps> = ({
  href = '#main',
  targetId,
  label = 'Skip to main content',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { isNavigatingWithKeyboard } = useAccessibility()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsVisible(true)
        // Hide after a short delay
        setTimeout(() => setIsVisible(false), 3000)
      }
    }

    const handleMouseDown = () => {
      setIsVisible(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    const targetIdToUse = targetId || href.replace('#', '')
    const targetElement = document.getElementById(targetIdToUse) ||
                        document.querySelector('main') ||
                        document.querySelector('[role="main"]') ||
                        document.querySelector('#main')

    if (targetElement) {
      targetElement.setAttribute('tabindex', '-1')
      targetElement.focus()

      // Announce for screen readers
      const { announce } = useAccessibility()
      announce('Skipped to main content', 'polite')

      // Remove tabindex after focus
      setTimeout(() => {
        targetElement.removeAttribute('tabindex')
      }, 100)
    }
  }

  return (
    <AnimatePresence>
      {(isVisible || isNavigatingWithKeyboard) && (
        <motion.a
          href={href}
          onClick={handleClick}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`
            absolute top-4 left-4 z-50
            bg-white text-gray-900
            px-4 py-2 rounded-lg
            shadow-lg
            border-2 border-primary-600
            font-medium text-sm
            focus:outline-none
            focus:ring-2 focus:ring-primary-500
            focus:ring-offset-2
            transform -translate-y-0
            hover:bg-primary-50
            hover:text-primary-700
            transition-all duration-200
            ${className}
          `}
        >
          {label}
        </motion.a>
      )}
    </AnimatePresence>
  )
}

export default SkipLink