"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, FileText, Loader2, Lock, Download } from "lucide-react"
import { pinJaDefinido, armazenarPIN, verificarAutenticacao } from "@/lib/autenticacao"
import { gerarDocumento, type DadosEstudante } from "@/lib/documentos"
import { gerarQRCode } from "@/lib/qr-generator"

export default function TelaEmitir() {
  const [etapa, setEtapa] = useState<"pin" | "formulario" | "confirmacao" | "sucesso">("pin")
  const [pinDefinido, setPinDefinido] = useState(pinJaDefinido())
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [mensagemTipo, setMensagemTipo] = useState<"erro" | "sucesso" | "info">("info")

  const [documentoGerado, setDocumentoGerado] = useState<any>(null)
  const [qrImageUrl, setQrImageUrl] = useState("")

  // PIN states
  const [pinInserido, setPinInserido] = useState("")
  const [confirmarPin, setConfirmarPin] = useState("")
  const [mostrarPin, setMostrarPin] = useState(false)

  // Dados do estudante para transferência
  const [dados, setDados] = useState({
    nomeCompleto: "",
    numeroBi: "",
    dataMatricula: "",
    classe: "",
    notas: {
      lingua_portuguesa: "",
      matematica: "",
      historia: "",
      geografia: "",
      ciencias: "",
      educacao_fisica: "",
    },
    observacoes: "",
  })

  const usuario = verificarAutenticacao()

  // ... existing PIN functions ...

  const handleDefinirPin = async () => {
    if (!pinInserido || !confirmarPin) {
      setMensagem("Por favor, preencha ambos os campos de PIN")
      setMensagemTipo("erro")
      return
    }

    if (pinInserido !== confirmarPin) {
      setMensagem("Os PINs não coincidem")
      setMensagemTipo("erro")
      return
    }

    if (!/^\d{4,6}$/.test(pinInserido)) {
      setMensagem("PIN deve ter entre 4 e 6 dígitos")
      setMensagemTipo("erro")
      return
    }

    setCarregando(true)
    try {
      await armazenarPIN(pinInserido)
      setPinDefinido(true)
      setMensagem("PIN definido com sucesso!")
      setMensagemTipo("sucesso")
      setTimeout(() => {
        setEtapa("formulario")
        setPinInserido("")
        setConfirmarPin("")
      }, 1500)
    } catch (error) {
      setMensagem("Erro ao definir PIN")
      setMensagemTipo("erro")
    } finally {
      setCarregando(false)
    }
  }

  const handleVerificarPinAntes = async () => {
    if (!pinInserido) {
      setMensagem("Por favor, insira seu PIN")
      setMensagemTipo("erro")
      return
    }

    setCarregando(true)
    try {
      const { verificarPIN: verifFunc } = await import("@/lib/autenticacao")
      const pinValido = await verifFunc(pinInserido)
      if (pinValido) {
        setMensagem("PIN correto! Gerando documento...")
        setMensagemTipo("sucesso")

        const dadosEstudante: DadosEstudante = {
          nomeCompleto: dados.nomeCompleto,
          numeroBi: dados.numeroBi,
          dataMatricula: dados.dataMatricula,
          classe: dados.classe,
          notas: dados.notas,
          observacoes: dados.observacoes,
        }

        const documento = await gerarDocumento(
          dadosEstudante,
          usuario?.escola || "Escola Origem",
          usuario?.cidade || "Maputo",
        )

        // Generate QR code image
        const qrUrl = await gerarQRCode(documento.qrCodeData)

        setDocumentoGerado(documento)
        setQrImageUrl(qrUrl)

        setTimeout(() => {
          setEtapa("sucesso")
          setPinInserido("")
        }, 1500)
      } else {
        setMensagem("PIN incorreto")
        setMensagemTipo("erro")
      }
    } catch (error) {
      setMensagem("Erro ao gerar documento")
      setMensagemTipo("erro")
    } finally {
      setCarregando(false)
    }
  }

  const handleDadosChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith("nota_")) {
      const materia = name.replace("nota_", "")
      setDados((prev) => ({
        ...prev,
        notas: {
          ...prev.notas,
          [materia]: value,
        },
      }))
    } else {
      setDados((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setDados((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBaixarDocumento = () => {
    if (!documentoGerado) return

    const conteudo = `
DOCUMENTO DE TRANSFERÊNCIA ESCOLAR
====================================

Código ID: ${documentoGerado.shortId}
Data: ${documentoGerado.dataEmissao}

ESTUDANTE:
----------
Nome: ${documentoGerado.estudante.nomeCompleto}
BI: ${documentoGerado.estudante.numeroBi}
Classe: ${documentoGerado.estudante.classe}

NOTAS:
------
Português: ${documentoGerado.estudante.notas.lingua_portuguesa}
Matemática: ${documentoGerado.estudante.notas.matematica}
História: ${documentoGerado.estudante.notas.historia}
Geografia: ${documentoGerado.estudante.notas.geografia}
Ciências: ${documentoGerado.estudante.notas.ciencias}
E.F.: ${documentoGerado.estudante.notas.educacao_fisica}

Hash: ${documentoGerado.hash}
    `

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(conteudo))
    element.setAttribute("download", `Transferencia_${documentoGerado.shortId}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1f1c45]">Emitir Documento de Transferência</h2>
          <p className="text-gray-500">Sistema de emissão de documentos escolares</p>
        </div>
        <Badge className="bg-[#db341e] text-white">
          <FileText size={16} className="mr-1" />
          Diretor
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

      {!pinDefinido ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} className="text-[#db341e]" />
              Configurar PIN de Segurança
            </CardTitle>
            <CardDescription>Defina um PIN de 4-6 dígitos para proteger a emissão de documentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin-novo">Novo PIN (4-6 dígitos)</Label>
              <div className="relative">
                <Input
                  id="pin-novo"
                  type={mostrarPin ? "text" : "password"}
                  placeholder="••••"
                  value={pinInserido}
                  onChange={(e) => setPinInserido(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin-confirmar">Confirmar PIN</Label>
              <Input
                id="pin-confirmar"
                type={mostrarPin ? "text" : "password"}
                placeholder="••••"
                value={confirmarPin}
                onChange={(e) => setConfirmarPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setMostrarPin(!mostrarPin)}>
              {mostrarPin ? "Ocultar" : "Mostrar"} PIN
            </Button>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDefinirPin} className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]" disabled={carregando}>
              {carregando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Definindo PIN...
                </>
              ) : (
                "Definir PIN"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : etapa === "formulario" ? (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Estudante</CardTitle>
            <CardDescription>Preencha as informações do estudante para transferência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                <Input
                  id="nomeCompleto"
                  name="nomeCompleto"
                  placeholder="Nome do estudante"
                  value={dados.nomeCompleto}
                  onChange={handleDadosChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroBi">Número de BI *</Label>
                <Input
                  id="numeroBi"
                  name="numeroBi"
                  placeholder="Número de identificação"
                  value={dados.numeroBi}
                  onChange={handleDadosChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataMatricula">Data de Matrícula</Label>
                <Input
                  id="dataMatricula"
                  name="dataMatricula"
                  type="date"
                  value={dados.dataMatricula}
                  onChange={handleDadosChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classe">Classe/Nível</Label>
                <Select value={dados.classe} onValueChange={(value) => handleSelectChange("classe", value)}>
                  <SelectTrigger id="classe">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7ª Classe</SelectItem>
                    <SelectItem value="8">8ª Classe</SelectItem>
                    <SelectItem value="9">9ª Classe</SelectItem>
                    <SelectItem value="10">10ª Classe</SelectItem>
                    <SelectItem value="11">11ª Classe</SelectItem>
                    <SelectItem value="12">12ª Classe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-[#1f1c45]">Notas dos Testes (0-20)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries({
                  lingua_portuguesa: "Língua Portuguesa",
                  matematica: "Matemática",
                  historia: "História",
                  geografia: "Geografia",
                  ciencias: "Ciências",
                  educacao_fisica: "Educação Física",
                }).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={`nota_${key}`} className="text-sm">
                      {label}
                    </Label>
                    <Input
                      id={`nota_${key}`}
                      name={`nota_${key}`}
                      type="number"
                      min="0"
                      max="20"
                      placeholder="0-20"
                      value={dados.notas[key as keyof typeof dados.notas]}
                      onChange={handleDadosChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                name="observacoes"
                placeholder="Observações adicionais sobre o estudante"
                value={dados.observacoes}
                onChange={handleDadosChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f1c45]"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setEtapa("pin")}>
              Voltar
            </Button>
            <Button className="flex-1 bg-[#1f1c45] hover:bg-[#2d2a5a]" onClick={() => setEtapa("confirmacao")}>
              Prosseguir
            </Button>
          </CardFooter>
        </Card>
      ) : etapa === "confirmacao" ? (
        <Card>
          <CardHeader>
            <CardTitle>Confirmar Emissão de Documento</CardTitle>
            <CardDescription>Insira seu PIN para confirmar a emissão</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#1f1c45]/5 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Estudante:</span>
                <span className="font-semibold">{dados.nomeCompleto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">BI:</span>
                <span className="font-semibold">{dados.numeroBi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Classe:</span>
                <span className="font-semibold">{dados.classe}ª Classe</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin-confirmacao">PIN de Confirmação</Label>
              <Input
                id="pin-confirmacao"
                type={mostrarPin ? "text" : "password"}
                placeholder="••••"
                value={pinInserido}
                onChange={(e) => setPinInserido(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setMostrarPin(!mostrarPin)}>
              {mostrarPin ? "Ocultar" : "Mostrar"} PIN
            </Button>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setEtapa("formulario")}>
              Voltar
            </Button>
            <Button
              className="flex-1 bg-[#db341e] hover:bg-[#c02e1a]"
              onClick={handleVerificarPinAntes}
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Emitindo...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Emitir Documento
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Documento Emitido com Sucesso!</CardTitle>
            <CardDescription>Seu documento foi gerado e armazenado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-[#1f1c45]/5 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ID do Documento:</span>
                <span className="font-mono font-bold text-lg">{documentoGerado?.shortId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estudante:</span>
                <span className="font-semibold">{documentoGerado?.estudante.nomeCompleto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Emissão:</span>
                <span>{documentoGerado?.dataEmissao}</span>
              </div>
            </div>

            {qrImageUrl && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-gray-600">Código QR para verificação:</p>
                <img
                  src={qrImageUrl || "/placeholder.svg"}
                  alt="QR Code"
                  className="border-2 border-[#1f1c45] p-2 bg-white"
                />
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Nota:</span> O documento foi salvo localmente e pode ser compartilhado
                com a escola destino. O código QR contém todas as informações necessárias para verificação.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleBaixarDocumento}>
              <Download className="mr-2 h-4 w-4" />
              Baixar Documento
            </Button>
            <Button
              className="flex-1 bg-[#1f1c45] hover:bg-[#2d2a5a]"
              onClick={() => {
                setEtapa("formulario")
                setDados({
                  nomeCompleto: "",
                  numeroBi: "",
                  dataMatricula: "",
                  classe: "",
                  notas: {
                    lingua_portuguesa: "",
                    matematica: "",
                    historia: "",
                    geografia: "",
                    ciencias: "",
                    educacao_fisica: "",
                  },
                  observacoes: "",
                })
              }}
            >
              Novo Documento
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
