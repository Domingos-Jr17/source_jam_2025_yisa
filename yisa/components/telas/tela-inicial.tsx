"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { verificarAutenticacao } from "@/lib/autenticacao"
import { getDocumentsBySchool , type SolicitacaoTransferencia, obterTodosSolicitacoes} from "@/lib/documentos"
import { FileText, Send, ArrowRight } from 'lucide-react'
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'



interface DocumentoEmitido {
  shortId: string
  nomeEstudante: string
  classe: string
  dataEmissao: string
  escolaOrigem: string
  status: string
}

export default function TelaInicial({ onNavigateTo }: { onNavigateTo?: (tab: string) => void }) {
  const usuario = verificarAutenticacao()
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoTransferencia[]>([])
  const [documentos, setDocumentos] = useState<DocumentoEmitido[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load requests from localStorage
    const solicitacoesArmazenadas = obterTodosSolicitacoes()
    const solicitacoesFiltrados = solicitacoesArmazenadas.filter(
    (sol) =>
      sol.nomeEstudante.toLowerCase().includes(usuario?.nome.toLowerCase()) ||
      sol.bi.includes(usuario?.bi),
  )
    setSolicitacoes(solicitacoesArmazenadas)

    // Load emitted documents from localStorage
    const documentosArmazenados = getDocumentsBySchool(usuario?.escola)
   
    setDocumentos(Object.values(documentosArmazenados))
  
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
                    <p className="text-xs text-gray-500">Acesse a aba "Emitir" para responder às solicitações.</p>
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
                    <p className="text-xs text-gray-500">Acesse a aba "Histórico" para ver todos os documentos.</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-[#004b87]">Documentos Emitidos Recentemente</CardTitle>
                  <CardDescription>Últimos 5 documentos gerados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(() => {
                      // Gerar dados de simulação se não houver documentos
                      const simulados = [
                        { shortId: "DOC001", nomeEstudante: "João Silva", classe: "10ª Classe", dataEmissao: "2024-11-14", status: "Válido" },
                        { shortId: "DOC002", nomeEstudante: "Maria Santos", classe: "11ª Classe", dataEmissao: "2024-11-13", status: "Válido" },
                        { shortId: "DOC003", nomeEstudante: "Pedro Oliveira", classe: "10ª Classe", dataEmissao: "2024-11-12", status: "Válido" },
                      ]
                      
                      // Se não houver documentos, mostrar simulação
                      if (documentos.length === 0) {
                         return (
                           <div className="flex flex-col items-center justify-center p-6 text-gray-500 animate-fadeIn">
                             <div className="text-4xl mb-2">📄</div>
                       
                             <p className="font-semibold text-gray-700">
                               Nenhum documento encontrado
                             </p>
                       
                             <p className="text-xs text-gray-400 mt-1">
                               Não existem documentos emitidos para esta escola.
                             </p>
                       
                             {/* Botão opcional */}
                             <button
                               onClick={() => console.log("Criar documento")}
                               className="mt-4 px-4 py-2 bg-[#004b87] text-white text-xs rounded-lg hover:bg-[#00345f] transition-colors"
                             >
                               Criar documento
                             </button>
                           </div>
                         );
                       }
                      
                      return documentos.slice(-5).reverse().map((doc: any) => (
                        <div key={doc.shortId} className="flex items-center justify-between p-3 border-2 border-[#1b8856]/20 rounded-lg hover:bg-[#1b8856]/5 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-[#004b87] text-sm">{doc.estudante.nomeCompleto}</h4>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Válido</span>
                            </div>
                            <p className="text-xs text-gray-600">{doc.estudante.classe} • {doc.dataEmissao}</p>
                          </div>
                          <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded">{doc.shortId}</span>
                        </div>
                      ))
                    })()}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      ) : (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Bem-vindo ao DocEscola</CardTitle>
            <CardDescription>Sistema de Transferência de Documentos Escolares para Moçambique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Faça login com sua conta para acessar o sistema de emissão, verificação ou visualização de documentos.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <p className="font-semibold text-sm">Tipos de acesso:</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  <span>
                    <span className="font-semibold">Direção:</span> Emite e verifica documentos
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Send size={16} className="text-purple-600" />
                  <span>
                    <span className="font-semibold">Aluno:</span> Submete pedidos e visualiza documentos
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
