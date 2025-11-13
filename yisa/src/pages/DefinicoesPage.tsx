import React from 'react'
import { motion } from 'framer-motion'

const DefinicoesPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Definições
        </h1>
        <p className="text-gray-600">
          Configure suas preferências e opções de segurança
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Configurações da Aplicação</h2>
          <p className="card-description">
            Personalize sua experiência e ajuste as configurações de segurança
          </p>
        </div>

        <div className="text-center py-12">
          <div className="spinner spinner-md mx-auto mb-4"></div>
          <p className="text-gray-600">Página de definições em desenvolvimento...</p>
        </div>
      </div>
    </motion.div>
  )
}

export default DefinicoesPage