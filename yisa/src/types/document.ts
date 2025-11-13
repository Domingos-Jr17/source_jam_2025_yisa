/**
 * Tipos de dados para documentos do sistema YISA
 * Document data types for the YISA system
 */

export interface DocumentoEscolar {
  id: string;
  tipo: DocumentType;
  estudanteId: string;
  dataEmissao: Date;
  numeroDocumento: string;
  escolaOrigem: string;
  escolaDestino?: string;
  estudante: StudentInfo;
  dadosEscolares: SchoolData;
  pdfUrl?: string;
  pdfBase64?: string;
  qrCodeData: string;
  hashValidacao: string;
  assinaturaDigital?: string;
  status: DocumentStatus;
  versao: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export type DocumentType =
  | 'declaracao_transferencia'
  | 'historico_escolar'
  | 'certificado_conclusao'
  | 'declaracao_matricula'
  | 'atestado_frequencia';

export type DocumentStatus =
  | 'emitido'
  | 'validado'
  | 'revogado'
  | 'expirado'
  | 'rascunho';

export interface StudentInfo {
  nomeCompleto: string;
  numeroBI: string;
  dataNascimento: Date;
  naturalidade: string;
  nomePai?: string;
  nomeMae?: string;
  responsavel?: string;
  contactoResponsavel?: string;
}

export interface SchoolData {
  escolaOrigem: {
    nome: string;
    codigo: string;
    provincia: string;
    distrito: string;
    nomenclatura: string;
    diretor?: string;
  };
  escolaDestino?: {
    nome: string;
    codigo: string;
    provincia: string;
    distrito: string;
    nomenclatura: string;
    diretor?: string;
  };
  classeAtual: {
    classe: number;
    turma: string;
    ano: number;
    regime: 'diurno' | 'noturno';
  };
  classesAnteriores?: ClasseInfo[];
  disciplina?: string;
}

export interface ClasseInfo {
  classe: number;
  turma: string;
  ano: number;
  escola: string;
  regime: 'diurno' | 'noturno';
  numeroAprovacoes?: number;
}

export interface QRCodeData {
  documentoId: string;
  tipoDocumento: DocumentType;
  numeroDocumento: string;
  estudanteBI: string;
  dataEmissao: string;
  escolaOrigem: string;
  hashValidacao: string;
  urlVerificacao: string;
  assinaturaDigital?: string;
  checksum: string;
}

export interface ValidationResult {
  valido: boolean;
  dataValidacao: Date;
  erros: ValidationError[];
  avisos: ValidationWarning[];
  documentoVerificado?: DocumentoEscolar;
}

export interface ValidationError {
  campo: string;
  mensagem: string;
  codigo: string;
  gravidade: 'erro' | 'aviso';
}

export interface ValidationWarning {
  campo: string;
  mensagem: string;
  codigo: string;
  gravidade: 'erro' | 'aviso';
}

export interface DocumentSearchFilters {
  tipo?: DocumentType;
  status?: DocumentStatus;
  dataInicio?: Date;
  dataFim?: Date;
  escolaOrigem?: string;
  nomeEstudante?: string;
  numeroBI?: string;
}

export interface DocumentShareOptions {
  viaWhatsApp: boolean;
  viaEmail: boolean;
  copiarLink: boolean;
  compartilharQR: boolean;
  incluirDadosSensiveis: boolean;
}

export interface DocumentStats {
  total: number;
  emitidosHoje: number;
  emitidosEstaSemana: number;
  emitidosEsteMes: number;
  porTipo: Record<DocumentType, number>;
  porStatus: Record<DocumentStatus, number>;
}