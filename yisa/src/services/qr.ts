import QRCode from 'qrcode'
import { CryptoService } from './crypto'
import { SECURITY_CONFIG } from '../utils/constants'
import type { QRCodeData, DocumentoEscolar, DocumentType } from '../types'

/**
 * QR Code service for document verification
 * Serviço de QR Code para verificação de documentos
 */
export class QRService {
  private static instance: QRService

  private constructor() {}

  public static getInstance(): QRService {
    if (!QRService.instance) {
      QRService.instance = new QRService()
    }
    return QRService.instance
  }

  /**
   * Generate QR code data for document verification
   */
  public async generateQRCodeData(document: DocumentoEscolar): Promise<QRCodeData> {
    const qrData: QRCodeData = {
      documentoId: document.id,
      tipoDocumento: document.tipo as any,
      numeroDocumento: document.numeroDocumento,
      estudanteBI: document.estudante.numeroBI,
      dataEmissao: document.dataEmissao.toISOString(),
      escolaOrigem: document.escolaOrigem,
      hashValidacao: document.hashValidacao,
      urlVerificacao: `https://yisa.education.mz/verificar/${document.id}`,
      checksum: '' // Will be calculated below
    }

    // Generate checksum for integrity verification
    const dataString = JSON.stringify(qrData)
    const cryptoService = CryptoService.getInstance()
    const checksum = await cryptoService.hashData(dataString)
    qrData.checksum = checksum

    return qrData
  }

  /**
   * Generate QR code image as base64
   */
  public async generateQRCodeImage(data: QRCodeData): Promise<string> {
    try {
      const dataString = JSON.stringify(data)

      const qrCodeDataURL = await QRCode.toDataURL(dataString, {
        width: SECURITY_CONFIG.QR_CODE.SIZE,
        margin: SECURITY_CONFIG.QR_CODE.MARGIN,
        errorCorrectionLevel: SECURITY_CONFIG.QR_CODE.ERROR_CORRECTION_LEVEL as 'L' | 'M' | 'Q' | 'H',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      return qrCodeDataURL
    } catch (error) {
      console.error('QR Code generation error:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  /**
   * Verify QR code data integrity
   */
  public async verifyQRCodeData(qrData: QRCodeData): Promise<boolean> {
    try {
      // Create checksum from the data (excluding the checksum field)
      const { checksum, ...dataWithoutChecksum } = qrData
      const dataString = JSON.stringify(dataWithoutChecksum)
      const cryptoService = CryptoService.getInstance()
      const calculatedChecksum = await cryptoService.hashData(dataString)

      // Compare checksums
      return checksum === calculatedChecksum
    } catch (error) {
      console.error('QR Code verification error:', error)
      return false
    }
  }

  /**
   * Parse QR code from string data
   */
  public parseQRCodeData(qrString: string): QRCodeData | null {
    try {
      const data = JSON.parse(qrString)

      // Validate required fields
      const requiredFields = [
        'documentoId',
        'tipoDocumento',
        'numeroDocumento',
        'estudanteBI',
        'dataEmissao',
        'escolaOrigem',
        'hashValidacao',
        'urlVerificacao',
        'checksum'
      ]

      for (const field of requiredFields) {
        if (!(field in data)) {
          console.error(`Missing required field: ${field}`)
          return null
        }
      }

      return data as QRCodeData
    } catch (error) {
      console.error('QR Code parsing error:', error)
      return null
    }
  }

  /**
   * Generate verification URL for document
   */
  public generateVerificationURL(documentId: string): string {
    return `https://yisa.education.mz/verificar/${documentId}`
  }

  /**
   * Create QR code with embedded watermark
   */
  public async generateWatermarkedQRCode(data: QRCodeData, watermark: string): Promise<string> {
    try {
      const dataString = JSON.stringify(data)

      // Add watermark to the data
      const watermarkedData = {
        ...data,
        watermark,
        timestamp: Date.now()
      }

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(watermarkedData), {
        width: SECURITY_CONFIG.QR_CODE.SIZE,
        margin: SECURITY_CONFIG.QR_CODE.MARGIN,
        errorCorrectionLevel: SECURITY_CONFIG.QR_CODE.ERROR_CORRECTION_LEVEL as 'L' | 'M' | 'Q' | 'H',
        color: {
          dark: '#1e40af', // YISA primary color
          light: '#FFFFFF'
        }
      })

      return qrCodeDataURL
    } catch (error) {
      console.error('Watermarked QR Code generation error:', error)
      throw new Error('Failed to generate watermarked QR code')
    }
  }

  /**
   * Generate batch QR codes for multiple documents
   */
  public async generateBatchQRCodes(documents: DocumentoEscolar[]): Promise<Array<{ documentId: string; qrCode: string }>> {
    const results = []

    for (const document of documents) {
      try {
        const qrData = await this.generateQRCodeData(document)
        const qrCode = await this.generateQRCodeImage(qrData)
        results.push({
          documentId: document.id,
          qrCode
        })
      } catch (error) {
        console.error(`Failed to generate QR code for document ${document.id}:`, error)
        results.push({
          documentId: document.id,
          qrCode: ''
        })
      }
    }

    return results
  }

  /**
   * Validate QR code format
   */
  public validateQRCodeFormat(qrCodeData: string): boolean {
    try {
      const parsed = JSON.parse(qrCodeData)

      // Check if it has the expected structure for YISA documents
      return (
        typeof parsed === 'object' &&
        'documentoId' in parsed &&
        'tipoDocumento' in parsed &&
        'hashValidacao' in parsed &&
        'checksum' in parsed
      )
    } catch {
      return false
    }
  }

  /**
   * Get QR code metadata
   */
  public getQRCodeMetadata(qrData: QRCodeData): {
    documentId: string
    documentType: string
    issueDate: Date
    school: string
    isValid: boolean
  } {
    return {
      documentId: qrData.documentoId,
      documentType: String(qrData.tipoDocumento),
      issueDate: new Date(qrData.dataEmissao),
      school: qrData.escolaOrigem,
      isValid: qrData.checksum.length > 0
    }
  }
}