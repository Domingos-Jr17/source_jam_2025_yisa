import type { DocumentType, DocumentStatus, StudentInfo, SchoolData } from './document'
import type { SecurityEvent, BiometricData } from './security'

/**
 * Tipos de dados para o banco de dados IndexedDB do YISA
 * Database types for the YISA IndexedDB system
 */

export interface YISADatabase {
  users: UserEntity;
  students: StudentEntity;
  documents: DocumentEntity;
  sessions: SessionEntity;
  schools: SchoolEntity;
  audit: AuditEntity;
  settings: SettingsEntity;
  security: SecurityEntity;
}

export interface UserEntity {
  id?: number;
  nomeCompleto: string;
  email?: string;
  telefone?: string;
  pinHash: string;
  pinSalt: string;
  isActive: boolean;
  createdAt?: Date;
}

export interface StudentEntity {
  id: string;
  nomeCompleto: string;
  numeroBI: string;
  dataNascimento: Date;
  naturalidade: string;
  nomePai?: string;
  nomeMae?: string;
  responsavel?: string;
  contactoResponsavel?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  documents: string[]; // Array de IDs de documentos
}

export interface DocumentEntity {
  id: string;
  tipo: DocumentType;
  estudanteId: string;
  dataEmissao: Date;
  numeroDocumento: string;
  escolaOrigem: string;
  escolaDestino?: string;
  estudante: StudentInfo;
  dadosEscolares: SchoolData;
  pdfBase64?: string;
  qrCodeData: string;
  hashValidacao: string;
  status: DocumentStatus;
  versao: string;
  criadoEm: Date;
  atualizadoEm: Date;
  compartilhadoEm?: Date;
  verificadoEm?: Date;
}

export interface SessionEntity {
  id: string;
  deviceId: string;
  pinHash: string;
  pinSalt: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  expiresAt: Date;
  securityLevel: string;
  failedAttempts: number;
  lockedUntil?: Date;
  biometricData?: BiometricData;
}

export interface SchoolEntity {
  id: string;
  codigo: string;
  nome: string;
  provincia: string;
  distrito: string;
  nomenclatura: string;
  tipo: 'publica' | 'privada';
  endereco?: string;
  contacto?: string;
  email?: string;
  diretor?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditEntity {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  deviceId: string;
  sessionId?: string;
  userId?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent: string;
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  metadata?: string; // JSON string
  duration?: number;
}

export interface SettingsEntity {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  category: string;
  description?: string;
  updatedAt: Date;
  updatedBy?: string;
}

export interface SecurityEntity {
  id: string;
  type: string;
  severity: string;
  deviceId: string;
  sessionId?: string;
  timestamp: Date;
  description: string;
  metadata?: string; // JSON string
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface DatabaseConfig {
  name: string;
  version: number;
  stores: DatabaseStore[];
}

export interface DatabaseStore {
  name: string;
  keyPath: string;
  autoIncrement?: boolean;
  indexes: DatabaseIndex[];
}

export interface DatabaseIndex {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
  multiEntry?: boolean;
}

export interface DatabaseQuery<T> {
  store: keyof YISADatabase;
  index?: string;
  range?: IDBValidKey | IDBKeyRange;
  direction?: IDBCursorDirection;
  filter?: (item: T) => boolean;
  limit?: number;
  offset?: number;
}

export interface DatabaseTransaction {
  stores: (keyof YISADatabase)[];
  mode: IDBTransactionMode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onAbort?: () => void;
}

export interface DatabaseBackup {
  version: string;
  timestamp: Date;
  data: {
    students: StudentEntity[];
    documents: DocumentEntity[];
    schools: SchoolEntity[];
    settings: SettingsEntity[];
  };
  checksum: string;
}

export interface DatabaseStats {
  totalSize: number;
  recordCount: Record<string, number>;
  oldestRecord: Date;
  newestRecord: Date;
  lastBackup?: Date;
  compressionRatio?: number;
}

export interface SyncStatus {
  lastSync: Date;
  pendingUploads: number;
  pendingDownloads: number;
  conflicts: number;
  inProgress: boolean;
  error?: string;
}

// Database operations
export interface DatabaseOperation<T = any> {
  type: 'add' | 'put' | 'delete' | 'clear' | 'bulkAdd' | 'bulkPut' | 'bulkDelete';
  store: keyof YISADatabase;
  data?: T | T[];
  key?: IDBValidKey;
  query?: DatabaseQuery<T>;
}

export interface DatabaseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  operationId?: string;
  timestamp: Date;
}

// Migration types
export interface DatabaseMigration {
  version: number;
  description: string;
  up: (db: IDBDatabase) => Promise<void>;
  down: (db: IDBDatabase) => Promise<void>;
  testMigration?: () => Promise<boolean>;
}

export interface MigrationState {
  currentVersion: number;
  targetVersion: number;
  inProgress: boolean;
  completedMigrations: number[];
  error?: string;
}

