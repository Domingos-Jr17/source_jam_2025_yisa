import React from 'react'
import { motion } from 'framer-motion'

const SobrePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sobre o YISA
        </h1>
        <p className="text-gray-600">
          Conheça mais sobre a nossa missão de transformar a educação em Moçambique
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Nossa Missão</h2>
          <p className="card-description">
            Democratizar o acesso a documentos escolares através da tecnologia
          </p>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            O YISA (Youth Innovation Student Assistant) é uma plataforma inovadora
            desenvolvida para resolver o problema burocrático das transferências
            escolares em Moçambique.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Impacto</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Redução do tempo de transferência de 30 dias para 90 segundos</li>
            <li>Economia de 180,000 dias de aula anualmente</li>
            <li>Redução de custos em 64.2M MT para as famílias</li>
            <li>Serviço para mais de 12,000 estudantes</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">Tecnologia</h3>
          <p className="text-gray-600">
            Utilizamos tecnologia de ponta com criptografia militar e funciona
            completamente offline, garantindo segurança e acessibilidade.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">Equipe</h3>
          <p className="text-gray-600">
            Desenvolvido pela equipa MozDev & Maputo Frontenders durante o
            Source Jam 2024, com o apoio da comunidade tecnológica de Moçambique.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default SobrePage