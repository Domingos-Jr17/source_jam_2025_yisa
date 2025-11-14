export type NotificacaoTipo = "solicitacao" | "emissao" | "aprovacao"

export interface Notificacao {
  id: string
  tipo: NotificacaoTipo
  titulo: string
  mensagem: string
  data: string
  lida: boolean
  destinatario: string // escola ou aluno
  remetente: string
  documentoId?: string
  qrCode?: string
}

// Create notification
export function criarNotificacao(
  tipo: NotificacaoTipo,
  titulo: string,
  mensagem: string,
  destinatario: string,
  remetente: string,
  documentoId?: string,
  qrCode?: string,
): Notificacao {
  return {
    id: Math.random().toString(36).substring(2, 10).toUpperCase(),
    tipo,
    titulo,
    mensagem,
    data: new Date().toISOString(),
    lida: false,
    destinatario,
    remetente,
    documentoId,
    qrCode,
  }
}

// Save notification
export function salvarNotificacao(notificacao: Notificacao): void {
  const notificacoes = obterTodasNotificacoes()
  notificacoes.push(notificacao)
  localStorage.setItem("notificacoes", JSON.stringify(notificacoes))
}

// Get all notifications
export function obterTodasNotificacoes(): Notificacao[] {
  const notificacoes = localStorage.getItem("notificacoes")
  return notificacoes ? JSON.parse(notificacoes) : []
}

// Get notifications by recipient (school or student)
export function obterNotificacoesPorDestinatario(destinatario: string): Notificacao[] {
  const notificacoes = obterTodasNotificacoes()
  return notificacoes.filter((n) => n.destinatario === destinatario).sort((a, b) => {
    return new Date(b.data).getTime() - new Date(a.data).getTime()
  })
}

// Mark notification as read
export function marcarComoLida(notificacaoId: string): void {
  const notificacoes = obterTodasNotificacoes()
  const notificacao = notificacoes.find((n) => n.id === notificacaoId)
  if (notificacao) {
    notificacao.lida = true
    localStorage.setItem("notificacoes", JSON.stringify(notificacoes))
  }
}

// Mark all notifications as read for a recipient
export function marcarTodasComoLidas(destinatario: string): void {
  const notificacoes = obterTodasNotificacoes()
  notificacoes.forEach((n) => {
    if (n.destinatario === destinatario) {
      n.lida = true
    }
  })
  localStorage.setItem("notificacoes", JSON.stringify(notificacoes))
}

// Get unread count
export function obterContagemNaoLidas(destinatario: string): number {
  const notificacoes = obterNotificacoesPorDestinatario(destinatario)
  return notificacoes.filter((n) => !n.lida).length
}

// Delete notification
export function deletarNotificacao(notificacaoId: string): void {
  const notificacoes = obterTodasNotificacoes()
  const novasNotificacoes = notificacoes.filter((n) => n.id !== notificacaoId)
  localStorage.setItem("notificacoes", JSON.stringify(novasNotificacoes))
}
