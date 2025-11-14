"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, CheckCircle, FileText, Send, Calendar, User, Building2, Hash, QrCode } from 'lucide-react'
import { obterTodasNotificacoes, marcarComoLida, type Notificacao } from "@/lib/notificacoes"

interface TelaDetalhesNotificacaoProps {
  notificacaoId: string
  onVoltar: () => void
}

export default function TelaDetalhesNotificacao({ notificacaoId, onVoltar }: TelaDetalhesNotificacaoProps) {
  const [notificacao, setNotificacao] = useState<Notificacao | null>(null)

  useEffect(() => {
    const notificacoes = obterTodasNotificacoes()
    const notif = notificacoes.find((n) => n.id === notificacaoId)
    if (notif) {
      setNotificacao(notif)
      // Mark as read when viewing details
      if (!notif.lida) {
        marcarComoLida(notificacaoId)
      }
    }
  }, [notificacaoId])

  if (!notificacao) {
    return (
      <div className="space-y-6 py-4">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Notificação não encontrada</p>
            <Button onClick={onVoltar} className="mt-4 bg-[#1f1c45]">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case "solicitacao":
        return <Send size={24} className="text-blue-600" />
      case "emissao":
        return <FileText size={24} className="text-green-600" />
      case "aprovacao":
        return <CheckCircle size={24} className="text-purple-600" />
      default:
        return <Bell size={24} className="text-gray-600" />
    }
  }

  const getTituloTipo = (tipo: string) => {
    switch (tipo) {
      case "solicitacao":
        return "Solicitação de Transferência"
      case "emissao":
        return "Documento Emitido"
      case "aprovacao":
        return "Transferência Aprovada"
      default:
        return "Notificação"
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
            <h2 className="text-2xl font-bold text-[#1f1c45]">Detalhes da Notificação</h2>
            <p className="text-gray-500">Informações completas</p>
          </div>
        </div>

        <Badge
          className={`${
            notificacao.tipo === "solicitacao"
              ? "bg-blue-600"
              : notificacao.tipo === "emissao"
                ? "bg-green-600"
                : "bg-purple-600"
          } text-white`}
        >
          {getTituloTipo(notificacao.tipo)}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-gray-100">{getIconeNotificacao(notificacao.tipo)}</div>
            <div className="flex-1">
              <CardTitle className="text-xl text-[#1f1c45] mb-2">{notificacao.titulo}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>{new Date(notificacao.data).toLocaleDateString("pt-MZ", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}</span>
                <span>•</span>
                <span>{new Date(notificacao.data).toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-[#1f1c45] mb-2">Mensagem</h3>
            <p className="text-gray-700">{notificacao.mensagem}</p>
          </div>

          {/* Sender and Recipient */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <User size={18} />
                <h3 className="font-semibold">Remetente</h3>
              </div>
              <p className="text-gray-700 font-medium">{notificacao.remetente}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Building2 size={18} />
                <h3 className="font-semibold">Destinatário</h3>
              </div>
              <p className="text-gray-700 font-medium">{notificacao.destinatario}</p>
            </div>
          </div>

          {/* Document ID */}
          {notificacao.documentoId && (
            <div className="bg-[#1f1c45]/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-[#1f1c45] mb-2">
                <Hash size={18} />
                <h3 className="font-semibold">ID do Documento</h3>
              </div>
              <p className="font-mono text-lg font-bold text-[#db341e]">{notificacao.documentoId}</p>
              <p className="text-xs text-gray-500 mt-1">
                Use este ID para verificar o documento na aba "Verificar"
              </p>
            </div>
          )}

          {/* QR Code */}
          {notificacao.qrCode && (
            <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-[#1f1c45] mb-3">
                <QrCode size={18} />
                <h3 className="font-semibold">Código QR para Verificação</h3>
              </div>
              <div className="flex justify-center">
                <img
                  src={notificacao.qrCode || "/placeholder.svg"}
                  alt="QR Code"
                  className="border-2 border-[#1f1c45] p-2 bg-white max-w-xs"
                />
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Escaneie este código para verificar a autenticidade do documento
              </p>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-700 font-medium">Status</span>
            <Badge className={notificacao.lida ? "bg-gray-500" : "bg-[#db341e]"}>
              {notificacao.lida ? "Lida" : "Não Lida"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onVoltar} className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar às Notificações
      </Button>
    </div>
  )
}
