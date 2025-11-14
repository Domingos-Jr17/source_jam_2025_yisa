"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Bell, Lock, BookOpen, Save, AlertTriangle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

export default function TelaConfiguracoes() {
  const [configNotificacoes, setConfigNotificacoes] = useState({
    exames: true,
    quizzes: true,
    lembretes: true,
    atualizacoes: false,
    email: true,
    push: true,
    antecedencia: "1dia",
  })

  const [configPrivacidade, setConfigPrivacidade] = useState({
    perfilPublico: false,
    mostrarProgresso: true,
    mostrarConquistas: true,
    compartilharDados: false,
  })

  const [configEstudo, setConfigEstudo] = useState({
    dificuldade: "medio",
    tempoSessao: 25,
    tempoIntervalo: 5,
    temaEscuro: false,
    tamanhoFonte: "medio",
  })

  const handleNotificacaoChange = (key: keyof typeof configNotificacoes, value: boolean | string) => {
    setConfigNotificacoes((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handlePrivacidadeChange = (key: keyof typeof configPrivacidade, value: boolean) => {
    setConfigPrivacidade((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleEstudoChange = (key: keyof typeof configEstudo, value: string | number | boolean) => {
    setConfigEstudo((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const salvarConfiguracoes = () => {
    // Aqui você implementaria a lógica para salvar as configurações no backend
    alert("Configurações salvas com sucesso!")
  }

  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-bold text-[#1f1c45]">Configurações</h2>
      <p className="text-gray-500">Personalize sua experiência e gerencie suas preferências</p>

      <Tabs defaultValue="notificacoes" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="privacidade">Privacidade</TabsTrigger>
          <TabsTrigger value="estudo">Preferências de Estudo</TabsTrigger>
        </TabsList>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="text-[#db341e]" />
                <CardTitle>Configurações de Notificações</CardTitle>
              </div>
              <CardDescription>Gerencie como e quando deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Tipos de Notificações</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="exames" className="font-medium">
                        Exames
                      </Label>
                      <p className="text-sm text-gray-500">Receba notificações sobre novos exames disponíveis</p>
                    </div>
                    <Switch
                      id="exames"
                      checked={configNotificacoes.exames}
                      onCheckedChange={(checked) => handleNotificacaoChange("exames", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="quizzes" className="font-medium">
                        Quizzes
                      </Label>
                      <p className="text-sm text-gray-500">Receba notificações sobre novos quizzes e desafios</p>
                    </div>
                    <Switch
                      id="quizzes"
                      checked={configNotificacoes.quizzes}
                      onCheckedChange={(checked) => handleNotificacaoChange("quizzes", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lembretes" className="font-medium">
                        Lembretes de Estudo
                      </Label>
                      <p className="text-sm text-gray-500">Receba lembretes para manter sua rotina de estudos</p>
                    </div>
                    <Switch
                      id="lembretes"
                      checked={configNotificacoes.lembretes}
                      onCheckedChange={(checked) => handleNotificacaoChange("lembretes", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="atualizacoes" className="font-medium">
                        Atualizações do App
                      </Label>
                      <p className="text-sm text-gray-500">Receba notificações sobre novas funcionalidades</p>
                    </div>
                    <Switch
                      id="atualizacoes"
                      checked={configNotificacoes.atualizacoes}
                      onCheckedChange={(checked) => handleNotificacaoChange("atualizacoes", checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Canais de Notificação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email" className="font-medium">
                        Email
                      </Label>
                      <p className="text-sm text-gray-500">Receba notificações por email</p>
                    </div>
                    <Switch
                      id="email"
                      checked={configNotificacoes.email}
                      onCheckedChange={(checked) => handleNotificacaoChange("email", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push" className="font-medium">
                        Notificações Push
                      </Label>
                      <p className="text-sm text-gray-500">Receba notificações no seu dispositivo</p>
                    </div>
                    <Switch
                      id="push"
                      checked={configNotificacoes.push}
                      onCheckedChange={(checked) => handleNotificacaoChange("push", checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Preferências de Tempo</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="antecedencia" className="font-medium">
                      Antecedência para Lembretes
                    </Label>
                    <p className="text-sm text-gray-500 mb-2">
                      Com quanta antecedência deseja receber lembretes de exames
                    </p>
                    <Select
                      value={configNotificacoes.antecedencia}
                      onValueChange={(value) => handleNotificacaoChange("antecedencia", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a antecedência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1hora">1 hora antes</SelectItem>
                        <SelectItem value="3horas">3 horas antes</SelectItem>
                        <SelectItem value="1dia">1 dia antes</SelectItem>
                        <SelectItem value="3dias">3 dias antes</SelectItem>
                        <SelectItem value="1semana">1 semana antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]" onClick={salvarConfiguracoes}>
                <Save className="mr-2" size={16} />
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacidade">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="text-[#db341e]" />
                <CardTitle>Configurações de Privacidade</CardTitle>
              </div>
              <CardDescription>Controle quem pode ver suas informações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Visibilidade do Perfil</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="perfilPublico" className="font-medium">
                        Perfil Público
                      </Label>
                      <p className="text-sm text-gray-500">Permitir que outros usuários vejam seu perfil</p>
                    </div>
                    <Switch
                      id="perfilPublico"
                      checked={configPrivacidade.perfilPublico}
                      onCheckedChange={(checked) => handlePrivacidadeChange("perfilPublico", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mostrarProgresso" className="font-medium">
                        Mostrar Progresso
                      </Label>
                      <p className="text-sm text-gray-500">Permitir que outros vejam seu progresso nos estudos</p>
                    </div>
                    <Switch
                      id="mostrarProgresso"
                      checked={configPrivacidade.mostrarProgresso}
                      onCheckedChange={(checked) => handlePrivacidadeChange("mostrarProgresso", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mostrarConquistas" className="font-medium">
                        Mostrar Conquistas
                      </Label>
                      <p className="text-sm text-gray-500">Permitir que outros vejam suas conquistas e medalhas</p>
                    </div>
                    <Switch
                      id="mostrarConquistas"
                      checked={configPrivacidade.mostrarConquistas}
                      onCheckedChange={(checked) => handlePrivacidadeChange("mostrarConquistas", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compartilharDados" className="font-medium">
                        Compartilhar Dados de Uso
                      </Label>
                      <p className="text-sm text-gray-500">
                        Compartilhar dados anônimos para melhorar a experiência do app
                      </p>
                    </div>
                    <Switch
                      id="compartilharDados"
                      checked={configPrivacidade.compartilharDados}
                      onCheckedChange={(checked) => handlePrivacidadeChange("compartilharDados", checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Dados da Conta</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full border-[#1f1c45] text-[#1f1c45]">
                    Alterar Senha
                  </Button>
                  <Button variant="outline" className="w-full border-[#1f1c45] text-[#1f1c45]">
                    Exportar Meus Dados
                  </Button>
                  <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                    <AlertTriangle className="mr-2" size={16} />
                    Excluir Minha Conta
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]" onClick={salvarConfiguracoes}>
                <Save className="mr-2" size={16} />
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="estudo">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="text-[#db341e]" />
                <CardTitle>Preferências de Estudo</CardTitle>
              </div>
              <CardDescription>Personalize sua experiência de estudo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações de Dificuldade</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium mb-2 block">Nível de Dificuldade Padrão</Label>
                    <RadioGroup
                      value={configEstudo.dificuldade}
                      onValueChange={(value) => handleEstudoChange("dificuldade", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="facil" id="facil" />
                        <Label htmlFor="facil">Fácil</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medio" id="medio" />
                        <Label htmlFor="medio">Médio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dificil" id="dificil" />
                        <Label htmlFor="dificil">Difícil</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Temporizador Pomodoro</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="tempoSessao" className="font-medium">
                        Tempo de Sessão de Estudo
                      </Label>
                      <span>{configEstudo.tempoSessao} minutos</span>
                    </div>
                    <Slider
                      id="tempoSessao"
                      min={5}
                      max={60}
                      step={5}
                      value={[configEstudo.tempoSessao]}
                      onValueChange={(value) => handleEstudoChange("tempoSessao", value[0])}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="tempoIntervalo" className="font-medium">
                        Tempo de Intervalo
                      </Label>
                      <span>{configEstudo.tempoIntervalo} minutos</span>
                    </div>
                    <Slider
                      id="tempoIntervalo"
                      min={1}
                      max={15}
                      step={1}
                      value={[configEstudo.tempoIntervalo]}
                      onValueChange={(value) => handleEstudoChange("tempoIntervalo", value[0])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Aparência</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="temaEscuro" className="font-medium">
                        Tema Escuro
                      </Label>
                      <p className="text-sm text-gray-500">Ativar modo escuro para reduzir o cansaço visual</p>
                    </div>
                    <Switch
                      id="temaEscuro"
                      checked={configEstudo.temaEscuro}
                      onCheckedChange={(checked) => handleEstudoChange("temaEscuro", checked)}
                    />
                  </div>
                  <Separator />
                  <div>
                    <Label htmlFor="tamanhoFonte" className="font-medium">
                      Tamanho da Fonte
                    </Label>
                    <p className="text-sm text-gray-500 mb-2">Ajuste o tamanho do texto para melhor leitura</p>
                    <Select
                      value={configEstudo.tamanhoFonte}
                      onValueChange={(value) => handleEstudoChange("tamanhoFonte", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tamanho da fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeno">Pequeno</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                        <SelectItem value="extragrande">Extra Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#1f1c45] hover:bg-[#2d2a5a]" onClick={salvarConfiguracoes}>
                <Save className="mr-2" size={16} />
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
