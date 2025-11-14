// User types for different access levels
export type UserRole = "diretor" | "aluno"

// School transfer system users
export const usuariosTeste = [
  {
    id: "1",
    nome: "Dr. Carlos Silva",
    email: "diretor@escola1.com",
    senha: "senha123",
    papel: "diretor" as UserRole,
    escola: "Escola Secundária São João",
    cidade: "Maputo",
  },
  {
    id: "2",
    nome: "João Mateus",
    email: "joao@aluno.com",
    senha: "senha789",
    papel: "aluno" as UserRole,
    escola: "Escola Secundária São João",
    cidade: "Maputo",
    turma: "10A",
    classe: "10",
    bi: "123456789",
  },
  {
    id: "3",
    nome: "Maria Silva",
    email: "maria@aluno.com",
    senha: "senha456",
    papel: "aluno" as UserRole,
    escola: "Escola Técnica de Gaza",
    cidade: "Gaza",
    turma: "11B",
    classe: "11",
    bi: "987654321",
  },
  {
    id: "4",
    nome: "Dr. Edgar Cossa",
    email: "diretor@escola2.com",
    senha: "senha234",
    papel: "diretor" as UserRole,
    escola: "Escola Secundária Machel",
    cidade: "Maputo",
  },
]

// List of schools in the system
export const escolasSistema = [
  "Escola Primária São João",
  "Escola Secundária Machel",
  "Escola Técnica de Gaza",
  "Instituto Técnico Moçambicano",
  "Escola Industrial",
  "Escola Comercial Central",
  "Colégio Dom Bosco",
]

// Hash function for SHA-256 (simplified version)
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Generate short ID for documents
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Validate PIN (4-6 digits)
export function validarPIN(pin: string): boolean {
  return /^\d{4,6}$/.test(pin)
}

// Create PIN hash for storage
export async function criarHashPIN(pin: string): Promise<string> {
  return hashData(pin)
}

// Authentication function
export async function autenticar(email: string, senha: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const usuario = usuariosTeste.find((u) => u.email === email)

  if (!usuario) {
    return {
      sucesso: false,
      mensagem: "Usuário não encontrado.",
    }
  }

  if (usuario.senha !== senha) {
    return {
      sucesso: false,
      mensagem: "Senha incorreta.",
    }
  }

  // Simula o armazenamento do usuário na sessão
  localStorage.setItem(
    "usuarioAtual",
    JSON.stringify({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
      escola: usuario.escola,
      cidade: usuario.cidade,
    }),
  )

  return {
    sucesso: true,
    mensagem: "Login realizado com sucesso!",
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
      escola: usuario.escola,
      cidade: usuario.cidade,
    },
  }
}

// Interface for registration
interface DadosRegistro {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  papel: string
  escola: string
  cidade: string
}

// Registration function
export async function registrar(dados: DadosRegistro) {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const emailExistente = usuariosTeste.some((u) => u.email === dados.email)

  if (emailExistente) {
    return {
      sucesso: false,
      mensagem: "Este email já está em uso.",
    }
  }

  const novoUsuario = {
    id: (usuariosTeste.length + 1).toString(),
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    papel: dados.papel.toString() as UserRole,
    escola: dados.escola,
    cidade: dados.cidade,
  }

  usuariosTeste.push(novoUsuario)

  return {
    sucesso: true,
    mensagem: "Registro realizado com sucesso!",
  }
}

// Função simulada de recuperação de senha
export async function recuperarSenha(email: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const usuario = usuariosTeste.find((u) => u.email === email)

  if (!usuario) {
    return {
      sucesso: false,
      mensagem: "Email não encontrado em nossa base de dados.",
    }
  }

  return {
    sucesso: true,
    mensagem: "Instruções de recuperação enviadas para seu email.",
  }
}

// Função para verificar se o usuário está autenticado
export function verificarAutenticacao() {
  const usuarioAtual = localStorage.getItem("usuarioAtual")
  return usuarioAtual ? JSON.parse(usuarioAtual) : null
}

// Função para fazer logout
export function logout() {
  localStorage.removeItem("usuarioAtual")
  localStorage.removeItem("pinCriptografado")
}

// PIN management functions
export async function armazenarPIN(pin: string): Promise<void> {
  const hashPIN = await criarHashPIN(pin)
  localStorage.setItem("pinCriptografado", hashPIN)
}

export async function verificarPIN(pin: string): Promise<boolean> {
  const pinArmazenado = localStorage.getItem("pinCriptografado")
  if (!pinArmazenado) return false

  const hashPin = await criarHashPIN(pin)
  return hashPin === pinArmazenado
}

export function pinJaDefinido(): boolean {
  return localStorage.getItem("pinCriptografado") !== null
}

export interface Aluno {
  id: string
  nome: string
  bi: string
  escola: string
  turma: string
  classe: string
  dataCadastro: string
}

export const alunosRegistados: Aluno[] = [
  {
    id: "ALU001",
    nome: "João Mateus",
    bi: "123456789",
    escola: "Escola Primária São João",
    turma: "5A",
    classe: "5",
    dataCadastro: "2024-01-15",
  },
  {
    id: "ALU002",
    nome: "Maria Silva",
    bi: "987654321",
    escola: "Escola Secundária Machel",
    turma: "10B",
    classe: "10",
    dataCadastro: "2024-02-10",
  },
  {
    id: "ALU003",
    nome: "Pedro Oliveira",
    bi: "456789123",
    escola: "Escola Primária São João",
    turma: "4C",
    classe: "4",
    dataCadastro: "2024-01-20",
  },
  {
    id: "ALU004",
    nome: "Ana Costa",
    bi: "321654987",
    escola: "Escola Técnica de Gaza",
    turma: "11A",
    classe: "11",
    dataCadastro: "2024-03-05",
  },
  {
    id: "ALU005",
    nome: "Carlos Mango",
    bi: "789123456",
    escola: "Escola Secundária Machel",
    turma: "12C",
    classe: "12",
    dataCadastro: "2024-02-28",
  },
  {
    id: "ALU006",
    nome: "Zélia Mendes",
    bi: "654321789",
    escola: "Escola Primária São João",
    turma: "6B",
    classe: "6",
    dataCadastro: "2024-03-12",
  },
]

// Function to get students by school
export function obterAlunosPorEscola(escola: string): Aluno[] {
  return alunosRegistados.filter((aluno) => aluno.escola === escola)
}

// Function to get student by ID
export function obterAlunoPorId(id: string): Aluno | undefined {
  return alunosRegistados.find((aluno) => aluno.id === id)
}
