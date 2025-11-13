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
    escola: "Escola Primária São João",
    cidade: "Maputo",
  },
  {
    id: "2",
    nome: "João Mateus",
    email: "joao@aluno.com",
    senha: "senha789",
    papel: "aluno" as UserRole,
    escola: "Escola Secundária Machel",
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
  papel: UserRole
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
    papel: dados.papel,
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
