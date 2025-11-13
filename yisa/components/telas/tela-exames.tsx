"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Timer, AlertCircle, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"

export default function TelaExames() {
  const [exameAtivo, setExameAtivo] = useState<string | null>(null)
  const [tempoRestante, setTempoRestante] = useState(0)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [respostas, setRespostas] = useState<Record<number, string>>({})
  const questoesPorPagina = 10

  const exames = [
    {
      id: "matematica",
      titulo: "Exame Final de Matemática",
      descricao: "Duração: 3 horas • 50 questões",
      disponivel: true,
      mensagem: "Esta simulação abrange álgebra, cálculo e estatística de todo o semestre.",
      duracao: 180, // minutos
      questoes: Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        pergunta: `Questão ${i + 1}: ${i % 3 === 0 ? "Se f(x) = 2x² + 3x - 5, qual é o valor de f(" + (i + 1) + ")?" : i % 3 === 1 ? "Qual é a derivada de f(x) = x³ + " + (i + 1) + "x² - 4x + 7?" : "Resolva a equação: " + (i + 1) + "x + 5 = " + ((i + 1) * 2 + 5)}`,
        opcoes: ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
        resposta:
          i % 4 === 0
            ? "Alternativa A"
            : i % 4 === 1
              ? "Alternativa B"
              : i % 4 === 2
                ? "Alternativa C"
                : "Alternativa D",
      })),
    },
    {
      id: "fisica",
      titulo: "Exame Final de Física",
      descricao: "Duração: 2.5 horas • 40 questões",
      disponivel: true,
      mensagem: "Abrange mecânica, termodinâmica e eletromagnetismo.",
      duracao: 150, // minutos
      questoes: Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        pergunta: `Questão ${i + 1}: ${i % 3 === 0 ? "Qual é a unidade de medida da força no Sistema Internacional?" : i % 3 === 1 ? "Um objeto é lançado verticalmente para cima. No ponto mais alto de sua trajetória, qual é a sua velocidade?" : "Calcule a energia cinética de um objeto com massa " + (i + 1) + " kg movendo-se a " + (i + 1) * 2 + " m/s."}`,
        opcoes: ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
        resposta:
          i % 4 === 0
            ? "Alternativa A"
            : i % 4 === 1
              ? "Alternativa B"
              : i % 4 === 2
                ? "Alternativa C"
                : "Alternativa D",
      })),
    },
    {
      id: "quimica",
      titulo: "Exame Final de Química",
      descricao: "Duração: 2 horas • 45 questões",
      disponivel: false,
      mensagem: "Abrange química orgânica, química inorgânica e bioquímica.",
      duracao: 120, // minutos
      disponibilidadeEm: "2 dias",
      questoes: [],
    },
  ]

  const iniciarExame = (id: string) => {
    const exame = exames.find((e) => e.id === id)
    if (exame && exame.disponivel) {
      setExameAtivo(id)
      setTempoRestante(exame.duracao * 60) // Convertendo para segundos
      setPaginaAtual(1)
      setRespostas({})
    }
  }

  const finalizarExame = () => {
    // Aqui você poderia calcular a pontuação, salvar resultados, etc.
    setExameAtivo(null)

    // Simulando um resultado salvo
    alert(`Exame finalizado! Suas respostas foram salvas.`)
  }

  const responderQuestao = (questaoId: number, resposta: string) => {
    setRespostas((prev) => ({
      ...prev,
      [questaoId]: resposta,
    }))
  }

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`
  }

  const exameAtual = exames.find((e) => e.id === exameAtivo)
  const totalPaginas = exameAtual ? Math.ceil(exameAtual.questoes.length / questoesPorPagina) : 0
  const questoesAtuais = exameAtual
    ? exameAtual.questoes.slice((paginaAtual - 1) * questoesPorPagina, paginaAtual * questoesPorPagina)
    : []

  if (exameAtivo) {
    return (
      <div className="space-y-6 py-4">
        {/* Cabeçalho do Exame */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setExameAtivo(null)} className="mr-2">
              <ArrowLeft className="mr-2" size={16} />
              Voltar
            </Button>
            <h2 className="text-2xl font-bold text-[#1f1c45]">{exameAtual?.titulo}</h2>
          </div>
          <div className="flex items-center bg-[#1f1c45] text-white px-4 py-2 rounded-md">
            <Timer className="mr-2" size={16} />
            <span className="font-medium">{formatarTempo(tempoRestante)}</span>
          </div>
        </div>

        {/* Folha de Exame */}
        <div className="bg-white border rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8 border-b pb-4">
            <h3 className="text-xl font-bold">{exameAtual?.titulo}</h3>
            <p className="text-gray-500">{exameAtual?.descricao}</p>
          </div>

          <div className="space-y-8">
            {questoesAtuais.map((questao) => (
              <div key={questao.id} className="border-b pb-6 last:border-b-0">
                <p className="font-medium mb-4">{questao.pergunta}</p>
                <RadioGroup
                  value={respostas[questao.id] || ""}
                  onValueChange={(value) => responderQuestao(questao.id, value)}
                  className="space-y-3"
                >
                  {questao.opcoes.map((opcao, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={opcao} id={`questao-${questao.id}-opcao-${index}`} />
                      <Label htmlFor={`questao-${questao.id}-opcao-${index}`}>{opcao}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="mt-8 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
            >
              <ChevronLeft className="mr-2" size={16} />
              Anterior
            </Button>

            <Pagination>
              <PaginationContent>
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink isActive={paginaAtual === i + 1} onClick={() => setPaginaAtual(i + 1)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>

            <Button
              variant="outline"
              onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
            >
              Próxima
              <ChevronRight className="ml-2" size={16} />
            </Button>
          </div>

          {/* Botão de Finalizar */}
          <div className="mt-8 flex justify-center">
            <Button variant="destructive" onClick={finalizarExame} className="flex items-center">
              <AlertCircle className="mr-2" size={16} />
              Finalizar Exame
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-bold text-[#1f1c45]">Simulação de Exame Online</h2>
      <p className="text-gray-500">Pratique com condições reais de exame</p>

      <div className="space-y-4">
        {exames.map((exame) => (
          <Card key={exame.id}>
            <CardHeader>
              <CardTitle>{exame.titulo}</CardTitle>
              <CardDescription>{exame.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${exame.disponivel ? "bg-green-500" : "bg-yellow-500"}`}></div>
                <span className={`text-sm ${exame.disponivel ? "text-green-600" : "text-yellow-600"}`}>
                  {exame.disponivel ? "Disponível agora" : `Disponível em ${exame.disponibilidadeEm}`}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{exame.mensagem}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Ver Detalhes</Button>
              <Button
                className="bg-[#db341e] hover:bg-[#c02e1a]"
                disabled={!exame.disponivel}
                onClick={() => iniciarExame(exame.id)}
              >
                {exame.disponivel ? "Iniciar Exame" : "Em Breve"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
