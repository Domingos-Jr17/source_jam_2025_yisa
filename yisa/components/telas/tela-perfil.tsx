"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Edit,
  Save,
  School,
  Building,
  IdCard,
} from "lucide-react"
import { verificarAutenticacao } from "@/lib/autenticacao"

export default function TelaPerfil() {
  const [modoEdicao, setModoEdicao] = useState(false)

  // ✅ Obtem usuário logado (com papel)
  const usuario = verificarAutenticacao() || {
    id: "2",
    nome: "João Mateus",
    email: "joao@aluno.com",
    senha: "senha789",
    papel: "aluno",
    escola: "Escola Secundária Machel",
    cidade: "Maputo",
    turma: "10A",
    classe: "10",
    bi: "123456789",
  }

  const [dadosUsuario, setDadosUsuario] = useState(usuario)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDadosUsuario((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const salvarPerfil = () => {
    setModoEdicao(false)
    alert("Perfil salvo com sucesso!")
  }

  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-bold text-[#1f1c45]">Perfil do Usuário</h2>
      <p className="text-gray-500">
        Gerencie suas informações pessoais e acompanhe seu progresso
      </p>

      <Tabs defaultValue="informacoes" className="w-full">
        <TabsList className="grid grid-cols-1 mb-6">
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lado esquerdo: Avatar + botão editar */}
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback className="text-2xl bg-[#1f1c45] text-white">
                      {usuario.nome?.split(" ")[0][0]}
                      {usuario.nome?.split(" ")[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{usuario.nome}</CardTitle>
                <CardDescription className="capitalize">
                  {usuario.papel}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge
                  variant="outline"
                  className="bg-[#1f1c45]/10 text-[#1f1c45]"
                >
                  {usuario.papel === "diretor" ? "Gestor Escolar" : "Estudante"}
                </Badge>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="outline"
                  className="w-full border-[#1f1c45] text-[#1f1c45]"
                  onClick={() => setModoEdicao(!modoEdicao)}
                >
                  {modoEdicao ? (
                    <>
                      <Save size={16} className="mr-2" />
                      Salvar
                    </>
                  ) : (
                    <>
                      <Edit size={16} className="mr-2" />
                      Editar Perfil
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Lado direito: informações dinâmicas */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Dados de cadastro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <Campo
                    icone={<User size={16} />}
                    label="Nome Completo"
                    name="nome"
                    valor={dadosUsuario.nome}
                    modoEdicao={modoEdicao}
                    handleChange={handleChange}
                  />

                  {/* Email */}
                  <Campo
                    icone={<Mail size={16} />}
                    label="Email"
                    name="email"
                    valor={dadosUsuario.email}
                    modoEdicao={modoEdicao}
                    handleChange={handleChange}
                  />

                  {/* Cidade */}
                  <Campo
                    icone={<MapPin size={16} />}
                    label="Cidade"
                    name="cidade"
                    valor={dadosUsuario.cidade}
                    modoEdicao={modoEdicao}
                    handleChange={handleChange}
                  />

                  {/* Escola */}
                  <Campo
                    icone={<School size={16} />}
                    label="Escola"
                    name="escola"
                    valor={dadosUsuario.escola}
                    modoEdicao={modoEdicao}
                    handleChange={handleChange}
                  />

                  {/* Campos específicos por papel */}
                  {usuario.papel === "aluno" && (
                    <>
                      <Campo
                        icone={<BookOpen size={16} />}
                        label="Turma"
                        name="turma"
                        valor={dadosUsuario.turma}
                        modoEdicao={modoEdicao}
                        handleChange={handleChange}
                      />

                      <Campo
                        icone={<Award size={16} />}
                        label="Classe"
                        name="classe"
                        valor={dadosUsuario.classe}
                        modoEdicao={modoEdicao}
                        handleChange={handleChange}
                      />

                      <Campo
                        icone={<IdCard size={16} />}
                        label="Bilhete de Identidade"
                        name="bi"
                        valor={dadosUsuario.bi}
                        modoEdicao={modoEdicao}
                        handleChange={handleChange}
                      />
                    </>
                  )}
                </div>
              </CardContent>

              {modoEdicao && (
                <CardFooter>
                  <Button
                    className="bg-[#1f1c45] hover:bg-[#2d2a5a] w-full"
                    onClick={salvarPerfil}
                  >
                    Salvar Alterações
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/** 🔧 Componente de campo reutilizável */
function Campo({
  icone,
  label,
  name,
  valor,
  modoEdicao,
  handleChange,
}: {
  icone: React.ReactNode
  label: string
  name: string
  valor: string
  modoEdicao: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {modoEdicao ? (
        <Input id={name} name={name} value={valor} onChange={handleChange} />
      ) : (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
          {icone}
          <span>{valor || "-"}</span>
        </div>
      )}
    </div>
  )
}
