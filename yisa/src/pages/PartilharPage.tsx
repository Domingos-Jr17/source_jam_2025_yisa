import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ShareIcon,
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import ShareButton from '../components/ShareButton'
import WhatsAppShare from '../components/WhatsAppShare'
import type { DocumentoEscolar } from '../types'
import { DatabaseService } from '../services/database'

const PartilharPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>()
  const navigate = useNavigate()
  const [document, setDocument] = useState<DocumentoEscolar | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showWhatsAppDetail, setShowWhatsAppDetail] = useState(false)

  useEffect(() => {
    if (!documentId) {
      navigate('/carteira')
      return
    }

    loadDocument(documentId)
  }, [documentId, navigate])

  const loadDocument = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const db = DatabaseService.getInstance()
      const doc = await db.getDocument(id)

      if (!doc) {
        setError('Documento não encontrado')
        return
      }

      setDocument(doc)

    } catch (error) {
      console.error('Error loading document:', error)
      setError('Erro ao carregar documento')
    } finally {
      setLoading(false)
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

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getQRCodeData = () => {
    if (!document) return undefined

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar documento...</p>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-6">{error || 'Documento não encontrado'}</p>
          <button
            onClick={() => navigate('/carteira')}
            className="btn-primary"
          >
            Voltar para Carteira
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center">
                <ShareIcon className="w-6 h-6 text-primary-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">Partilhar Documento</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Preview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documento</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 bg-primary-50 border-b border-primary-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <DocumentDuplicateIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getDocumentTypeLabel(document.tipo)}
                    </h3>
                    <p className="text-sm text-gray-600">Nº {document.numeroDocumento}</p>
                  </div>
                  <div className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircleIcon className="w-3 h-3 inline mr-1" />
                    Válido
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Student Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Dados do Estudante</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nome Completo:</span>
                      <span className="font-medium text-gray-900">{document.estudante.nomeCompleto}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Número do BI:</span>
                      <span className="font-medium text-gray-900">{document.estudante.numeroBI}</span>
                    </div>
                  </div>
                </div>

                {/* School Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Informações Escolares</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Escola de Origem:</span>
                      <span className="font-medium text-gray-900">{document.escolaOrigem}</span>
                    </div>
                    {document.escolaDestino && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Escola Destino:</span>
                        <span className="font-medium text-gray-900">{document.escolaDestino}</span>
                      </div>
                    )}
                    {document.dadosEscolares?.classeAtual && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Classe:</span>
                        <span className="font-medium text-gray-900">
                          {document.dadosEscolares.classeAtual.classe}ª {document.dadosEscolares.classeAtual.turma}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Informações do Documento</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Data de Emissão:</span>
                      <span className="font-medium text-gray-900">{formatDate(document.dataEmissao)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        {document.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Features */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 text-sm">Verificação Disponível</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Este documento pode ser verificado por QR code ou link de verificação
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sharing Options */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Opções de Partilha</h2>

            {/* WhatsApp Detailed Share */}
            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <WhatsAppShare
                  document={document}
                  qrCodeData={getQRCodeData()}
                />
              </div>
            </div>

            {/* Other Sharing Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Outras Opções</h3>

              <div className="space-y-3">
                {/* Quick Share Button */}
                <ShareButton
                  document={document}
                  qrCodeData={getQRCodeData()}
                  size="lg"
                  variant="primary"
                  showText={true}
                  className="w-full"
                />

                {/* Verification Link */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Link de Verificação</h4>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-mono text-gray-600 break-all mb-2">
                      {window.location.origin}/verificar/{document.id}
                    </p>
                    <button
                      onClick={async () => {
                        const { SharingService } = await import('../services/sharing')
                        const sharingService = SharingService.getInstance()
                        const result = await sharingService.shareViaClipboard(document)
                        if (result.success) {
                          // Show success message
                        }
                      }}
                      className="btn-outline btn-sm"
                    >
                      Copiar Link
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">QR Code</h4>
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                      <DocumentDuplicateIcon className="w-16 h-16" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Escaneie para verificar a autenticidade
                  </p>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 text-sm">Segurança da Partilha</h4>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Documento protegido com encriptação AES-256</li>
                    <li>• Verificação por hash SHA-256</li>
                    <li>• Validação offline em tempo real</li>
                    <li>• Auditoria completa de partilhas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartilharPage