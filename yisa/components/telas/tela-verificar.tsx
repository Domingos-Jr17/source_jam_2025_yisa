"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, XCircle, Search, Loader2, QrCode } from "lucide-react"
import { recuperarDocumento, verificarIntegridade, type DocumentoTransferencia } from "@/lib/documentos"

export default function TelaVerificar() {
  const [modoVerificacao, setModoVerificacao] = useState<"entrada" | "resultado">("entrada")
  const [shortId, setShortId] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [documento, setDocumento] = useState<DocumentoTransferencia | null>(null)
  const [statusVerificacao, setStatusVerificacao] = useState<"valido" | "invalido" | null>(null)
  const [mensagem, setMensagem] = useState("")

  const handleBuscarDocumento = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shortId.trim()) {
      setMensagem("Por favor, insira o ID do documento")
      return
    }

    setCarregando(true)
    setMensagem("")

    try {
      const doc = recuperarDocumento(shortId.toUpperCase())

      if (!doc) {
        setStatusVerificacao("invalido")
        setMensagem("Documento não encontrado no sistema")
        setDocumento(null)
      } else {
        // Verify document integrity
        const eValido = await verificarIntegridade(doc)

        if (eValido) {
          setStatusVerificacao("valido")
          setMensagem("Documento verificado com sucesso!")
          setDocumento(doc)
        } else {
          setStatusVerificacao("invalido")
          setMensagem("AVISO: Documento foi alterado após emissão!")
          setDocumento(doc)
        }
      }

      setModoVerificacao("resultado")
    } catch (error) {
      setStatusVerificacao("invalido")
      setMensagem("Erro ao verificar documento")
      setDocumento(null)
    } finally {
      setCarregando(false)
    }
  }

  const handleNovaVerificacao = () => {
    setModoVerificacao("entrada")
    setShortId("")
    setDocumento(null)
    setStatusVerificacao(null)
    setMensagem("")
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1f1c45]">Verificar Documento</h2>
          <p className="text-gray-500">Sistema de validação de documentos escolares offline</p>
        </div>
        <Badge className="bg-[#1f1c45] text-white">
          <QrCode size={16} className="mr-1" />
          Escola Destino
        </Badge>
      </div>

      {modoVerificacao === "entrada" ? (
        <Card>
          <CardHeader>
            <CardTitle>Verificar Autenticidade do Documento</CardTitle>
            <CardDescription>Insira o código de ID do documento ou escaneie o QR code para verificação</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBuscarDocumento} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shortId">Código de ID do Documento</Label>
                <Input
                  id="shortId"
                  placeholder="Ex: A1B2C3D4"
                  value={shortId}
                  onChange={(e) => setShortId(e.target.value.toUpperCase())}
                  maxLength={8}
                  className="font-mono text-lg tracking-widest"
                />
                <p className="text-xs text-gray-500">O ID é um código de 8 caracteres encontrado no documento</p>
              </div>

              {mensagem && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                  <p className="text-sm text-blue-700">{mensagem}</p>
                </div>
              )}

              <Button type="submit" className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]" disabled={carregando}>
                {carregando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verificar Documento
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-50">
            <p className="text-xs text-gray-600">
              Funciona offline: Todos os documentos verificados anteriormente são armazenados localmente
            </p>
          </CardFooter>
        </Card>
      ) : (
        <>
          {statusVerificacao === "valido" ? (
            <Card className="border-2 border-green-500">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={24} />
                  Documento Válido
                </CardTitle>
                <CardDescription>O documento foi verificado com sucesso e não foi alterado</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {documento && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">ID do Documento</p>
                        <p className="font-mono font-bold text-lg">{documento.shortId}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Data de Emissão</p>
                        <p className="font-semibold">{documento.dataEmissao}</p>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-6">
                      <h3 className="font-semibold text-[#1f1c45] mb-4">Dados do Estudante</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nome:</span>
                          <span className="font-semibold">{documento.estudante.nomeCompleto}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">BI:</span>
                          <span className="font-semibold">{documento.estudante.numeroBi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Classe:</span>
                          <span className="font-semibold">{documento.estudante.classe}ª</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-6">
                      <h3 className="font-semibold text-[#1f1c45] mb-4">Notas</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(documento.estudante.notas).map(([materia, nota]) => {
                          const materiaLabel = {
                            lingua_portuguesa: "Português",
                            matematica: "Matemática",
                            historia: "História",
                            geografia: "Geografia",
                            ciencias: "Ciências",
                            educacao_fisica: "E.F.",
                          }[materia as keyof typeof documento.estudante.notas]
                          return (
                            <div key={materia} className="bg-gray-50 p-3 rounded-md">
                              <p className="text-xs text-gray-600">{materiaLabel}</p>
                              <p className="font-bold text-lg">{nota}/20</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Hash SHA-256 (Verificação):</p>
                      <p className="font-mono text-xs text-blue-600 break-all">{documento.hash}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-red-500">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle size={24} />
                  Documento Inválido
                </CardTitle>
                <CardDescription>Este documento não pôde ser verificado ou foi alterado</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800 text-sm">Não foi possível verificar</p>
                    <p className="text-sm text-red-700 mt-1">{mensagem}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardFooter className="justify-center pt-6">
              <Button onClick={handleNovaVerificacao} className="bg-[#1f1c45] hover:bg-[#2d2a5a]">
                Verificar Outro Documento
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}
