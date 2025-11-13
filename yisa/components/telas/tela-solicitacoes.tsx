"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle,ArrowLeft , Send, Clock, CheckCircle, Loader2 } from "lucide-react"
import { verificarAutenticacao } from "@/lib/autenticacao"
import { escolasSistema } from "@/lib/autenticacao"
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

export default function TelaSolicitacoes() {
  const usuario = verificarAutenticacao()
  const [etapa, setEtapa] = useState<"formulario" | "confirmacao" | "sucesso">("formulario")
  const [carregando, setCarregando] = useState(false)
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoTransferencia[]>([])
  const [mensagem, setMensagem] = useState("")
  const [mensagemTipo, setMensagemTipo] = useState<"erro" | "sucesso" | "info">("info")
  const router = useRouter()

  const [dados, setDados] = useState({
    escolaDestino: "",
    motivo: "",
  })

  const [solicitacaoGerada, setSolicitacaoGerada] = useState<SolicitacaoTransferencia | null>(null)

  useEffect(() => {
    // Load requests from localStorage
    const solicitacoesArmazenadas = JSON.parse(localStorage.getItem("solicitacoesTransferencia") || "[]")
    setSolicitacoes(solicitacoesArmazenadas)
  }, [])

  const onVoltar = () => {
     router.push("/")
  }

  const handleDadosChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDados((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setDados((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmeterSolicitacao = async () => {
    if (!dados.escolaDestino || !dados.motivo) {
      setMensagem("Por favor, preencha todos os campos obrigatórios")
      setMensagemTipo("erro")
      return
    }

    setCarregando(true)
    try {
      const novaSolicitacao: SolicitacaoTransferencia = {
        id: Math.random().toString(36).substring(2, 10).toUpperCase(),
        escolaOrigem: usuario?.escola || "",
        escolaDestino: dados.escolaDestino,
        nomeEstudante: usuario?.nome || "",
        turma: usuario?.turma || "",
        classe: usuario?.classe || "",
        bi: usuario?.bi || "",
        motivo: dados.motivo,
        dataSolicitacao: new Date().toLocaleDateString("pt-MZ"),
        status: "pendente",
      }

      const solicitacoesAtualizado = [...solicitacoes, novaSolicitacao]
      localStorage.setItem("solicitacoesTransferencia", JSON.stringify(solicitacoesAtualizado))
      setSolicitacoes(solicitacoesAtualizado)
      setSolicitacaoGerada(novaSolicitacao)

      setMensagem("Solicitação submetida com sucesso!")
      setMensagemTipo("sucesso")

      setTimeout(() => {
        setEtapa("sucesso")
      }, 1500)
    } catch (error) {
      setMensagem("Erro ao submeter solicitação")
      setMensagemTipo("erro")
    } finally {
      setCarregando(false)
    }
  }

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
        return <Badge className="bg-red-500">Rejeitada</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center">
      {/* Lado esquerdo: botão voltar + título */}
      <div className="flex items-center gap-3">
        <button
          onClick={onVoltar}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={20} className="text-[#1f1c45]" />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-[#1f1c45]">Meus Pedidos de Transferência</h2>
          <p className="text-gray-500">Submeta e acompanhe seus pedidos de transferência</p>
        </div>
      </div>

      {/* Lado direito: badge */}
      <Badge className="bg-[#1f1c45] text-white">
        <Send size={16} className="mr-1" />
        {solicitacoes.length} Pedido{solicitacoes.length !== 1 ? "s" : ""}
      </Badge>
    </div>

      {mensagem && (
        <Card
          className={`${
            mensagemTipo === "erro"
              ? "bg-red-50 border-red-200"
              : mensagemTipo === "sucesso"
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
          }`}
        >
          <CardContent className="pt-4 flex gap-3">
            <AlertCircle
              size={20}
              className={`${
                mensagemTipo === "erro"
                  ? "text-red-600"
                  : mensagemTipo === "sucesso"
                    ? "text-green-600"
                    : "text-blue-600"
              } flex-shrink-0`}
            />
            <p
              className={`${
                mensagemTipo === "erro"
                  ? "text-red-700"
                  : mensagemTipo === "sucesso"
                    ? "text-green-700"
                    : "text-blue-700"
              }`}
            >
              {mensagem}
            </p>
          </CardContent>
        </Card>
      )}

      {etapa === "formulario" && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Solicitação de Transferência</CardTitle>
            <CardDescription>Preencha os dados abaixo para submeter seu pedido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-[#1f1c45]/5 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nome:</span>
                <span className="font-semibold">{usuario?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">BI:</span>
                <span className="font-semibold">{usuario?.bi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Turma/Classe:</span>
                <span className="font-semibold">
                  {usuario?.turma} ({usuario?.classe}ª)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Escola Atual:</span>
                <span className="font-semibold">{usuario?.escola}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="escolaDestino">Escola de Destino *</Label>
              <Select value={dados.escolaDestino} onValueChange={(value) => handleSelectChange("escolaDestino", value)}>
                <SelectTrigger id="escolaDestino">
                  <SelectValue placeholder="Selecione a escola de destino" />
                </SelectTrigger>
                <SelectContent>
                  {escolasSistema.map((escola) => (
                    <SelectItem key={escola} value={escola}>
                      {escola}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da Transferência *</Label>
              <textarea
                id="motivo"
                name="motivo"
                placeholder="Explique o motivo da sua transferência..."
                value={dados.motivo}
                onChange={handleDadosChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f1c45]"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button className="flex-1 bg-[#1f1c45] hover:bg-[#2d2a5a]" onClick={() => setEtapa("confirmacao")}>
              Prosseguir
            </Button>
          </CardFooter>
        </Card>
      )}

      {etapa === "confirmacao" && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmar Solicitação</CardTitle>
            <CardDescription>Revise os dados antes de submeter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#1f1c45]/5 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Escola Origem:</span>
                <span className="font-semibold">{usuario?.escola}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Escola Destino:</span>
                <span className="font-semibold">{dados.escolaDestino}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Motivo:</span>
                <span className="font-semibold">{dados.motivo.substring(0, 50)}...</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setEtapa("formulario")}>
              Voltar
            </Button>
            <Button
              className="flex-1 bg-[#db341e] hover:bg-[#c02e1a]"
              onClick={handleSubmeterSolicitacao}
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submetendo...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submeter Solicitação
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {etapa === "sucesso" && solicitacaoGerada && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Solicitação Submetida com Sucesso!</CardTitle>
            <CardDescription>Seu pedido foi registrado no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID da Solicitação:</span>
                  <span className="font-mono font-bold">{solicitacaoGerada.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-semibold">{solicitacaoGerada.dataSolicitacao}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(solicitacaoGerada.status)}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Próximos passos:</span> Sua solicitação foi enviada para análise. A
                direção da escola de destino analisará e aprovará ou rejeitará seu pedido. Você poderá acompanhar o
                status aqui.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]"
              onClick={() => {
                setEtapa("formulario")
                setDados({ escolaDestino: "", motivo: "" })
                setMensagem("")
              }}
            >
              Fazer Novo Pedido
            </Button>
          </CardFooter>
        </Card>
      )}

      {solicitacoes.length > 0 && etapa === "formulario" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-[#1f1c45]">Histórico de Solicitações</h3>
          {solicitacoes.map((sol) => (
            <Card key={sol.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#1f1c45]">{sol.escolaDestino}</h4>
                      {getStatusBadge(sol.status)}
                    </div>
                    <p className="text-sm text-gray-700">{sol.motivo.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-500 mt-2">
                      ID: {sol.id} • {sol.dataSolicitacao}
                    </p>
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
