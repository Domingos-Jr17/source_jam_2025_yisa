import React, { useState } from 'react'
import { Bars3Icon, XMarkIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../hooks/useAuth'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

interface HeaderProps {
  onMenuToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { isAuthenticated, user } = useAuth()
  const { isOnline } = useNetworkStatus()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
              onClick={onMenuToggle}
              aria-label="Abrir menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center ml-2 lg:ml-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
                YISA
              </h1>
            </div>
          </div>

          {/* Right side - Status and User */}
          <div className="flex items-center space-x-4">
            {/* Network Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600 hidden sm:block">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Notifications (if authenticated) */}
            {isAuthenticated && (
              <button
                type="button"
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Notificações"
              >
                <BellIcon className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
              </button>
            )}

            {/* User Menu (if authenticated) */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="Menu do utilizador"
                >
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Utilizador</p>
                      <p className="text-xs text-gray-500">Dispositivo: {user?.deviceId?.slice(0, 8)}...</p>
                    </div>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        // TODO: Navigate to settings
                        setShowUserMenu(false)
                      }}
                    >
                      Definições
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        // TODO: Handle logout
                        setShowUserMenu(false)
                      }}
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login button (if not authenticated) */
              <button
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  // TODO: Navigate to login
                  console.log('Navigate to login')
                }}
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar (optional) */}
      <div className="border-t border-gray-200 lg:hidden">
        <div className="px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Procurar documentos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={!isAuthenticated}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header