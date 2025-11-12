import React from 'react'
import { motion } from 'framer-motion'

const EmitirPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Emitir Documento
        </h1>
        <p className="text-gray-600">
          Crie documentos escolares oficiais com validade digital
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Formulário de Emissão</h2>
          <p className="card-description">
            Preencha os dados do estudante para emitir o documento
          </p>
        </div>

        <div className="text-center py-12">
          <div className="spinner spinner-md mx-auto mb-4"></div>
          <p className="text-gray-600">Formulário de emissão em desenvolvimento...</p>
        </div>
      </div>
    </motion.div>
  )
}

export default EmitirPage