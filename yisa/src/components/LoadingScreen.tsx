import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface LoadingScreenProps {
  /** Optional custom message for loading state */
  message?: string;
  /** Optional aria-label for screen readers */
  ariaLabel?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "A carregar sistema...",
  ariaLabel = "Tela de carregamento da plataforma YISA"
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center"
      role="main"
      aria-label={ariaLabel}
    >
      <div className="text-center">
        <motion.div
          initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
          animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
          transition={shouldReduceMotion ? {} : { duration: 0.5 }}
          className="mb-8"
        >
          {/* YISA Logo */}
          <div className="w-40 h-12 mx-auto mb-6 flex items-center justify-center ">
            <img
              src="/yisa-.ico"
              alt="Logo YISA - Plataforma de Documentos Escolares"
              className="w-full h-full object-contain"
              aria-describedby="yisa-description"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            PLATAFORMA DE DOCUMENTOS ESCOLARES DIGITAIS
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Sistema seguro e offline para gestão de documentos de estudantes em Moçambique
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
          animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}
          transition={shouldReduceMotion ? {} : { delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary-600 rounded-full"
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={shouldReduceMotion ? {} : {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <p
            className="text-sm text-gray-500"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={shouldReduceMotion ? {} : { y: 30, opacity: 0 }}
          animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}
          transition={shouldReduceMotion ? {} : { delay: 0.6, duration: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-4 max-w-xs mx-auto text-center"
        >
          <div className="bg-white rounded-lg p-3 shadow-sm" role="img" aria-label="Seguro: sistema protegido com criptografia">
            <div className="text-primary-600 text-2xl mb-1" aria-hidden="true">🔒</div>
            <div className="text-xs text-gray-600">Seguro</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm" role="img" aria-label="Offline: funciona sem conexão à internet">
            <div className="text-primary-600 text-2xl mb-1" aria-hidden="true">📱</div>
            <div className="text-xs text-gray-600">Offline</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm" role="img" aria-label="Rápido: processamento veloz e eficiente">
            <div className="text-primary-600 text-2xl mb-1" aria-hidden="true">⚡</div>
            <div className="text-xs text-gray-600">Rápido</div>
          </div>
          
        </motion.div>

         <p
            id="yisa-description"
            className="text-primary-700 text-lg font-semibold max-w-md mx-auto py-6 leading-relaxed"
          >
           YISA - Fazer Chegar, Carregar, Trazer (Ronga/Changana)
          </p>

      </div>
    </div>
  )
}

export default React.memo(LoadingScreen)