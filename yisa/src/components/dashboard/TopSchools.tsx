import React from 'react'
import { motion } from 'framer-motion'
import {
  BuildingOfficeIcon,
  TrophyIcon,
  AcademicCapIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import type { SchoolStats } from '../../services/dashboard'

interface TopSchoolsProps {
  schools: SchoolStats[]
  loading?: boolean
}

const TopSchools: React.FC<TopSchoolsProps> = ({
  schools,
  loading = false
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className=\"w-5 h-5 text-yellow-500\" />
      case 2:
        return <TrophyIcon className=\"w-5 h-5 text-gray-400\" />
      case 3:
        return <TrophyIcon className=\"w-5 h-5 text-orange-600\" />
      default:
        return <div className=\"w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-medium\">
          {rank}
        </div>
    }
  }

  const getRankBorderColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-200 bg-yellow-50'
      case 2:
        return 'border-gray-200 bg-gray-50'
      case 3:
        return 'border-orange-200 bg-orange-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `Há ${diffDays} dias`
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`

    return date.toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      declaracao_transferencia: 'Declaração de Transferência',
      historico_escolar: 'Histórico Escolar',
      certificado_conclusao: 'Certificado de Conclusão',
      declaracao_matricula: 'Declaração de Matrícula',
      atestado_frequencia: 'Atestado de Frequência'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
        <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Escolas em Destaque</h3>
        <div className=\"space-y-4\">
          {[...Array(5)].map((_, i) => (
            <div key={i} className=\"animate-pulse space-y-3\">
              <div className=\"flex items-center justify-between\">
                <div className=\"flex items-center space-x-3\">
                  <div className=\"w-8 h-8 bg-gray-200 rounded-full\"></div>
                  <div className=\"space-y-2\">
                    <div className=\"h-4 bg-gray-200 rounded w-32\"></div>
                    <div className=\"h-3 bg-gray-200 rounded w-24\"></div>
                  </div>
                </div>
                <div className=\"text-right space-y-2\">
                  <div className=\"h-4 bg-gray-200 rounded w-16\"></div>
                  <div className=\"h-3 bg-gray-200 rounded w-20\"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
        <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Escolas em Destaque</h3>
        <div className=\"text-center py-8\">
          <BuildingOfficeIcon className=\"w-12 h-12 text-gray-400 mx-auto mb-3\" />
          <p className=\"text-gray-500\">Nenhuma escola encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className=\"bg-white rounded-xl shadow-sm border border-gray-200 p-6\">
      <div className=\"flex items-center justify-between mb-4\">
        <h3 className=\"text-lg font-semibold text-gray-900\">Escolas em Destaque</h3>
        <div className=\"flex items-center text-sm text-gray-500\">
          <AcademicCapIcon className=\"w-4 h-4 mr-1\" />
          {schools.length} escolas
        </div>
      </div>

      <div className=\"space-y-3\">
        {schools.map((school, index) => (
          <motion.div
            key={school.schoolName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getRankBorderColor(index + 1)}`}
          >
            <div className=\"flex items-center justify-between\">
              {/* School Info */}
              <div className=\"flex items-center space-x-3 flex-1 min-w-0\">
                <div className=\"flex-shrink-0\">
                  {getRankIcon(index + 1)}
                </div>
                <div className=\"flex-1 min-w-0\">
                  <h4 className=\"font-medium text-gray-900 truncate\">
                    {school.schoolName}
                  </h4>
                  <div className=\"flex items-center space-x-4 text-sm text-gray-500 mt-1\">
                    <span className=\"flex items-center\">
                      <CalendarIcon className=\"w-3 h-3 mr-1\" />
                      {formatDate(school.lastActivity)}
                    </span>
                    {school.mostCommonType && (
                      <span className=\"truncate\" title={getDocumentTypeLabel(school.mostCommonType)}>
                        {getDocumentTypeLabel(school.mostCommonType)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Count */}
              <div className=\"text-right ml-4\">
                <div className=\"text-2xl font-bold text-gray-900\">
                  {school.documentCount.toLocaleString('pt-MZ')}
                </div>
                <div className=\"text-xs text-gray-500\">documentos</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className=\"mt-3\">
              <div className=\"flex items-center justify-between text-xs text-gray-500 mb-1\">
                <span>Pontuação</span>
                <span>{Math.round((school.documentCount / schools[0].documentCount) * 100)}%</span>
              </div>
              <div className=\"w-full bg-gray-200 rounded-full h-2\">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(school.documentCount / schools[0].documentCount) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {schools.length > 0 && (
        <div className=\"mt-4 pt-4 border-t border-gray-100 text-center\">
          <button className=\"text-sm text-primary-600 hover:text-primary-700 font-medium\">
            Ver todas as escolas
          </button>
        </div>
      )}
    </div>
  )
}

export default TopSchools