import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ShareIcon,
  EyeIcon,
  BuildingOfficeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useDashboard } from '../hooks/useDashboard'
import StatCard from '../components/dashboard/StatCard'
import ActivityTimeline from '../components/dashboard/ActivityTimeline'
import TopSchools from '../components/dashboard/TopSchools'

const HistoricoPage: React.FC = () => {
  const {
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
  } = useDashboard()

  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportData()
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-MZ').format(num)
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=\"min-h-screen bg-gray-50 flex items-center justify-center\"
      >
        <div className=\"text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200\">
          <ChartBarIcon className=\"w-16 h-16 text-red-500 mx-auto mb-4\" />
          <h2 className=\"text-xl font-semibold text-gray-900 mb-2\">Erro ao Carregar Dashboard</h2>
          <p className=\"text-gray-600 mb-6\">{error}</p>
          <button
            onClick={refreshDashboard}
            className=\"btn-primary\"
          >
            <ArrowPathIcon className=\"w-4 h-4 mr-2\" />
            Tentar Novamente
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className=\"min-h-screen bg-gray-50\"
    >
      {/* Header */}
      <div className=\"mb-8\">
        <div className=\"flex items-center justify-between mb-4\">
          <div>
            <h1 className=\"text-3xl font-bold text-gray-900 mb-2\">
              Dashboard & Histórico
            </h1>
            <p className=\"text-gray-600\">
              Visão geral completa das operações e estatísticas do sistema YISA
            </p>
          </div>
          <div className=\"flex items-center space-x-3\">
            {/* Time Range Selector */}
            <div className=\"flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1\">
              <FunnelIcon className=\"w-4 h-4 text-gray-500 ml-2\" />
              {availableTimeRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeRange.label === range.label
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <button
              onClick={refreshDashboard}
              disabled={isLoading}
              className=\"btn-ghost\"
              title=\"Atualizar\"
            >
              <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting || !stats}
              className=\"btn-outline\"
              title=\"Exportar dados\"
            >
              <ArrowDownTrayIcon className={`w-5 h-5 ${isExporting ? 'animate-pulse' : ''}`} />
              {isExporting ? 'A exportar...' : 'Exportar'}
            </button>
          </div>
        </div>

        {/* Last Updated */}
        <div className=\"flex items-center text-sm text-gray-500\">
          <ClockIcon className=\"w-4 h-4 mr-1\" />
          Última atualização: {new Date().toLocaleString('pt-MZ')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8\">
        <StatCard
          title=\"Documentos Totais\"
          value={stats?.totalDocuments || 0}
          icon={<DocumentTextIcon className=\"w-6 h-6\" />}
          color=\"blue\"
          loading={isLoading}
          subtitle={`Este ${timeRange.label.toLowerCase()}`}
        />

        <StatCard
          title=\"Emitidos Hoje\"
          value={stats?.documentsToday || 0}
          change={stats?.documentsToday ? getPercentageChange(stats.documentsToday, stats.documentsThisWeek / 7) : 0}
          changeType={stats?.documentsToday > 0 ? 'increase' : 'neutral'}
          icon={<CalendarIcon className=\"w-6 h-6\" />}
          color=\"green\"
          loading={isLoading}
        />

        <StatCard
          title=\"Partilhas Esta Semana\"
          value={stats?.sharingStats.sharesThisWeek || 0}
          change={stats?.sharingStats.totalShares ? getPercentageChange(stats.sharingStats.sharesThisWeek, stats.sharingStats.totalShares / 4) : 0}
          changeType={stats?.sharingStats.sharesThisWeek > 0 ? 'increase' : 'neutral'}
          icon={<ShareIcon className=\"w-6 h-6\" />}
          color=\"purple\"
          loading={isLoading}
        />

        <StatCard
          title=\"Verificações\"
          value={stats?.verificationStats.totalVerifications || 0}
          change={stats?.verificationStats.successfulVerifications ?
            getPercentageChange(stats.verificationStats.successfulVerifications, stats.verificationStats.totalVerifications) : 0}
          changeType={stats?.verificationStats.successfulVerifications > 0 ? 'increase' : 'neutral'}
          icon={<EyeIcon className=\"w-6 h-6\" />}
          color=\"yellow\"
          loading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8\">
        {/* Activity Timeline - 2 columns */}
        <div className=\"lg:col-span-2\">
          <ActivityTimeline
            activities={stats?.recentActivity || []}
            loading={isLoading}
          />
        </div>

        {/* Top Schools - 1 column */}
        <div>
          <TopSchools
            schools={stats?.topSchools || []}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8\">
        {/* Document Type Distribution */}
        <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Distribuição por Tipo</h3>
          {isLoading ? (
            <div className=\"animate-pulse space-y-4\">
              <div className=\"h-64 bg-gray-200 rounded\"></div>
            </div>
          ) : (
            <div className=\"space-y-4\">
              {Object.entries(stats?.documentsByType || {}).map(([type, count]) => (
                <div key={type} className=\"flex items-center justify-between\">
                  <div className=\"flex-1\">
                    <div className=\"flex items-center justify-between mb-2\">
                      <span className=\"text-sm font-medium text-gray-700 capitalize\">
                        {type.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                      </span>
                      <span className=\"text-sm font-semibold text-gray-900\">{formatNumber(count)}</span>
                    </div>
                    <div className=\"w-full bg-gray-200 rounded-full h-2\">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / (stats?.totalDocuments || 1)) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className=\"h-2 bg-blue-500 rounded-full\"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Status dos Documentos</h3>
          {isLoading ? (
            <div className=\"animate-pulse space-y-4\">
              <div className=\"h-64 bg-gray-200 rounded\"></div>
            </div>
          ) : (
            <div className=\"space-y-4\">
              {Object.entries(stats?.documentsByStatus || {}).map(([status, count]) => (
                <div key={status} className=\"flex items-center justify-between\">
                  <div className=\"flex-1\">
                    <div className=\"flex items-center justify-between mb-2\">
                      <span className=\"text-sm font-medium text-gray-700 capitalize\">
                        {status.replace(/_/g, ' ')}
                      </span>
                      <span className=\"text-sm font-semibold text-gray-900\">{formatNumber(count)}</span>
                    </div>
                    <div className=\"w-full bg-gray-200 rounded-full h-2\">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / (stats?.totalDocuments || 1)) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-2 rounded-full ${
                          status === 'emitido' ? 'bg-green-500' :
                          status === 'validado' ? 'bg-blue-500' :
                          status === 'revogado' ? 'bg-red-500' :
                          status === 'expirado' ? 'bg-gray-500' :
                          'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
          <div className=\"flex items-center mb-4\">
            <ShareIcon className=\"w-5 h-5 text-green-600 mr-2\" />
            <h3 className=\"font-semibold text-gray-900\">Estatísticas de Partilha</h3>
          </div>
          <div className=\"space-y-3 text-sm\">
            <div className=\"flex justify-between\">
              <span className=\"text-gray-600\">Total de Partilhas:</span>
              <span className=\"font-medium\">{formatNumber(stats?.sharingStats.totalShares || 0)}</span>
            </div>
            <div className=\"flex justify-between\">
              <span className=\"text-gray-600\">Esta Semana:</span>
              <span className=\"font-medium\">{formatNumber(stats?.sharingStats.sharesThisWeek || 0)}</span>
            </div>
            <div className=\"flex justify-between\">
              <span className=\"text-gray-600\">Método Mais Usado:</span>
              <span className=\"font-medium\">WhatsApp</span>
            </div>
          </div>
        </div>

        <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
          <div className=\"flex items-center mb-4\">
            <EyeIcon className=\"w-5 h-5 text-blue-600 mr-2\" />
            <h3 className=\"font-semibold text-gray-900\">Estatísticas de Verificação</h3>
          </div>
          <div className=\"space-y-3 text-sm\">
            <div className=\"flex justify-between\">
              <span className=\"text-gray-600\">Total de Verificações:</span>
              <span className=\"font-medium\">{formatNumber(stats?.verificationStats.totalVerifications || 0)}</span>
            </div>
            <div className=\"flex justify-between\">
              <span className=\"text-gray-600\">Taxa de Sucesso:</span>
              <span className=\"font-medium text-green-600\">{
                stats?.verificationStats.totalVerifications ?
                Math.round((stats.verificationStats.successfulVerifications / stats.verificationStats.totalVerifications) * 100) : 0
              }%</span>
            </div>
            <div className=\"flex justify-between\">
              <span className=\"text-gray-600\">Tempo Médio:</span>
              <span className=\"font-medium\">2.5s</span>
            </div>
          </div>
        </div>

        <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
          <div className=\"flex items-center mb-4\">
            <BuildingOfficeIcon className=\"w-5 h-5 text-purple-600 mr-2\" />
            <h3 className=\"font-semibold text-gray-900\">Escolas Activas</h3>
          </div>
          <div className=\"space-y-3 text-sm\">
            <div className=\"flex justify-between\">
              <span className=\"text-gray-600\">Total de Escolas:</span>
              <span className=\"font-medium\">{formatNumber(stats?.topSchools.length || 0)}</span>
            </div>
            <div className=\"flex justify-between\">
              <span className=\"text-gray-600\">Média por Escola:</span>
              <span className=\"font-medium\">{
                stats?.topSchools.length ?
                Math.round(stats.totalDocuments / stats.topSchools.length) : 0
              }</span>
            </div>
            <div className=\"flex justify-between\">
              <span className=\"text-gray-600\">Escola Mais Ativa:</span>
              <span className=\"font-medium truncate ml-2\">{
                stats?.topSchools[0]?.schoolName || 'N/A'
              }</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HistoricoPage