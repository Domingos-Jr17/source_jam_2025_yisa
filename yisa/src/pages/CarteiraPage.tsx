import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  WalletIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CloudIcon
} from '@heroicons/react/24/outline'
import { useDocumentWallet } from '../hooks/useDocumentWallet'
import DocumentCard from '../components/DocumentCard'
import type { DocumentoEscolar } from '../types'

const CarteiraPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const {
    documents,
    stats,
    isLoading,
    error,
    searchQuery,
    sortBy,
    filterType,
    setSearchQuery,
    setSortBy,
    setFilterType,
    deleteDocument,
    shareDocument,
    downloadDocument,
    refreshWallet
  } = useDocumentWallet()

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 5000)
    }
  }, [location.state])

  const handleViewDocument = (documentId: string) => {
    navigate(`/documento/${documentId}`)
  }

  const documentTypes = [
    { value: '', label: 'Todos os Tipos' },
    { value: 'declaracao_transferencia', label: 'Declaração de Transferência' },
    { value: 'historico_escolar', label: 'Histórico Escolar' },
    { value: 'certificado_conclusao', label: 'Certificado de Conclusão' },
    { value: 'declaracao_matricula', label: 'Declaração de Matrícula' },
    { value: 'atestado_frequencia', label: 'Atestado de Frequência' }
  ]

  const sortOptions = [
    { value: 'recent', label: 'Mais Recentes' },
    { value: 'oldest', label: 'Mais Antigos' },
    { value: 'name', label: 'Nome do Estudante' },
    { value: 'type', label: 'Tipo de Documento' }
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Minha Carteira Digital
        </h1>
        <p className="text-gray-600">
          Acesse, gerencie e partilhe todos os seus documentos escolares de forma segura e offline
        </p>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 alert alert-success"
          >
            <ShieldCheckIcon className="w-5 h-5" />
            <span>{location.state?.message || 'Operação concluída com sucesso!'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Documentos Totais</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-green-600">{stats.emitidosHoje}</p>
              <p className="text-sm text-gray-600">Emitidos Hoje</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <WalletIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-blue-600">{stats.emitidosEstaSemana}</p>
              <p className="text-sm text-gray-600">Esta Semana</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CloudIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-purple-600">{stats.emitidosEsteMes}</p>
              <p className="text-sm text-gray-600">Este Mês</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">Filtrar e Procurar</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Procurar documentos..."
              value={searchQuery}
              onChange={handleSearch}
              className="form-input pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-input pl-10 appearance-none"
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="form-input pl-10 appearance-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="btn-outline"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              {viewMode === 'grid' ? 'Lista' : 'Grade'}
            </button>
            <button
              onClick={refreshWallet}
              className="btn-ghost"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar documentos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card">
          <div className="alert alert-error">
            <p>{error}</p>
            <button onClick={refreshWallet} className="btn-primary mt-4">
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Documents Grid/List */}
      {!isLoading && !error && (
        <>
          {documents.length === 0 ? (
            <div className="card">
              <div className="text-center py-12">
                <WalletIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum Documento Encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Você ainda não possui documentos na sua carteira digital.
                </p>
                <button
                  onClick={() => navigate('/emitir')}
                  className="btn-primary"
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Emitir Primeiro Documento
                </button>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              <AnimatePresence>
                {documents.map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <DocumentCard
                      document={document}
                      onDelete={deleteDocument}
                      onShare={shareDocument}
                      onDownload={downloadDocument}
                      onView={handleViewDocument}
                      compact={viewMode === 'list'}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Security Info */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <ShieldCheckIcon className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Segurança da Sua Carteira</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Todos os documentos são armazenados com criptografia AES-256</li>
              <li>• Acesso restrito por PIN biométrico de 6 dígitos</li>
              <li>• Sincronização automática quando online</li>
              <li>• Backup automático local criptografado</li>
              <li>• Auditoria completa de todas as operações</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CarteiraPage