import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Components
import Header from './components/Header'
import Navigation from './components/Navigation'
import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'
import SkipLink from './components/accessibility/SkipLink'

// Pages
import HomePage from './pages/HomePage'
import EmitirPage from './pages/EmitirPage'
import VerificarPage from './pages/VerificarPage'
import CarteiraPage from './pages/CarteiraPage'
import PartilharPage from './pages/PartilharPage'
import HistoricoPage from './pages/HistoricoPage'
import DefinicoesPage from './pages/DefinicoesPage'
import SobrePage from './pages/SobrePage'
import OfflinePage from './pages/OfflinePage'

// Hooks
import { useAuth } from './hooks/useAuth'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import { useAppInstall } from './hooks/useAppInstall'
import { useAccessibility } from './hooks/useAccessibility'

// Stores
import { useAuthStore } from './stores/authStore'

// Utils
import { ROUTES } from './utils/constants'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <Navigation
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

const App: React.FC = () => {
  const { isOnline } = useNetworkStatus()
  const { showInstallPrompt, installApp } = useAppInstall()
  const { isAuthenticated, isLoading } = useAuthStore()
  const {
    settings,
    getAccessibilityClasses,
    announcePageChange
  } = useAccessibility()

  // Show install banner if PWA install is available
  const showInstallBanner = showInstallPrompt && !isAuthenticated

  // Handle keyboard shortcuts and announce page changes
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K for search (future feature)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        // TODO: Open search modal
      }

      // Ctrl/Cmd + / for keyboard shortcuts help
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault()
        // TODO: Show keyboard shortcuts modal
      }

      // Escape to close modals
      if (event.key === 'Escape') {
        // TODO: Close any open modals
      }
    }

    document.addEventListener('keydown', handleKeyboardShortcuts)
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts)
  }, [])

  // Announce page changes for screen readers
  useEffect(() => {
    const handleRouteChange = () => {
      const pageName = getPageNameFromPath(location.pathname)
      announcePageChange(pageName, `Navigated to ${pageName}`)
    }

    // Initial page announcement
    handleRouteChange()

    // Listen for route changes
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      setTimeout(handleRouteChange, 0)
    }

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      setTimeout(handleRouteChange, 0)
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [announcePageChange])

  // Helper function to get page name from path
  const getPageNameFromPath = (path: string): string => {
    const pageMap: Record<string, string> = {
      [ROUTES.HOME]: 'Página Inicial',
      [ROUTES.EMITIR]: 'Emitir Documento',
      [ROUTES.VERIFICAR]: 'Verificar Documento',
      [ROUTES.CARTEIRA]: 'Minha Carteira',
      [ROUTES.HISTORICO]: 'Histórico',
      [ROUTES.DEFINICOES]: 'Definições',
      [ROUTES.SOBRE]: 'Sobre YISA'
    }

    for (const [route, name] of Object.entries(pageMap)) {
      if (path.startsWith(route)) {
        return name
      }
    }

    return 'Página Desconhecida'
  }

  // Show offline page if no network
  if (!isOnline) {
    return <OfflinePage />
  }

  // Show loading screen during initial load
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ErrorBoundary>
      <div className={`relative ${getAccessibilityClasses()}`}>
        {/* Install Banner */}
        <AnimatePresence>
          {showInstallBanner && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              className="fixed top-0 left-0 right-0 z-50 bg-primary-600 text-white p-4 shadow-lg"
            >
              <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span className="font-medium">
                    Instale o YISA para acesso rápido offline
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={installApp}
                    className="bg-white text-primary-600 px-4 py-2 rounded-md font-medium hover:bg-primary-50 transition-colors"
                  >
                    Instalar
                  </button>
                  <button
                    onClick={() => {
                      // Dismiss the banner
                      localStorage.setItem('yisa_install_dismissed', 'true')
                      window.location.reload()
                    }}
                    className="p-1 hover:bg-primary-700 rounded transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* App Routes */}
        <AppLayout>
          {/* Screen reader announcements */}
          <div
            className="sr-only aria-live-polite"
            aria-live="polite"
            aria-atomic="true"
            id="page-announcements"
          />
          <div
            className="sr-only aria-live-assertive"
            aria-live="assertive"
            aria-atomic="true"
            id="urgent-announcements"
          />

          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.SOBRE} element={<SobrePage />} />
            <Route path={ROUTES.VERIFICAR} element={<VerificarPage />} />

            {/* Protected Routes - Require Authentication */}
            {isAuthenticated ? (
              <>
                <Route path={ROUTES.EMITIR} element={<EmitirPage />} />
                <Route path={ROUTES.CARTEIRA} element={<CarteiraPage />} />
                <Route path="/partilhar/:documentId" element={<PartilharPage />} />
                <Route path={ROUTES.HISTORICO} element={<HistoricoPage />} />
                <Route path={ROUTES.DEFINICOES} element={<DefinicoesPage />} />
              </>
            ) : (
              // Redirect to home if not authenticated
              <>
                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
              </>
            )}

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </AppLayout>

        {/* Global Components */}
        {/* TODO: Add Toast Notifications */}
        {/* TODO: Add Modal Container */}
        {/* TODO: Add Loading Overlay */}
      </div>
    </ErrorBoundary>
  )
}

export default App