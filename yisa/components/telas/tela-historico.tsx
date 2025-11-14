"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Download, Edit2, Trash2, Eye } from 'lucide-react'
import { useState, useEffect } from "react"
import { DocumentoTransferencia } from "@/lib/documentos"

interface TelaHistoricoProps {
  onSelecionarDocumento?: (documentoId: string) => void
}

export default function TelaHistorico({ onSelecionarDocumento }: TelaHistoricoProps) {
  const [documentos, setDocumentos] = useState<DocumentoTransferencia[]>([])
  const [busca, setBusca] = useState("")
  const [documentoEditando, setDocumentoEditando] = useState<DocumentoTransferencia | null>(null)
  const [dadosEditacao, setDadosEditacao] = useState<any>(null)

  useEffect(() => {
    carregarDocumentos()
  }, [])

  const carregarDocumentos = () => {
    const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}")
    const docs = Object.values(documentosArmazenados).reverse() as DocumentoTransferencia[]
    setDocumentos(docs)
  }

  const documentosFiltrados = documentos.filter((doc) =>
    doc.estudante.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) ||
    doc.shortId.toLowerCase().includes(busca.toLowerCase()) ||
    doc.estudante.numeroBi.includes(busca)
  )

  const handleEditar = (doc: DocumentoTransferencia) => {
    setDocumentoEditando(doc)
    setDadosEditacao({ ...doc.estudante })
  }

  const handleSalvarEdicao = () => {
    if (!documentoEditando) return

    const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}")
    const docAtualizado = {
      ...documentoEditando,
      estudante: dadosEditacao,
    }
    documentosArmazenados[documentoEditando.shortId] = docAtualizado
    localStorage.setItem("documentosEmitidos", JSON.stringify(documentosArmazenados))

    carregarDocumentos()
    setDocumentoEditando(null)
    setDadosEditacao(null)
  }

  const handleDeletar = (shortId: string) => {
    if (confirm("Tem certeza que deseja deletar este documento?")) {
      const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}")
      delete documentosArmazenados[shortId]
      localStorage.setItem("documentosEmitidos", JSON.stringify(documentosArmazenados))
      carregarDocumentos()
    }
  }

  
  const handleVerDetalhes = (doc: DocumentoTransferencia) => {
    if (onSelecionarDocumento) {
      onSelecionarDocumento(doc.shortId)
    } else {
      handleEditar(doc)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold text-[#004b87]">Histórico de Documentos</h2>
        <p className="text-gray-500">Gerencie todos os documentos de transferência emitidos</p>
      </div>

      {/* Barra de busca */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buscar Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nome do estudante, ID ou BI..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Modal de edição */}
      {documentoEditando && (
        <Card className="border-2 border-[#004b87] bg-[#004b87]/5">
          <CardHeader>
            <CardTitle className="text-base text-[#004b87]">Editar Documento</CardTitle>
            <CardDescription>Atualize os dados do documento de {documentoEditando.estudante.nomeCompleto}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Observações</label>
                <textarea
                  value={dadosEditacao.observacoes}
                  onChange={(e) => setDadosEditacao({ ...dadosEditacao, observacoes: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSalvarEdicao} className="bg-[#1b8856] hover:bg-[#1b8856]/90">
                Salvar Alterações
              </Button>
              <Button onClick={() => setDocumentoEditando(null)} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de documentos */}
      <div className="space-y-3">
        {documentosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhum documento encontrado</p>
            </CardContent>
          </Card>
        ) : (
          documentosFiltrados.map((doc) => (
            <Card key={doc.shortId} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleVerDetalhes(doc)}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[#004b87]">{doc.estudante.nomeCompleto}</h3>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Válido</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-semibold">BI:</span> {doc.estudante.numeroBi}
                      </div>
                      <div>
                        <span className="font-semibold">Classe:</span> {doc.estudante.classe}
                      </div>
                      <div>
                        <span className="font-semibold">Emissão:</span> {doc.dataEmissao}
                      </div>
                      <div>
                        <span className="font-semibold">ID:</span> {doc.shortId}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap md:flex-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[#004b87] border-[#004b87] hover:bg-[#004b87]/10"
                      onClick={() => handleEditar(doc)}
                    >
                      <Edit2 size={16} />
                      <span className="hidden sm:inline ml-1">Editar</span>
                    </Button>
                   
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleDeletar(doc.shortId)}
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline ml-1">Deletar</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
