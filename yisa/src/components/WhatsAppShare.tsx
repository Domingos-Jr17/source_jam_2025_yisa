import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import type { DocumentoEscolar, QRCodeData } from '../types'
import { SharingService, type ShareResult } from '../services/sharing'

interface WhatsAppShareProps {
  document: DocumentoEscolar
  qrCodeData?: QRCodeData
  onClose?: () => void
  compact?: boolean
}

interface ContactTemplate {
  id: string
  name: string
  phone: string
  type: 'parent' | 'school' | 'ministry' | 'other'
  icon: React.ReactNode
  description: string
}

const WhatsAppShare: React.FC<WhatsAppShareProps> = ({
  document,
  qrCodeData,
  onClose,
  compact = false
}) => {
  const [selectedContact, setSelectedContact] = useState<string>('')
  const [customMessage, setCustomMessage] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [shareResult, setShareResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleShareResult = (result: ShareResult) => {
    setShareResult({
      success: result.success,
      message: result.message || result.error || 'Operação concluída'
    })
  }

  const sharingService = SharingService.getInstance()

  // Common contact templates for quick sharing
  const contactTemplates: ContactTemplate[] = [
    {
      id: 'parent',
      name: 'Pais/Encarregados',
      phone: '',
      type: 'parent',
      icon: <UserGroupIcon className="w-5 h-5" />,
      description: 'Partilhar com os pais ou encarregados de educação'
    },
    {
      id: 'school',
      name: 'Escola Destino',
      phone: '',
      type: 'school',
      icon: <BuildingOfficeIcon className="w-5 h-5" />,
      description: 'Partilhar com a escola de destino'
    },
    {
      id: 'ministry',
      name: 'Ministério da Educação',
      phone: '',
      type: 'ministry',
      icon: <BuildingOfficeIcon className="w-5 h-5" />,
      description: 'Partilhar com autoridades educativas'
    },
    {
      id: 'custom',
      name: 'Contacto Personalizado',
      phone: '',
      type: 'other',
      icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
      description: 'Inserir número personalizado'
    }
  ]

  const generateDefaultMessage = () => {
    const documentType = getDocumentTypeLabel(document.tipo)
    const studentName = document.estudante.nomeCompleto
    const documentNumber = document.numeroDocumento
    const school = document.escolaOrigem
    const verificationUrl = `${window.location.origin}/verificar/${document.id}`

    let message = `📋 *Documento Escolar YISA*\n\n`
    message += `📝 *Tipo:* ${documentType}\n`
    message += `👤 *Estudante:* ${studentName}\n`
    message += `🆔 *Número:* ${documentNumber}\n`
    message += `🏫 *Escola:* ${school}\n`
    message += `📅 *Emissão:* ${new Date(document.dataEmissao).toLocaleDateString('pt-MZ')}\n`
    message += `\n✅ *Documento válido e verificado*\n\n`
    message += `🔍 *Verifique o documento:* ${verificationUrl}\n\n`
    message += `📱 *Partilhado via YISA - Sistema de Gestão de Documentos Escolares*`

    return message
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

  const handleShare = async () => {
    setIsSharing(true)
    setShareResult(null)

    try {
      const message = customMessage.trim() || generateDefaultMessage()
      const recipient = selectedContact === 'custom' ? '' : undefined

      const result = await sharingService.shareViaWhatsApp(document, qrCodeData, {
        customMessage: message,
        recipient: recipient
      })

      handleShareResult(result)

      if (result.success && onClose) {
        setTimeout(() => onClose(), 2000)
      }

    } catch (error) {
      console.error('WhatsApp share error:', error)
      setShareResult({
        success: false,
        message: 'Erro ao partilhar via WhatsApp. Tente novamente.'
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleQuickShare = async (contactId: string) => {
    setSelectedContact(contactId)
    await handleShare()
  }

  if (compact) {
    return (
      <motion.button
        onClick={() => handleQuickShare('parent')}
        disabled={isSharing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        <ChatBubbleLeftRightIcon className="w-4 h-4" />
        <span>WhatsApp</span>
        {isSharing && <div className="spinner spinner-sm" />}
      </motion.button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Partilhar via WhatsApp</h3>
        <p className="text-sm text-gray-600">
          Partilhe o documento diretamente no WhatsApp com o destinatário pretendido
        </p>
      </div>

      {/* Quick Contact Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {contactTemplates.slice(0, 3).map((template) => (
          <motion.button
            key={template.id}
            onClick={() => handleQuickShare(template.id)}
            disabled={isSharing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedContact === template.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedContact === template.id
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {template.icon}
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                <p className="text-xs text-gray-500">{template.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Custom Message */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Mensagem Personalizada (opcional)
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Deixe em branco para usar a mensagem padrão..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          disabled={isSharing}
        />
        <p className="text-xs text-gray-500">
          {customMessage.length}/500 caracteres
        </p>
      </div>

      {/* Document Preview */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <DocumentTextIcon className="w-4 h-4 mr-2" />
          Documento a ser Partilhado
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tipo:</span>
            <span className="font-medium">{getDocumentTypeLabel(document.tipo)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estudante:</span>
            <span className="font-medium">{document.estudante.nomeCompleto}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Número:</span>
            <span className="font-medium">{document.numeroDocumento}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Escola:</span>
            <span className="font-medium">{document.escolaOrigem}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Válido
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        onClick={handleShare}
        disabled={isSharing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSharing ? (
          <>
            <div className="spinner spinner-sm" />
            <span>A partilhar...</span>
          </>
        ) : (
          <>
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span>Partilhar no WhatsApp</span>
          </>
        )}
      </motion.button>

      {/* Result Message */}
      {shareResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-sm ${
            shareResult.success
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <div className="flex items-center">
            {shareResult.success ? (
              <CheckCircleIcon className="w-4 h-4 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
            )}
            <span>{shareResult.message}</span>
          </div>
        </motion.div>
      )}

      {/* Security Notice */}
      <div className="text-xs text-gray-500 text-center">
        <ClockIcon className="w-3 h-3 inline mr-1" />
        A partilha é segura e o documento pode ser verificado pelo destinatário
      </div>
    </div>
  )
}

export default WhatsAppShare