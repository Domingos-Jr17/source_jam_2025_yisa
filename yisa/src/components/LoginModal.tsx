import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [pin, setPin] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [confirmPin, setConfirmPin] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, verifyPin } = useAuthStore()

  // Clear form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin('')
      setConfirmPin('')
      setFullName('')
      setError('')
      setIsNewUser(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isNewUser) {
        // Register new user
        if (pin.length !== 6) {
          setError('PIN deve ter 6 dígitos')
          setIsLoading(false)
          return
        }

        if (pin !== confirmPin) {
          setError('PINs não coincidem')
          setIsLoading(false)
          return
        }

        if (!fullName.trim()) {
          setError('Nome é obrigatório')
          setIsLoading(false)
          return
        }

        // For new users, we use the same login method
        // The system will handle first-time setup automatically
        const success = await login({ pin })
        if (success) {
          setError('')
          onLoginSuccess?.()
          onClose()
        } else {
          setError('Falha ao criar sessão. Tente novamente.')
        }
        
      } else {
        // Login existing user
        if (pin.length !== 6) {
          setError('PIN deve ter 6 dígitos')
          setIsLoading(false)
          return
        }

        const success = await login({ pin })
        if (success) {
          setError('')
          onLoginSuccess?.()
          onClose()
        } else {
          setError('PIN incorreto')
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6)
    setPin(numericValue)
  }

  const handleConfirmPinChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6)
    setConfirmPin(numericValue)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 m-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Fechar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <LockClosedIcon className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              {isNewUser ? 'Criar Conta' : 'Bem-vindo de Volta'}
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {isNewUser 
                ? 'Crie sua conta para acessar o sistema YISA'
                : 'Digite seu PIN de 6 dígitos para acessar sua conta'
              }
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isNewUser && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                  PIN de 6 Dígitos
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="pin"
                    value={pin}
                    onChange={(e) => handlePinChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-center text-2xl letter-spacing-2"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {isNewUser && (
                <div>
                  <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar PIN
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPin"
                      value={confirmPin}
                      onChange={(e) => handleConfirmPinChange(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-center text-2xl letter-spacing-2"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Success message for registration */}
              {isNewUser && !error && fullName && pin && pin === confirmPin && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  Conta criada com sucesso! Você será redirecionado...
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || (isNewUser && (!fullName || !pin || pin !== confirmPin))}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isNewUser ? 'Criando conta...' : 'Acessando...'}
                  </span>
                ) : (
                  <span>{isNewUser ? 'Criar Conta' : 'Acessar Conta'}</span>
                )}
              </button>
            </form>

            {/* Toggle between login/register */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isNewUser ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsNewUser(!isNewUser)
                    setError('')
                    setPin('')
                    setConfirmPin('')
                    setFullName('')
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  {isNewUser ? 'Faça login' : 'Crie uma conta'}
                </button>
              </p>
            </div>

            {/* Info message */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              Seu PIN é pessoal e intransferível. Guarde-o em local seguro.
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default LoginModal