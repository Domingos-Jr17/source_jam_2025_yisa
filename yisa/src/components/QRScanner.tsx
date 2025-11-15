import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode'
import { QRService } from '../services/qr'
import { DatabaseService } from '../services/database'
import {
  QrCodeIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import type { QRCodeData } from '../types'
import type { ValidationResult, ValidationError, ValidationWarning } from '../types/document'

interface QRScannerProps {
  onScanComplete?: (data: QRCodeData) => void
  onError?: (error: string) => void
  onClose?: () => void
  showResults?: boolean
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScanComplete,
  onError,
  onClose,
  showResults = true
}) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<QRCodeData | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')
  const [lastScannedDocument, setLastScannedDocument] = useState<any>(null)

  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeScanner = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (html5QrCodeScanner.current) {
        try {
          html5QrCodeScanner.current.clear()
        } catch (error) {
          console.error('Error clearing scanner:', error)
        }
      }
    }
  }, [])

  const startScanning = async () => {
    if (!scannerRef.current) return

    try {
      setIsScanning(true)
      setScanResult(null)
      setValidationResult(null)

      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [0, 1, 2] as any, // QR_CODE, AZTEC, CODABAR
        },
        false
      )

      html5QrCodeScanner.current = scanner

      scanner.render(
        async (decodedText: string) => {
          await handleScanSuccess(decodedText)
        },
        (error: Error | string | unknown) => {
          console.warn('QR scan error:', error)
          // Don't show error for continuous scanning failures
        }
      )

      setCameraPermission('granted')

    } catch (error) {
      console.error('Error starting scanner:', error)
      setIsScanning(false)
      setCameraPermission('denied')

      const errorMessage = error instanceof Error
        ? error.message
        : 'Não foi possível acessar a câmara. Por favor, verifique as permissões.'

      onError?.(errorMessage)
    }
  }

  const handleScanSuccess = async (decodedText: string) => {
    try {
      setIsValidating(true)

      // Parse QR code data
      const qrService = QRService.getInstance()
      const qrData = qrService.parseQRCodeData(decodedText)

      if (!qrData) {
        throw new Error('Código QR inválido ou corrompido')
      }

      // Verify QR code integrity
      const isValidQR = await qrService.verifyQRCodeData(qrData)

      if (!isValidQR) {
        throw new Error('Código QR não passou na verificação de integridade')
      }

      // Validate document from database
      const db = DatabaseService.getInstance()
      const document = await db.getDocument(qrData.documentoId)

      if (!document) {
        throw new Error('Documento não encontrado na base de dados')
      }

      // Verify document hash
      const hashMatches = document.hashValidacao === qrData.hashValidacao

      if (!hashMatches) {
        throw new Error('Hash do documento não corresponde. O documento pode ter sido alterado.')
      }

      // Check if document is still valid
      const now = new Date()
      const emissionDate = new Date(qrData.dataEmissao)
      const daysSinceEmission = Math.floor((now.getTime() - emissionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSinceEmission > 30) {
        throw new Error('Documento expirou. A validade é de 30 dias após a emissão.')
      }

      // Success!
      setScanResult(qrData)
      setLastScannedDocument(document)
      setValidationResult({
        valido: true,
        dataValidacao: now,
        erros: [],
        avisos: daysSinceEmission > 25 ? [{
          campo: 'validade',
          mensagem: 'O documento está próximo de expirar',
          codigo: 'EXPIRING_SOON',
          gravidade: 'aviso'
        }] : [],
        documentoVerificado: document
      })

      onScanComplete?.(qrData)

    } catch (error) {
      console.error('Scan validation error:', error)
      setScanResult(null)
      setLastScannedDocument(null)

      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setValidationResult({
        valido: false,
        dataValidacao: new Date(),
        erros: [{
          campo: 'qrcode',
          mensagem: errorMessage,
          codigo: 'VALIDATION_ERROR',
          gravidade: 'erro'
        }],
        avisos: []
      })

      onError?.(errorMessage)
    } finally {
      setIsValidating(false)
    }
  }

  const stopScanning = () => {
    if (html5QrCodeScanner.current) {
      try {
        html5QrCodeScanner.current.clear()
      } catch (error) {
        console.error('Error stopping scanner:', error)
      }
      html5QrCodeScanner.current = null
    }
    setIsScanning(false)
  }

  const resetScanner = () => {
    stopScanning()
    setScanResult(null)
    setValidationResult(null)
    setLastScannedDocument(null)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsValidating(true)

      const html5QrCode = new Html5Qrcode('qr-reader')
      const result = await html5QrCode.scanFile(file, true)

      if (result) {
        await handleScanSuccess(result)
      }

    } catch (error) {
      console.error('File scan error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao ler o arquivo'
      onError?.(errorMessage)
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <QrCodeIcon className="w-6 h-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Verificação de Documento</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Scanner Status */}
      {!isScanning && !scanResult && (
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCodeIcon className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Escaneie o QR Code do Documento
          </h3>
          <p className="text-gray-600 mb-6">
            Posicione o QR code do documento escolar dentro da área de QR para verificar a autenticidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startScanning}
              className="btn-primary"
            >
              <CameraIcon className="w-5 h-5 mr-2" />
              Iniciar Scanner
            </button>
            <label className="btn-outline cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isValidating}
              />
              Carregar Imagem
            </label>
          </div>
        </div>
      )}

      {/* Scanner View */}
      {isScanning && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Posicione o QR code dentro da área indicada
            </p>
            <button
              onClick={stopScanning}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Cancelar
            </button>
          </div>
          <div
            id="qr-reader"
            ref={scannerRef}
            className="rounded-lg overflow-hidden border-2 border-gray-200"
          />
        </div>
      )}

      {/* Loading State */}
      {isValidating && (
        <div className="flex items-center justify-center py-8">
          <div className="spinner spinner-md mr-3"></div>
          <span className="text-gray-600">A validar documento...</span>
        </div>
      )}

      {/* Results */}
      {showResults && validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Validation Status */}
          <div className={`card ${validationResult.valido ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-start">
              {validationResult.valido ? (
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
              ) : (
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
              )}
              <div>
                <h3 className={`font-medium ${validationResult.valido ? 'text-green-800' : 'text-red-800'}`}>
                  {validationResult.valido ? 'Documento Válido' : 'Documento Inválido'}
                </h3>
                <p className={`text-sm mt-1 ${validationResult.valido ? 'text-green-700' : 'text-red-700'}`}>
                  Data da verificação: {validationResult.dataValidacao.toLocaleString('pt-MZ')}
                </p>
              </div>
            </div>
          </div>

          {/* Document Details */}
          {validationResult.valido && scanResult && lastScannedDocument && (
            <div className="space-y-4">
              <div className="card">
                <h4 className="font-semibold text-gray-900 mb-3">Informações do Documento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Tipo:</span>
                    <p className="font-medium">{String(scanResult.tipoDocumento)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Número:</span>
                    <p className="font-medium">{scanResult.numeroDocumento}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Data de Emissão:</span>
                    <p className="font-medium">{new Date(scanResult.dataEmissao).toLocaleDateString('pt-MZ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Escola de Origem:</span>
                    <p className="font-medium">{scanResult.escolaOrigem}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold text-gray-900 mb-3">Dados do Estudante</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nome Completo:</span>
                    <p className="font-medium">{lastScannedDocument.estudante.nomeCompleto}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Número do BI:</span>
                    <p className="font-medium">{lastScannedDocument.estudante.numeroBI}</p>
                  </div>
                  {lastScannedDocument.dadosEscolares?.classeAtual && (
                    <>
                      <div>
                        <span className="text-gray-500">Classe:</span>
                        <p className="font-medium">{lastScannedDocument.dadosEscolares.classeAtual.classe}ª</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Turma:</span>
                        <p className="font-medium">{lastScannedDocument.dadosEscolares.classeAtual.turma}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Errors */}
          {!validationResult.valido && validationResult.erros.length > 0 && (
            <div className="alert alert-error">
              <ul className="list-disc list-inside">
                {validationResult.erros.map((error: ValidationError, index: number) => (
                  <li key={index}>{error.mensagem}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {validationResult.avisos.length > 0 && (
            <div className="alert alert-warning">
              <ul className="list-disc list-inside">
                {validationResult.avisos.map((warning: ValidationWarning, index: number) => (
                  <li key={index}>{warning.mensagem}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={resetScanner}
              className="btn-primary"
            >
              Escanear Outro Documento
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="btn-outline"
              >
                Fechar
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default QRScanner