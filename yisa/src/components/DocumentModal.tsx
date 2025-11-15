import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  QrCodeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import type { DocumentoEscolar } from '../types'
import ShareButton from './ShareButton'

interface DocumentModalProps {
  document: DocumentoEscolar | null
  isOpen: boolean
  onClose: () => void
  onDownload?: (id: string) => void
  onDelete?: (id: string) => void
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  document,
  isOpen,
  onClose,
  onDownload,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!document) return null

  const handleDelete = async () => {
    if (!onDelete) return

    if (!confirm(`Tem certeza que deseja eliminar este documento?\n\n${document.estudante.nomeCompleto} - ${document.numeroDocumento}`)) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(document.id)
      onClose()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async () => {
    if (onDownload) {
      await onDownload(document.id)
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      declaracao_transferencia: 'Declaração de Transferência',
      historico_escolar: 'Histórico Escolar',
      certificado_conclusao: 'Certificado de Conclusão',
      declaracao_matricula: 'Declaração de Matrícula',
      atestado_frequencia: 'Atestado de Frequência'
    }
    return labels[type] || type
  }

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'declaracao_transferencia':
        return <ShareIcon className="w-6 h-6" />
      case 'historico_escolar':
        return <DocumentTextIcon className="w-6 h-6" />
      case 'certificado_conclusao':
        return <CheckCircleIcon className="w-6 h-6" />
      case 'declaracao_matricula':
        return <ClockIcon className="w-6 h-6" />
      case 'atestado_frequencia':
        return <CheckCircleIcon className="w-6 h-6" />
      default:
        return <DocumentTextIcon className="w-6 h-6" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emitido':
        return 'text-green-600 bg-green-100'
      case 'validado':
        return 'text-blue-600 bg-blue-100'
      case 'revogado':
        return 'text-red-600 bg-red-100'
      case 'expirado':
        return 'text-gray-600 bg-gray-100'
      case 'rascunho':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'emitido':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'validado':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'revogado':
        return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'expirado':
        return <ClockIcon className="w-4 h-4" />
      default:
        return <DocumentTextIcon className="w-4 h-4" />
    }
  }

  const getDaysSinceEmission = () => {
    const now = new Date()
    const emissionDate = new Date(document.dataEmissao)
    const daysDiff = Math.floor((now.getTime() - emissionDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff
  }

  const isExpired = () => {
    return getDaysSinceEmission() > 30
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Generate QR code data for sharing
  const getQRCodeData = () => {
    if (document.qrCodeData) {
      try {
        // Try to parse as JSON first
        return JSON.parse(document.qrCodeData)
      } catch {
        // If it's not valid JSON, return as string
        return document.qrCodeData
      }
    }

    // Generate QR code data if not present
    return {
      documentoId: document.id,
      tipoDocumento: document.tipo,
      numeroDocumento: document.numeroDocumento,
      nomeEstudante: document.estudante.nomeCompleto,
      escolaOrigem: document.escolaOrigem,
      dataEmissao: document.dataEmissao,
      hashValidacao: document.hashValidacao
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      {getDocumentTypeIcon(document.tipo)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {getDocumentTypeLabel(document.tipo)}
                      </h2>
                      <p className="text-primary-100">
                        Nº {document.numeroDocumento}
                      </p>
                      <div className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)} text-white`}>
                        {getStatusIcon(document.status)}
                        <span className="ml-1">{document.status.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Student Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Dados do Estudante
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                      <p className="text-gray-900 font-medium">{document.estudante.nomeCompleto}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Número do BI</label>
                      <p className="text-gray-900 font-medium">{document.estudante.numeroBI}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Naturalidade</label>
                      <p className="text-gray-900">{document.estudante.naturalidade || 'Moçambique'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                      <p className="text-gray-900">{formatDate(document.estudante.dataNascimento)}</p>
                    </div>
                  </div>
                </div>

                {/* School Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Informação Escolar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Escola de Origem</label>
                      <p className="text-gray-900 font-medium">{document.escolaOrigem}</p>
                    </div>
                    {document.escolaDestino && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Escola de Destino</label>
                        <p className="text-gray-900 font-medium">{document.escolaDestino}</p>
                      </div>
                    )}
                    {document.dadosEscolares?.classeAtual && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Classe</label>
                          <p className="text-gray-900">
                            {document.dadosEscolares.classeAtual.classe}ª {document.dadosEscolares.classeAtual.turma}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Regime</label>
                          <p className="text-gray-900 capitalize">{document.dadosEscolares.classeAtual.regime}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Document Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Informações do Documento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Data de Emissão</label>
                      <p className="text-gray-900">{formatDate(document.dataEmissao)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Validade</label>
                      <p className={`font-medium ${isExpired() ? 'text-red-600' : 'text-green-600'}`}>
                        {isExpired() ? 'Expirado' : `Válido por ${30 - getDaysSinceEmission()} dias`}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Hash de Validação</label>
                      <p className="text-gray-900 font-mono text-xs break-all">{document.hashValidacao}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID do Documento</label>
                      <p className="text-gray-900 font-mono text-xs">{document.id}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                {document.qrCodeData && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <QrCodeIcon className="w-5 h-5 mr-2 text-primary-600" />
                      QR Code de Verificação
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="inline-flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
                        <QrCodeIcon className="w-12 h-12 text-primary-600" />
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Este documento contém um QR Code para verificação online
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {document.pdfBase64 && (
                      <button
                        onClick={handleDownload}
                        className="btn-primary"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        Baixar PDF
                      </button>
                    )}
                    <ShareButton
                      document={document}
                      qrCodeData={getQRCodeData()}
                      variant="secondary"
                      showText={true}
                    />
                  </div>
                  <div className="flex gap-2">
                    {onDelete && (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="btn-danger"
                      >
                        {isDeleting ? (
                          <>
                            <div className="spinner spinner-sm mr-2" />
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                            Eliminar
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="btn-secondary"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default DocumentModal