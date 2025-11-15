import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DocumentTextIcon,
  ShareIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import type { ActivityEvent } from '../../services/dashboard'

interface ActivityTimelineProps {
  activities: ActivityEvent[]
  loading?: boolean
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  loading = false
}) => {
  const getActivityIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'document_created':
        return <DocumentTextIcon className="w-4 h-4" />
      case 'document_shared':
        return <ShareIcon className="w-4 h-4" />
      case 'document_verified':
        return <EyeIcon className="w-4 h-4" />
      case 'document_downloaded':
        return <ArrowDownTrayIcon className="w-4 h-4" />
      default:
        return <DocumentTextIcon className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'document_created':
        return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'document_shared':
        return 'bg-green-100 text-green-600 border-green-200'
      case 'document_verified':
        return 'bg-purple-100 text-purple-600 border-purple-200'
      case 'document_downloaded':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `Há ${diffMins} min`
    if (diffHours < 24) return `Há ${diffHours} h`
    if (diffDays < 7) return `Há ${diffDays} d`

    return date.toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="text-center py-8">
          <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma atividade recente encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
        <span className="text-sm text-gray-500">{activities.length} atividades</span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <motion.div
              key={`${activity.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Activity Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {activity.description}
                  </h4>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  {activity.studentName && (
                    <span className="font-medium">{activity.studentName}</span>
                  )}
                  {activity.studentName && activity.documentType && ' • '}
                  {activity.documentType && (
                    <span>{activity.documentType}</span>
                  )}
                </p>

                {activity.metadata && (
                  <div className="text-xs text-gray-500 space-y-1">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-1">
                        <span className="font-medium capitalize">{key}:</span>
                        <span className="truncate">{
                          typeof value === 'object' ? JSON.stringify(value) : String(value)
                        }</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Document ID Badge */}
              {activity.documentId && (
                <div className="flex-shrink-0 ml-3">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 font-mono">
                    #{activity.documentId.slice(-8)}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Ver toda a atividade
          </button>
        </div>
      )}
    </div>
  )
}

export default ActivityTimeline