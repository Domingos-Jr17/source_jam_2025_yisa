import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'
import {
  DocumentTextIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const HomePage: React.FC = () => {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'emit':
        if (isAuthenticated) {
          navigate(ROUTES.EMITIR)
        } else {
          // TODO: Show login modal
          console.log('Show login modal')
        }
        break
      case 'verify':
        navigate(ROUTES.VERIFICAR)
        break
      case 'wallet':
        if (isAuthenticated) {
          navigate(ROUTES.CARTEIRA)
        } else {
          // TODO: Show login modal
          console.log('Show login modal')
        }
        break
      default:
        break
    }
  }

  const quickActions = [
    {
      id: 'emit',
      title: 'Emitir Documento',
      description: 'Criar declaração de transferência ou outros documentos escolares',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      requiresAuth: true
    },
    {
      id: 'verify',
      title: 'Verificar Documento',
      description: 'Escanear QR code para verificar autenticidade',
      icon: QrCodeIcon,
      color: 'bg-green-500',
      requiresAuth: false
    },
    {
      id: 'wallet',
      title: 'Minha Carteira',
      description: 'Acessar documentos guardados offline',
      icon: ShieldCheckIcon,
      color: 'bg-purple-500',
      requiresAuth: true
    }
  ]

  const features = [
    {
      title: 'Segurança Militar',
      description: 'Criptografia AES-256 e autenticação biométrica',
      icon: ShieldCheckIcon,
      color: 'text-red-600'
    },
    {
      title: '100% Offline',
      description: 'Funciona completamente sem internet',
      icon: DevicePhoneMobileIcon,
      color: 'text-green-600'
    },
    {
      title: 'Verificação Instantânea',
      description: 'QR codes com verificação criptográfica',
      icon: QrCodeIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Histórico Completo',
      description: 'Registo detalhado de todas as operações',
      icon: ClockIcon,
      color: 'text-purple-600'
    },
    {
      title: 'Interface Intuitiva',
      description: 'Design simples e fácil de usar',
      icon: AcademicCapIcon,
      color: 'text-orange-600'
    },
    {
      title: 'Compatibilidade Total',
      description: 'Funciona em todos os dispositivos modernos',
      icon: DevicePhoneMobileIcon,
      color: 'text-indigo-600'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao <span className="text-primary-600">YISA</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Sistema digital seguro para gestão de documentos escolares em Moçambique.
          Reduza o tempo de transferência de 30 dias para 90 segundos.
        </p>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            const isDisabled = action.requiresAuth && !isAuthenticated

            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                onClick={() => handleQuickAction(action.id)}
                disabled={isDisabled}
                className={`
                  relative p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
                {isDisabled && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Requer login
                    </span>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="py-12"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Porque escolher o YISA?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.7 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Icon className={`w-8 h-8 ${feature.color} mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="py-12 bg-primary-600 rounded-xl text-white"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8">Impacto na Educação</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">12,000+</div>
              <div className="text-primary-100">Estudantes Atendidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">180,000</div>
              <div className="text-primary-100">Dias de Aula Economizados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-primary-100">Escolas Cobertas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">90s</div>
              <div className="text-primary-100">Tempo de Emissão</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="py-12 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Comece a usar o YISA hoje
          </h2>
          <p className="text-gray-600 mb-8">
            Proteja seus documentos escolares com tecnologia militar e garanta acesso rápido e seguro.
          </p>
          <button
            onClick={() => {
              // TODO: Show login/register modal
              console.log('Show login modal')
            }}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Começar Agora
          </button>
        </motion.section>
      )}
    </div>
  )
}

export default HomePage