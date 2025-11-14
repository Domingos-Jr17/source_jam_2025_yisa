import React, { useState, useEffect } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import {type DocumentoTransferencia } from './documentos'
import { gerarQRCode } from "@/lib/qr-generator"



export async function  handleBaixarPDF(documento: DocumentoTransferencia) {
    if (!documento ) return

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    const qrUrl = await gerarQRCode(documento.qrCodeData)
    const qrImageUrl = qrUrl

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20

    // Cabeçalho - Nome da Escola
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    const nomeEscola = documento.escolaOrigem.toUpperCase()
    const escolaWidth = pdf.getTextWidth(nomeEscola)
    pdf.text(nomeEscola, (pageWidth - escolaWidth) / 2, margin)

    // Linha decorativa
    pdf.setLineWidth(0.5)
    pdf.line(margin, margin + 5, pageWidth - margin, margin + 5)

    // Título do Documento
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    const titulo = 'DOCUMENTO DE TRANSFERÊNCIA ESCOLAR'
    const tituloWidth = pdf.getTextWidth(titulo)
    pdf.text(titulo, (pageWidth - tituloWidth) / 2, margin + 15)

    // Data de Emissão
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const dataTexto = `Data de Emissão: ${documento.dataEmissao}`
    const dataWidth = pdf.getTextWidth(dataTexto)
    pdf.text(dataTexto, (pageWidth - dataWidth) / 2, margin + 25)

    // Dados do Estudante
    let yPosition = margin + 40

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('DADOS DO ESTUDANTE', margin, yPosition)
    
    yPosition += 10
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    
    pdf.text(`Nome Completo: ${documento.estudante.nomeCompleto}`, margin, yPosition)
    yPosition += 8
    pdf.text(`Número de BI: ${documento.estudante.numeroBi}`, margin, yPosition)
    yPosition += 8
    pdf.text(`Classe: ${documento.estudante.classe}`, margin, yPosition)

    // QR Code - centralizado
    yPosition += 20
    const qrSize = 60
    const qrX = (pageWidth - qrSize) / 2
    
    pdf.addImage(qrImageUrl, 'PNG', qrX, yPosition, qrSize, qrSize)

    // Código ID abaixo do QR Code
    yPosition += qrSize + 8
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    const codigoTexto = `Código: ${documento.shortId}`
    const codigoWidth = pdf.getTextWidth(codigoTexto)
    pdf.text(codigoTexto, (pageWidth - codigoWidth) / 2, yPosition)

    // Hash (opcional)
    yPosition += 6
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    const hashTexto = `Hash: ${documento.hash.substring(0, 32)}...`
    const hashWidth = pdf.getTextWidth(hashTexto)
    pdf.text(hashTexto, (pageWidth - hashWidth) / 2, yPosition)

    // Rodapé
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'italic')
    const rodape = 'Documento gerado eletronicamente - Verifique a autenticidade através do QR Code'
    const rodapeWidth = pdf.getTextWidth(rodape)
    pdf.text(rodape, (pageWidth - rodapeWidth) / 2, pageHeight - 10)

    // Salvar o PDF
    pdf.save(`Transferencia_${documento.shortId}.pdf`)
  }

  export async function handleVisualizar(documento: DocumentoTransferencia) {
    if (!documento) return

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const qrUrl = await gerarQRCode(documento.qrCodeData)
    const qrImageUrl = qrUrl
    // ... (mesmo código de geração do PDF)
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20

    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    const nomeEscola = documento.escolaOrigem.toUpperCase()
    const escolaWidth = pdf.getTextWidth(nomeEscola)
    pdf.text(nomeEscola, (pageWidth - escolaWidth) / 2, margin)

    pdf.setLineWidth(0.5)
    pdf.line(margin, margin + 5, pageWidth - margin, margin + 5)

    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    const titulo = 'DOCUMENTO DE TRANSFERÊNCIA ESCOLAR'
    const tituloWidth = pdf.getTextWidth(titulo)
    pdf.text(titulo, (pageWidth - tituloWidth) / 2, margin + 15)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const dataTexto = `Data de Emissão: ${documento.dataEmissao}`
    const dataWidth = pdf.getTextWidth(dataTexto)
    pdf.text(dataTexto, (pageWidth - dataWidth) / 2, margin + 25)

    let yPosition = margin + 40
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('DADOS DO ESTUDANTE', margin, yPosition)
    
    yPosition += 10
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Nome Completo: ${documento.estudante.nomeCompleto}`, margin, yPosition)
    yPosition += 8
    pdf.text(`Número de BI: ${documento.estudante.numeroBi}`, margin, yPosition)
    yPosition += 8
    pdf.text(`Classe: ${documento.estudante.classe}`, margin, yPosition)

    if (documento.dataEmissao) {
      yPosition += 8
      pdf.text(`Data de Nascimento: ${documento.dataEmissao}`, margin, yPosition)
    }

    yPosition += 20
    const qrSize = 60
    const qrX = (pageWidth - qrSize) / 2
    pdf.addImage(qrImageUrl, 'PNG', qrX, yPosition, qrSize, qrSize)

    yPosition += qrSize + 8
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    const codigoTexto = `Código: ${documento.shortId}`
    const codigoWidth = pdf.getTextWidth(codigoTexto)
    pdf.text(codigoTexto, (pageWidth - codigoWidth) / 2, yPosition)

    yPosition += 6
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    const hashTexto = `Hash: ${documento.hash.substring(0, 32)}...`
    const hashWidth = pdf.getTextWidth(hashTexto)
    pdf.text(hashTexto, (pageWidth - hashWidth) / 2, yPosition)

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'italic')
    const rodape = 'Documento gerado eletronicamente - Verifique a autenticidade através do QR Code'
    const rodapeWidth = pdf.getTextWidth(rodape)
    pdf.text(rodape, (pageWidth - rodapeWidth) / 2, pageHeight - 10)

    // Abrir em nova aba
    window.open(pdf.output('bloburl'), '_blank')
  }

