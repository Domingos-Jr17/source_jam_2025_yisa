"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function TelaProgresso() {
  // Dados de teste para o gráfico de desempenho
  const dadosDesempenho = [
    { materia: "Matemática", pontuacao: 78, media: 65 },
    { materia: "Física", pontuacao: 65, media: 60 },
    { materia: "Química", pontuacao: 80, media: 68 },
    { materia: "Biologia", pontuacao: 72, media: 70 },
    { materia: "História", pontuacao: 85, media: 75 },
    { materia: "Geografia", pontuacao: 70, media: 72 },
  ]

  // Dados para o gráfico de radar
  const dadosHabilidades = [
    { subject: "Álgebra", A: 85, fullMark: 100 },
    { subject: "Geometria", A: 80, fullMark: 100 },
    { subject: "Cálculo", A: 60, fullMark: 100 },
    { subject: "Estatística", A: 70, fullMark: 100 },
    { subject: "Trigonometria", A: 75, fullMark: 100 },
    { subject: "Aritmética", A: 90, fullMark: 100 },
  ]

  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-bold text-[#1f1c45]">Análise de Desempenho</h2>
      <p className="text-gray-500">Acompanhe seu progresso e melhoria</p>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho Geral</CardTitle>
          <CardDescription>Comparação com a média da turma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosDesempenho}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="materia" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="pontuacao" name="Sua Pontuação" fill="#1f1c45" />
                <Bar dataKey="media" name="Média da Turma" fill="#db341e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perfil de Habilidades em Matemática</CardTitle>
          <CardDescription>Análise detalhada por área</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dadosHabilidades}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Suas Habilidades" dataKey="A" stroke="#1f1c45" fill="#1f1c45" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold text-[#1f1c45] mt-6">Desempenho por Matéria</h3>
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Matemática</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pontuação Média</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />

              <div className="flex justify-between text-sm mt-4">
                <div>
                  <div className="font-medium">Pontos Fortes</div>
                  <ul className="text-gray-500 list-disc list-inside">
                    <li>Álgebra</li>
                    <li>Geometria</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium">Pontos Fracos</div>
                  <ul className="text-gray-500 list-disc list-inside">
                    <li>Cálculo</li>
                    <li>Estatística</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Física</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pontuação Média</span>
                <span className="font-medium">65%</span>
              </div>
              <Progress value={65} className="h-2" />

              <div className="flex justify-between text-sm mt-4">
                <div>
                  <div className="font-medium">Pontos Fortes</div>
                  <ul className="text-gray-500 list-disc list-inside">
                    <li>Mecânica</li>
                    <li>Óptica</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium">Pontos Fracos</div>
                  <ul className="text-gray-500 list-disc list-inside">
                    <li>Termodinâmica</li>
                    <li>Eletromagnetismo</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Melhoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <div className="rounded-full bg-[#db341e] p-1 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-lightbulb"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Foco em Cálculo</p>
                <p className="text-sm text-gray-500">
                  Seu desempenho em cálculo está abaixo da média. Tente o pacote de quiz de cálculo.
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <div className="rounded-full bg-[#db341e] p-1 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-lightbulb"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Pratique Termodinâmica</p>
                <p className="text-sm text-gray-500">
                  Tente os exames práticos de termodinâmica para melhorar sua compreensão.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
