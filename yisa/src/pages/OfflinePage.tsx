import React from 'react'
import { motion } from 'framer-motion'
import { WifiOffIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <WifiOffIcon className="w-10 h-10 text-yellow-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Modo Offline
        </h1>

        <p className="text-gray-600 mb-6">
          Você está atualmente offline. Algumas funcionalidades podem estar limitadas,
          mas você ainda pode acessar documentos guardados e emitir novos documentos.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Tentar Novamente</span>
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Continuar Offline
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-green-600 font-semibold">✓</div>
              <div className="text-xs text-gray-600">Documentos Guardados</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-blue-600 font-semibold">📝</div>
              <div className="text-xs text-gray-600">Emissão Online</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OfflinePage