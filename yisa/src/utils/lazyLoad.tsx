/**
 * Lazy loading utilities for performance optimization
 */

import { lazy, ComponentType, Suspense, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Loading component for lazy loaded components
const LoadingSpinner = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

// Fallback component for lazy loading errors
const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <div className="text-error-500 text-lg mb-2">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load component
        </h3>
        <p className="text-sm text-gray-600">
          {error.message || 'An error occurred while loading this component.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}

// Wrapper component for lazy loaded components
interface LazyWrapperProps {
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
  delay?: number
  children: React.ReactNode
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
  fallback = <LoadingSpinner />,
  errorFallback = <ErrorBoundary error={new Error('Component failed to load')} />,
  delay = 200,
  children
}) => {
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Suspense fallback={showFallback ? fallback : <div />}>
      {children}
    </Suspense>
  )
}

// Enhanced lazy loading function with error handling
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    fallback?: React.ReactNode
    errorFallback?: React.ReactNode
    preload?: boolean
  }
): ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFunc)

  // Preload the component if requested
  if (options?.preload) {
    importFunc()
  }

  const Component = (props: React.ComponentProps<T>) => (
    <LazyWrapper
      fallback={options?.fallback}
      errorFallback={options?.errorFallback}
    >
      <LazyComponent {...props} />
    </LazyWrapper>
  )

  // Add static methods for preloading
  ;(Component as any).preload = importFunc

  return Component as ComponentType<React.ComponentProps<T>>
}

// Preload critical components
export const preloadCriticalComponents = async () => {
  const criticalImports = [
    () => import('../pages/EmitirPage'),
    () => import('../pages/VerificarPage'),
    () => import('../pages/CarteiraPage'),
    () => import('../components/QRScanner')
  ]

  try {
    await Promise.all(criticalImports.map(importFunc => importFunc()))
  } catch (error) {
    console.warn('Failed to preload some components:', error)
  }
}

// Intersection Observer based loading
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback()
            observer.unobserve(element)
          }
        })
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, callback, options])
}

// Viewport-based lazy loading component
interface ViewportLazyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
}

export const ViewportLazy: React.FC<ViewportLazyProps> = ({
  children,
  fallback = <div className="h-32 bg-gray-100 animate-pulse" />,
  rootMargin = '50px',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useIntersectionObserver(
    { current: ref } as React.RefObject<Element>,
    () => setIsVisible(true),
    { rootMargin, threshold }
  )

  return (
    <div ref={setRef}>
      {isVisible ? children : fallback}
    </div>
  )
}

// Progressive image loading
interface ProgressiveImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
  onLoad?: () => void
  onError?: () => void
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  className = '',
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const img = new Image()
    img.src = src

    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
      onLoad?.()
    }

    img.onerror = () => {
      setIsLoading(false)
      onError?.()
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, onLoad, onError])

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'} ${className}`}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="small" />
        </div>
      )}
    </div>
  )
}

// Preload utilities
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
  })
}

export const preloadFont = (fontUrl: string, fontFamily: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const font = new FontFace(fontFamily, `url(${fontUrl})`)
    font
      .load()
      .then(() => {
        document.fonts.add(font)
        resolve()
      })
      .catch(reject)
  })
}

// Resource monitoring
export const useResourceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    bundleSize: 0,
    loadTime: 0,
    renderTime: 0
  })

  useEffect(() => {
    if ('memory' in performance) {
      const updateMetrics = () => {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: (performance as any).memory.usedJSHeapSize
        }))
      }

      const interval = setInterval(updateMetrics, 5000)
      return () => clearInterval(interval)
    }
    return undefined
  }, [])

  return metrics
}

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export {
  LoadingSpinner,
  ErrorBoundary,
  LazyWrapper
}
