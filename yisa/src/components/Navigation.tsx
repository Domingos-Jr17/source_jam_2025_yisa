import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  DocumentTextIcon,
  QrCodeIcon,
  WalletIcon,
  ClockIcon,
  CogIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../hooks/useAuth'
import { useAccessibility } from '../hooks/useAccessibility'
import { ROUTES } from '../utils/constants'

interface NavigationProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  {
    name: 'Início',
    href: ROUTES.HOME,
    icon: HomeIcon,
    description: 'Página principal'
  },
  {
    name: 'Emitir Documento',
    href: ROUTES.EMITIR,
    icon: DocumentTextIcon,
    description: 'Criar novo documento',
    requiresAuth: true
  },
  {
    name: 'Verificar Documento',
    href: ROUTES.VERIFICAR,
    icon: QrCodeIcon,
    description: 'Escanear QR code'
  },
  {
    name: 'Minha Carteira',
    href: ROUTES.CARTEIRA,
    icon: WalletIcon,
    description: 'Documentos guardados',
    requiresAuth: true
  },
  {
    name: 'Histórico',
    href: ROUTES.HISTORICO,
    icon: ClockIcon,
    description: 'Documentos emitidos',
    requiresAuth: true
  },
  {
    name: 'Definições',
    href: ROUTES.DEFINICOES,
    icon: CogIcon,
    description: 'Configurações',
    requiresAuth: true
  },
  {
    name: 'Sobre',
    href: ROUTES.SOBRE,
    icon: InformationCircleIcon,
    description: 'Informações'
  }
]

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth()
  const { announce, isNavigatingWithKeyboard } = useAccessibility()
  const navigationRef = useRef<HTMLElement>(null)

  const filteredNavItems = navigationItems.filter(item =>
    !item.requiresAuth || isAuthenticated
  )

  // Handle keyboard navigation within sidebar
  useEffect(() => {
    if (!isOpen || !isNavigatingWithKeyboard) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        announce('Navigation menu closed', 'polite')
        return
      }

      // Arrow key navigation
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const navItems = navigationRef.current?.querySelectorAll('a') || []
        const currentIndex = Array.from(navItems).findIndex(item => item === document.activeElement)

        let nextIndex = currentIndex
        if (event.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % navItems.length
        } else {
          nextIndex = currentIndex <= 0 ? navItems.length - 1 : currentIndex - 1
        }

        const nextItem = navItems[nextIndex] as HTMLElement
        if (nextItem) {
          nextItem.focus()
          const itemName = nextItem.textContent?.trim()
          if (itemName) {
            announce(`Focused on ${itemName}`, 'polite')
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isNavigatingWithKeyboard, onClose, announce])

  // Handle navigation announcements
  const handleNavigationClick = (itemName: string) => {
    announce(`Navigating to ${itemName}`, 'polite')
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={navigationRef}
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        exit={{ x: -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200
          lg:translate-x-0 lg:static lg:inset-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
        `}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <div className="flex items-center">
              <div className="w-32 h-12 flex items-center justify-center mr-3">
                <img
                  src="/yisa-.ico"
                  alt="Logo YISA"
                  className="w-full h-full object-contain"
                />
              </div>
          
            </div>
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 px-3 py-6 space-y-1 overflow-y-auto"
            role="menu"
            aria-label="Navigation menu"
          >
            {filteredNavItems.map((item, index) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    handleNavigationClick(item.name)
                    if (window.innerWidth < 1024) {
                      onClose()
                    }
                  }}
                  className={({ isActive }) => `
                    group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  aria-label={`${item.name} - ${item.description}`}
                  role="menuitem"
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                  data-index={index}
                >
                  <Icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${({ isActive }: { isActive: boolean }) => isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    )}
                  </div>
                  {/* Screen reader only status indicator */}
                  {location.pathname === item.href && (
                    <span className="sr-only">Current page</span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div className="flex items-center justify-between mb-2">
                <span>Versão 1.0.0</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-center">
                <p>&copy; 2025 YISA Team</p>
                <p className="mt-1">Moçambique 🇲🇿</p>
              </div>

            
            </div>

            {/* Quick stats (if authenticated) */}
            {isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-primary-50 rounded-lg p-2">
                    <div className="text-lg font-semibold text-primary-600">0</div>
                    <div className="text-xs text-gray-600">Documentos</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-lg font-semibold text-green-600">✓</div>
                    <div className="text-xs text-gray-600">Seguro</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Navigation