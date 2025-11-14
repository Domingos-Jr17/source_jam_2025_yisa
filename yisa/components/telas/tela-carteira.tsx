"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Download, FileText, Search, Trash2, Wallet } from 'lucide-react'
import { obterTodosDocumentos, apagarDocumentosPorUsuario, type DocumentoTransferencia, DISCIPLINAS_POR_NIVEL } from "@/lib/documentos"
import { verificarAutenticacao } from "@/lib/autenticacao"
import { handleBaixarPDF, handleVisualizar } from '@/lib/pdf-generator'

export default function TelaCarteira() {
  const [documentos, setDocumentos] = useState<DocumentoTransferencia[]>([])
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoTransferencia | null>(null)
  const [filtro, setFiltro] = useState("")
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Load documents from localStorage
    const usuario = verificarAutenticacao()
    const docs = obterTodosDocumentos()
    setDocumentos(docs)
    setCarregando(false)
  }, [])
  const usuario = verificarAutenticacao()
  const documentosFiltrados = documentos.filter(
    (doc) =>
      doc.estudante.nomeCompleto.toLowerCase().includes(usuario?.nome.toLowerCase()) ||
      doc.shortId.includes(usuario?.shortId),
  )

  const handleBaixarDocumento = (documento: DocumentoTransferencia) => {
    if (!documento) return
    handleBaixarPDF(documento)
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1f1c45]">Minha Carteira Digital</h2>
          <p className="text-gray-500">Seus documentos de transferência armazenados</p>
        </div>
        <Badge className="bg-[#1f1c45] text-white">
          <Wallet size={16} className="mr-1" />
          {documentosFiltrados.length} Documento{documentos.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {!documentoSelecionado ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Buscar Documentos</CardTitle>
              <CardDescription>Procure por nome, BI ou ID do documento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nome, BI ou ID..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" className="px-3 bg-transparent">
                  <Search size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {carregando ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">Carregando documentos...</p>
              </CardContent>
            </Card>
          ) : documentosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 font-semibold">Nenhum documento encontrado</p>
                <p className="text-gray-500 text-sm mt-2">
                  {filtro ? "Tente ajustar sua busca" : "Você ainda não tem documentos armazenados"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {documentosFiltrados.map((doc) => (
                <Card
                  key={doc.shortId}
                  className="cursor-pointer hover:border-[#db341e] hover:bg-[#db341e]/5 transition-all"
                  onClick={() => setDocumentoSelecionado(doc)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1f1c45]">{doc.estudante.nomeCompleto}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            BI: {doc.estudante.numeroBi}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {doc.estudante.classe}ª Classe
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {doc.dataEmissao}
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-mono font-bold text-[#1f1c45]">{doc.shortId}</p>
                        <p className="text-xs text-gray-500">ID do documento</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{documentoSelecionado.estudante.nomeCompleto}</CardTitle>
                <CardDescription>ID: {documentoSelecionado.shortId}</CardDescription>
              </div>
              <Button variant="ghost" className="text-[#db341e]" onClick={() => setDocumentoSelecionado(null)}>
                Voltar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1f1c45]/5 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Data de Emissão</p>
                <p className="font-semibold">{documentoSelecionado.dataEmissao}</p>
              </div>
              <div className="bg-[#1f1c45]/5 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Classe</p>
                <p className="font-semibold">{documentoSelecionado.estudante.classe}ª Classe</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-[#1f1c45] mb-3">Dados do Estudante</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome:</span>
                  <span className="font-semibold">{documentoSelecionado.estudante.nomeCompleto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">BI:</span>
                  <span className="font-semibold">{documentoSelecionado.estudante.numeroBi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data de Matrícula:</span>
                  <span className="font-semibold">{documentoSelecionado.estudante.dataMatricula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nível:</span>
                  <span className="font-semibold">
                    {documentoSelecionado.estudante.nivelAcademico === "primario" ? "Primário" : "Secundário"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-[#1f1c45] mb-3">Notas</h4>
              <div className="grid grid-cols-2 gap-2">
                {DISCIPLINAS_POR_NIVEL[documentoSelecionado.estudante.nivelAcademico].map(({ key, label }) => (
                  <div key={key} className="bg-gray-50 p-2 rounded text-sm">
                    <p className="text-xs text-gray-600">{label}</p>
                    <p className="font-bold">{documentoSelecionado.estudante.notas[key] || "-"}/20</p>
                  </div>
                ))}
              </div>
            </div>

            {documentoSelecionado.estudante.observacoes && (
              <div className="border-t pt-4">
                <h4 className="font-semibold text-[#1f1c45] mb-2">Observações</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {documentoSelecionado.estudante.observacoes}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              onClick={() => apagarDocumentosPorUsuario(documentoSelecionado.shortId)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Apagar
            </Button>
            <Button
              className="flex-1 bg-[#1f1c45] hover:bg-[#2d2a5a]"
              onClick={() => handleBaixarDocumento(documentoSelecionado)}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
