"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { verificarAutenticacao } from "@/lib/autenticacao"
import { FileText, Send, ArrowRight , GraduationCap, Shield} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface SolicitacaoTransferencia {
  id: string
  escolaOrigem: string
  escolaDestino: string
  nomeEstudante: string
  turma: string
  classe: string
  bi: string
  motivo: string
  dataSolicitacao: string
  status: "pendente" | "aprovada" | "rejeitada"
}

export default function TelaInicial({ onNavigateTo }: { onNavigateTo?: (tab: string) => void }) {
  const usuario = verificarAutenticacao()
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoTransferencia[]>([])
  const router = useRouter()


  useEffect(() => {
    // Load requests from localStorage
    const solicitacoesArmazenadas = JSON.parse(localStorage.getItem("solicitacoesTransferencia") || "[]")
    setSolicitacoes(solicitacoesArmazenadas)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pendente</span>
      case "aprovada":
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Aprovada</span>
      case "rejeitada":
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Rejeitada</span>
      default:
        return null
    }
  }

  const handleSolicitarTransferencia = () => {
    if (onNavigateTo) {
      router.push("/solicitar")
    }
  }

  return (
    <div className="space-y-6 py-4">
      {usuario ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#004b87]">Bem-vindo, {usuario.nome}!</h2>
              <p className="text-gray-500">Sistema de Transferência de Documentos Escolares - Moçambique</p>
            </div>
          </div>

          {usuario.papel === "aluno" && (
            <>
              <Card className="bg-gradient-to-r from-[#004b87] to-[#1b8856] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send size={24} />
                    Solicitar Transferência
                  </CardTitle>
                  <CardDescription className="text-gray-100">
                    Submeta um pedido de transferência para a escola desejada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    Acesse o formulário de solicitação para submeter um novo pedido de transferência. Escolha a escola
                    de destino e explique o motivo da sua transferência.
                  </p>
                  <Button
                    onClick={handleSolicitarTransferencia}
                    className="bg-white text-[#004b87] hover:bg-gray-100 font-semibold flex items-center gap-2 w-full"
                  >
                    Solicitar Agora
                    <ArrowRight size={18} />
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-[#1b8856]">
                  <CardHeader>
                    <CardTitle className="text-base text-[#004b87]">Meus Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-700">
                      Submeta solicitações de transferência e acompanhe seu status em tempo real.
                    </p>
                    <Button
                      onClick={handleSolicitarTransferencia}
                      variant="outline"
                      className="w-full bg-transparent border-[#1b8856] text-[#1b8856] hover:bg-[#1b8856]/10"
                    >
                      Ir para Pedidos
                      <ArrowRight size={16} />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#004b87]">
                  <CardHeader>
                    <CardTitle className="text-base text-[#004b87]">Minha Carteira</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>Visualize e gerencie seus documentos de transferência digitais.</p>
                    <p className="text-xs text-gray-500">Acesse a aba "Carteira" para ver seus documentos.</p>
                  </CardContent>
                </Card>
              </div>

              {solicitacoes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-[#004b87]">Últimas Solicitações</CardTitle>
                    <CardDescription>Seu histórico de pedidos de transferência</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {solicitacoes
                        .slice(-3)
                        .reverse()
                        .map((sol) => (
                          <div
                            key={sol.id}
                            className="flex items-start justify-between p-3 border-2 border-[#1b8856]/20 rounded-lg hover:bg-[#1b8856]/5 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-[#004b87] text-sm">{sol.escolaDestino}</h4>
                                {getStatusBadge(sol.status)}
                              </div>
                              <p className="text-xs text-gray-600">{sol.dataSolicitacao}</p>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">ID: {sol.id}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {usuario.papel === "diretor" && (
            <>
              <Card className="bg-gradient-to-r from-[#1f1c45] to-[#2d2a5a] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={24} />
                    Emitir Documentos de Transferência
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Emita e gerencie documentos escolares com segurança e integridade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Use o sistema para emitir documentos de transferência protegidos com código QR e hash SHA-256.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Send size={18} />
                      Solicitações Pendentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>Veja os pedidos de transferência dos alunos aguardando análise e aprovação.</p>
                    <p className="text-xs text-gray-500">Acesse a aba "Início" para ver todas as solicitações.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText size={18} />
                      Últimos Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>Histórico dos documentos emitidos recentemente pela sua escola.</p>
                    <p className="text-xs text-gray-500">Acesse a aba "Emitir" para ver o histórico completo.</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </>
      ) : (
        <Card className="max-w-2xl mx-auto overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-[#004b87] via-[#1b8856] to-[#1b8856] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <GraduationCap size={64} className="text-white opacity-90" strokeWidth={1.5} />
          <div className="h-16 w-px bg-white/30"></div>
          <Shield size={56} className="text-white opacity-90" strokeWidth={1.5} />
        </div>
      </div>
      
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Bem-vindo ao DocEscola
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Sistema de Gestão e Transferência de Documentos Escolares de Moçambique
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 px-6 pb-6">
        <div className="text-center">
          <p className="text-gray-700 leading-relaxed">
            Aceda ao sistema com as suas credenciais para utilizar os serviços de emissão, 
            verificação e consulta de documentos académicos.
          </p>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-900 mb-5 text-center">
            Selecione o Seu Perfil de Acesso
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="group relative overflow-hidden p-6 rounded-xl border-2 border-blue-200 bg-[#1b8856] hover:from-blue-100 hover:to-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield size={32} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-gray-200">Direção Escolar</p>
                  <p className="text-xs text-gray-100 mt-1">
                    Emissão e verificação de documentos
                  </p>
                </div>
              </div>
            </button>
            
            <button className="group relative overflow-hidden p-6 rounded-xl border-2 border-purple-200 bg-[#004b87] hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap size={32} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-gray-300">Estudante</p>
                  <p className="text-xs text-gray-100 mt-1">
                    Submissão e consulta de documentos
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Sistema seguro e certificado para gestão académica
          </p>
        </div>
      </CardContent>
    </Card>
      )}
    </div>
  )
}
