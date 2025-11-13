import Dexie, { Table } from 'dexie'
import { DATABASE_CONFIG } from '../utils/constants'
import type {
  YISADatabase,
  StudentEntity,
  DocumentEntity,
  SessionEntity,
  SchoolEntity,
  AuditEntity,
  SettingsEntity,
  SecurityEntity,
  DatabaseStats,
  SyncStatus
} from '../types'

/**
 * Database service for IndexedDB operations
 * Serviço de banco de dados para operações IndexedDB
 */
export class DatabaseService extends Dexie {
  private static instance: DatabaseService

  // Tables
  students!: Table<StudentEntity>
  documents!: Table<DocumentEntity>
  sessions!: Table<SessionEntity>
  schools!: Table<SchoolEntity>
  audit!: Table<AuditEntity>
  settings!: Table<SettingsEntity>
  security!: Table<SecurityEntity>

  private constructor() {
    super(DATABASE_CONFIG.NAME)

    // Define schema
    this.version(DATABASE_CONFIG.VERSION).stores({
      students: '++id, numeroBI, nomeCompleto, createdAt, isActive, *documents',
      documents: '++id, estudanteId, tipo, status, dataEmissao, numeroDocumento, *estudanteId',
      sessions: '++id, deviceId, isActive, *deviceId',
      schools: '++id, codigo, nome, provincia, distrito, isActive',
      audit: '++id, action, timestamp, deviceId, *action, *deviceId',
      settings: '++id, key, category, *key, *category',
      security: '++id, type, timestamp, deviceId, *type, *deviceId'
    })

    // Initialize default data
    this.initializeDefaultData()
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  /**
   * Initialize default data and settings
   */
  private async initializeDefaultData(): Promise<void> {
    try {
      // Check if first run
      const isFirstRun = await this.settings.get('first_run')

      if (!isFirstRun) {
        await this.createDefaultSettings()
        await this.createDefaultSchools()
        await this.settings.add({
          id: 'first_run',
          key: 'first_run',
          value: new Date().toISOString(),
          type: 'string',
          category: 'system',
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Database initialization error:', error)
    }
  }

  /**
   * Create default application settings
   */
  private async createDefaultSettings(): Promise<void> {
    const defaultSettings: SettingsEntity[] = [
      {
        id: 'app_version',
        key: 'app_version',
        value: '1.0.0',
        type: 'string',
        category: 'app',
        description: 'Versão atual da aplicação',
        updatedAt: new Date()
      },
      {
        id: 'theme',
        key: 'theme',
        value: 'auto',
        type: 'string',
        category: 'ui',
        description: 'Tema da interface',
        updatedAt: new Date()
      },
      {
        id: 'language',
        key: 'language',
        value: 'pt-MZ',
        type: 'string',
        category: 'ui',
        description: 'Idioma da aplicação',
        updatedAt: new Date()
      },
      {
        id: 'auto_backup',
        key: 'auto_backup',
        value: 'true',
        type: 'boolean',
        category: 'backup',
        description: 'Backup automático ativado',
        updatedAt: new Date()
      },
      {
        id: 'session_timeout',
        key: 'session_timeout',
        value: '30',
        type: 'number',
        category: 'security',
        description: 'Timeout da sessão em minutos',
        updatedAt: new Date()
      },
      {
        id: 'max_failed_attempts',
        key: 'max_failed_attempts',
        value: '5',
        type: 'number',
        category: 'security',
        description: 'Máximo de tentativas falhadas',
        updatedAt: new Date()
      }
    ]

    await this.settings.bulkAdd(defaultSettings)
  }

  /**
   * Create default schools (sample data for Mozambique)
   */
  private async createDefaultSchools(): Promise<void> {
    const defaultSchools = [
      {
        id: 'esc-001',
        codigo: '100001',
        nome: 'Escola Secundária da Manhiça',
        provincia: 'Maputo (Província)',
        distrito: 'Manhiça',
        nomenclatura: 'ESG',
        tipo: 'publica' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'esc-002',
        codigo: '100002',
        nome: 'Escola Primária Completa da Manhiça',
        provincia: 'Maputo (Província)',
        distrito: 'Manhiça',
        nomenclatura: 'EB2',
        tipo: 'publica' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'esc-003',
        codigo: '200001',
        nome: 'Escola Secundária 25 de Setembro',
        provincia: 'Maputo (Cidade)',
        distrito: 'KaMpfumu',
        nomenclatura: 'ESG',
        tipo: 'publica' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    await this.schools.bulkAdd(defaultSchools)
  }

  // STUDENT OPERATIONS
  public async addStudent(student: Omit<StudentEntity, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<string> {
    const id = await this.students.add({
      ...student,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      documents: []
    })
    return id.toString()
  }

  public async getStudent(id: string): Promise<StudentEntity | undefined> {
    return await this.students.get(id)
  }

  public async getStudentByBI(numeroBI: string): Promise<StudentEntity | undefined> {
    return await this.students.where('numeroBI').equals(numeroBI).first()
  }

  public async updateStudent(id: string, updates: Partial<StudentEntity>): Promise<number> {
    return await this.students.update(id, {
      ...updates,
      updatedAt: new Date()
    })
  }

  public async deleteStudent(id: string): Promise<void> {
    await this.students.delete(id)
  }

  public async getAllStudents(): Promise<StudentEntity[]> {
    return await this.students.filter(student => student.isActive).toArray()
  }

  // DOCUMENT OPERATIONS
  public async addDocument(document: Omit<DocumentEntity, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
    const id = await this.documents.add({
      ...document,
      id: crypto.randomUUID(),
      criadoEm: new Date(),
      atualizadoEm: new Date()
    })
    return id.toString()
  }

  public async getDocument(id: string): Promise<DocumentEntity | undefined> {
    return await this.documents.get(id)
  }

  public async getDocumentsByStudent(estudanteId: string): Promise<DocumentEntity[]> {
    return await this.documents.where('estudanteId').equals(estudanteId).toArray()
  }

  public async updateDocument(id: string, updates: Partial<DocumentEntity>): Promise<number> {
    return await this.documents.update(id, {
      ...updates,
      atualizadoEm: new Date()
    })
  }

  public async deleteDocument(id: string): Promise<void> {
    await this.documents.delete(id)
  }

  public async getAllDocuments(): Promise<DocumentEntity[]> {
    return await this.documents.orderBy('criadoEm').reverse().toArray()
  }

  public async searchDocuments(query: string): Promise<DocumentEntity[]> {
    return await this.documents
      .filter(doc =>
        doc.estudante.nomeCompleto.toLowerCase().includes(query.toLowerCase()) ||
        doc.numeroDocumento.toLowerCase().includes(query.toLowerCase()) ||
        doc.escolaOrigem.toLowerCase().includes(query.toLowerCase())
      )
      .toArray()
  }

  // SESSION OPERATIONS
  public async addSession(session: Omit<SessionEntity, 'id' | 'createdAt'>): Promise<string> {
    const id = await this.sessions.add({
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date()
    })
    return id.toString()
  }

  public async getSession(id: string): Promise<SessionEntity | undefined> {
    return await this.sessions.get(id)
  }

  public async getSessionsByDevice(deviceId: string): Promise<SessionEntity[]> {
    return await this.sessions.where('deviceId').equals(deviceId).toArray()
  }

  public async updateSession(id: string, updates: Partial<SessionEntity>): Promise<number> {
    return await this.sessions.update(id, updates)
  }

  public async deleteSession(id: string): Promise<void> {
    await this.sessions.delete(id)
  }

  // SCHOOL OPERATIONS
  public async getAllSchools(): Promise<SchoolEntity[]> {
    return await this.schools.filter(school => school.isActive).toArray()
  }

  public async getSchool(id: string): Promise<SchoolEntity | undefined> {
    return await this.schools.get(id)
  }

  public async getSchoolByCode(codigo: string): Promise<SchoolEntity | undefined> {
    return await this.schools.where('codigo').equals(codigo).first()
  }

  public async getSchoolsByProvince(provincia: string): Promise<SchoolEntity[]> {
    return await this.schools.where('provincia').equals(provincia).toArray()
  }

  // AUDIT OPERATIONS
  public async addAuditEvent(event: Omit<AuditEntity, 'id' | 'timestamp'>): Promise<string> {
    const id = await this.audit.add({
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    })
    return id.toString()
  }

  public async getAuditEvents(limit = 100): Promise<AuditEntity[]> {
    return await this.audit.orderBy('timestamp').reverse().limit(limit).toArray()
  }

  public async getAuditEventsByDevice(deviceId: string): Promise<AuditEntity[]> {
    return await this.audit.where('deviceId').equals(deviceId).toArray()
  }

  // SECURITY OPERATIONS
  public async addSecurityEvent(event: Omit<SecurityEntity, 'id' | 'timestamp'>): Promise<string> {
    const id = await this.security.add({
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    })
    return id.toString()
  }

  public async getSecurityEvents(limit = 100): Promise<SecurityEntity[]> {
    return await this.security.orderBy('timestamp').reverse().limit(limit).toArray()
  }

  // SETTINGS OPERATIONS
  public async getSetting(key: string): Promise<SettingsEntity | undefined> {
    return await this.settings.where('key').equals(key).first()
  }

  public async updateSetting(key: string, value: string): Promise<void> {
    await this.settings.where('key').equals(key).modify({
      value,
      updatedAt: new Date()
    })
  }

  public async getAllSettings(): Promise<SettingsEntity[]> {
    return await this.settings.toArray()
  }

  // DATABASE MAINTENANCE
  public async getDatabaseStats(): Promise<DatabaseStats> {
    const [
      studentsCount,
      documentsCount,
      schoolsCount,
      sessionsCount,
      auditCount,
      securityCount,
      oldestRecord,
      newestRecord
    ] = await Promise.all([
      this.students.count(),
      this.documents.count(),
      this.schools.count(),
      this.sessions.count(),
      this.audit.count(),
      this.security.count(),
      this.audit.orderBy('timestamp').first(),
      this.audit.orderBy('timestamp').last()
    ])

    // Estimate database size (rough calculation)
    const totalSize = (studentsCount + documentsCount + schoolsCount + sessionsCount) * 1024 // ~1KB per record

    return {
      totalSize,
      recordCount: {
        students: studentsCount,
        documents: documentsCount,
        schools: schoolsCount,
        sessions: sessionsCount,
        audit: auditCount,
        security: securityCount,
        settings: await this.settings.count()
      },
      oldestRecord: oldestRecord?.timestamp || new Date(),
      newestRecord: newestRecord?.timestamp || new Date(),
      compressionRatio: 0.7 // Estimated
    }
  }

  public async clearAllData(): Promise<void> {
    await Promise.all([
      this.students.clear(),
      this.documents.clear(),
      this.sessions.clear(),
      this.audit.clear(),
      this.security.clear()
    ])
    // Keep schools and settings
  }

  public async exportData(): Promise<any> {
    const [students, documents, schools, settings] = await Promise.all([
      this.students.toArray(),
      this.documents.toArray(),
      this.schools.toArray(),
      this.settings.toArray()
    ])

    return {
      version: '1.0.0',
      timestamp: new Date(),
      data: {
        students,
        documents,
        schools,
        settings
      }
    }
  }

  public async importData(backupData: any): Promise<void> {
    const { data } = backupData

    await this.transaction('rw', this.students, this.documents, this.schools, this.settings, async () => {
      await this.students.clear()
      await this.documents.clear()
      await this.schools.clear()
      await this.settings.clear()

      if (data.students) await this.students.bulkAdd(data.students)
      if (data.documents) await this.documents.bulkAdd(data.documents)
      if (data.schools) await this.schools.bulkAdd(data.schools)
      if (data.settings) await this.settings.bulkAdd(data.settings)
    })
  }

  public async getSyncStatus(): Promise<SyncStatus> {
    const lastSyncSetting = await this.getSetting('last_sync')
    const pendingUploads = await this.audit.filter(event => !event.success).count()

    return {
      lastSync: lastSyncSetting ? new Date(lastSyncSetting.value) : new Date(0),
      pendingUploads,
      pendingDownloads: 0,
      conflicts: 0,
      inProgress: false
    }
  }
}

export default DatabaseService
