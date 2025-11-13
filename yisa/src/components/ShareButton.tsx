import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShareIcon,
  ChatBubbleLeftRightIcon,
  LinkIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import type { DocumentoEscolar, QRCodeData } from '../types'
import { SharingService, type ShareResult } from '../services/sharing'
import ShareModal from './ShareModal'

interface ShareButtonProps {
  document: DocumentoEscolar
  qrCodeData?: QRCodeData
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
  showText?: boolean
  compact?: boolean
  className?: string
}

const ShareButton: React.FC<ShareButtonProps> = ({
  document,
  qrCodeData,
  size = 'md',
  variant = 'primary',
  showText = true,
  compact = false,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareResult, setShareResult] = useState<{
    success: boolean
    message: string
    method?: string
  } | null>(null)

  const handleShareResult = (result: ShareResult) => {
    setShareResult({
      success: result.success,
      message: result.message || result.error || 'Operação concluída',
      method: result.method
    })
  }

  const sharingService = SharingService.getInstance()

  const handleQuickShare = async () => {
    setIsSharing(true)
    setShareResult(null)

    try {
      const result = await sharingService.smartShare(document, qrCodeData)
      handleShareResult(result)

      // Auto-hide success message after 3 seconds
      if (result.success) {
        setTimeout(() => setShareResult(null), 3000)
      }

    } catch (error) {
      console.error('Quick share error:', error)
      setShareResult({
        success: false,
        message: 'Erro ao partilhar documento'
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleWhatsAppShare = async () => {
    setIsSharing(true)
    setShareResult(null)

    try {
      const result = await sharingService.shareViaWhatsApp(document, qrCodeData)
      handleShareResult(result)

      if (result.success) {
        setTimeout(() => setShareResult(null), 3000)
      }

    } catch (error) {
      console.error('WhatsApp share error:', error)
      setShareResult({
        success: false,
        message: 'Erro ao partilhar via WhatsApp'
      })
    } finally {
      setIsSharing(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-6 py-3 text-base'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
      case 'ghost':
        return 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
      default:
        return 'bg-primary-600 text-white hover:bg-primary-700'
    }
  }

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  if (compact) {
    return (
      <>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          disabled={isSharing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-lg ${getVariantClasses()} ${baseClasses} ${className}`}
          title="Partilhar documento"
        >
          {isSharing ? (
            <div className="spinner spinner-sm" />
          ) : (
            <ShareIcon className="w-4 h-4" />
          )}
        </motion.button>

        <ShareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          documentData={document}
          qrCodeData={qrCodeData}
        />
      </>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Main Share Button */}
        <motion.button
          onClick={() => setIsModalOpen(true)}
          disabled={isSharing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`${baseClasses} ${getSizeClasses()} ${getVariantClasses()} ${className}`}
        >
          {isSharing ? (
            <div className="spinner spinner-sm mr-2" />
          ) : (
            <ShareIcon className="w-4 h-4 mr-2" />
          )}
          {showText && 'Partilhar'}
        </motion.button>

        {/* Quick Actions */}
        {!compact && (
          <div className="flex items-center gap-1">
            {/* WhatsApp Quick Share */}
            <motion.button
              onClick={handleWhatsAppShare}
              disabled={isSharing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
              title="Partilhar via WhatsApp"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
            </motion.button>

            {/* Copy Link Quick Share */}
            <motion.button
              onClick={async () => {
                const result = await sharingService.shareViaClipboard(document)
                handleShareResult(result)
                if (result.success) {
                  setTimeout(() => setShareResult(null), 3000)
                }
              }}
              disabled={isSharing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Copiar link"
            >
              <LinkIcon className="w-4 h-4" />
            </motion.button>

            {/* More Options */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              disabled={isSharing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Mais opções"
            >
              <EllipsisHorizontalIcon className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Share Result Messages */}
      {shareResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mt-2 px-3 py-2 rounded-lg text-sm ${
            shareResult.success
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {shareResult.message}
        </motion.div>
      )}

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentData={document}
        qrCodeData={qrCodeData}
      />
    </>
  )
}

export default ShareButton