import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  WifiOffIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { useServiceWorker } from '../hooks/useServiceWorker'
import { useDocumentWallet } from '../hooks/useDocumentWallet'
import { useNavigate } from 'react-router-dom'

const OfflinePage: React.FC = () => {
  const [isRetrying, setIsRetrying] = useState(false)
  const [offlineCapabilities, setOfflineCapabilities] = useState({
    hasDocuments: false,
    canEmit: false,
    canVerify: false,
    hasCache: false,
    cachedResources: 0
  })
  const navigate = useNavigate()

  const { status: swStatus, actions: swActions } = useServiceWorker()
  const { documents } = useDocumentWallet()

  useEffect(() => {
    // Check offline capabilities
    const checkCapabilities = async () => {
      try {
        const cacheInfo = await swActions.getCacheInfo()
        const hasCache = cacheInfo && cacheInfo.length > 0
        const cachedResources = cacheInfo?.reduce((total, cache) => total + cache.size, 0) || 0
        const hasDocuments = documents.length > 0

        setOfflineCapabilities({
          hasDocuments,
          canEmit: true, // Can emit but will sync later
          canVerify: true, // QR verification works offline
          hasCache,
          cachedResources
        })
      } catch (error) {
        console.error('Error checking offline capabilities:', error)
      }
    }

    checkCapabilities()
  }, [documents, swActions])

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      // Wait a moment to check connection
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (navigator.onLine) {
        // Try to go to home page when back online
        navigate('/')
      } else {
        setIsRetrying(false)
      }
    } catch (error) {
      console.error('Retry failed:', error)
      setIsRetrying(false)
    }
  }

  const handleClearCache = async () => {
    try {
      await swActions.clearCache()
      setOfflineCapabilities(prev => ({ ...prev, hasCache: false, cachedResources: 0 }))
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Offline Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <WifiOffIcon className="w-12 h-12 text-yellow-600" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Modo Offline
            </h1>

            <p className="text-lg text-gray-600 mb-8 text-center">
              Sem conexão à internet, mas o YISA continua funcional para operações essenciais.
            </p>

            {/* Offline Capabilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-green-50 rounded-xl p-4 border border-green-200"
              >
                <div className="flex items-center mb-3">
                  <DocumentTextIcon className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">Documentos Offline</h3>
                </div>
                <p className="text-sm text-green-700 mb-2">
                  {offlineCapabilities.hasDocuments
                    ? `${documents.length} documentos disponíveis`
                    : 'Nenhum documento armazenado localmente'}
                </p>
                {offlineCapabilities.hasDocuments && (
                  <button
                    onClick={() => navigate('/carteira')}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Acessar Minha Carteira →
                  </button>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 rounded-xl p-4 border border-blue-200"
              >
                <div className="flex items-center mb-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">Verificação QR</h3>
                </div>
                <p className="text-sm text-blue-700 mb-2">
                  Verificação de documentos funciona completamente offline
                </p>
                <button
                  onClick={() => navigate('/verificar')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Verificar Documento →
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-yellow-50 rounded-xl p-4 border border-yellow-200"
              >
                <div className="flex items-center mb-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-yellow-900">Emissão Limitada</h3>
                </div>
                <p className="text-sm text-yellow-700">
                  Novos documentos serão sincronizados quando voltar online
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-purple-50 rounded-xl p-4 border border-purple-200"
              >
                <div className="flex items-center mb-3">
                  <CogIcon className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-purple-900">Cache do App</h3>
                </div>
                <p className="text-sm text-purple-700 mb-2">
                  {offlineCapabilities.hasCache
                    ? `${offlineCapabilities.cachedResources} recursos em cache`
                    : 'Sem recursos em cache'}
                </p>
                {offlineCapabilities.hasCache && (
                  <button
                    onClick={handleClearCache}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Limpar Cache
                  </button>
                )}
              </motion.div>
            </div>

            {/* Service Worker Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-3">Estado do Aplicativo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Service Worker:</span>
                  <span className={`font-medium ${
                    swStatus.enabled ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {swStatus.enabled ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Instalado:</span>
                  <span className={`font-medium ${
                    swStatus.controlling ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {swStatus.controlling ? 'Sim' : 'Não'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Atualização:</span>
                  <span className={`font-medium ${
                    swStatus.updateAvailable ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {swStatus.updateAvailable ? 'Pendente' : 'Atualizado'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isRetrying ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    <span>A Verificar Conexão...</span>
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-5 h-5" />
                    <span>Tentar Conexão Novamente</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/carteira')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Minha Carteira
                </button>

                <button
                  onClick={() => navigate('/verificar')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  Verificar
                </button>
              </div>
            </motion.div>

            {/* Help Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Dicas Offline
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Continue a aceder aos documentos já descarregados</li>
                <li>• Verifique documentos usando QR codes (funciona offline)</li>
                <li>• Novos documentos serão sincronizados automaticamente</li>
                <li>• Instale o YISA como aplicativo para melhor experiência offline</li>
              </ul>
            </motion.div>
          </div>

          {/* Retry Status */}
          <AnimatePresence>
            {isRetrying && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center text-sm text-gray-600"
              >
                A verificar estado da conexão...
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default OfflinePage