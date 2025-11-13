/**
 * Export central de tipos do sistema YISA
 * Central export for YISA system types
 */

// Student types
export type {
  StudentData,
  DocumentValidation,
  School,
  StudentClass,
  StudentGrade,
  TransferRequest,
  DocumentoTransferencia
} from './student';

// Document types
export type {
  DocumentoEscolar,
  DocumentType,
  DocumentStatus,
  StudentInfo,
  SchoolData,
  ClasseInfo,
  DocumentSearchFilters,
  DocumentShareOptions,
  DocumentStats
} from './document';

// Security types
export type {
  SecurityConfig,
  AuthCredentials,
  BiometricData,
  EncryptedData,
  HashedData,
  DeviceFingerprint,
  ScreenInfo,
  SecuritySession,
  SecurityLevel,
  SecurityEvent,
  SecurityEventType,
  SecuritySeverity,
  RateLimitConfig,
  RateLimitStatus,
  SecurityAudit,
  SecurityMetrics,
  EncryptionKey,
  SecurityPolicy
} from './security';

// Database types
export * from './database';

// Export validation types from document module
export type { ValidationError, ValidationWarning, ValidationResult } from './document';

export interface QRCodeData {
  documentoId: string;
  tipoDocumento: DocumentType;
  numeroDocumento: string;
  nomeEstudante: string;
  escolaOrigem: string;
  dataEmissao: Date;
  hashValidacao: string;
}

// Common utility types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface NotificationConfig {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
  persistent?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  errorCode?: string;
  retryHandler?: () => void;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'date' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: FieldValidation;
  disabled?: boolean;
  readonly?: boolean;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export interface FormState<T = any> {
  values: Partial<T>;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  language: 'pt-MZ' | 'en-US' | 'xt-MZ';
}

export interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  maxFileSize: number;
  supportedFormats: string[];
  features: Record<string, boolean>;
  maintenance: boolean;
  maintenanceMessage?: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Common constants
export const SUPPORTED_LANGUAGES = ['pt-MZ', 'en-US', 'xt-MZ'] as const;
export const DOCUMENT_TYPES = [
  'declaracao_transferencia',
  'historico_escolar',
  'certificado_conclusao',
  'declaracao_matricula',
  'atestado_frequencia'
] as const;

export const SECURITY_LEVELS = ['low', 'medium', 'high', 'maximum'] as const;
export const DOCUMENT_STATUSES = [
  'emitido',
  'validado',
  'revogado',
  'expirado',
  'rascunho'
] as const;

export const SCHOOL_NOMENCLATURES = ['EB1', 'EB2', 'ESG', 'EMU', 'IC'] as const;
export const SCHOOL_TYPES = ['publica', 'privada'] as const;