"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Clock, CheckCircle, XCircle, Search } from "lucide-react"
import { verificarAutenticacao } from "@/lib/autenticacao"
import { Input } from "@/components/ui/input"

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

export default function TelaPedidos({ onNavigateTo }: { onNavigateTo?: (tab: string) => void }) {
  const usuario = verificarAutenticacao()
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoTransferencia[]>([])
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "pendente" | "aprovada" | "rejeitada">("todos")
  const [pesquisa, setPesquisa] = useState("")

  useEffect(() => {
    // Load requests from localStorage
    const solicitacoesArmazenadas = JSON.parse(localStorage.getItem("solicitacoesTransferencia") || "[]")
    setSolicitacoes(solicitacoesArmazenadas)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge className="bg-yellow-500">
            <Clock size={12} className="mr-1" /> Pendente
          </Badge>
        )
      case "aprovada":
        return (
          <Badge className="bg-green-500">
            <CheckCircle size={12} className="mr-1" /> Aprovada
          </Badge>
        )
      case "rejeitada":
        return (
          <Badge className="bg-red-500">
            <XCircle size={12} className="mr-1" /> Rejeitada
          </Badge>
        )
      default:
        return null
    }
  }

  const handleNovoSolicitacao = () => {
    if (onNavigateTo) {
      onNavigateTo("solicitacoes")
    }
  }

  // Filter solicitations
  const solicitacoesFiltradas = solicitacoes.filter((sol) => {
    const matchStatus = filtroStatus === "todos" || sol.status === filtroStatus
    const matchPesquisa =
      pesquisa === "" ||
      sol.id.toLowerCase().includes(pesquisa.toLowerCase()) ||
      sol.escolaDestino.toLowerCase().includes(pesquisa.toLowerCase()) ||
      sol.motivo.toLowerCase().includes(pesquisa.toLowerCase())

    return matchStatus && matchPesquisa
  })

  const contadores = {
    todos: solicitacoes.length,
    pendente: solicitacoes.filter((s) => s.status === "pendente").length,
    aprovada: solicitacoes.filter((s) => s.status === "aprovada").length,
    rejeitada: solicitacoes.filter((s) => s.status === "rejeitada").length,
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1f1c45]">Meus Pedidos</h2>
          <p className="text-gray-500">Acompanhe o status de seus pedidos de transferência</p>
        </div>
        <Button
          onClick={handleNovoSolicitacao}
          className="bg-[#db341e] hover:bg-[#c02e1a] text-white flex items-center gap-2"
        >
          <Send size={18} />
          Novo Pedido
        </Button>
      </div>

      {/* Filtros e Contadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar pedidos..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="pl-9"
          />
        </div>

        <button
          onClick={() => setFiltroStatus("todos")}
          className={`p-3 rounded-lg border-2 transition-all ${
            filtroStatus === "todos" ? "border-[#1f1c45] bg-[#1f1c45]/5" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-2xl font-bold text-[#1f1c45]">{contadores.todos}</div>
          <div className="text-xs text-gray-600">Todos</div>
        </button>

        <button
          onClick={() => setFiltroStatus("pendente")}
          className={`p-3 rounded-lg border-2 transition-all ${
            filtroStatus === "pendente" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-2xl font-bold text-yellow-600">{contadores.pendente}</div>
          <div className="text-xs text-gray-600">Pendentes</div>
        </button>

        <button
          onClick={() => setFiltroStatus("aprovada")}
          className={`p-3 rounded-lg border-2 transition-all ${
            filtroStatus === "aprovada" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-2xl font-bold text-green-600">{contadores.aprovada}</div>
          <div className="text-xs text-gray-600">Aprovados</div>
        </button>

        <button
          onClick={() => setFiltroStatus("rejeitada")}
          className={`p-3 rounded-lg border-2 transition-all ${
            filtroStatus === "rejeitada" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="text-2xl font-bold text-red-600">{contadores.rejeitada}</div>
          <div className="text-xs text-gray-600">Rejeitados</div>
        </button>
      </div>

      {/* Lista de Pedidos */}
      {solicitacoesFiltradas.length > 0 ? (
        <div className="space-y-3">
          {solicitacoesFiltradas
            .slice()
            .reverse()
            .map((sol) => (
              <Card key={sol.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-[#1f1c45] text-base">{sol.escolaDestino}</h4>
                          {getStatusBadge(sol.status)}
                        </div>
                        <p className="text-sm text-gray-700">{sol.motivo}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">ID</span>
                        <span className="font-mono text-sm font-semibold">{sol.id}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Data</span>
                        <span className="text-sm">{sol.dataSolicitacao}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Origem</span>
                        <span className="text-sm">{sol.escolaOrigem}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Turma</span>
                        <span className="text-sm">
                          {sol.turma} ({sol.classe}ª)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="py-12">
            <Send size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">
              {pesquisa || filtroStatus !== "todos" ? "Nenhum pedido encontrado" : "Você ainda não tem pedidos"}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {pesquisa || filtroStatus !== "todos"
                ? "Tente ajustar seus filtros de busca"
                : "Crie seu primeiro pedido de transferência clicando no botão abaixo"}
            </p>
            {(pesquisa === "" || filtroStatus === "todos") && (
              <Button onClick={handleNovoSolicitacao} className="bg-[#db341e] hover:bg-[#c02e1a] text-white">
                <Send size={16} className="mr-2" />
                Criar Novo Pedido
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
