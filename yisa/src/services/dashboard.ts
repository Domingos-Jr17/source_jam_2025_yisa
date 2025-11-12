import type { DocumentoEscolar, AuditEvent } from '../types'
import { DatabaseService } from './database'

export interface DashboardStats {
  totalDocuments: number
  documentsThisMonth: number
  documentsThisWeek: number
  documentsToday: number
  documentsByType: Record<string, number>
  documentsByStatus: Record<string, number>
  recentActivity: ActivityEvent[]
  topSchools: SchoolStats[]
  sharingStats: SharingStats
  verificationStats: VerificationStats
}

export interface ActivityEvent {
  id: string
  type: 'document_created' | 'document_shared' | 'document_verified' | 'document_downloaded'
  timestamp: Date
  documentId: string
  documentType: string
  studentName: string
  description: string
  metadata?: Record<string, any>
}

export interface SchoolStats {
  schoolName: string
  documentCount: number
  lastActivity: Date
  mostCommonType: string
}

export interface SharingStats {
  totalShares: number
  sharesByMethod: Record<string, number>
  sharesThisWeek: number
  mostSharedDocument: string
}

export interface VerificationStats {
  totalVerifications: number
  successfulVerifications: number
  failedVerifications: number
  verificationsThisWeek: number
  averageVerificationTime: number
}

export interface TimeRangeFilter {
  start: Date
  end: Date
  label: string
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string[]
  borderColor?: string
  borderWidth?: number
}

export class DashboardService {
  private static instance: DashboardService

  private constructor() {}

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService()
    }
    return DashboardService.instance
  }

  /**
   * Get comprehensive dashboard statistics
   */
  async getDashboardStats(timeRange?: TimeRangeFilter): Promise<DashboardStats> {
    const db = DatabaseService.getInstance()

    const now = new Date()
    const defaultTimeRange: TimeRangeFilter = {
      start: new Date(now.getFullYear(), 0, 1), // Start of year
      end: now,
      label: 'Este Ano'
    }

    const range = timeRange || defaultTimeRange

    try {
      const [documents, auditEvents] = await Promise.all([
        db.getAllDocuments(),
        db.getAuditEvents()
      ])

      // Filter documents by time range
      const filteredDocuments = this.filterDocumentsByTimeRange(documents, range)

      // Calculate basic stats
      const stats = await this.calculateBasicStats(filteredDocuments)

      // Calculate activity events
      const recentActivity = this.processActivityEvents(auditEvents, range)

      // Calculate school statistics
      const topSchools = this.calculateSchoolStats(filteredDocuments)

      // Calculate sharing statistics
      const sharingStats = this.calculateSharingStats(auditEvents, range)

      // Calculate verification statistics
      const verificationStats = this.calculateVerificationStats(auditEvents, range)

      return {
        ...stats,
        recentActivity,
        topSchools,
        sharingStats,
        verificationStats
      }

    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      throw new Error('Erro ao carregar estatísticas do dashboard')
    }
  }

  /**
   * Get documents emission chart data
   */
  async getEmissionChartData(timeRange: TimeRangeFilter): Promise<ChartData> {
    const db = DatabaseService.getInstance()
    const documents = await db.getAllDocuments()
    const filteredDocuments = this.filterDocumentsByTimeRange(documents, timeRange)

    // Group by month
    const monthlyData = this.groupDocumentsByMonth(filteredDocuments, timeRange)

    return {
      labels: monthlyData.labels,
      datasets: [
        {
          label: 'Documentos Emitidos',
          data: monthlyData.data,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2
        }
      ]
    }
  }

  /**
   * Get document type distribution chart data
   */
  async getDocumentTypeChart(): Promise<ChartData> {
    const db = DatabaseService.getInstance()
    const documents = await db.getAllDocuments()

    const typeDistribution = this.calculateDocumentTypeDistribution(documents)

    return {
      labels: typeDistribution.labels,
      datasets: [
        {
          label: 'Distribuição por Tipo',
          data: typeDistribution.data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderWidth: 2
        }
      ]
    }
  }

  /**
   * Get sharing trends chart data
   */
  async getSharingTrendsData(timeRange: TimeRangeFilter): Promise<ChartData> {
    const db = DatabaseService.getInstance()
    const auditEvents = await db.getAuditEvents()

    const sharingEvents = auditEvents.filter(event =>
      event.action === 'document_shared' &&
      new Date(event.timestamp) >= timeRange.start &&
      new Date(event.timestamp) <= timeRange.end
    )

    const weeklyData = this.groupEventsByWeek(sharingEvents, timeRange)

    return {
      labels: weeklyData.labels,
      datasets: [
        {
          label: 'Partilhas por Semana',
          data: weeklyData.data,
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2
        }
      ]
    }
  }

  /**
   * Calculate basic document statistics
   */
  private async calculateBasicStats(documents: DocumentoEscolar[]) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const documentsByType = documents.reduce((acc, doc) => {
      acc[doc.tipo] = (acc[doc.tipo] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const documentsByStatus = documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalDocuments: documents.length,
      documentsToday: documents.filter(doc => new Date(doc.criadoEm) >= today).length,
      documentsThisWeek: documents.filter(doc => new Date(doc.criadoEm) >= weekAgo).length,
      documentsThisMonth: documents.filter(doc => new Date(doc.criadoEm) >= monthAgo).length,
      documentsByType,
      documentsByStatus
    }
  }

  /**
   * Process activity events from audit logs
   */
  private processActivityEvents(auditEvents: AuditEvent[], timeRange: TimeRangeFilter): ActivityEvent[] {
    const events = auditEvents
      .filter(event => {
        const eventDate = new Date(event.timestamp)
        return eventDate >= timeRange.start && eventDate <= timeRange.end
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20) // Last 20 events

    return events.map(event => {
      let type: ActivityEvent['type']
      let description = ''

      switch (event.action) {
        case 'document_created':
          type = 'document_created'
          description = 'Documento criado'
          break
        case 'document_shared':
          type = 'document_shared'
          description = 'Documento partilhado'
          break
        case 'document_verified':
          type = 'document_verified'
          description = 'Documento verificado'
          break
        case 'document_downloaded':
          type = 'document_downloaded'
          description = 'Documento descarregado'
          break
        default:
          type = 'document_created'
          description = 'Operação registrada'
      }

      return {
        id: event.id,
        type,
        timestamp: new Date(event.timestamp),
        documentId: event.resourceId,
        documentType: this.extractDocumentType(event.metadata),
        studentName: this.extractStudentName(event.metadata),
        description,
        metadata: event.metadata ? JSON.parse(event.metadata) : undefined
      }
    })
  }

  /**
   * Calculate school statistics
   */
  private calculateSchoolStats(documents: DocumentoEscolar[]): SchoolStats[] {
    const schoolMap = new Map<string, SchoolStats>()

    documents.forEach(doc => {
      const existing = schoolMap.get(doc.escolaOrigem) || {
        schoolName: doc.escolaOrigem,
        documentCount: 0,
        lastActivity: new Date(0),
        mostCommonType: ''
      }

      existing.documentCount++
      existing.lastActivity = new Date(Math.max(
        existing.lastActivity.getTime(),
        new Date(doc.criadoEm).getTime()
      ))

      // Update most common type
      const typeCounts = documents
        .filter(d => d.escolaOrigem === doc.escolaOrigem)
        .reduce((acc, d) => {
          acc[d.tipo] = (acc[d.tipo] || 0) + 1
          return acc
        }, {} as Record<string, number>)

      existing.mostCommonType = Object.entries(typeCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || ''

      schoolMap.set(doc.escolaOrigem, existing)
    })

    return Array.from(schoolMap.values())
      .sort((a, b) => b.documentCount - a.documentCount)
      .slice(0, 10) // Top 10 schools
  }

  /**
   * Calculate sharing statistics
   */
  private calculateSharingStats(auditEvents: AuditEvent[], timeRange: TimeRangeFilter): SharingStats {
    const sharingEvents = auditEvents.filter(event => {
      const eventDate = new Date(event.timestamp)
      return event.action === 'document_shared' &&
             eventDate >= timeRange.start &&
             eventDate <= timeRange.end
    })

    const sharesByMethod = sharingEvents.reduce((acc, event) => {
      const method = this.extractShareMethod(event.metadata)
      acc[method] = (acc[method] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const sharesThisWeek = sharingEvents.filter(event =>
      new Date(event.timestamp) >= weekAgo
    ).length

    const mostSharedDocument = this.getMostSharedDocument(sharingEvents)

    return {
      totalShares: sharingEvents.length,
      sharesByMethod,
      sharesThisWeek,
      mostSharedDocument
    }
  }

  /**
   * Calculate verification statistics
   */
  private calculateVerificationStats(auditEvents: AuditEvent[], timeRange: TimeRangeFilter): VerificationStats {
    const verificationEvents = auditEvents.filter(event => {
      const eventDate = new Date(event.timestamp)
      return event.action === 'document_verified' &&
             eventDate >= timeRange.start &&
             eventDate <= timeRange.end
    })

    const successfulVerifications = verificationEvents.filter(event => event.success).length
    const failedVerifications = verificationEvents.length - successfulVerifications

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const verificationsThisWeek = verificationEvents.filter(event =>
      new Date(event.timestamp) >= weekAgo
    ).length

    return {
      totalVerifications: verificationEvents.length,
      successfulVerifications,
      failedVerifications,
      verificationsThisWeek,
      averageVerificationTime: 2.5 // Placeholder - would need timing data
    }
  }

  /**
   * Helper methods
   */
  private filterDocumentsByTimeRange(documents: DocumentoEscolar[], timeRange: TimeRangeFilter): DocumentoEscolar[] {
    return documents.filter(doc => {
      const docDate = new Date(doc.criadoEm)
      return docDate >= timeRange.start && docDate <= timeRange.end
    })
  }

  private groupDocumentsByMonth(documents: DocumentoEscolar[], timeRange: TimeRangeFilter) {
    const monthlyMap = new Map<string, number>()
    const labels: string[] = []

    // Generate all months in range
    const current = new Date(timeRange.start)
    while (current <= timeRange.end) {
      const monthKey = current.toLocaleDateString('pt-MZ', { month: 'short', year: 'numeric' })
      labels.push(monthKey)
      monthlyMap.set(monthKey, 0)
      current.setMonth(current.getMonth() + 1)
    }

    // Count documents by month
    documents.forEach(doc => {
      const monthKey = new Date(doc.criadoEm).toLocaleDateString('pt-MZ', { month: 'short', year: 'numeric' })
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1)
    })

    return {
      labels,
      data: labels.map(label => monthlyMap.get(label) || 0)
    }
  }

  private calculateDocumentTypeDistribution(documents: DocumentoEscolar[]) {
    const typeMap = new Map<string, number>()

    documents.forEach(doc => {
      const typeLabel = this.getDocumentTypeLabel(doc.tipo)
      typeMap.set(typeLabel, (typeMap.get(typeLabel) || 0) + 1)
    })

    return {
      labels: Array.from(typeMap.keys()),
      data: Array.from(typeMap.values())
    }
  }

  private groupEventsByWeek(events: AuditEvent[], timeRange: TimeRangeFilter) {
    const weeklyMap = new Map<string, number>()
    const labels: string[] = []

    // Generate weeks in range
    const current = new Date(timeRange.start)
    let weekNumber = 1
    while (current <= timeRange.end) {
      const weekKey = `Semana ${weekNumber}`
      labels.push(weekKey)
      weeklyMap.set(weekKey, 0)
      current.setDate(current.getDate() + 7)
      weekNumber++
    }

    // Count events by week
    events.forEach(event => {
      const weekIndex = Math.floor((new Date(event.timestamp).getTime() - timeRange.start.getTime()) / (7 * 24 * 60 * 60 * 1000))
      const weekKey = `Semana ${weekIndex + 1}`
      weeklyMap.set(weekKey, (weeklyMap.get(weekKey) || 0) + 1)
    })

    return {
      labels,
      data: labels.map(label => weeklyMap.get(label) || 0)
    }
  }

  private extractDocumentType(metadata?: string): string {
    if (!metadata) return ''
    try {
      const parsed = JSON.parse(metadata)
      return parsed.documentType || parsed.tipo || ''
    } catch {
      return ''
    }
  }

  private extractStudentName(metadata?: string): string {
    if (!metadata) return ''
    try {
      const parsed = JSON.parse(metadata)
      return parsed.studentName || parsed.nomeCompleto || ''
    } catch {
      return ''
    }
  }

  private extractShareMethod(metadata?: string): string {
    if (!metadata) return 'unknown'
    try {
      const parsed = JSON.parse(metadata)
      return parsed.shareMethod || 'web_share'
    } catch {
      return 'web_share'
    }
  }

  private getMostSharedDocument(sharingEvents: AuditEvent[]): string {
    const docCounts = new Map<string, number>()

    sharingEvents.forEach(event => {
      docCounts.set(event.resourceId, (docCounts.get(event.resourceId) || 0) + 1)
    })

    const mostShared = Array.from(docCounts.entries())
      .sort(([,a], [,b]) => b - a)[0]

    return mostShared ? `Documento #${mostShared[0].slice(-8)}` : 'Nenhum'
  }

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
   * Get available time range filters
   */
  getTimeRangeFilters(): TimeRangeFilter[] {
    const now = new Date()

    return [
      {
        start: new Date(now.getFullYear(), 0, 1), // Start of current year
        end: now,
        label: 'Este Ano'
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), 1), // Start of current month
        end: now,
        label: 'Este Mês'
      },
      {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        end: now,
        label: 'Últimos 30 Dias'
      },
      {
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        end: now,
        label: 'Últimos 7 Dias'
      },
      {
        start: new Date(now.setHours(0, 0, 0, 0)), // Today
        end: new Date(),
        label: 'Hoje'
      }
    ]
  }
}