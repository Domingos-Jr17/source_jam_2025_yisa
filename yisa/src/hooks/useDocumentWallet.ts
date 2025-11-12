import { useState, useEffect, useCallback } from 'react'
import { DatabaseService } from '../services/database'
import type { DocumentoEscolar, DocumentStats } from '../types'

interface UseDocumentWalletReturn {
  documents: DocumentoEscolar[]
  stats: DocumentStats
  isLoading: boolean
  error: string | null
  searchQuery: string
  sortBy: 'recent' | 'oldest' | 'name' | 'type'
  filterType: string
  loadDocuments: () => Promise<void>
  deleteDocument: (documentId: string) => Promise<boolean>
  shareDocument: (documentId: string) => Promise<void>
  downloadDocument: (documentId: string) => Promise<void>
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: 'recent' | 'oldest' | 'name' | 'type') => void
  setFilterType: (type: string) => void
  refreshWallet: () => Promise<void>
  getDocumentById: (id: string) => DocumentoEscolar | undefined
}

export const useDocumentWallet = (): UseDocumentWalletReturn => {
  const [documents, setDocuments] = useState<DocumentoEscolar[]>([])
  const [allDocuments, setAllDocuments] = useState<DocumentoEscolar[]>([])
  const [stats, setStats] = useState<DocumentStats>({
    total: 0,
    emitidosHoje: 0,
    emitidosEstaSemana: 0,
    emitidosEsteMes: 0,
    porTipo: {
      declaracao_transferencia: 0,
      historico_escolar: 0,
      certificado_conclusao: 0,
      declaracao_matricula: 0,
      atestado_frequencia: 0
    },
    porStatus: {
      emitido: 0,
      validado: 0,
      revogado: 0,
      expirado: 0,
      rascunho: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'name' | 'type'>('recent')
  const [filterType, setFilterType] = useState('')

  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const db = DatabaseService.getInstance()
      const allDocs = await db.getAllDocuments()

      // Sort documents based on current sort preference
      const sortedDocs = sortDocuments(allDocs, sortBy)
      setAllDocuments(sortedDocs)

      // Apply initial filters
      const filteredDocs = applyFilters(sortedDocs, searchQuery, filterType)
      setDocuments(filteredDocs)

      // Calculate stats
      const newStats = calculateStats(allDocs)
      setStats(newStats)

    } catch (error) {
      console.error('Error loading documents:', error)
      setError('Erro ao carregar documentos da carteira')
    } finally {
      setIsLoading(false)
    }
  }, [sortBy])

  const sortDocuments = (docs: DocumentoEscolar[], sortType: string): DocumentoEscolar[] => {
    const sorted = [...docs]

    switch (sortType) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime())
      case 'name':
        return sorted.sort((a, b) => a.estudante.nomeCompleto.localeCompare(b.estudante.nomeCompleto))
      case 'type':
        return sorted.sort((a, b) => a.tipo.localeCompare(b.tipo))
      default:
        return sorted
    }
  }

  const applyFilters = (docs: DocumentoEscolar[], query: string, type: string): DocumentoEscolar[] => {
    let filtered = docs

    // Apply search filter
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter(doc =>
        doc.estudante.nomeCompleto.toLowerCase().includes(lowercaseQuery) ||
        doc.numeroDocumento.toLowerCase().includes(lowercaseQuery) ||
        doc.escolaOrigem.toLowerCase().includes(lowercaseQuery) ||
        doc.tipo.toLowerCase().includes(lowercaseQuery)
      )
    }

    // Apply type filter
    if (type) {
      filtered = filtered.filter(doc => doc.tipo === type)
    }

    return filtered
  }

  const calculateStats = (docs: DocumentoEscolar[]): DocumentStats => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const porTipo = docs.reduce((acc, doc) => {
      acc[doc.tipo as keyof typeof acc] = (acc[doc.tipo as keyof typeof acc] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const porStatus = docs.reduce((acc, doc) => {
      acc[doc.status as keyof typeof acc] = (acc[doc.status as keyof typeof acc] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: docs.length,
      emitidosHoje: docs.filter(doc => new Date(doc.dataEmissao) >= today).length,
      emitidosEstaSemana: docs.filter(doc => new Date(doc.dataEmissao) >= weekAgo).length,
      emitidosEsteMes: docs.filter(doc => new Date(doc.dataEmissao) >= monthAgo).length,
      porTipo: {
        declaracao_transferencia: porTipo.declaracao_transferencia || 0,
        historico_escolar: porTipo.historico_escolar || 0,
        certificado_conclusao: porTipo.certificado_conclusao || 0,
        declaracao_matricula: porTipo.declaracao_matricula || 0,
        atestado_frequencia: porTipo.atestado_frequencia || 0
      },
      porStatus: {
        emitido: porStatus.emitido || 0,
        validado: porStatus.validado || 0,
        revogado: porStatus.revogado || 0,
        expirado: porStatus.expirado || 0,
        rascunho: porStatus.rascunho || 0
      }
    }
  }

  // Apply filters whenever search or filter changes
  useEffect(() => {
    const filtered = applyFilters(allDocuments, searchQuery, filterType)
    const sorted = sortDocuments(filtered, sortBy)
    setDocuments(sorted)
  }, [searchQuery, filterType, sortBy, allDocuments])

  // Load documents on mount
  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const deleteDocument = async (documentId: string): Promise<boolean> => {
    try {
      const db = DatabaseService.getInstance()

      // Log deletion for audit
      await db.addAuditEvent({
        action: 'document_deleted',
        resource: 'document',
        resourceId: documentId,
        deviceId: '', // Will come from auth context
        userAgent: navigator.userAgent,
        success: true,
        metadata: JSON.stringify({ documentId })
      })

      await db.deleteDocument(documentId)

      // Refresh wallet
      await loadDocuments()

      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      setError('Erro ao eliminar documento')
      return false
    }
  }

  const shareDocument = async (documentId: string): Promise<void> => {
    try {
      const document = getDocumentById(documentId)
      if (!document) {
        throw new Error('Documento não encontrado')
      }

      // Check if Web Share API is available
      if (navigator.share) {
        const shareData = {
          title: `Documento YISA - ${document.tipo.replace('_', ' ').toUpperCase()}`,
          text: `Documento de ${document.estudante.nomeCompleto} - ${document.numeroDocumento}`,
          url: `${window.location.origin}/verificar/${documentId}`
        }

        await navigator.share(shareData)
      } else {
        // Fallback to copying URL to clipboard
        const shareUrl = `${window.location.origin}/verificar/${documentId}`
        await navigator.clipboard.writeText(shareUrl)

        // Show success message
        alert('Link de partilha copiado para a área de transferência!')
      }

      // Log sharing for audit
      const db = DatabaseService.getInstance()
      await db.addAuditEvent({
        action: 'document_shared',
        resource: 'document',
        resourceId: documentId,
        deviceId: '', // Will come from auth context
        userAgent: navigator.userAgent,
        success: true,
        metadata: JSON.stringify({ shareMethod: navigator.share ? 'web_share' : 'clipboard' })
      })

    } catch (error) {
      console.error('Error sharing document:', error)
      setError('Erro ao partilhar documento')
    }
  }

  const downloadDocument = async (documentId: string): Promise<void> => {
    try {
      const document = getDocumentById(documentId)
      if (!document || !document.pdfBase64) {
        throw new Error('PDF não encontrado para este documento')
      }

      // Convert base64 to blob
      const byteCharacters = atob(document.pdfBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `YISA-${document.numeroDocumento}.pdf`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup
      URL.revokeObjectURL(url)

      // Log download for audit
      const db = DatabaseService.getInstance()
      await db.addAuditEvent({
        action: 'document_downloaded',
        resource: 'document',
        resourceId: documentId,
        deviceId: '', // Will come from auth context
        userAgent: navigator.userAgent,
        success: true,
        metadata: JSON.stringify({ filename: `YISA-${document.numeroDocumento}.pdf` })
      })

    } catch (error) {
      console.error('Error downloading document:', error)
      setError('Erro ao baixar documento')
    }
  }

  const getDocumentById = (id: string): DocumentoEscolar | undefined => {
    return allDocuments.find(doc => doc.id === id)
  }

  const refreshWallet = async (): Promise<void> => {
    await loadDocuments()
  }

  return {
    documents,
    stats,
    isLoading,
    error,
    searchQuery,
    sortBy,
    filterType,
    loadDocuments,
    deleteDocument,
    shareDocument,
    downloadDocument,
    setSearchQuery,
    setSortBy,
    setFilterType,
    refreshWallet,
    getDocumentById
  }
}