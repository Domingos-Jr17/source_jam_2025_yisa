"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, FileText, Loader2, Lock, Download, Send } from 'lucide-react'
import { pinJaDefinido, armazenarPIN, verificarAutenticacao, obterAlunosPorEscola, escolasSistema as escolas, type Aluno } from "@/lib/autenticacao"
import { gerarDocumento, type DadosEstudante, DISCIPLINAS_POR_NIVEL } from "@/lib/documentos"
import { gerarQRCode } from "@/lib/qr-generator"
import { criarNotificacao, salvarNotificacao } from "@/lib/notificacoes"
import { handleBaixarPDF, handleVisualizar } from '@/lib/pdf-generator'

export default function TelaEmitir() {
  const [escolaDestino, setEscolaDestino] = useState("")
  const [etapa, setEtapa] = useState<"pin" | "formulario" | "confirmacao" | "sucesso">("pin")
  const [pinDefinido, setPinDefinido] = useState(pinJaDefinido())
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [mensagemTipo, setMensagemTipo] = useState<"erro" | "sucesso" | "info">("info")

  const [documentoGerado, setDocumentoGerado] = useState<any>(null)
  const [qrImageUrl, setQrImageUrl] = useState("")

  const [pinInserido, setPinInserido] = useState("")
  const [confirmarPin, setConfirmarPin] = useState("")
  const [mostrarPin, setMostrarPin] = useState(false)

  const [alunosDisponiveis, setAlunosDisponiveis] = useState<Aluno[]>([])
  const [estudanteSelecionado, setEstudanteSelecionado] = useState<Aluno | null>(null)

  const [dados, setDados] = useState({
    nomeCompleto: "",
    numeroBi: "",
    dataMatricula: "",
    classe: "",
    nivelAcademico: "primario" as "primario" | "secundario",
    notas: {} as Record<string, string>,
    observacoes: "",
  })

  const usuario = useMemo(() => verificarAutenticacao(), [])

  useEffect(() => {
    if (usuario?.escola) {
      const alunos = obterAlunosPorEscola(usuario.escola)
      setAlunosDisponiveis(alunos)
    }
  }, [usuario.escola])

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

    if (!escolaDestino) {
      setMensagem("Por favor, selecione a escola de destino")
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
          nivelAcademico: dados.nivelAcademico,
          notas: dados.notas,
          observacoes: dados.observacoes,
        }

        const documento = await gerarDocumento(
          dadosEstudante,
          usuario?.escola || "Escola Origem",
          usuario?.cidade || "Maputo",
        )

        const qrUrl = await gerarQRCode(documento.qrCodeData)

        setDocumentoGerado(documento)
        setQrImageUrl(qrUrl)

        const notificacaoAluno = criarNotificacao(
          "aprovacao",
          "Documento de Transferência Emitido",
          `Seu documento de transferência foi emitido com sucesso! ID: ${documento.shortId}. Você pode visualizá-lo em sua carteira digital.`,
          dados.nomeCompleto,
          usuario?.escola || "Direção",
          documento.shortId,
        )
        salvarNotificacao(notificacaoAluno)

        const notificacaoEscolaDestino = criarNotificacao(
          "emissao",
          "Novo Documento de Transferência Recebido",
          `Documento de transferência emitido para ${dados.nomeCompleto} (BI: ${dados.numeroBi}, Classe: ${dados.classe}ª). Use o código QR ou ID para verificar: ${documento.shortId}`,
          escolaDestino,
          usuario?.escola || "Escola Origem",
          documento.shortId,
          qrUrl,
        )
        salvarNotificacao(notificacaoEscolaDestino)

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

  const handleEstudanteSelecionado = (alunoId: string) => {
    const aluno = alunosDisponiveis.find((a) => a.id === alunoId)
    if (aluno) {
      setEstudanteSelecionado(aluno)
      setDados((prev) => ({
        ...prev,
        nomeCompleto: aluno.nome,
        numeroBi: aluno.bi,
        classe: aluno.classe,
      }))
    }
  }

  const handleNivelChange = (value: "primario" | "secundario") => {
    const disciplinas = DISCIPLINAS_POR_NIVEL[value]
    const notasVazias = disciplinas.reduce((acc, d) => ({ ...acc, [d.key]: "" }), {})
    setDados((prev) => ({
      ...prev,
      nivelAcademico: value,
      notas: notasVazias,
    }))
  }

  const handleBaixarDocumento = () => {
    if (!documentoGerado) return
    handleBaixarPDF(documentoGerado)
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
            <CardDescription>Selecione um aluno registado ou preencha manualmente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="estudanteSelecionado">Selecionar Aluno Registado</Label>
              <Select value={estudanteSelecionado?.id || ""} onValueChange={handleEstudanteSelecionado}>
                <SelectTrigger id="estudanteSelecionado">
                  <SelectValue placeholder="Selecione um aluno da escola" />
                </SelectTrigger>
                <SelectContent>
                  {alunosDisponiveis.length > 0 ? (
                    alunosDisponiveis.map((aluno) => (
                      <SelectItem key={aluno.id} value={aluno.id}>
                        {aluno.nome} ({aluno.bi})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="sem-alunos" disabled>
                      Nenhum aluno registado nesta escola
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

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
                <Label htmlFor="nivelAcademico">Nível Académico</Label>
                <Select value={dados.nivelAcademico} onValueChange={handleNivelChange}>
                  <SelectTrigger id="nivelAcademico">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primario">Primário</SelectItem>
                    <SelectItem value="secundario">Secundário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classe">Classe</Label>
                <Select value={dados.classe} onValueChange={(value) => handleSelectChange("classe", value)}>
                  <SelectTrigger id="classe">
                    <SelectValue placeholder="Selecione a classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {dados.nivelAcademico === "primario" ? (
                      <>
                        <SelectItem value="1">1ª Classe</SelectItem>
                        <SelectItem value="2">2ª Classe</SelectItem>
                        <SelectItem value="3">3ª Classe</SelectItem>
                        <SelectItem value="4">4ª Classe</SelectItem>
                        <SelectItem value="5">5ª Classe</SelectItem>
                        <SelectItem value="6">6ª Classe</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="7">7ª Classe</SelectItem>
                        <SelectItem value="8">8ª Classe</SelectItem>
                        <SelectItem value="9">9ª Classe</SelectItem>
                        <SelectItem value="10">10ª Classe</SelectItem>
                        <SelectItem value="11">11ª Classe</SelectItem>
                        <SelectItem value="12">12ª Classe</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-[#1f1c45]">Notas dos Testes (0-20)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DISCIPLINAS_POR_NIVEL[dados.nivelAcademico].map(({ key, label }) => (
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
                      value={dados.notas[key] || ""}
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
            <CardDescription>Selecione a escola de destino e insira seu PIN</CardDescription>
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
              <Label htmlFor="escolaDestino">Escola de Destino *</Label>
              <Select value={escolaDestino} onValueChange={setEscolaDestino}>
                <SelectTrigger id="escolaDestino">
                  <SelectValue placeholder="Selecione a escola de destino" />
                </SelectTrigger>
                <SelectContent>
                  {escolas
                    .filter((escola) => escola !== usuario?.escola)
                    .map((escola) => (
                      <SelectItem key={escola} value={escola}>
                        {escola}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                O documento será enviado para a escola selecionada via notificação
              </p>
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
                  <Send className="mr-2 h-4 w-4" />
                  Emitir e Enviar
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Documento Emitido com Sucesso!</CardTitle>
            <CardDescription>
              Documento enviado para {escolaDestino}
            </CardDescription>
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
                <span className="font-semibold">Nota:</span> O documento foi enviado para {escolaDestino} via
                notificação. A escola destino receberá o código QR e poderá verificar a autenticidade do documento.
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
                setEstudanteSelecionado(null)
                setEscolaDestino("")
                setDados({
                  nomeCompleto: "",
                  numeroBi: "",
                  dataMatricula: "",
                  classe: "",
                  nivelAcademico: "primario",
                  notas: {},
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
