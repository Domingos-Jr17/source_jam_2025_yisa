import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { QRService } from './qr'
import type { DocumentEntity } from '../types/database'

/**
 * PDF generation service for school documents
 * Serviço de geração de PDF para documentos escolares
 */
export class PDFService {
  private static instance: PDFService

  private constructor() {}

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService()
    }
    return PDFService.instance
  }

  /**
   * Generate PDF for transfer declaration document
   */
  public async generateTransferPDF(document: DocumentEntity): Promise<Uint8Array> {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595, 842]) // A4 size in points

      // Embed fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

      // Document dimensions and margins
      const { width, height } = page.getSize()
      const margin = 50
      const contentWidth = width - 2 * margin

      // YISA Header
      this.drawHeader(page, font, boldFont, margin, height, contentWidth)

      // Document Title
      const titleY = height - 120
      page.drawText('DECLARAÇÃO DE TRANSFERÊNCIA', {
        x: margin,
        y: titleY,
        size: 20,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2)
      })

      // Document number
      page.drawText(`Nº: ${document.numeroDocumento}`, {
        x: margin,
        y: titleY - 30,
        size: 12,
        font: font,
        color: rgb(0.3, 0.3, 0.3)
      })

      // Issue date
      const currentDate = new Date().toLocaleDateString('pt-MZ')
      page.drawText(`Data de Emissão: ${currentDate}`, {
        x: width - margin - 150,
        y: titleY - 30,
        size: 12,
        font: font,
        color: rgb(0.3, 0.3, 0.3)
      })

      // Student Information Section
      this.drawStudentInfo(page, document, font, boldFont, margin, contentWidth, titleY - 70)

      // Transfer Information Section
      this.drawTransferInfo(page, document, font, boldFont, margin, contentWidth, titleY - 180)

      // Legal text
      this.drawLegalText(page, font, italicFont, margin, contentWidth, titleY - 300)

      // QR Code (moved to upper section)
      await this.drawQRCode(pdfDoc, page, document, margin, titleY - 400)

      // Footer
      this.drawFooter(page, font, width, height)

      // Serialize PDF to bytes
      const pdfBytes = await pdfDoc.save()
      return pdfBytes

    } catch (error) {
      console.error('PDF generation error:', error)
      throw new Error('Failed to generate PDF document')
    }
  }

  /**
   * Draw YISA header
   */
  private drawHeader(
    page: any,
    font: any,
    boldFont: any,
    margin: number,
    height: number,
    contentWidth: number
  ): void {
    // YISA Logo placeholder
    const headerY = height - 50

    // Institution name
    page.drawText('REPÚBLICA DE MOÇAMBIQUE', {
      x: margin,
      y: headerY,
      size: 14,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    })

    page.drawText('MINISTÉRIO DA EDUCAÇÃO E DESENVOLVIMENTO HUMANO', {
      x: margin,
      y: headerY - 20,
      size: 12,
      font: font,
      color: rgb(0.3, 0.3, 0.3)
    })

    // Line separator
    page.drawLine({
      start: { x: margin, y: headerY - 35 },
      end: { x: margin + contentWidth, y: headerY - 35 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5)
    })
  }

  /**
   * Draw student information section
   */
  private drawStudentInfo(
    page: any,
    document: DocumentEntity,
    font: any,
    boldFont: any,
    margin: number,
    contentWidth: number,
    startY: number
  ): void {
    const sectionY = startY
    const lineHeight = 20
    let currentY = sectionY

    // Section title
    page.drawText('DADOS DO ESTUDANTE', {
      x: margin,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    })

    currentY -= 25

    // Student details
    const studentData = [
      ['Nome Completo:', document.estudante.nomeCompleto],
      ['Número do Bilhete de Identidade:', document.estudante.numeroBI],
      ['Naturalidade:', document.estudante.naturalidade || 'Moçambique']
    ]

    studentData.forEach(([label, value]) => {
      page.drawText(label, {
        x: margin,
        y: currentY,
        size: 11,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3)
      })

      page.drawText(value, {
        x: margin + 150,
        y: currentY,
        size: 11,
        font: font,
        color: rgb(0.2, 0.2, 0.2)
      })

      currentY -= lineHeight
    })
  }

  /**
   * Draw transfer information section
   */
  private drawTransferInfo(
    page: any,
    document: DocumentEntity,
    font: any,
    boldFont: any,
    margin: number,
    contentWidth: number,
    startY: number
  ): void {
    const sectionY = startY
    const lineHeight = 20
    let currentY = sectionY

    // Section title
    page.drawText('INFORMAÇÃO DA TRANSFERÊNCIA', {
      x: margin,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    })

    currentY -= 25

    // Transfer details
    const transferData = [
      ['Escola de Origem:', document.escolaOrigem],
      ['Escola de Destino:', document.escolaDestino || ''],
      ['Classe:', document.dadosEscolares?.classeAtual?.classe?.toString() || ''],
      ['Turma:', document.dadosEscolares?.classeAtual?.turma || ''],
      ['Ano Letivo:', new Date().getFullYear().toString()]
    ]

    transferData.forEach(([label, value]) => {
      if (value) {
        page.drawText(label, {
          x: margin,
          y: currentY,
          size: 11,
          font: boldFont,
          color: rgb(0.3, 0.3, 0.3)
        })

        page.drawText(value, {
          x: margin + 150,
          y: currentY,
          size: 11,
          font: font,
          color: rgb(0.2, 0.2, 0.2)
        })

        currentY -= lineHeight
      }
    })
  }

  /**
   * Draw legal text section
   */
  private drawLegalText(
    page: any,
    font: any,
    italicFont: any,
    margin: number,
    contentWidth: number,
    startY: number
  ): void {
    const legalText = `Declaramos para todos os efeitos que o estudante acima identificado frequentou esta instituição de ensino e encontra-se regularmente matriculado na classe indicada, podendo proceder à sua transferência para a escola de destino.

Este documento é válido por 30 dias a partir da data de emissão e deverá ser apresentado na escola de destino juntamente com o bilhete de identidade do estudante.

Documento gerado através do sistema YISA - Sistema Inteligente de Gestão de Documentos Escolares, com validade digital e verificação online.`

    let currentY = startY
    const lineHeight = 15

    // Split text into paragraphs and handle word wrapping
    const paragraphs = legalText.split('\n').filter(p => p.trim())

    paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ')
      let currentLine = ''

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const textWidth = this.calculateTextWidth(testLine, italicFont, 10)

        if (textWidth > contentWidth && currentLine) {
          // Draw current line
          page.drawText(currentLine, {
            x: margin,
            y: currentY,
            size: 10,
            font: italicFont,
            color: rgb(0.3, 0.3, 0.3)
          })
          currentY -= lineHeight
          currentLine = word
        } else {
          currentLine = testLine
        }
      })

      // Draw last line of paragraph
      if (currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y: currentY,
          size: 10,
          font: italicFont,
          color: rgb(0.3, 0.3, 0.3)
        })
        currentY -= lineHeight
      }

      // Add extra space between paragraphs
      currentY -= 5
    })
  }

  /**
   * Calculate text width for word wrapping
   */
  private calculateTextWidth(text: string, font: any, fontSize: number): number {
    // Approximate text width calculation
    // In a real implementation, you would use font.widthOfTextAtSize(text, fontSize)
    const averageCharWidth = fontSize * 0.6
    return text.length * averageCharWidth
  }

  /**
   * Draw QR code on the document
   */
  private async drawQRCode(
    pdfDoc: any,
    page: any,
    document: DocumentEntity,
    margin: number,
    qrCodeY: number
  ): Promise<void> {
    try {
      // Generate QR code data and image
      const qrService = QRService.getInstance()
      const qrData = await qrService.generateQRCodeData(document)
      const qrCodeImageBase64 = await qrService.generateQRCodeImage(qrData)

      // Convert base64 to image data
      const base64Data = qrCodeImageBase64.replace(/^data:image\/png;base64,/, '')
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Embed QR code image in PDF
      const qrImage = await pdfDoc.embedPng(bytes)
      const qrCodeSize = 120
      const qrCodeX = page.getWidth() - margin - qrCodeSize

      // Draw QR code border
      page.drawRectangle({
        x: qrCodeX - 5,
        y: qrCodeY - qrCodeSize - 5,
        width: qrCodeSize + 10,
        height: qrCodeSize + 10,
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 1
      })

      // QR Code title
      page.drawText('QR Code de Verificação', {
        x: qrCodeX,
        y: qrCodeY + 10,
        size: 10,
        color: rgb(0.3, 0.3, 0.3)
      })

      // Draw the actual QR code image
      page.drawImage(qrImage, {
        x: qrCodeX,
        y: qrCodeY - qrCodeSize,
        width: qrCodeSize,
        height: qrCodeSize
      })

    } catch (error) {
      console.error('Error drawing QR code:', error)
      // Fallback to placeholder if QR code fails
      const qrCodeSize = 120
      const qrCodeX = page.getWidth() - margin - qrCodeSize

      page.drawRectangle({
        x: qrCodeX - 5,
        y: qrCodeY - qrCodeSize - 5,
        width: qrCodeSize + 10,
        height: qrCodeSize + 10,
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 1
      })

      page.drawText('QR Code de Verificação', {
        x: qrCodeX,
        y: qrCodeY + 10,
        size: 10,
        color: rgb(0.3, 0.3, 0.3)
      })

      page.drawRectangle({
        x: qrCodeX,
        y: qrCodeY - qrCodeSize,
        width: qrCodeSize,
        height: qrCodeSize,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 1
      })

      page.drawText('QR CODE', {
        x: qrCodeX + qrCodeSize / 2 - 30,
        y: qrCodeY - qrCodeSize / 2,
        size: 12,
        color: rgb(0.2, 0.2, 0.2)
      })
    }
  }

  /**
   * Draw document footer
   */
  private drawFooter(page: any, font: any, width: number, height: number): void {
    const margin = 50
    const footerY = 80

    // Generate random verification code
    const verificationCode = `YISA-${Date.now().toString(36).toUpperCase()}`

    // Verification line
    page.drawLine({
      start: { x: margin, y: footerY },
      end: { x: width - margin, y: footerY },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5)
    })

    // Footer text
    page.drawText('Código de Verificação:', {
      x: margin,
      y: footerY - 20,
      size: 9,
      font: font,
      color: rgb(0.3, 0.3, 0.3)
    })

    page.drawText(verificationCode, {
      x: margin + 120,
      y: footerY - 20,
      size: 9,
      font: font,
      color: rgb(0.2, 0.2, 0.2)
    })

    // System info
    page.drawText('Documento gerado pelo Sistema YISA', {
      x: margin,
      y: footerY - 40,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    })

    page.drawText(`https://yisa.education.mz/verificar/${verificationCode}`, {
      x: margin,
      y: footerY - 55,
      size: 8,
      font: font,
      color: rgb(0.3, 0.3, 0.3)
    })
  }

  /**
   * Generate PDF for school history document
   */
  public async generateHistoryPDF(document: DocumentEntity): Promise<Uint8Array> {
    // Similar structure to transfer PDF but with different content
    // This would include grade information, subjects, etc.
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842])

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const { width, height } = page.getSize()
    const margin = 50

    // Header
    this.drawHeader(page, font, boldFont, margin, height, width - 2 * margin)

    // Title
    page.drawText('HISTÓRICO ESCOLAR', {
      x: margin,
      y: height - 120,
      size: 20,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    })

    // TODO: Add detailed history content

    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  }

  /**
   * Convert PDF bytes to base64 string
   */
  public pdfToBase64(pdfBytes: Uint8Array): string {
    // Convert Uint8Array to binary string
    let binary = ''
    for (let i = 0; i < pdfBytes.length; i++) {
      binary += String.fromCharCode(pdfBytes[i])
    }
    // Convert binary string to base64
    return btoa(binary)
  }

  /**
   * Convert base64 string to PDF bytes
   */
  public base64ToPDF(base64: string): Uint8Array {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }
}