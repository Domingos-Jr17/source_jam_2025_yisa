import React from 'react'
import { motion } from 'framer-motion'

const HistoricoPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Histórico
        </h1>
        <p className="text-gray-600">
          Visualize todas as operações realizadas no sistema
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Registo de Atividades</h2>
          <p className="card-description">
            Histórico completo de emissões e verificações
          </p>
        </div>

        <div className="text-center py-12">
          <div className="spinner spinner-md mx-auto mb-4"></div>
          <p className="text-gray-600">Histórico em desenvolvimento...</p>
        </div>
      </div>
    </motion.div>
  )
}

export default HistoricoPage