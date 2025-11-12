import React from 'react'
import { motion } from 'framer-motion'

const CarteiraPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Minha Carteira
        </h1>
        <p className="text-gray-600">
          Acesse todos os seus documentos guardados offline
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Documentos Guardados</h2>
          <p className="card-description">
            Seus documentos estão seguros e acessíveis offline
          </p>
        </div>

        <div className="text-center py-12">
          <div className="spinner spinner-md mx-auto mb-4"></div>
          <p className="text-gray-600">Carteira digital em desenvolvimento...</p>
        </div>
      </div>
    </motion.div>
  )
}

export default CarteiraPage