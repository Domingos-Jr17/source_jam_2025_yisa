import type { DocumentEntity } from '../types/database'
import type { QRCodeData } from '../types'

export interface ShareOptions {
  includeQRCode?: boolean
  includePDF?: boolean
  customMessage?: string
  recipient?: string
}

export interface ShareResult {
  success: boolean
  method: 'whatsapp' | 'web_share' | 'clipboard' | 'email'
  message?: string
  error?: string
}

export class SharingService {
  private static instance: SharingService
  private readonly APP_BASE_URL = window.location.origin
  private readonly WHATSAPP_API_URL = 'https://wa.me/'

  private constructor() {}

  static getInstance(): SharingService {
    if (!SharingService.instance) {
      SharingService.instance = new SharingService()
    }
    return SharingService.instance
  }

  /**
   * Share document via WhatsApp using deep linking
   */
  async shareViaWhatsApp(
    document: DocumentEntity,
    qrCodeData?: QRCodeData,
    options: ShareOptions = {}
  ): Promise<ShareResult> {
    try {
      const message = this.buildShareMessage(document, qrCodeData, options)
      const verificationUrl = `${this.APP_BASE_URL}/verificar/${document.id}`

      // Create WhatsApp deep link
      const phoneNumber = options.recipient || ''
      const encodedMessage = encodeURIComponent(`${message}\n\nVerifique o documento: ${verificationUrl}`)

      const whatsappUrl = `${this.WHATSAPP_API_URL}${phoneNumber}?text=${encodedMessage}`

      // Log sharing attempt
      await this.logShareEvent(document.id, 'whatsapp', { recipient: options.recipient })

      // Open WhatsApp (mobile app or web)
      window.open(whatsappUrl, '_blank')

      return {
        success: true,
        method: 'whatsapp',
        message: 'Documento partilhado via WhatsApp com sucesso!'
      }

    } catch (error) {
      console.error('Error sharing via WhatsApp:', error)
      return {
        success: false,
        method: 'whatsapp',
        error: 'Erro ao partilhar via WhatsApp. Tente novamente.'
      }
    }
  }

  /**
   * Share document using Web Share API (native sharing)
   */
  async shareViaWebShare(
    document: DocumentEntity,
    qrCodeData?: QRCodeData,
    options: ShareOptions = {}
  ): Promise<ShareResult> {
    try {
      if (!navigator.share) {
        throw new Error('Web Share API not supported')
      }

      const message = this.buildShareMessage(document, qrCodeData, options)
      const verificationUrl = `${this.APP_BASE_URL}/verificar/${document.id}`

      const shareData: ShareData = {
        title: `YISA - ${this.getDocumentTypeLabel(document.tipo)}`,
        text: `${message}\n\nVerifique o documento: ${verificationUrl}`,
        url: verificationUrl
      }

      await navigator.share(shareData)

      // Log sharing event
      await this.logShareEvent(document.id, 'web_share')

      return {
        success: true,
        method: 'web_share',
        message: 'Documento partilhado com sucesso!'
      }

    } catch (error) {
      console.error('Error sharing via Web Share:', error)

      // If user cancels sharing, don't treat as error
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          method: 'web_share',
          error: 'Partilha cancelada pelo utilizador'
        }
      }

      return {
        success: false,
        method: 'web_share',
        error: 'Erro ao partilhar documento'
      }
    }
  }

  /**
   * Share document by copying link to clipboard
   */
  async shareViaClipboard(
    document: DocumentEntity,
    options: ShareOptions = {}
  ): Promise<ShareResult> {
    try {
      const verificationUrl = `${this.APP_BASE_URL}/verificar/${document.id}`
      const message = options.customMessage ||
        `Documento YISA - ${this.getDocumentTypeLabel(document.tipo)}\n${document.estudante.nomeCompleto}\n\nVerifique: ${verificationUrl}`

      await navigator.clipboard.writeText(message)

      // Log sharing event
      await this.logShareEvent(document.id, 'clipboard')

      return {
        success: true,
        method: 'clipboard',
        message: 'Link copiado para a área de transferência!'
      }

    } catch (error) {
      console.error('Error copying to clipboard:', error)
      return {
        success: false,
        method: 'clipboard',
        error: 'Erro ao copiar link para a área de transferência'
      }
    }
  }

  /**
   * Share document via email
   */
  async shareViaEmail(
    document: DocumentEntity,
    qrCodeData?: QRCodeData,
    options: ShareOptions = {}
  ): Promise<ShareResult> {
    try {
      const message = this.buildShareMessage(document, qrCodeData, options)
      const verificationUrl = `${this.APP_BASE_URL}/verificar/${document.id}`

      const subject = encodeURIComponent(`YISA - ${this.getDocumentTypeLabel(document.tipo)} - ${document.numeroDocumento}`)
      const body = encodeURIComponent(`${message}\n\nVerifique o documento: ${verificationUrl}`)

      const mailtoUrl = `mailto:?subject=${subject}&body=${body}`

      // Log sharing event
      await this.logShareEvent(document.id, 'email', { recipient: options.recipient })

      window.open(mailtoUrl, '_blank')

      return {
        success: true,
        method: 'email',
        message: 'Cliente de email aberto para partilha!'
      }

    } catch (error) {
      console.error('Error sharing via email:', error)
      return {
        success: false,
        method: 'email',
        error: 'Erro ao partilhar via email'
      }
    }
  }

  /**
   * Get available sharing methods based on device capabilities
   */
  getAvailableSharingMethods(): Array<{
    id: string
    name: string
    icon: string
    description: string
    available: boolean
  }> {
    const methods = [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: '💬',
        description: 'Partilhar diretamente no WhatsApp',
        available: true // Always available as web version works
      },
      {
        id: 'web_share',
        name: 'Partilha Nativa',
        icon: '📤',
        description: 'Usar partilha do sistema',
        available: !!navigator.share
      },
      {
        id: 'clipboard',
        name: 'Copiar Link',
        icon: '📋',
        description: 'Copiar para área de transferência',
        available: !!navigator.clipboard
      },
      {
        id: 'email',
        name: 'Email',
        icon: '📧',
        description: 'Partilhar via email',
        available: true
      }
    ]

    return methods
  }

  /**
   * Smart sharing - tries best available method
   */
  async smartShare(
    document: DocumentEntity,
    qrCodeData?: QRCodeData,
    options: ShareOptions = {}
  ): Promise<ShareResult> {
    const methods = this.getAvailableSharingMethods()

    // Priority order: Web Share -> WhatsApp -> Clipboard -> Email
    const priorityOrder = ['web_share', 'whatsapp', 'clipboard', 'email']

    for (const methodId of priorityOrder) {
      const method = methods.find(m => m.id === methodId)
      if (!method?.available) continue

      switch (methodId) {
        case 'web_share':
          const result = await this.shareViaWebShare(document, qrCodeData, options)
          if (result.success) return result
          break

        case 'whatsapp':
          const whatsappResult = await this.shareViaWhatsApp(document, qrCodeData, options)
          if (whatsappResult.success) return whatsappResult
          break

        case 'clipboard':
          const clipboardResult = await this.shareViaClipboard(document, options)
          if (clipboardResult.success) return clipboardResult
          break

        case 'email':
          const emailResult = await this.shareViaEmail(document, qrCodeData, options)
          return emailResult
      }
    }

    return {
      success: false,
      method: 'clipboard',
      error: 'Nenhum método de partilha disponível'
    }
  }

  /**
   * Generate QR code for sharing
   */
  generateShareQRCode(document: DocumentEntity): string {
    const verificationUrl = `${this.APP_BASE_URL}/verificar/${document.id}`
    return verificationUrl
  }

  /**
   * Build share message based on document and options
   */
  private buildShareMessage(
    document: DocumentEntity,
    qrCodeData?: QRCodeData,
    options: ShareOptions = {}
  ): string {
    if (options.customMessage) {
      return options.customMessage
    }

    const documentType = this.getDocumentTypeLabel(document.tipo)
    const studentName = document.estudante.nomeCompleto
    const documentNumber = document.numeroDocumento
    const school = document.escolaOrigem
    const emissionDate = new Date(document.dataEmissao).toLocaleDateString('pt-MZ')

    let message = `📋 *Documento Escolar YISA*\n\n`
    message += `📝 *Tipo:* ${documentType}\n`
    message += `👤 *Estudante:* ${studentName}\n`
    message += `🆔 *Número:* ${documentNumber}\n`
    message += `🏫 *Escola:* ${school}\n`
    message += `📅 *Emissão:* ${emissionDate}\n`

    if (qrCodeData) {
      message += `\n✅ *Documento válido e verificado*`
    }

    return message
  }

  /**
   * Get localized document type label
   */
  private getDocumentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      declaracao_transferencia: 'Declaração de Transferência',
      historico_escolar: 'Histórico Escolar',
      certificado_conclusao: 'Certificado de Conclusão',
      declaracao_matricula: 'Declaração de Matrícula',
      atestado_frequencia: 'Atestado de Frequência'
    }
    return labels[type] || type
  }

  /**
   * Log sharing events for audit
   */
  private async logShareEvent(
    documentId: string,
    method: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const { DatabaseService } = await import('../services/database')
      const db = DatabaseService.getInstance()

      await db.addAuditEvent({
        action: 'document_shared',
        resource: 'document',
        resourceId: documentId,
        deviceId: '', // Will come from auth context
        userAgent: navigator.userAgent,
        success: true,
        metadata: JSON.stringify({
          shareMethod: method,
          timestamp: new Date().toISOString(),
          ...metadata
        })
      })

    } catch (error) {
      console.error('Error logging share event:', error)
      // Don't throw - sharing should work even if logging fails
    }
  }

  /**
   * Generate share preview data
   */
  generateSharePreview(document: DocumentEntity): {
    title: string
    description: string
    url: string
    image?: string
  } {
    const documentType = this.getDocumentTypeLabel(document.tipo)

    return {
      title: `YISA - ${documentType}`,
      description: `Documento escolar de ${document.estudante.nomeCompleto} - ${document.numeroDocumento}`,
      url: `${this.APP_BASE_URL}/verificar/${document.id}`,
      image: undefined // Could add school logo or document preview
    }
  }
}