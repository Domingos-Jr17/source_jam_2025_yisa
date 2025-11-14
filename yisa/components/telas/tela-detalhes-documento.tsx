"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Download, Edit2, Trash2, MessageCircle } from 'lucide-react'
import { useState, useEffect } from "react"
import { DocumentoTransferencia } from "@/lib/documentos"
import { handleBaixarPDF, handleVisualizar } from '@/lib/pdf-generator'
import { DISCIPLINAS_POR_NIVEL } from "@/lib/documentos"

interface TelaDetalhesDocumentoProps {
  documentoId: string
  onVoltar: () => void
  onNavigateTo: (tab: string) => void
}

export default function TelaDetalhesDocumento({ documentoId, onVoltar, onNavigateTo }: TelaDetalhesDocumentoProps) {
  const [documento, setDocumento] = useState<DocumentoTransferencia | null>(null)
  const [editando, setEditando] = useState(false)
  const [dadosEditacao, setDadosEditacao] = useState<any>(null)

  useEffect(() => {
    const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}")
    const doc = documentosArmazenados[documentoId]
    if (doc) {
      setDocumento(doc)
      setDadosEditacao({ ...doc.estudante })
    }
  }, [documentoId])

  const handleSalvarEdicao = () => {
    if (!documento) return

    const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}")
    const docAtualizado = {
      ...documento,
      estudante: dadosEditacao,
    }
    documentosArmazenados[documento.shortId] = docAtualizado
    localStorage.setItem("documentosEmitidos", JSON.stringify(documentosArmazenados))

    setDocumento(docAtualizado)
    setEditando(false)
  }

  const handleDeletar = () => {
    if (!documento || !confirm("Tem certeza que deseja deletar este documento?")) return

    const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}")
    delete documentosArmazenados[documento.shortId]
    localStorage.setItem("documentosEmitidos", JSON.stringify(documentosArmazenados))

    onVoltar()
  }

  const handleDownloadPDF = () => {
    if (!documento) return
    handleBaixarPDF(documento)
  }

  const handleCompartilharWhatsApp = () => {
    if (!documento) return
    const link = handleVisualizar(documento)
  //  window.open(link, '_blank')
  }

  if (!documento) {
    return <div className="text-center py-8">Documento não encontrado</div>
  }

  return (
    <div className="space-y-6 py-4">
      {/* Cabeçalho com voltar */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onVoltar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={24} className="text-[#004b87]" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#004b87]">Detalhes do Documento</h2>
          <p className="text-gray-500">ID: {documento.shortId}</p>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-2 flex-wrap">
        {!editando && (
          <>
            <Button
              onClick={() => setEditando(true)}
              className="bg-[#004b87] hover:bg-[#004b87]/90"
            >
              <Edit2 size={16} className="mr-2" />
              Editar Documento
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
           
          </>
        )}
      </div>

      {/* Modo edição */}
      {editando ? (
        <Card className="border-2 border-[#004b87] bg-[#004b87]/5">
          <CardHeader>
            <CardTitle className="text-[#004b87]">Editar Documento</CardTitle>
            <CardDescription>Atualize os dados do estudante e suas notas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados do estudante */}
            <div>
              <h3 className="text-lg font-semibold text-[#004b87] mb-4">Dados do Estudante</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
                  <Input
                    value={dadosEditacao.nomeCompleto}
                    onChange={(e) => setDadosEditacao({ ...dadosEditacao, nomeCompleto: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Número BI</label>
                  <Input
                    value={dadosEditacao.numeroBi}
                    onChange={(e) => setDadosEditacao({ ...dadosEditacao, numeroBi: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Classe</label>
                  <Input
                    value={dadosEditacao.classe}
                    onChange={(e) => setDadosEditacao({ ...dadosEditacao, classe: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Data de Matrícula</label>
                  <Input
                    value={dadosEditacao.dataMatricula}
                    onChange={(e) => setDadosEditacao({ ...dadosEditacao, dataMatricula: e.target.value })}
                    className="mt-1"
                    type="date"
                  />
                </div>
              </div>
            </div>

            {/* Notas */}
           {DISCIPLINAS_POR_NIVEL[dadosEditacao.nivelAcademico as "primario" | "secundario"].map(
                ({ key, label }) => (
                  <div key={key}>
                    <label className="text-sm font-semibold text-gray-700">{label}</label>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      value={dadosEditacao.notas[key] || ""}
                      onChange={(e) =>
                        setDadosEditacao({
                          ...dadosEditacao,
                          notas: { ...dadosEditacao.notas, [key]: e.target.value },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                )
              )}
              

            {/* Observações */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Observações</label>
              <textarea
                value={dadosEditacao.observacoes}
                onChange={(e) => setDadosEditacao({ ...dadosEditacao, observacoes: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2">
              <Button onClick={handleSalvarEdicao} className="bg-[#1b8856] hover:bg-[#1b8856]/90">
                Salvar Alterações
              </Button>
              <Button onClick={() => setEditando(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Visualização do documento */
        <Card>
          <CardHeader>
            <CardTitle className="text-[#004b87]">{documento.estudante.nomeCompleto}</CardTitle>
            <CardDescription>Documento emitido em {documento.dataEmissao}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados do estudante */}
            <div>
              <h3 className="text-lg font-semibold text-[#004b87] mb-3">Informações do Estudante</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold text-gray-700">BI:</span>
                  <p className="text-gray-600">{documento.estudante.numeroBi}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold text-gray-700">Classe:</span>
                  <p className="text-gray-600">{documento.estudante.classe}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold text-gray-700">Data de Matrícula:</span>
                  <p className="text-gray-600">{documento.estudante.dataMatricula}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold text-gray-700">Escola de Origem:</span>
                  <p className="text-gray-600">{documento.escolaOrigem}, {documento.cidadeOrigem}</p>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div>
              <h3 className="text-lg font-semibold text-[#004b87] mb-3">Notas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DISCIPLINAS_POR_NIVEL[documento?.estudante?.nivelAcademico]?.map(({ key, label }) => (
                   <div key={key} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                     <span className="font-semibold text-gray-700">{label}:</span>
                     <p className="text-lg font-bold text-[#004b87]">{documento.estudante.notas[key] || "-"}/20</p>
                   </div>
                 ))}
              </div>
            </div>

            {/* Observações */}
            {documento.estudante.observacoes && (
              <div>
                <h3 className="text-lg font-semibold text-[#004b87] mb-3">Observações</h3>
                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                  <p className="text-gray-700">{documento.estudante.observacoes}</p>
                </div>
              </div>
            )}

            {/* Informações de segurança */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Informações de Segurança</h3>
              <div className="text-xs bg-gray-50 p-3 rounded font-mono break-all">
                <p><span className="font-semibold">Hash SHA-256:</span> {documento.hash}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
