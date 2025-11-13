import React from 'react'
import { motion } from 'framer-motion'

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* YISA Logo */}
          <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <img
              src="/yisa-logo.png"
              alt="YISA Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            YISA - Gestão de Documentos Escolares
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Sistema seguro e offline para gestão de documentos de estudantes em Moçambique
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary-600 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">A carregar sistema...</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-4 max-w-xs mx-auto text-center"
        >
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-primary-600 text-2xl mb-1">🔒</div>
            <div className="text-xs text-gray-600">Seguro</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-primary-600 text-2xl mb-1">📱</div>
            <div className="text-xs text-gray-600">Offline</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-primary-600 text-2xl mb-1">⚡</div>
            <div className="text-xs text-gray-600">Rápido</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingScreen