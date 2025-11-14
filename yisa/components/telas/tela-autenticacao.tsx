"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { usuariosTeste, autenticar, registrar, recuperarSenha } from "@/lib/autenticacao"

export default function TelaAutenticacao() {
  const router = useRouter()
  const [abaAtiva, setAbaAtiva] = useState("login")
  const [carregando, setCarregando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mensagemErro, setMensagemErro] = useState("")
  const [mensagemSucesso, setMensagemSucesso] = useState("")

  const [dadosLogin, setDadosLogin] = useState({
    email: "",
    senha: "",
    lembrar: false,
  })

  const [dadosRegistro, setDadosRegistro] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    papel: "diretor",
    escola: "",
    cidade: "",
  })

  const [emailRecuperacao, setEmailRecuperacao] = useState("")

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setDadosLogin((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRegistroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDadosRegistro((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setDadosRegistro((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setMensagemErro("")
    setMensagemSucesso("")

    try {
      const resultado = await autenticar(dadosLogin.email, dadosLogin.senha)
      if (resultado.sucesso) {
        setMensagemSucesso("Login realizado com sucesso! Redirecionando...")
        setTimeout(() => {
          router.push("/")
        }, 1500)
      } else {
        setMensagemErro(resultado.mensagem)
      }
    } catch (error) {
      setMensagemErro("Ocorreu um erro ao tentar fazer login. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setMensagemErro("")
    setMensagemSucesso("")

    if (dadosRegistro.senha !== dadosRegistro.confirmarSenha) {
      setMensagemErro("As senhas não coincidem.")
      setCarregando(false)
      return
    }

    if (dadosRegistro.senha.length < 6) {
      setMensagemErro("A senha deve ter pelo menos 6 caracteres.")
      setCarregando(false)
      return
    }

    try {
      const resultado = await registrar(dadosRegistro)
      if (resultado.sucesso) {
        setMensagemSucesso("Registro realizado com sucesso! Faça login para continuar.")
        setTimeout(() => {
          setAbaAtiva("login")
        }, 1500)
      } else {
        setMensagemErro(resultado.mensagem)
      }
    } catch (error) {
      setMensagemErro("Ocorreu um erro ao tentar registrar. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  const handleRecuperacao = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setMensagemErro("")
    setMensagemSucesso("")

    try {
      const resultado = await recuperarSenha(emailRecuperacao)
      if (resultado.sucesso) {
        setMensagemSucesso(
          "Instruções de recuperação de senha foram enviadas para seu email. Verifique sua caixa de entrada.",
        )
      } else {
        setMensagemErro(resultado.mensagem)
      }
    } catch (error) {
      setMensagemErro("Ocorreu um erro ao tentar recuperar a senha. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1f1c45]">DocEscola</h1>
          <p className="mt-2 text-gray-600">Sistema de Transferência de Documentos Escolares</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <Tabs defaultValue="login" value={abaAtiva} onValueChange={setAbaAtiva} className="w-full">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="registro">Registro</TabsTrigger>
                <TabsTrigger value="recuperacao">Recuperar</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {mensagemErro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {mensagemErro}
              </div>
            )}

            {mensagemSucesso && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                {mensagemSucesso}
              </div>
            )}

            <Tabs value={abaAtiva} className="w-full">
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={dadosLogin.email}
                      onChange={handleLoginChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <div className="relative">
                      <Input
                        id="senha"
                        name="senha"
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={dadosLogin.senha}
                        onChange={handleLoginChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                      >
                        {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lembrar"
                        name="lembrar"
                        checked={dadosLogin.lembrar}
                        onCheckedChange={(checked) => setDadosLogin((prev) => ({ ...prev, lembrar: checked === true }))}
                      />
                      <Label htmlFor="lembrar" className="text-sm">
                        Lembrar de mim
                      </Label>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]" disabled={carregando}>
                    {carregando ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>

              </TabsContent>

              <TabsContent value="registro">
                <form onSubmit={handleRegistro} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Seu nome completo"
                      required
                      value={dadosRegistro.nome}
                      onChange={handleRegistroChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-registro">Email</Label>
                    <Input
                      id="email-registro"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={dadosRegistro.email}
                      onChange={handleRegistroChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha-registro">Senha</Label>
                      <div className="relative">
                        <Input
                          id="senha-registro"
                          name="senha"
                          type={mostrarSenha ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          value={dadosRegistro.senha}
                          onChange={handleRegistroChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmar-senha"
                          name="confirmarSenha"
                          type={mostrarSenha ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          value={dadosRegistro.confirmarSenha}
                          onChange={handleRegistroChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                          {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="papel">Tipo de Acesso</Label>
                    <Select value={dadosRegistro.papel} onValueChange={(value) => handleSelectChange("papel", value)}>
                      <SelectTrigger id="papel">
                        <SelectValue placeholder="Selecione seu papel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diretor">Diretor/Direção da Escola</SelectItem>
                        <SelectItem value="escola_destino">Escola Destino</SelectItem>
                        <SelectItem value="aluno">Aluno/Estudante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="escola">Escola</Label>
                    <Input
                      id="escola"
                      name="escola"
                      placeholder="Nome da sua escola"
                      required
                      value={dadosRegistro.escola}
                      onChange={handleRegistroChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade/Província</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      placeholder="Maputo, Beira, etc..."
                      required
                      value={dadosRegistro.cidade}
                      onChange={handleRegistroChange}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]" disabled={carregando}>
                    {carregando ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...
                      </>
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="recuperacao">
                <form onSubmit={handleRecuperacao} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-recuperacao">Email</Label>
                    <Input
                      id="email-recuperacao"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={emailRecuperacao}
                      onChange={(e) => setEmailRecuperacao(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]" disabled={carregando}>
                    {carregando ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                      </>
                    ) : (
                      "Recuperar Senha"
                    )}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Lembrou sua senha?{" "}
                    <button
                      type="button"
                      className="text-[#db341e] hover:underline"
                      onClick={() => setAbaAtiva("login")}
                    >
                      Voltar para o login
                    </button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center w-full">
              {abaAtiva === "login" ? (
                <p className="text-sm text-gray-500">
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    className="text-[#db341e] hover:underline"
                    onClick={() => setAbaAtiva("registro")}
                  >
                    Registre-se
                  </button>
                </p>
              ) : abaAtiva === "registro" ? (
                <p className="text-sm text-gray-500">
                  Já tem uma conta?{" "}
                  <button type="button" className="text-[#db341e] hover:underline" onClick={() => setAbaAtiva("login")}>
                    Faça login
                  </button>
                </p>
              ) : null}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
