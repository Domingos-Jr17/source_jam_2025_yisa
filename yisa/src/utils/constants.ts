/**
 * Constantes do Sistema YISA
 * YISA System Constants
 */

// Application Info
export const APP_CONFIG = {
  NAME: 'YISA - Gestão de Documentos Escolares',
  SHORT_NAME: 'YISA',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema seguro de gestão de documentos para estudantes de Moçambique',
  AUTHOR: 'YISA Team - MozDev & Maputo Frontenders',
  HOMEPAGE: 'https://yisa.education.mz',
  REPOSITORY: 'https://github.com/Domingos-Jr17/source_jam_2025_yisa.git',
  SUPPORT_EMAIL: 'suporte@yisa.education.mz',
  PHONE: '+258 84 123 4567'
} as const;

// PWA Configuration
export const PWA_CONFIG = {
  CACHE_NAME: 'yisa-app-v1.0.0',
  OFFLINE_HTML: '/offline.html',
  CRITICAL_ASSETS: [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
  ],
  CACHE_STRATEGIES: {
    STATIC: 'cacheFirst',
    API: 'networkFirst',
    IMAGES: 'cacheFirst',
    FONTS: 'cacheFirst'
  }
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  PBKDF2: {
    ITERATIONS: 100_000,
    SALT_LENGTH: 32,
    KEY_LENGTH: 32,
    ALGORITHM: 'SHA-256'
  },
  AES: {
    KEY_LENGTH: 256,
    IV_LENGTH: 12,
    TAG_LENGTH: 16,
    ALGORITHM: 'AES-GCM'
  },
  PIN: {
    LENGTH: 6,
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
  },
  QR_CODE: {
    SIZE: 256,
    ERROR_CORRECTION_LEVEL: 'M' as const,
    MARGIN: 4
  }
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  NAME: 'YISADatabase',
  VERSION: 3,
  STORES: [
    {
      name: 'students',
      keyPath: 'id',
      indexes: [
        { name: 'byBI', keyPath: 'numeroBI', unique: true },
        { name: 'byName', keyPath: 'nomeCompleto' },
        { name: 'byCreatedAt', keyPath: 'createdAt' }
      ]
    },
    {
      name: 'documents',
      keyPath: 'id',
      indexes: [
        { name: 'byStudentId', keyPath: 'estudanteId' },
        { name: 'byType', keyPath: 'tipo' },
        { name: 'byStatus', keyPath: 'status' },
        { name: 'byEmissionDate', keyPath: 'dataEmissao' },
        { name: 'byDocumentNumber', keyPath: 'numeroDocumento', unique: true }
      ]
    },
    {
      name: 'sessions',
      keyPath: 'id',
      indexes: [
        { name: 'byDeviceId', keyPath: 'deviceId' },
        { name: 'byIsActive', keyPath: 'isActive' }
      ]
    },
    {
      name: 'schools',
      keyPath: 'id',
      indexes: [
        { name: 'byCode', keyPath: 'codigo', unique: true },
        { name: 'byName', keyPath: 'nome' },
        { name: 'byProvince', keyPath: 'provincia' },
        { name: 'byDistrict', keyPath: 'distrito' }
      ]
    },
    {
      name: 'audit',
      keyPath: 'id',
      indexes: [
        { name: 'byAction', keyPath: 'action' },
        { name: 'byTimestamp', keyPath: 'timestamp' },
        { name: 'byDeviceId', keyPath: 'deviceId' }
      ]
    },
    {
      name: 'settings',
      keyPath: 'id',
      indexes: [
        { name: 'byKey', keyPath: 'key', unique: true },
        { name: 'byCategory', keyPath: 'category' }
      ]
    },
    {
      name: 'security',
      keyPath: 'id',
      indexes: [
        { name: 'byType', keyPath: 'type' },
        { name: 'byTimestamp', keyPath: 'timestamp' },
        { name: 'byDeviceId', keyPath: 'deviceId' }
      ]
    }
  ]
} as const;

// Document Types
export const DOCUMENT_TYPES = {
  DECLARACAO_TRANSFERENCIA: 'declaracao_transferencia',
  HISTORICO_ESCOLAR: 'historico_escolar',
  CERTIFICADO_CONCLUSAO: 'certificado_conclusao',
  DECLARACAO_MATRICULA: 'declaracao_matricula',
  ATESTADO_FREQUENCIA: 'atestado_frequencia'
} as const;

export const DOCUMENT_TYPE_LABELS = {
  [DOCUMENT_TYPES.DECLARACAO_TRANSFERENCIA]: 'Declaração de Transferência',
  [DOCUMENT_TYPES.HISTORICO_ESCOLAR]: 'Histórico Escolar',
  [DOCUMENT_TYPES.CERTIFICADO_CONCLUSAO]: 'Certificado de Conclusão',
  [DOCUMENT_TYPES.DECLARACAO_MATRICULA]: 'Declaração de Matrícula',
  [DOCUMENT_TYPES.ATESTADO_FREQUENCIA]: 'Atestado de Frequência'
} as const;

// Document Status
export const DOCUMENT_STATUS = {
  EMITIDO: 'emitido',
  VALIDADO: 'validado',
  REVOGADO: 'revogado',
  EXPIRADO: 'expirado',
  RASCUNHO: 'rascunho'
} as const;

export const DOCUMENT_STATUS_LABELS = {
  [DOCUMENT_STATUS.EMITIDO]: 'Emitido',
  [DOCUMENT_STATUS.VALIDADO]: 'Validado',
  [DOCUMENT_STATUS.REVOGADO]: 'Revogado',
  [DOCUMENT_STATUS.EXPIRADO]: 'Expirado',
  [DOCUMENT_STATUS.RASCUNHO]: 'Rascunho'
} as const;

// School Information
export const SCHOOL_TYPES = {
  PUBLICA: 'publica',
  PRIVADA: 'privada'
} as const;

export const SCHOOL_NOMENCLATURES = {
  EB1: 'EB1 - Ensino Básico 1ª Ciclo',
  EB2: 'EB2 - Ensino Básico 2ª Ciclo',
  ESG: 'ESG - Ensino Secundário Geral',
  EMU: 'EMU - Ensino Médio Unificado',
  IC: 'IC - Institutos de Ciência'
} as const;

export const SCHOOL_REGIMES = {
  DIURNO: 'diurno',
  NOTURNO: 'noturno'
} as const;

// Mozambique Provinces
export const PROVINCES = [
  'Maputo (Cidade)',
  'Maputo (Província)',
  'Gaza',
  'Inhambane',
  'Manica',
  'Sofala',
  'Tete',
  'Zambézia',
  'Nampula',
  'Niassa',
  'Cabo Delgado'
] as const;

// Classes and Subjects
export const SCHOOL_CLASSES = [
  { value: '1', label: '1ª Classe' },
  { value: '2', label: '2ª Classe' },
  { value: '3', label: '3ª Classe' },
  { value: '4', label: '4ª Classe' },
  { value: '5', label: '5ª Classe' },
  { value: '6', label: '6ª Classe' },
  { value: '7', label: '7ª Classe' },
  { value: '8', label: '8ª Classe' },
  { value: '9', label: '9ª Classe' },
  { value: '10', label: '10ª Classe' },
  { value: '11', label: '11ª Classe' },
  { value: '12', label: '12ª Classe' }
] as const;

export const SUBJECTS = [
  'Português',
  'Matemática',
  'Ciências Naturais',
  'Ciências Sociais',
  'Educação Visual',
  'Educação Musical',
  'Educação Física',
  'Inglês',
  'Francês',
  'Física',
  'Química',
  'Biologia',
  'Geografia',
  'História',
  'Filosofia',
  'Empreendedorismo'
] as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  BI_NUMBER: /^[0-9]{9}[A-Z]{2}[0-9]{3}$/,
  PHONE: /^\+258[84|85|86|87][0-9]{7}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME: /^[A-Za-zÀ-ÿ\s]{2,50}$/,
  SCHOOL_CODE: /^[0-9]{6}$/,
  DOCUMENT_NUMBER: /^[A-Z]{2}[0-9]{6}$/
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ],
  MAX_QR_CODE_SIZE: 1024 * 1024, // 1MB
  MAX_PDF_SIZE: 5 * 1024 * 1024 // 5MB
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://api.yisa.education.mz/v1'
    : 'http://localhost:3001/v1',
  AUTH: '/auth',
  DOCUMENTS: '/documents',
  STUDENTS: '/students',
  SCHOOLS: '/schools',
  VERIFY: '/verify',
  AUDIT: '/audit'
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_SESSION: 'yisa_user_session',
  DEVICE_FINGERPRINT: 'yisa_device_fingerprint',
  APP_SETTINGS: 'yisa_app_settings',
  OFFLINE_DOCUMENTS: 'yisa_offline_docs',
  SYNC_QUEUE: 'yisa_sync_queue'
} as const;

// Error Codes
export const ERROR_CODES = {
  INVALID_PIN: 'INVALID_PIN',
  PIN_LOCKED: 'PIN_LOCKED',
  INVALID_BI: 'INVALID_BI',
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  INVALID_QR_CODE: 'INVALID_QR_CODE',
  OFFLINE_MODE: 'OFFLINE_MODE',
  STORAGE_FULL: 'STORAGE_FULL',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  DOCUMENT_CREATED: 'Documento criado com sucesso',
  DOCUMENT_SHARED: 'Documento partilhado com sucesso',
  DOCUMENT_VERIFIED: 'Documento verificado com sucesso',
  PIN_CHANGED: 'PIN alterado com sucesso',
  DATA_SYNCED: 'Dados sincronizados com sucesso',
  BACKUP_CREATED: 'Cópia de segurança criada com sucesso'
} as const;

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  EMITIR: '/emitir',
  VERIFICAR: '/verificar',
  CARTEIRA: '/carteira',
  HISTORICO: '/historico',
  DEFINICOES: '/definicoes',
  SOBRE: '/sobre',
  OFFLINE: '/offline'
} as const;

// Environment
export const ENVIRONMENT = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test'
} as const;

export default {
  APP_CONFIG,
  PWA_CONFIG,
  SECURITY_CONFIG,
  DATABASE_CONFIG,
  DOCUMENT_TYPES,
  DOCUMENT_STATUS,
  SCHOOL_TYPES,
  SCHOOL_NOMENCLATURES,
  PROVINCES,
  VALIDATION_PATTERNS,
  FILE_UPLOAD,
  API_ENDPOINTS,
  CACHE_KEYS,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ROUTES,
  ENVIRONMENT
};