import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  LinkIcon,
  EnvelopeIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import type { DocumentoEscolar, QRCodeData } from '../types'
import { SharingService, type ShareResult } from '../services/sharing'
import WhatsAppShare from './WhatsAppShare'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  documentData: DocumentoEscolar
  qrCodeData?: QRCodeData
}

interface ShareMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  action: () => Promise<void>
  available: boolean
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  documentData,
  qrCodeData
}) => {
  const [isSharing, setIsSharing] = useState(false)
  const [shareResult, setShareResult] = useState<{
    success: boolean
    message: string
    method?: string
  } | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const handleShareResult = (result: ShareResult) => {
    setShareResult({
      success: result.success,
      message: result.message || result.error || 'Operação concluída',
      method: result.method
    })
  }
  const [copiedText, setCopiedText] = useState(false)
  const [showWhatsAppDetail, setShowWhatsAppDetail] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const sharingService = SharingService.getInstance()

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    // Reset state when modal opens/closes
    if (isOpen) {
      setShareResult(null)
      setSelectedMethod(null)
      setCopiedText(false)
    }
  }, [isOpen])

  const handleShare = async (methodId: string) => {
    setSelectedMethod(methodId)

    // Show WhatsApp detailed view
    if (methodId === 'whatsapp') {
      setShowWhatsAppDetail(true)
      return
    }

    setIsSharing(true)
    setShareResult(null)

    try {
      let result

      switch (methodId) {
        case 'web_share':
          result = await sharingService.shareViaWebShare(documentData, qrCodeData)
          break

        case 'clipboard':
          result = await sharingService.shareViaClipboard(documentData)
          if (result.success) {
            setCopiedText(true)
            setTimeout(() => setCopiedText(false), 3000)
          }
          break

        case 'email':
          result = await sharingService.shareViaEmail(documentData, qrCodeData)
          break

        default:
          throw new Error('Método de partilha inválido')
      }

      handleShareResult(result)

    } catch (error) {
      console.error('Share error:', error)
      setShareResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao partilhar documento'
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleSmartShare = async () => {
    setSelectedMethod('smart')
    setIsSharing(true)
    setShareResult(null)

    try {
      const result = await sharingService.smartShare(documentData, qrCodeData)
      handleShareResult(result)

      if (result.success) {
        setTimeout(() => onClose(), 2000)
      }

    } catch (error) {
      console.error('Smart share error:', error)
      setShareResult({
        success: false,
        message: 'Erro ao partilhar documento'
      })
    } finally {
      setIsSharing(false)
    }
  }

  const shareMethods: ShareMethod[] = [
    {
      id: 'smart',
      name: 'Partilha Rápida',
      icon: <ShareIcon className="w-6 h-6" />,
      description: 'Escolhe o melhor método automaticamente',
      action: handleSmartShare,
      available: true
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      description: 'Partilhar diretamente no WhatsApp',
      action: () => handleShare('whatsapp'),
      available: true
    },
    {
      id: 'web_share',
      name: 'Partilha Nativa',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      description: 'Usar sistema de partilha do dispositivo',
      action: () => handleShare('web_share'),
      available: !!navigator.share
    },
    {
      id: 'clipboard',
      name: 'Copiar Link',
      icon: <LinkIcon className="w-6 h-6" />,
      description: 'Copiar para área de transferência',
      action: () => handleShare('clipboard'),
      available: !!navigator.clipboard
    },
    {
      id: 'email',
      name: 'Email',
      icon: <EnvelopeIcon className="w-6 h-6" />,
      description: 'Partilhar via email',
      action: () => handleShare('email'),
      available: true
    }
  ]

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

  const generateQRCode = () => {
    return sharingService.generateShareQRCode(documentData)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShareIcon className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Partilhar Documento</h2>
                    <p className="text-sm text-gray-500">Escolha como pretende partilhar</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Document Preview */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <DocumentDuplicateIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {getDocumentTypeLabel(documentData.tipo)}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {documentData.estudante.nomeCompleto} • {documentData.numeroDocumento}
                  </p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Válido
                </div>
              </div>
            </div>

            {/* Share Methods */}
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {showWhatsAppDetail ? (
                <WhatsAppShare
                  document={documentData}
                  qrCodeData={qrCodeData}
                  onClose={() => {
                    setShowWhatsAppDetail(false)
                    setSelectedMethod(null)
                  }}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3">
                    {shareMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        onClick={method.action}
                        disabled={!method.available || isSharing}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          !method.available
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            : selectedMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              selectedMethod === method.id
                                ? 'bg-primary-100 text-primary-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {method.icon}
                            </div>
                            <div className="text-left">
                              <h4 className="font-medium text-gray-900">{method.name}</h4>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                          </div>

                          {/* Loading indicator */}
                          {selectedMethod === method.id && isSharing && (
                            <div className="spinner spinner-sm" />
                          )}

                          {/* Success indicator */}
                          {selectedMethod === method.id && !isSharing && shareResult?.success && (
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          )}

                          {/* Error indicator */}
                          {selectedMethod === method.id && !isSharing && !shareResult?.success && (
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-3">
                      <QrCodeIcon className="w-5 h-5 text-primary-600 mr-2" />
                      <h4 className="font-medium text-gray-900">QR Code de Partilha</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Escaneie este QR code para aceder ao documento
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 inline-block">
                      <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        <QrCodeIcon className="w-16 h-16" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 break-all font-mono">
                      {generateQRCode()}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Result Messages */}
            <AnimatePresence>
              {shareResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`px-6 py-4 border-t ${
                    shareResult.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center">
                    {shareResult.success ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <p className={`text-sm ${
                      shareResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {shareResult.message}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Copied indicator */}
            <AnimatePresence>
              {copiedText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Link copiado!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Notice */}
            <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
              <div className="flex items-start">
                <div className="w-4 h-4 text-blue-600 mr-2 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-blue-700">
                  A partilha é segura e encriptada. O destinatário pode verificar a autenticidade do documento.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ShareModal