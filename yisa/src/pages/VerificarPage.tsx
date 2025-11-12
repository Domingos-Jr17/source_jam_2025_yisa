import React from 'react'
import { motion } from 'framer-motion'

const VerificarPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Verificar Documento
        </h1>
        <p className="text-gray-600">
          Escaneie o QR code para verificar a autenticidade do documento
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Scanner de QR Code</h2>
          <p className="card-description">
            Posicione o QR code do documento dentro da área de扫描
          </p>
        </div>

        <div className="text-center py-12">
          <div className="spinner spinner-md mx-auto mb-4"></div>
          <p className="text-gray-600">Scanner de QR code em desenvolvimento...</p>
        </div>
      </div>
    </motion.div>
  )
}

export default VerificarPage