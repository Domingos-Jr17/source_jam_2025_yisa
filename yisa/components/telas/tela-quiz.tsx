"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Timer, Trophy, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TelaQuiz() {
  const [quizAtivo, setQuizAtivo] = useState<string | null>(null)
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null)
  const [respostaVerificada, setRespostaVerificada] = useState(false)
  const [pontuacao, setPontuacao] = useState(0)
  const [quizFinalizado, setQuizFinalizado] = useState(false)
  const [tempoRestante, setTempoRestante] = useState(0)

  const quizzes = {
    diario: {
      titulo: "Desafio Diário",
      descricao: "5 minutos",
      tempo: 300, // segundos
      questoes: [
        {
          pergunta: "Qual é o valor de π (pi) arredondado para duas casas decimais?",
          opcoes: ["3.12", "3.14", "3.16", "3.18"],
          resposta: "3.14",
        },
        {
          pergunta: "Qual é a fórmula química da água?",
          opcoes: ["H2O", "CO2", "O2", "H2O2"],
          resposta: "H2O",
        },
        {
          pergunta: "Qual é a capital do Brasil?",
          opcoes: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
          resposta: "Brasília",
        },
        {
          pergunta: "Quem escreveu 'Dom Casmurro'?",
          opcoes: ["José de Alencar", "Machado de Assis", "Carlos Drummond de Andrade", "Clarice Lispector"],
          resposta: "Machado de Assis",
        },
        {
          pergunta: "Qual é o maior planeta do Sistema Solar?",
          opcoes: ["Terra", "Marte", "Júpiter", "Saturno"],
          resposta: "Júpiter",
        },
      ],
    },
    contraOTempo: {
      titulo: "Contra o Tempo",
      descricao: "10 minutos",
      tempo: 600, // segundos
      questoes: [
        {
          pergunta: "Qual é o resultado de 15 × 7?",
          opcoes: ["95", "105", "115", "125"],
          resposta: "105",
        },
        {
          pergunta: "Qual é o símbolo químico do ouro?",
          opcoes: ["Au", "Ag", "Fe", "Cu"],
          resposta: "Au",
        },
        {
          pergunta: "Quantos lados tem um hexágono?",
          opcoes: ["5", "6", "7", "8"],
          resposta: "6",
        },
        {
          pergunta: "Qual é o maior oceano do mundo?",
          opcoes: ["Atlântico", "Índico", "Pacífico", "Ártico"],
          resposta: "Pacífico",
        },
        {
          pergunta: "Quem pintou a 'Mona Lisa'?",
          opcoes: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
          resposta: "Leonardo da Vinci",
        },
        {
          pergunta: "Qual é a velocidade da luz aproximadamente?",
          opcoes: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "1.000.000 km/s"],
          resposta: "300.000 km/s",
        },
        {
          pergunta: "Qual é o menor país do mundo em área territorial?",
          opcoes: ["Mônaco", "Vaticano", "Nauru", "San Marino"],
          resposta: "Vaticano",
        },
      ],
    },
    matematica: {
      titulo: "Pacote de Quiz de Matemática",
      descricao: "3 níveis de dificuldade • 200 questões",
      progresso: 45,
      questoes: [
        {
          pergunta: "Qual é a raiz quadrada de 144?",
          opcoes: ["10", "12", "14", "16"],
          resposta: "12",
        },
        {
          pergunta: "Se 2x + 5 = 15, qual é o valor de x?",
          opcoes: ["3", "5", "7", "10"],
          resposta: "5",
        },
        {
          pergunta: "Qual é o valor de log₁₀(100)?",
          opcoes: ["1", "2", "10", "100"],
          resposta: "2",
        },
        {
          pergunta: "Qual é a área de um círculo com raio 5 cm?",
          opcoes: ["25π cm²", "10π cm²", "5π cm²", "50π cm²"],
          resposta: "25π cm²",
        },
        {
          pergunta: "Qual é o valor de sen(30°)?",
          opcoes: ["0", "0.5", "1", "√3/2"],
          resposta: "0.5",
        },
      ],
    },
    fisica: {
      titulo: "Pacote de Quiz de Física",
      descricao: "3 níveis de dificuldade • 180 questões",
      progresso: 68,
      questoes: [
        {
          pergunta: "Qual é a unidade de medida da corrente elétrica?",
          opcoes: ["Volt", "Watt", "Ampere", "Ohm"],
          resposta: "Ampere",
        },
        {
          pergunta: "Qual é a fórmula da Segunda Lei de Newton?",
          opcoes: ["F = ma", "E = mc²", "F = G(m₁m₂)/r²", "v = d/t"],
          resposta: "F = ma",
        },
        {
          pergunta: "Qual é a unidade de potência no Sistema Internacional?",
          opcoes: ["Joule", "Newton", "Watt", "Pascal"],
          resposta: "Watt",
        },
        {
          pergunta: "O que mede a escala Kelvin?",
          opcoes: ["Pressão", "Temperatura", "Densidade", "Luminosidade"],
          resposta: "Temperatura",
        },
        {
          pergunta: "Qual é a velocidade do som no ar a 20°C?",
          opcoes: ["343 m/s", "300.000 km/s", "1.500 m/s", "100 m/s"],
          resposta: "343 m/s",
        },
      ],
    },
    quimica: {
      titulo: "Pacote de Quiz de Química",
      descricao: "3 níveis de dificuldade • 150 questões",
      progresso: 22,
      questoes: [
        {
          pergunta: "Qual é o número atômico do oxigênio?",
          opcoes: ["6", "8", "10", "12"],
          resposta: "8",
        },
        {
          pergunta: "Qual é o pH de uma solução neutra?",
          opcoes: ["0", "7", "10", "14"],
          resposta: "7",
        },
        {
          pergunta: "Qual elemento tem o símbolo 'Na'?",
          opcoes: ["Nitrogênio", "Níquel", "Neônio", "Sódio"],
          resposta: "Sódio",
        },
        {
          pergunta: "O que é um isótopo?",
          opcoes: [
            "Átomos com mesmo número de prótons e diferentes números de elétrons",
            "Átomos com mesmo número de prótons e diferentes números de nêutrons",
            "Átomos com diferentes números de prótons",
            "Moléculas com mesma fórmula química",
          ],
          resposta: "Átomos com mesmo número de prótons e diferentes números de nêutrons",
        },
        {
          pergunta: "Qual é a fórmula química do ácido sulfúrico?",
          opcoes: ["H2SO3", "H2SO4", "HNO3", "HCl"],
          resposta: "H2SO4",
        },
      ],
    },
  }

  const iniciarQuiz = (id: string) => {
    setQuizAtivo(id)
    setQuestaoAtual(0)
    setRespostaSelecionada(null)
    setRespostaVerificada(false)
    setPontuacao(0)
    setQuizFinalizado(false)

    // Configurar o tempo para o quiz
    if (id === "diario") {
      setTempoRestante(quizzes.diario.tempo)
    } else if (id === "contraOTempo") {
      setTempoRestante(quizzes.contraOTempo.tempo)
    } else {
      // Para os pacotes de matérias, não há tempo limite
      setTempoRestante(0)
    }
  }

  const continuarQuiz = (id: string) => {
    setQuizAtivo(id)
    // Aqui você poderia carregar o progresso salvo do usuário
    setQuestaoAtual(0)
    setRespostaSelecionada(null)
    setRespostaVerificada(false)
    setQuizFinalizado(false)
    setTempoRestante(0) // Sem tempo limite para os pacotes de matérias
  }

  const selecionarResposta = (resposta: string) => {
    if (!respostaVerificada) {
      setRespostaSelecionada(resposta)
    }
  }

  const verificarResposta = () => {
    if (!respostaSelecionada || respostaVerificada) return

    setRespostaVerificada(true)

    const quizAtual = quizzes[quizAtivo as keyof typeof quizzes]
    const respostaCorreta = quizAtual.questoes[questaoAtual].resposta

    if (respostaSelecionada === respostaCorreta) {
      setPontuacao((prev) => prev + 1)
    }
  }

  const proximaQuestao = () => {
    const quizAtual = quizzes[quizAtivo as keyof typeof quizzes]

    if (questaoAtual < quizAtual.questoes.length - 1) {
      setQuestaoAtual((prev) => prev + 1)
      setRespostaSelecionada(null)
      setRespostaVerificada(false)
    } else {
      // Finalizar o quiz
      setQuizFinalizado(true)
    }
  }

  const finalizarQuiz = () => {
    setQuizAtivo(null)
    // Aqui você poderia salvar os resultados do quiz
    alert(`Quiz finalizado! Sua pontuação: ${pontuacao}/${quizzes[quizAtivo as keyof typeof quizzes].questoes.length}`)
  }

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`
  }

  if (quizAtivo) {
    const quizAtual = quizzes[quizAtivo as keyof typeof quizzes]

    return (
      <div className="space-y-6 py-4">
        {/* Cabeçalho do Quiz */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setQuizAtivo(null)} className="mr-2">
              <ArrowLeft className="mr-2" size={16} />
              Voltar
            </Button>
            <h2 className="text-2xl font-bold text-[#1f1c45]">{quizAtual.titulo}</h2>
          </div>
          {tempoRestante > 0 && (
            <div className="flex items-center bg-[#db341e] text-white px-4 py-2 rounded-md">
              <Timer className="mr-2" size={16} />
              <span className="font-medium">{formatarTempo(tempoRestante)}</span>
            </div>
          )}
        </div>

        {/* Conteúdo do Quiz */}
        <div className="bg-white border rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          {quizFinalizado ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <Trophy className="text-[#db341e]" size={64} />
              <h3 className="text-2xl font-bold">Quiz Concluído!</h3>
              <p className="text-center text-gray-600">
                Sua pontuação: {pontuacao} de {quizAtual.questoes.length}
              </p>
              <Progress value={(pontuacao / quizAtual.questoes.length) * 100} className="h-2 w-full max-w-md" />
              <Button onClick={finalizarQuiz} className="mt-4 bg-[#1f1c45]">
                Voltar para Quizzes
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-medium">
                  Questão {questaoAtual + 1} de {quizAtual.questoes.length}
                </h3>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">Pontuação: {pontuacao}</div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-medium">{quizAtual.questoes[questaoAtual].pergunta}</h4>

                <div className="space-y-3">
                  {quizAtual.questoes[questaoAtual].opcoes.map((opcao, index) => {
                    const isSelected = respostaSelecionada === opcao
                    const isCorrect = respostaVerificada && opcao === quizAtual.questoes[questaoAtual].resposta
                    const isWrong = respostaVerificada && isSelected && !isCorrect

                    return (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center justify-between border p-4 rounded-md cursor-pointer",
                          isSelected && !respostaVerificada && "border-[#1f1c45] bg-[#1f1c45]/10",
                          isCorrect && "border-green-500 bg-green-50",
                          isWrong && "border-red-500 bg-red-50",
                        )}
                        onClick={() => selecionarResposta(opcao)}
                      >
                        <span>{opcao}</span>
                        {respostaVerificada && isCorrect && <CheckCircle2 className="text-green-500" size={20} />}
                        {respostaVerificada && isWrong && <XCircle className="text-red-500" size={20} />}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-center pt-6">
                {!respostaVerificada ? (
                  <Button onClick={verificarResposta} disabled={!respostaSelecionada} className="bg-[#1f1c45] px-8">
                    Verificar Resposta
                  </Button>
                ) : (
                  <Button onClick={proximaQuestao} className="bg-[#1f1c45] px-8">
                    {questaoAtual < quizAtual.questoes.length - 1 ? "Próxima Questão" : "Ver Resultado"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-bold text-[#1f1c45]">Jogos de Quiz</h2>
      <p className="text-gray-500">Aprenda enquanto joga quizzes interativos</p>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-[#1f1c45] to-[#2d2a5a] text-white">
          <CardHeader className="p-4">
            <CardTitle className="text-base">{quizzes.diario.titulo}</CardTitle>
            <CardDescription className="text-gray-200">{quizzes.diario.descricao}</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full bg-white text-[#1f1c45] hover:bg-gray-100" onClick={() => iniciarQuiz("diario")}>
              Jogar Agora
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-[#db341e] to-[#e85c4a] text-white">
          <CardHeader className="p-4">
            <CardTitle className="text-base">{quizzes.contraOTempo.titulo}</CardTitle>
            <CardDescription className="text-gray-200">{quizzes.contraOTempo.descricao}</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full bg-white text-[#db341e] hover:bg-gray-100"
              onClick={() => iniciarQuiz("contraOTempo")}
            >
              Jogar Agora
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h3 className="text-lg font-semibold text-[#1f1c45] mt-6">Quizzes por Matéria</h3>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{quizzes.matematica.titulo}</CardTitle>
            <CardDescription>{quizzes.matematica.descricao}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">Conclusão</div>
                <div className="flex items-center space-x-2">
                  <Progress value={quizzes.matematica.progresso} className="h-2 w-24" />
                  <span className="text-sm text-gray-500">{quizzes.matematica.progresso}%</span>
                </div>
              </div>
              <Button className="bg-[#1f1c45] hover:bg-[#2d2a5a]" onClick={() => continuarQuiz("matematica")}>
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{quizzes.fisica.titulo}</CardTitle>
            <CardDescription>{quizzes.fisica.descricao}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">Conclusão</div>
                <div className="flex items-center space-x-2">
                  <Progress value={quizzes.fisica.progresso} className="h-2 w-24" />
                  <span className="text-sm text-gray-500">{quizzes.fisica.progresso}%</span>
                </div>
              </div>
              <Button className="bg-[#1f1c45] hover:bg-[#2d2a5a]" onClick={() => continuarQuiz("fisica")}>
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{quizzes.quimica.titulo}</CardTitle>
            <CardDescription>{quizzes.quimica.descricao}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">Conclusão</div>
                <div className="flex items-center space-x-2">
                  <Progress value={quizzes.quimica.progresso} className="h-2 w-24" />
                  <span className="text-sm text-gray-500">{quizzes.quimica.progresso}%</span>
                </div>
              </div>
              <Button className="bg-[#1f1c45] hover:bg-[#2d2a5a]" onClick={() => continuarQuiz("quimica")}>
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
