import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useDocumentForm } from '../hooks/useDocumentForm'
import FormInput from '../components/ui/FormInput'
import FormSelect from '../components/ui/FormSelect'
import { biMask, turmaMask, validateBI } from '../utils/masks'
import { SCHOOL_CLASSES } from '../utils/constants'

const EmitirPage: React.FC = () => {
  const {
    formData,
    errors,
    isLoading,
    validation,
    handleInputChange,
    validateForm,
    handleSubmit,
    resetForm
  } = useDocumentForm()

  const [showSuccess, setShowSuccess] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  // Real-time form validation
  useEffect(() => {
    const isValid =
      formData.nomeCompleto.trim().length >= 5 &&
      validateBI(formData.numeroBI) &&
      formData.nomeEscolaOrigem.trim().length > 0 &&
      formData.nomeEscolaDestino.trim().length > 0 &&
      formData.classe.length > 0 &&
      formData.turma.trim().length > 0

    setIsFormValid(isValid)
  }, [formData])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleSubmit()
    if (success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const classOptions = SCHOOL_CLASSES.map(cls => ({
    value: cls.value,
    label: cls.label
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Emitir Documento
        </h1>
        <p className="text-gray-600">
          Crie documentos escolares oficiais com validade digital e criptografia militar
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isFormValid ? 'bg-green-500 text-white' : 'bg-primary-600 text-white'
            }`}>
              {isFormValid ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-900">Dados do Estudante</span>
          </div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isFormValid ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              <DocumentTextIcon className="w-4 h-4" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-900">Emissão</span>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: isFormValid ? '100%' : '50%' }}
          />
        </div>
      </div>

      {/* Success notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 alert alert-success"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>Documento criado com sucesso! Redirecionando...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Student Information Section */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <UserIcon className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="card-title">Informações do Estudante</h2>
            </div>
            <p className="card-description">
              Preencha os dados pessoais do estudante
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Nome Completo"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={(value) => handleInputChange('nomeCompleto', value)}
              placeholder="Ex: João Carlos da Silva"
              required
              error={errors.nomeCompleto}
              helper="Nome completo como aparece no Bilhete de Identidade"
              maxLength={100}
            />

            <FormInput
              label="Número do Bilhete de Identidade"
              name="numeroBI"
              value={formData.numeroBI}
              onChange={(value) => handleInputChange('numeroBI', biMask(value))}
              placeholder="Ex: 123456789AB123"
              required
              error={errors.numeroBI}
              helper="Formato: 9 números + 2 letras + 3 números"
              maxLength={14}
              mask={biMask}
              className="uppercase"
            />
          </div>
        </div>

        {/* School Information Section */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <AcademicCapIcon className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="card-title">Informações Escolares</h2>
            </div>
            <p className="card-description">
              Dados sobre as escolas de origem e destino
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Escola de Origem"
                name="nomeEscolaOrigem"
                value={formData.nomeEscolaOrigem}
                onChange={(value) => handleInputChange('nomeEscolaOrigem', value)}
                placeholder="Ex: Escola Secundária da Manhiça"
                required
                error={errors.nomeEscolaOrigem}
                maxLength={100}
              />

              <FormInput
                label="Escola de Destino"
                name="nomeEscolaDestino"
                value={formData.nomeEscolaDestino}
                onChange={(value) => handleInputChange('nomeEscolaDestino', value)}
                placeholder="Ex: Escola Secundária 25 de Setembro"
                required
                error={errors.nomeEscolaDestino}
                maxLength={100}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FormSelect
                label="Classe"
                name="classe"
                value={formData.classe}
                onChange={(value) => handleInputChange('classe', value)}
                options={classOptions}
                placeholder="Selecione a classe"
                required
                error={errors.classe}
              />

              <FormInput
                label="Turma"
                name="turma"
                value={formData.turma}
                onChange={(value) => handleInputChange('turma', turmaMask(value))}
                placeholder="Ex: A, B, 12A"
                required
                error={errors.turma}
                helper="Letra ou número identificativo da turma"
                maxLength={10}
                mask={turmaMask}
                className="uppercase"
              />

              <FormInput
                label="Disciplina (opcional)"
                name="disciplina"
                value={formData.disciplina}
                onChange={(value) => handleInputChange('disciplina', value)}
                placeholder="Ex: Matemática"
                helper="Preencha apenas para transferências específicas"
                maxLength={50}
              />
            </div>
          </div>
        </div>

        {/* Form Validation Summary */}
        {validation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card ${validation.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
          >
            <div className="flex items-start">
              {validation.isValid ? (
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              ) : (
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className={`font-medium ${validation.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  {validation.isValid ? 'Formulário Válido' : 'Corrija os Erros'}
                </h3>
                {!validation.isValid && validation.errors.length > 0 && (
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {validation.errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                )}
                {validation.warnings.length > 0 && (
                  <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>{warning.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            type="button"
            onClick={resetForm}
            className="btn-ghost px-6 py-3"
            disabled={isLoading}
          >
            Limpar Formulário
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => validateForm()}
              className="btn-outline px-6 py-3"
              disabled={isLoading}
            >
              Validar Formulário
            </button>

            <button
              type="submit"
              className={`btn-primary px-8 py-3 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="spinner spinner-sm mr-2"></div>
                  A processar...
                </div>
              ) : (
                <div className="flex items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Emitir Documento
                </div>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <BuildingOfficeIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Segurança Garantida</h4>
            <p className="text-sm text-blue-700 mt-1">
              Este documento será protegido com criptografia AES-256 e incluirá um QR code
              único para verificação instantânea da autenticidade.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EmitirPage