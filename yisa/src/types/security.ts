/**
 * Tipos de dados para segurança do sistema YISA
 * Security data types for the YISA system
 */

export interface SecurityConfig {
  iterations: number;
  saltLength: number;
  hashLength: number;
  algorithm: 'SHA-256' | 'SHA-512';
}

export interface AuthCredentials {
  pin: string;
  deviceId?: string;
  biometricData?: BiometricData;
}

export interface BiometricData {
  type: 'fingerprint' | 'face' | 'voice';
  data: string;
  templateId: string;
}

export interface EncryptedData {
  data: string; // Base64 encrypted content
  iv: string; // Initialization vector
  salt: string; // Salt for key derivation
  algorithm: string;
  keyId?: string;
}

export interface HashedData {
  hash: string;
  salt: string;
  iterations: number;
  algorithm: string;
}

export interface DeviceFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  hardware: string;
  screen: ScreenInfo;
  timezone: string;
  canvas: string;
  webgl: string;
  fonts: string[];
  timestamp: number;
}

export interface ScreenInfo {
  width: number;
  height: number;
  colorDepth: number;
  pixelRatio: number;
}

export interface SecuritySession {
  sessionId: string;
  deviceId: string;
  userId?: string;
  startTime: Date;
  lastActivity: Date;
  expiresAt: Date;
  isActive: boolean;
  securityLevel: SecurityLevel;
}

export type SecurityLevel = 'low' | 'medium' | 'high' | 'maximum';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  timestamp: Date;
  deviceId: string;
  userId?: string;
  description: string;
  metadata?: Record<string, any>;
  resolved?: boolean;
  resolvedAt?: Date;
}

export type SecurityEventType =
  | 'login_attempt'
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'pin_change'
  | 'device_register'
  | 'suspicious_activity'
  | 'data_access'
  | 'document_creation'
  | 'document_verification'
  | 'rate_limit_exceeded'
  | 'encryption_failure'
  | 'session_expired';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
  strategy: 'fixed_window' | 'sliding_window' | 'token_bucket';
}

export interface RateLimitStatus {
  remaining: number;
  resetTime: Date;
  isBlocked: boolean;
  blockDuration?: number;
}

export interface SecurityAudit {
  id: string;
  timestamp: Date;
  action: string;
  resource: string;
  userId?: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorCode?: string;
  metadata?: Record<string, any>;
}

export interface SecurityMetrics {
  totalEvents: number;
  failedLogins: number;
  successfulLogins: number;
  suspiciousActivities: number;
  blockedAttempts: number;
  activeSessions: number;
  averageSessionDuration: number;
  securityScore: number;
  lastUpdated: Date;
}

export interface EncryptionKey {
  keyId: string;
  algorithm: string;
  keyLength: number;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  usage: string;
}

export interface SecurityPolicy {
  passwordMinLength: number;
  pinLength: number;
  sessionTimeout: number;
  maxFailedAttempts: number;
  lockoutDuration: number;
  requireBiometric: boolean;
  encryptStorage: boolean;
  auditEnabled: boolean;
  rateLimitEnabled: boolean;
}