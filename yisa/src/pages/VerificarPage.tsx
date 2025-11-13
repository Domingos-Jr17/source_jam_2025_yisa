import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import QRScanner from '../components/QRScanner'
import type { QRCodeData } from '../types'

const VerificarPage: React.FC = () => {
  const [recentScans, setRecentScans] = useState<QRCodeData[]>([])
  const [showScanner, setShowScanner] = useState(true)

  const handleScanComplete = (data: QRCodeData) => {
    // Add to recent scans (keep last 5)
    setRecentScans(prev => [data, ...prev.slice(0, 4)])
    setShowScanner(false)
  }

  const handleNewScan = () => {
    setShowScanner(true)
  }

  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Verificar Documento
        </h1>
        <p className="text-gray-600">
          Escaneie o QR code para verificar a autenticidade e validade do documento escolar
        </p>
      </div>

      <AnimatePresence mode="wait">
        {showScanner ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <QRScanner
              onScanComplete={handleScanComplete}
              onError={(error) => console.error('Scanner error:', error)}
              showResults={true}
            />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Verification Success Message */}
            <div className="mb-6">
              <div className="card border-green-200 bg-green-50">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Verificação Concluída</h3>
                    <p className="text-sm text-green-700 mt-1">
                      O documento foi verificado com sucesso e é autêntico.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 flex gap-4">
              <button
                onClick={handleNewScan}
                className="btn-primary"
              >
                Escanear Novo Documento
              </button>
            </div>

            {/* Recent Scans */}
            {recentScans.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <h3 className="card-title">Verificações Recentes</h3>
                    <span className="badge badge-gray">{recentScans.length} documentos</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentScans.map((scan, index) => (
                    <div
                      key={`${scan.documentoId}-${index}`}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <ShieldCheckIcon className="w-4 h-4 text-green-500 mr-2" />
                            <h4 className="font-medium text-gray-900">
                              {formatDocumentType(String(scan.tipoDocumento))}
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Número:</span>
                              <p className="font-medium">{scan.numeroDocumento}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Escola:</span>
                              <p className="font-medium truncate">{scan.escolaOrigem}</p>
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-gray-500">
                                {new Date(scan.dataEmissao).toLocaleDateString('pt-MZ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Information */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Como Funciona a Verificação</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Cada documento tem um QR code único com dados criptografados</li>
                    <li>• O sistema verifica a integridade do documento através de hash SHA-256</li>
                    <li>• A validação é feita offline em tempo real</li>
                    <li>• Documentos expiram após 30 dias da emissão</li>
                    <li>• Todas as verificações ficam registadas para auditoria</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default VerificarPage