"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, CheckCircle, FileText, Send, Trash2, Eye, ChevronRight } from 'lucide-react'
import {
  obterNotificacoesPorDestinatario,
  obterTodasNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
  deletarNotificacao,
  type Notificacao,
} from "@/lib/notificacoes"
import { verificarAutenticacao } from "@/lib/autenticacao"

interface TelaNotificacoesProps {
  onVoltar: () => void
  onVerDetalhes?: (notificacaoId: string) => void
}

export default function TelaNotificacoes({ onVoltar, onVerDetalhes }: TelaNotificacoesProps) {
  const usuario = verificarAutenticacao()
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [filtro, setFiltro] = useState<"todas" | "nao-lidas">("todas")

  useEffect(() => {
    carregarNotificacoes()
  }, [])

  const carregarNotificacoes = () => {
    if (usuario) {
      const destinatario = usuario.papel === "diretor" ? usuario.escola : usuario.nome
      const todasNotificacoes = obterNotificacoesPorDestinatario(destinatario)
      setNotificacoes(todasNotificacoes)
      const teste = obterTodasNotificacoes()
     // console.log("notificações :", todasNotificacoes)
      console.log("destinatario :", teste)
      console.log("destinatario :", destinatario)
    }
  }

  const handleMarcarComoLida = (notificacaoId: string) => {
    marcarComoLida(notificacaoId)
    carregarNotificacoes()
  }

  const handleMarcarTodasComoLidas = () => {
    const destinatario = usuario.papel === "diretor" ? usuario.escola : usuario.nome
    marcarTodasComoLidas(destinatario)
    carregarNotificacoes()
  }

  const handleDeletar = (notificacaoId: string) => {
    deletarNotificacao(notificacaoId)
    carregarNotificacoes()
  }

  const notificacoesFiltradas =
    filtro === "nao-lidas" ? notificacoes.filter((n) => !n.lida) : notificacoes

  const getIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case "solicitacao":
        return <Send size={20} className="text-blue-600" />
      case "emissao":
        return <FileText size={20} className="text-green-600" />
      case "aprovacao":
        return <CheckCircle size={20} className="text-purple-600" />
      default:
        return <Bell size={20} className="text-gray-600" />
    }
  }

  const getCorNotificacao = (tipo: string) => {
    switch (tipo) {
      case "solicitacao":
        return "border-l-4 border-blue-500"
      case "emissao":
        return "border-l-4 border-green-500"
      case "aprovacao":
        return "border-l-4 border-purple-500"
      default:
        return "border-l-4 border-gray-500"
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Voltar"
          >
            <ArrowLeft size={20} className="text-[#1f1c45]" />
          </button>

          <div>
            <h2 className="text-2xl font-bold text-[#1f1c45]">Notificações</h2>
            <p className="text-gray-500">Acompanhe suas solicitações e documentos</p>
          </div>
        </div>

        <Badge className="bg-[#db341e] text-white">
          <Bell size={16} className="mr-1" />
          {notificacoes.filter((n) => !n.lida).length} Nova{notificacoes.filter((n) => !n.lida).length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filtro === "todas" ? "default" : "outline"}
          onClick={() => setFiltro("todas")}
          className={filtro === "todas" ? "bg-[#1f1c45]" : ""}
        >
          Todas ({notificacoes.length})
        </Button>
        <Button
          variant={filtro === "nao-lidas" ? "default" : "outline"}
          onClick={() => setFiltro("nao-lidas")}
          className={filtro === "nao-lidas" ? "bg-[#1f1c45]" : ""}
        >
          Não Lidas ({notificacoes.filter((n) => !n.lida).length})
        </Button>
        {notificacoes.filter((n) => !n.lida).length > 0 && (
          <Button variant="ghost" onClick={handleMarcarTodasComoLidas} className="ml-auto">
            <CheckCircle size={16} className="mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {notificacoesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {filtro === "nao-lidas" ? "Nenhuma notificação não lida" : "Nenhuma notificação disponível"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notificacoesFiltradas.map((notificacao) => (
            <Card
              key={notificacao.id}
              className={`${getCorNotificacao(notificacao.tipo)} ${
                !notificacao.lida ? "bg-blue-50/50" : "bg-white"
              } cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => onVerDetalhes?.(notificacao.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getIconeNotificacao(notificacao.tipo)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#1f1c45]">{notificacao.titulo}</h4>
                      {!notificacao.lida && (
                        <Badge className="bg-[#db341e] text-white text-xs">Nova</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{notificacao.mensagem}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>De: {notificacao.remetente}</span>
                      <span>•</span>
                      <span>{new Date(notificacao.data).toLocaleDateString("pt-MZ")}</span>
                      <span>•</span>
                      <span>{new Date(notificacao.data).toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    {notificacao.documentoId && (
                      <div className="mt-2 bg-gray-100 p-2 rounded text-xs">
                        <span className="text-gray-600">ID do Documento: </span>
                        <span className="font-mono font-semibold">{notificacao.documentoId}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onVerDetalhes?.(notificacao.id)
                      }}
                      title="Ver detalhes"
                    >
                      <ChevronRight size={20} />
                    </Button>
                    {!notificacao.lida && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarcarComoLida(notificacao.id)
                        }}
                        title="Marcar como lida"
                      >
                        <Eye size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletar(notificacao.id)
                      }}
                      title="Deletar"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
