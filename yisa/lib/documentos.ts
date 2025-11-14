import { hashData, generateShortId } from "@/lib/autenticacao"

export interface DadosEstudante {
  nomeCompleto: string
  numeroBi: string
  dataMatricula: string
  classe: string
  nivelAcademico: "primario" | "secundario"
  notas: Record<string, string>
  observacoes: string
}

export interface DocumentoTransferencia {
  id: string
  shortId: string
  estudante: DadosEstudante
  dataEmissao: string
  escolaOrigem: string
  cidadeOrigem: string
  nivelAcademico: "primario" | "secundario"
  hash: string
  qrCodeData: string
}

export interface SolicitacaoTransferencia {
  id: string
  escolaOrigem: string
  escolaDestino: string
  nomeEstudante: string
  turma: string
  classe: string
  bi: string
  motivo: string
  dataSolicitacao: string
  status: "pendente" | "aprovada" | "rejeitada"
}

export const DISCIPLINAS_POR_NIVEL = {
  primario: [
    { key: "matematica", label: "Matemática" },
    { key: "portugues", label: "Português" },
    { key: "ciencias_naturais", label: "Ciências Naturais" },
    { key: "ciencias_sociais", label: "Ciências Sociais" },
    { key: "ingles", label: "Inglês" },
    { key: "ed_moral_civica", label: "Ed Moral Cívica" },
    { key: "oficios", label: "Ofícios" },
    { key: "ed_visual", label: "Ed Visual" },
    { key: "ed_fisica", label: "Ed Física" },
  ],
  secundario: [
    { key: "matematica", label: "Matemática" },
    { key: "portugues", label: "Português" },
    { key: "fisica", label: "Física" },
    { key: "ed_visual", label: "Ed Visual" },
    { key: "biologia", label: "Biologia" },
    { key: "quimica", label: "Química" },
    { key: "historia", label: "História" },
    { key: "ingles", label: "Inglês" },
    { key: "filosofia", label: "Filosofia" },
    { key: "empreendedorismo", label: "Empreendedorismo" },
    { key: "ed_fisica", label: "Ed Física" },
    { key: "tics", label: "TICS" },
  ],
}

// Generate QR code data for the document
export function gerarDadosQR(shortId: string, hash: string): string {
  return `${shortId}|${hash}`
}

// Create document hash
export async function criarHashDocumento(dados: DadosEstudante, dataEmissao: string, shortId: string): Promise<string> {
  const dataString = JSON.stringify({
    ...dados,
    dataEmissao,
    shortId,
  })
  return hashData(dataString)
}

// Generate complete document
export async function gerarDocumento(
  dados: DadosEstudante,
  escolaOrigem: string,
  cidadeOrigem: string,
): Promise<DocumentoTransferencia> {
  const shortId = generateShortId()
  const dataEmissao = new Date().toISOString().split("T")[0]
  const hash = await criarHashDocumento(dados, dataEmissao, shortId)
  const qrCodeData = gerarDadosQR(shortId, hash)

  const documento: DocumentoTransferencia = {
    id: Math.random().toString(36).substring(2, 11),
    shortId,
    estudante: dados,
    dataEmissao,
    escolaOrigem,
    cidadeOrigem,
    nivelAcademico: dados.nivelAcademico,
    hash,
    qrCodeData,
  }

  // Store in localStorage with shortId as key
  const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}")
  documentosArmazenados[shortId] = documento
  localStorage.setItem("documentosEmitidos", JSON.stringify(documentosArmazenados))

  return documento
}

// Retrieve document by shortId
export function recuperarDocumento(shortId: string): DocumentoTransferencia | null {
  const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}")
  return documentosArmazenados[shortId] || null
}

// Verify document integrity
export async function verificarIntegridade(documento: DocumentoTransferencia): Promise<boolean> {
  const hashRecalculado = await criarHashDocumento(documento.estudante, documento.dataEmissao, documento.shortId)
  return hashRecalculado === documento.hash
}

// Get all emitted documents
export function obterTodosDocumentos(): DocumentoTransferencia[] {
  const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}")
  return Object.values(documentosArmazenados) as DocumentoTransferencia[]
}

export function obterTodosSolicitacoes(): SolicitacaoTransferencia[] {
  const solicitacoesArmazenados = JSON.parse(localStorage.getItem("solicitacoesTransferencia") || "{}")
  return Object.values(solicitacoesArmazenados) as SolicitacaoTransferencia[]
}


export function apagarDocumentosPorUsuario( shortId: string ) {
  const documentosArmazenados = JSON.parse(localStorage.getItem("documentosEmitidos") || "{}");
  const documentosArray: DocumentoTransferencia[] = Object.values(documentosArmazenados);

  const documentosRestantes = documentosArray.filter((doc) =>
      doc.shortId.includes(shortId),
  );

  const novoArmazenamento = documentosRestantes.reduce((acc, doc) => {
    acc[doc.shortId] = doc;
    return acc;
  }, {} as Record<string, DocumentoTransferencia>);

  localStorage.setItem("documentosEmitidos", JSON.stringify(novoArmazenamento));

  return documentosRestantes; // opcional, retorna os documentos que sobraram
}


export function getDocumentsBySchool(escolaBuscada: string): any[] {
  const raw = localStorage.getItem("documentosEmitidos");

  if (!raw) return []; 

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error("JSON inválido em localStorage.documentosEmitidos:", e, raw);
    return [];
  }

  if (Array.isArray(parsed)) {
    return parsed.filter((doc: any) => doc && doc.escolaOrigem === escolaBuscada);
  }

  if (parsed && typeof parsed === "object") {
    const valores = Object.values(parsed);

     const pareceDocumento = (obj: any) =>
      obj && typeof obj === "object" && "escolaOrigem" in obj;

    if (pareceDocumento(parsed) && !Array.isArray(parsed)) {
      return parsed.escolaOrigem === escolaBuscada ? [parsed] : [];
    }

    return valores
      .filter((v: any) => typeof v === "object" && v !== null && "escolaOrigem" in v)
      .filter((doc: any) => doc.escolaOrigem === escolaBuscada);
  }

  return [];
}

// Format document for PDF display
export function formatarDocumentoPDF(documento: DocumentoTransferencia): string {
  const disciplinas = DISCIPLINAS_POR_NIVEL[documento.estudante.nivelAcademico]
  const notasFormatadas = disciplinas
    .map((d) => `${d.label}: ${documento.estudante.notas[d.key] || "-"}/20`)
    .join("\n")

  return `
DOCUMENTO DE TRANSFERÊNCIA ESCOLAR
===================================

ID Documento: ${documento.shortId}
Data de Emissão: ${documento.dataEmissao}

ESTUDANTE:
---------
Nome: ${documento.estudante.nomeCompleto}
BI: ${documento.estudante.numeroBi}
Classe: ${documento.estudante.classe}
Nível: ${documento.estudante.nivelAcademico === "primario" ? "Primário" : "Secundário"}
Data de Matrícula: ${documento.estudante.dataMatricula}

NOTAS:
------
${notasFormatadas}

OBSERVAÇÕES:
${documento.estudante.observacoes || "Nenhuma observação"}

ESCOLA DE ORIGEM:
${documento.escolaOrigem}, ${documento.cidadeOrigem}

VERIFICAÇÃO:
Hash SHA-256: ${documento.hash.substring(0, 16)}...
QR Code: ${documento.qrCodeData}
  `
}
