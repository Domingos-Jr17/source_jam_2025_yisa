import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import type { DocumentoEscolar } from '../types'

interface DocumentCardProps {
  document: DocumentoEscolar
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
  onDownload?: (id: string) => void
  onView?: (id: string) => void
  compact?: boolean
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onShare,
  onDownload,
  onView,
  compact = false
}) => {
  const [showActions, setShowActions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onDelete) return

    if (!confirm(`Tem certeza que deseja eliminar este documento?\n\n${document.estudante.nomeCompleto} - ${document.numeroDocumento}`)) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(document.id)
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onShare) {
      await onShare(document.id)
    }
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDownload) {
      await onDownload(document.id)
    }
  }

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onView) {
      onView(document.id)
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
        return <ShareIcon className="w-5 h-5" />
      case 'historico_escolar':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'certificado_conclusao':
        return <CheckCircleIcon className="w-5 h-5" />
      case 'declaracao_matricula':
        return <ClockIcon className="w-5 h-5" />
      case 'atestado_frequencia':
        return <CheckCircleIcon className="w-5 h-5" />
      default:
        return <DocumentTextIcon className="w-5 h-5" />
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
      year: 'numeric'
    })
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={handleView}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
              {getDocumentTypeIcon(document.tipo)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {document.estudante.nomeCompleto}
            </h4>
            <p className="text-xs text-gray-500 truncate">
              {getDocumentTypeLabel(document.tipo)}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
              {document.status.toUpperCase()}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowActions(!showActions)
              }}
              className="p-1 rounded hover:bg-gray-100"
            >
              <QrCodeIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Actions Dropdown */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
          >
            <div className="py-1">
              <button
                onClick={handleView}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                Ver Detalhes
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Baixar PDF
              </button>
              <button
                onClick={handleShare}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <ShareIcon className="w-4 h-4 mr-2" />
                Partilhar
              </button>
              <hr className="my-1" />
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                {isDeleting ? 'A eliminar...' : 'Eliminar'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-6" onClick={handleView}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
              {getDocumentTypeIcon(document.tipo)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getDocumentTypeLabel(document.tipo)}
              </h3>
              <p className="text-sm text-gray-500">
                Nº {document.numeroDocumento}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
            <div className="flex items-center">
              {getStatusIcon(document.status)}
              <span className="ml-1">{document.status.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h4 className="font-medium text-gray-900">{document.estudante.nomeCompleto}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">BI:</span> {document.estudante.numeroBI}
            </div>
            <div>
              <span className="font-medium">Escola:</span> {document.escolaOrigem}
            </div>
            {document.escolaDestino && (
              <div>
                <span className="font-medium">Destino:</span> {document.escolaDestino}
              </div>
            )}
            {document.dadosEscolares?.classeAtual && (
              <div>
                <span className="font-medium">Classe:</span> {document.dadosEscolares.classeAtual.classe}ª {document.dadosEscolares.classeAtual.turma}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              Emitido em {formatDate(document.dataEmissao)}
            </div>
            {isExpired() && (
              <div className="flex items-center mt-1 text-red-600">
                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                Documento expirou
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {document.qrCodeData && (
              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <QrCodeIcon className="w-3 h-3 mr-1" />
                QR Code
              </div>
            )}
            {document.pdfBase64 && (
              <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <DocumentTextIcon className="w-3 h-3 mr-1" />
                PDF
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleView}
              className="btn-ghost btn-sm text-gray-700"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              Ver
            </button>
            {document.pdfBase64 && (
              <button
                onClick={handleDownload}
                className="btn-ghost btn-sm text-gray-700"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                Baixar
              </button>
            )}
            <button
              onClick={handleShare}
              className="btn-ghost btn-sm text-gray-700"
            >
              <ShareIcon className="w-4 h-4 mr-1" />
              Partilhar
            </button>
          </div>
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-ghost btn-sm text-red-600 disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default DocumentCard