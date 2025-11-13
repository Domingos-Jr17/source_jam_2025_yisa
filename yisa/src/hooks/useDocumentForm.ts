import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { StudentData, DocumentValidation } from '../types'
import { DatabaseService } from '../services/database'
import { CryptoService } from '../services/crypto'
import { PDFService } from '../services/pdf'
import { QRService } from '../services/qr'

interface UseDocumentFormReturn {
  formData: StudentData
  errors: Record<string, string>
  isLoading: boolean
  validation: DocumentValidation | null
  handleInputChange: (field: keyof StudentData, value: string) => void
  validateForm: () => DocumentValidation
  handleSubmit: () => Promise<boolean>
  resetForm: () => void
}

export const useDocumentForm = (): UseDocumentFormReturn => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<StudentData>({
    nomeCompleto: '',
    numeroBI: '',
    nomeEscolaOrigem: '',
    nomeEscolaDestino: '',
    classe: '',
    turma: '',
    disciplina: '',
    dataTransferencia: new Date(),
    numeroProcesso: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [validation, setValidation] = useState<DocumentValidation | null>(null)

  const handleInputChange = useCallback((field: keyof StudentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'dataTransferencia' ? (value ? new Date(value) : new Date()) : value
    }))

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const validateForm = useCallback((): DocumentValidation => {
    const newErrors: Record<string, string> = {}
    const warnings: Array<{ field: keyof StudentData; message: string; code: string }> = []

    // Required field validations
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório'
    } else if (formData.nomeCompleto.length < 5) {
      newErrors.nomeCompleto = 'Nome deve ter pelo menos 5 caracteres'
    }

    if (!formData.numeroBI.trim()) {
      newErrors.numeroBI = 'Número do BI é obrigatório'
    } else if (!/^[0-9]{9}[A-Z]{2}[0-9]{3}$/.test(formData.numeroBI)) {
      newErrors.numeroBI = 'Formato de BI inválido. Use: 9 números + 2 letras + 3 números'
    }

    if (!formData.nomeEscolaOrigem.trim()) {
      newErrors.nomeEscolaOrigem = 'Escola de origem é obrigatória'
    }

    if (!formData.nomeEscolaDestino.trim()) {
      newErrors.nomeEscolaDestino = 'Escola de destino é obrigatória'
    }

    if (!formData.classe) {
      newErrors.classe = 'Classe é obrigatória'
    }

    if (!formData.turma.trim()) {
      newErrors.turma = 'Turma é obrigatória'
    } else if (!/^[A-Za-z0-9\s-]+$/.test(formData.turma)) {
      newErrors.turma = 'Turma contém caracteres inválidos'
    }

    // Warnings
    if (formData.nomeEscolaOrigem === formData.nomeEscolaDestino) {
      warnings.push({
        field: 'nomeEscolaDestino',
        message: 'Escola de destino é a mesma que a de origem',
        code: 'SAME_SCHOOL'
      })
    }

    const validation: DocumentValidation = {
      isValid: Object.keys(newErrors).length === 0,
      errors: Object.entries(newErrors).map(([field, message]) => ({
        field: field as keyof StudentData,
        message,
        code: field.toUpperCase()
      })),
      warnings
    }

    setValidation(validation)
    setErrors(newErrors)

    return validation
  }, [formData])

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    const validation = validateForm()

    if (!validation.isValid) {
      return false
    }

    setIsLoading(true)

    try {
      // Check if student with this BI already exists
      const db = DatabaseService.getInstance()
      const existingStudent = await db.getStudentByBI(formData.numeroBI)

      let studentId: string

      if (existingStudent) {
        // Update existing student
        studentId = existingStudent.id
        await db.updateStudent(studentId, {
          nomeCompleto: formData.nomeCompleto
        })
      } else {
        // Create new student
        studentId = await db.addStudent({
          nomeCompleto: formData.nomeCompleto,
          numeroBI: formData.numeroBI,
          dataNascimento: new Date(), // Default - should be captured in real form
          naturalidade: 'Moçambique', // Default - should be captured in real form
          nomePai: '',
          nomeMae: '',
          responsavel: '',
          contactoResponsavel: '',
          documents: [] // Initialize with empty documents array
        })
      }

      // Create document hash for integrity
      const documentData = JSON.stringify({
        ...formData,
        studentId,
        timestamp: new Date().toISOString()
      })

      const hash = await CryptoService.getInstance().hashData(documentData)

      // Create the transfer document object first
      const documentObject = {
        id: crypto.randomUUID(),
        tipo: 'declaracao_transferencia' as const,
        estudanteId: studentId,
        dataEmissao: new Date(),
        numeroDocumento: `YISA-${Date.now()}`,
        escolaOrigem: formData.nomeEscolaOrigem,
        escolaDestino: formData.nomeEscolaDestino,
        estudante: {
          nomeCompleto: formData.nomeCompleto,
          numeroBI: formData.numeroBI,
          dataNascimento: new Date(), // Default
          naturalidade: 'Moçambique', // Default
          nomePai: '',
          nomeMae: '',
          responsavel: '',
          contactoResponsavel: ''
        },
        dadosEscolares: {
          escolaOrigem: {
            nome: formData.nomeEscolaOrigem,
            codigo: 'ESC001', // Would be selected from database
            provincia: 'Maputo (Província)', // Default
            distrito: 'Manhiça', // Default
            nomenclatura: 'ESG',
            diretor: ''
          },
          escolaDestino: {
            nome: formData.nomeEscolaDestino,
            codigo: 'ESC002', // Would be selected from database
            provincia: 'Maputo (Província)', // Default
            distrito: 'Manhiça', // Default
            nomenclatura: 'ESG',
            diretor: ''
          },
          classeAtual: {
            classe: parseInt(formData.classe),
            turma: formData.turma,
            ano: new Date().getFullYear(),
            regime: formData.turma.includes('noturno') ? 'noturno' as const : 'diurno' as const
          },
          disciplina: formData.disciplina
        },
        qrCodeData: '', // Will be populated after QR generation
        hashValidacao: hash,
        status: 'emitido' as const,
        versao: '1.0',
        criadoEm: new Date(),
        atualizadoEm: new Date()
      }

      // Generate QR code data
      const qrService = QRService.getInstance()
      const qrData = await qrService.generateQRCodeData(documentObject)
      const qrCodeImage = await qrService.generateQRCodeImage(qrData)

      // Generate PDF with embedded QR code
      const pdfService = PDFService.getInstance()
      const pdfBytes = await pdfService.generateTransferPDF(documentObject)
      const pdfBase64 = pdfService.pdfToBase64(pdfBytes)

      // Now save the document with generated QR code and PDF
      const documentId = await db.addDocument({
        ...documentObject,
        qrCodeData: JSON.stringify(qrData),
        pdfBase64,
        status: 'emitido'
      })

      // Audit trail
      await db.addAuditEvent({
        action: 'document_created',
        resource: 'document',
        resourceId: documentId,
        deviceId: '', // Will come from auth context
        userAgent: navigator.userAgent,
        success: true,
        metadata: JSON.stringify({
          documentType: 'declaracao_transferencia',
          studentBI: formData.numeroBI,
          escolaOrigem: formData.nomeEscolaOrigem,
          escolaDestino: formData.nomeEscolaDestino
        })
      })

      // Success! Navigate to document preview or wallet
      navigate('/carteira', {
        state: {
          documentId,
          message: 'Documento criado com sucesso!'
        }
      })

      return true

    } catch (error) {
      console.error('Error creating document:', error)
      setErrors({
        submit: 'Erro ao criar documento. Por favor, tente novamente.'
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm, navigate])

  const resetForm = useCallback(() => {
    setFormData({
      nomeCompleto: '',
      numeroBI: '',
      nomeEscolaOrigem: '',
      nomeEscolaDestino: '',
      classe: '',
      turma: '',
      disciplina: '',
      dataTransferencia: new Date(),
      numeroProcesso: ''
    })
    setErrors({})
    setValidation(null)
  }, [])

  return {
    formData,
    errors,
    isLoading,
    validation,
    handleInputChange,
    validateForm,
    handleSubmit,
    resetForm
  }
}
