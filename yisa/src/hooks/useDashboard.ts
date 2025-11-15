import { useState, useEffect, useCallback } from 'react'
import type { DashboardStats, TimeRangeFilter, ChartData, ActivityEvent, SchoolStats } from '../services/dashboard'
import { DashboardService } from '../services/dashboard'

interface UseDashboardReturn {
  stats: DashboardStats | null
  emissionChartData: ChartData | null
  documentTypeChart: ChartData | null
  sharingTrendsChart: ChartData | null
  isLoading: boolean
  error: string | null
  timeRange: TimeRangeFilter
  setTimeRange: (range: TimeRangeFilter) => void
  availableTimeRanges: TimeRangeFilter[]
  refreshDashboard: () => Promise<void>
  exportData: () => Promise<void>
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [emissionChartData, setEmissionChartData] = useState<ChartData | null>(null)
  const [documentTypeChart, setDocumentTypeChart] = useState<ChartData | null>(null)
  const [sharingTrendsChart, setSharingTrendsChart] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>(() => {
    const dashboardService = DashboardService.getInstance()
    const filters = dashboardService.getTimeRangeFilters()
    return filters[0] // Default to "Este Ano"
  })

  const dashboardService = DashboardService.getInstance()

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load all dashboard data in parallel
      const [
        dashboardStats,
        emissionData,
        documentTypeData,
        sharingData
      ] = await Promise.all([
        dashboardService.getDashboardStats(timeRange),
        dashboardService.getEmissionChartData(timeRange),
        dashboardService.getDocumentTypeChart(),
        dashboardService.getSharingTrendsData(timeRange)
      ])

      setStats(dashboardStats)
      setEmissionChartData(emissionData)
      setDocumentTypeChart(documentTypeData)
      setSharingTrendsChart(sharingData)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError(error instanceof Error ? error.message : 'Erro ao carregar dados do dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [timeRange, dashboardService])

  const refreshDashboard = useCallback(async () => {
    await loadDashboardData()
  }, [loadDashboardData])

  const exportData = useCallback(async () => {
    try {
      if (!stats) {
        throw new Error('Sem dados para exportar')
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        timeRange: timeRange.label,
        statistics: {
          totalDocuments: stats.totalDocuments,
          documentsThisMonth: stats.documentsThisMonth,
          documentsThisWeek: stats.documentsThisWeek,
          documentsToday: stats.documentsToday
        },
        documentsByType: stats.documentsByType,
        documentsByStatus: stats.documentsByStatus,
        topSchools: stats.topSchools.map(school => ({
          schoolName: school.schoolName,
          documentCount: school.documentCount,
          mostCommonType: school.mostCommonType
        })),
        sharingStats: stats.sharingStats,
        verificationStats: stats.verificationStats,
        recentActivity: stats.recentActivity.slice(0, 10).map(activity => ({
          type: activity.type,
          timestamp: activity.timestamp,
          documentType: activity.documentType,
          studentName: activity.studentName,
          description: activity.description
        }))
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `yisa-dashboard-export-${new Date().toISOString().split('T')[0]}.json`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      // Log export event
      const { DatabaseService } = await import('../services/database')
      const db = DatabaseService.getInstance()
      await db.addAuditEvent({
        action: 'dashboard_exported',
        resource: 'dashboard',
        resourceId: 'dashboard',
        deviceId: '',
        userAgent: navigator.userAgent,
        success: true,
        metadata: JSON.stringify({
          exportFormat: 'json',
          timeRange: timeRange.label,
          recordCount: Object.keys(exportData).length
        })
      })

    } catch (error) {
      console.error('Error exporting dashboard data:', error)
      throw error
    }
  }, [stats, timeRange])

  // Load data when time range changes
  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // Set up auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [loadDashboardData])

  const availableTimeRanges = dashboardService.getTimeRangeFilters()

  return {
    stats,
    emissionChartData,
    documentTypeChart,
    sharingTrendsChart,
    isLoading,
    error,
    timeRange,
    setTimeRange,
    availableTimeRanges,
    refreshDashboard,
    exportData
  }
}