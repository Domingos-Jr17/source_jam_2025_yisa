/**
 * Tipos de dados para estudantes do sistema YISA
 * Student data types for the YISA system
 */

export interface StudentData {
  nomeCompleto: string;
  numeroBI: string;
  nomeEscolaOrigem: string;
  nomeEscolaDestino: string;
  classe: string;
  turma: string;
  disciplina?: string;
  dataTransferencia?: Date;
  numeroProcesso?: string;
}

export interface DocumentValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: keyof StudentData;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: keyof StudentData;
  message: string;
  code: string;
}

export interface School {
  id: string;
  nome: string;
  codigo: string;
  provincia: string;
  distrito: string;
  tipo: 'publica' | 'privada';
  nomenclatura: 'EB1' | 'EB2' | 'ESG' | 'EMU' | 'IC';
}

export interface StudentClass {
  classe: number;
  turma: string;
  ano: number;
  disciplina?: string;
  notas?: StudentGrade[];
}

export interface StudentGrade {
  disciplina: string;
  trimestre: number;
  mac: number;
  nap: number;
  npp?: number;
}

export interface TransferRequest {
  id: string;
  studentId: string;
  escolaOrigem: string;
  escolaDestino: string;
  motivo: string;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'em_processamento';
  dataPedido: Date;
  dataAprovacao?: Date;
  aprovadoPor?: string;
  documentos: DocumentoTransferencia[];
}

export interface DocumentoTransferencia {
  id: string;
  tipo: 'historico' | 'declaracao' | 'transferencia' | 'certificado';
  dataEmissao: Date;
  numeroDocumento: string;
  pdfBase64?: string;
  qrCodeData?: string;
  hashValidacao?: string;
  assinaturaDigital?: string;
}