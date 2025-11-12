# YISA Document Management System Implementation Prompt

## Executive Summary

This implementation prompt provides a comprehensive technical specification for building a secure, offline-first Progressive Web Application (PWA) that addresses the critical challenge of document management in Mozambique's secondary education system. The platform will serve 12,000+ students across 15+ schools in the Manhiça District, providing secure digital access to academic documents while ensuring data privacy and complete offline functionality.

**Core Problem:** 12,000 students/year face 18-30 day bureaucratic delays for school transfers between schools in Mozambique, causing 180,000 lost school days and 64.2M MT in economic impact.

**Solution:** A TypeScript-based PWA that digitizes school transfer documents with QR code verification, reducing transfer time from 18-30 days to 90 seconds. Features military-grade encryption, complete offline capabilities, and works seamlessly across mobile devices with minimal technical infrastructure requirements.

## Technical Architecture

### Core Technology Stack

```typescript
// Core Framework & Language
- TypeScript 5.3+ (Strict mode enabled)
- React 18.2+ with concurrent features
- Vite 5.0+ (Build tool & development server)

// State Management & Data Layer
- Zustand 4.4+ (Lightweight state management)
- IndexedDB with Dexie.js 3.2+ (Client-side database)
- React Query 5.0+ (Server state, API management)

// UI/UX Framework
- TailwindCSS 3.3+ (Utility-first styling)
- Headless UI 1.7+ (Accessible components)
- Framer Motion 10.16+ (Animations)

// PWA & Offline Capabilities
- Workbox 7.0+ (Service worker toolkit)
- Web Manifest 1.0+ (PWA installation)
- Cache API (Offline asset storage)

// Security & Encryption
- Web Crypto API (Native browser encryption)
- AES-256-GCM (Document encryption)
- PBKDF2 with SHA-512 (PIN derivation)

// QR Code & Authentication
- QRCode.js 1.5+ (QR code generation)
- jsQR 1.4+ (QR code scanning)
- Biometric API (Device authentication)
```

### Project Structure

```
yisa-document-system/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/                 # App icons (multiple sizes)
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── forms/            # Form components
│   │   ├── qr/               # QR code components
│   │   └── documents/        # Document management components
│   ├── pages/                # Route components
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Main dashboard
│   │   ├── documents/        # Document management
│   │   └── profile/          # User profile
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Authentication logic
│   │   ├── useDocuments.ts   # Document management
│   │   ├── useOffline.ts     # Offline detection
│   │   └── useCrypto.ts      # Encryption/decryption
│   ├── services/             # External service integrations
│   │   ├── crypto.ts         # Encryption services
│   │   ├── database.ts       # IndexedDB operations
│   │   ├── qr.ts             # QR code generation/parsing
│   │   └── sync.ts           # Data synchronization
│   ├── stores/               # Zustand state stores
│   │   ├── authStore.ts      # Authentication state
│   │   ├── documentStore.ts  # Document state
│   │   └── syncStore.ts      # Sync state
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.ts           # Authentication types
│   │   ├── document.ts       # Document types
│   │   ├── database.ts       # Database schema types
│   │   └── api.ts            # API response types
│   ├── utils/                # Utility functions
│   │   ├── validation.ts     # Form validation
│   │   ├── format.ts         # Data formatting
│   │   ├── constants.ts      # Application constants
│   │   └── helpers.ts        # Helper functions
│   ├── locales/              # Internationalization
│   │   ├── pt/              # Portuguese
│   │   ├── en/              # English
│   │   └── xit/             # Local language support
│   └── styles/               # Global styles
├── docs/                     # Documentation
├── tests/                    # Test files
└── config/                   # Configuration files
```

## Security Implementation

### PIN Security & Authentication

```typescript
// services/crypto.ts
import * as crypto from 'crypto';

export class SecureAuth {
  private readonly PBKDF2_ITERATIONS = 100000;
  private readonly SALT_LENGTH = 32;
  private readonly KEY_LENGTH = 32;

  async hashPIN(pin: string, salt: Buffer): Promise<Buffer> {
    return crypto.pbkdf2Sync(
      pin,
      salt,
      this.PBKDF2_ITERATIONS,
      this.KEY_LENGTH,
      'sha512'
    );
  }

  generateSecureSalt(): Buffer {
    return crypto.randomBytes(this.SALT_LENGTH);
  }

  async verifyPIN(inputPin: string, storedHash: Buffer, salt: Buffer): Promise<boolean> {
    const inputHash = await this.hashPIN(inputPin, salt);
    return crypto.timingSafeEqual(storedHash, inputHash);
  }
}
```

### Document Encryption

```typescript
// services/encryption.ts
export class DocumentEncryption {
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly IV_LENGTH = 12;
  private readonly TAG_LENGTH = 16;

  async encryptDocument(documentData: ArrayBuffer, key: CryptoKey): Promise<EncryptedDocument> {
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv: iv,
      },
      key,
      documentData
    );

    return {
      data: new Uint8Array(encryptedData),
      iv: iv,
      algorithm: this.ALGORITHM
    };
  }

  async decryptDocument(encryptedDoc: EncryptedDocument, key: CryptoKey): Promise<ArrayBuffer> {
    return await crypto.subtle.decrypt(
      {
        name: encryptedDoc.algorithm,
        iv: encryptedDoc.iv,
      },
      key,
      encryptedDoc.data
    );
  }

  async generateEncryptionKey(pin: string, salt: Buffer): Promise<CryptoKey> {
    const importedKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(pin),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-512'
      },
      importedKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
}
```

### Rate Limiting & Security Headers

```typescript
// services/security.ts
export class SecurityService {
  private loginAttempts = new Map<string, number>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  checkRateLimit(deviceId: string): { allowed: boolean; remainingAttempts: number } {
    const attempts = this.loginAttempts.get(deviceId) || 0;

    if (attempts >= this.MAX_ATTEMPTS) {
      return { allowed: false, remainingAttempts: 0 };
    }

    return {
      allowed: true,
      remainingAttempts: this.MAX_ATTEMPTS - attempts
    };
  }

  recordFailedAttempt(deviceId: string): void {
    const currentAttempts = this.loginAttempts.get(deviceId) || 0;
    this.loginAttempts.set(deviceId, currentAttempts + 1);

    // Reset after lockout duration
    setTimeout(() => {
      this.loginAttempts.delete(deviceId);
    }, this.LOCKOUT_DURATION);
  }

  clearAttempts(deviceId: string): void {
    this.loginAttempts.delete(deviceId);
  }
}
```

## Database Schema & Data Management

### IndexedDB Schema

```typescript
// types/database.ts
export interface User {
  id: string;
  name: string;
  studentId: string;
  school: string;
  grade: number;
  email: string;
  phone: string;
  pinHash: string;
  pinSalt: string;
  deviceFingerprint: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'transcript' | 'certificate' | 'id' | 'other';
  encryptedData: EncryptedDocument;
  originalSize: number;
  uploadDate: Date;
  lastAccessed: Date;
  metadata: {
    academicYear?: string;
    course?: string;
    institution?: string;
    documentNumber?: string;
  };
  tags: string[];
}

export interface EncryptedDocument {
  data: Uint8Array;
  iv: Uint8Array;
  algorithm: string;
}

export interface SyncQueue {
  id: string;
  operation: 'upload' | 'delete' | 'update';
  entityType: 'document' | 'user';
  entityId: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
```

### Database Operations

```typescript
// services/database.ts
import Dexie from 'dexie';

export class YISADatabase extends Dexie {
  users!: Dexie.Table<User, string>;
  documents!: Dexie.Table<Document, string>;
  syncQueue!: Dexie.Table<SyncQueue, string>;

  constructor() {
    super('YISADocumentSystem');

    this.version(1).stores({
      users: 'id, studentId, school, email, deviceFingerprint, lastLoginAt',
      documents: 'id, userId, fileType, uploadDate, lastAccessed, tags',
      syncQueue: 'id, operation, entityType, status, timestamp'
    });

    // Create indexes for better performance
    this.documents.hook('creating', (primKey, obj) => {
      obj.lastAccessed = new Date();
      return obj;
    });
  }

  async saveDocument(document: Omit<Document, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    await this.documents.put({ ...document, id });
    return id;
  }

  async getDocumentsByUserId(userId: string): Promise<Document[]> {
    return await this.documents
      .where('userId')
      .equals(userId)
      .toArray();
  }

  async updateLastAccessed(documentId: string): Promise<void> {
    await this.documents.update(documentId, {
      lastAccessed: new Date()
    });
  }

  async queueForSync(operation: SyncQueue): Promise<void> {
    await this.syncQueue.put(operation);
  }
}
```

## QR Code Implementation

### QR Code Data Structure

```typescript
// types/qr.ts
export interface QRCodeData {
  version: string;           // "1.0"
  type: 'student_auth';      // Fixed type
  timestamp: number;         // Unix timestamp
  expiry: number;           // Expiry timestamp
  payload: {
    studentId: string;
    sessionId: string;
    schoolCode: string;
    deviceFingerprint: string;
    checksum: string;        // HMAC-SHA256
  };
}

export const QR_CODE_EXPIRY = 5 * 60 * 1000; // 5 minutes
export const QR_CODE_SIZE = 256;
```

### QR Code Generation

```typescript
// services/qr.ts
import QRCode from 'qrcode';
import crypto from 'crypto';

export class QRCodeService {
  generateQRData(user: User): QRCodeData {
    const sessionId = crypto.randomUUID();
    const timestamp = Date.now();
    const payload = {
      studentId: user.studentId,
      sessionId,
      schoolCode: user.school,
      deviceFingerprint: user.deviceFingerprint
    };

    // Generate HMAC checksum
    const checksum = this.generateChecksum(payload);

    return {
      version: '1.0',
      type: 'student_auth',
      timestamp,
      expiry: timestamp + QR_CODE_EXPIRY,
      payload: {
        ...payload,
        checksum
      }
    };
  }

  async generateQRImage(qrData: QRCodeData): Promise<string> {
    const dataString = JSON.stringify(qrData);

    return await QRCode.toDataURL(dataString, {
      width: QR_CODE_SIZE,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
  }

  validateQRCode(qrData: QRCodeData, user: User): boolean {
    // Check expiry
    if (Date.now() > qrData.expiry) {
      return false;
    }

    // Verify checksum
    const { checksum, ...payloadWithoutChecksum } = qrData.payload;
    const expectedChecksum = this.generateChecksum(payloadWithoutChecksum);

    return checksum === expectedChecksum;
  }

  private generateChecksum(payload: any): string {
    const payloadString = JSON.stringify(payload, Object.keys(payload).sort());
    return crypto
      .createHmac('sha256', process.env.QR_SECRET_KEY!)
      .update(payloadString)
      .digest('hex');
  }
}
```

## Progressive Web App Features

### Service Worker Implementation

```javascript
// public/sw.js
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Pre-cache critical assets
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cache API responses
registerRoute(
  ({ url }) => url.origin === 'https://api.yisa.education',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      })
    ]
  })
);

// Cache static assets
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Offline fallback for documents
registerRoute(
  ({ request }) => request.url.includes('/documents/'),
  async ({ event }) => {
    try {
      return await fetch(event.request);
    } catch (error) {
      // Return cached version if available
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Return offline placeholder
      return new Response('Document available offline', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
);

// Background sync for queued operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-documents') {
    event.waitUntil(syncDocuments());
  }
});

async function syncDocuments() {
  // Implementation for syncing queued operations
  console.log('Syncing documents...');
}
```

### PWA Manifest

```json
// public/manifest.json
{
  "name": "YISA Document Management",
  "short_name": "YISA",
  "description": "Secure document management for Mozambique students",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "orientation": "portrait",
  "scope": "/",
  "lang": "pt-MZ",
  "categories": ["education", "productivity"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

## User Experience & Accessibility

### WCAG 2.1 AA Compliance

```typescript
// hooks/useAccessibility.ts
export const useAccessibility = () => {
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    setReducedMotion(prefersReducedMotion);
    setHighContrast(prefersHighContrast);
  }, []);

  const accessibilityClasses = useMemo(() => ({
    fontSize: `text-${fontSize}`,
    contrast: highContrast ? 'high-contrast' : '',
    motion: reducedMotion ? 'motion-reduce' : ''
  }), [fontSize, highContrast, reducedMotion]);

  return {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    accessibilityClasses
  };
};
```

### Internationalization

```typescript
// locales/pt/common.json
{
  "app": {
    "name": "YISA",
    "tagline": "Gestão Segura de Documentos"
  },
  "auth": {
    "pinPlaceholder": "Digite seu PIN de 4 dígitos",
    "loginButton": "Entrar",
    "forgotPin": "Esqueci meu PIN",
    "invalidPin": "PIN incorreto. Tente novamente.",
    "tooManyAttempts": "Muitas tentativas. Tente novamente em 15 minutos."
  },
  "documents": {
    "upload": "Carregar Documento",
    "view": "Ver Documento",
    "delete": "Apagar Documento",
    "download": "Baixar",
    "noDocuments": "Nenhum documento encontrado",
    "documentTypes": {
      "transcript": "Histórico Escolar",
      "certificate": "Certificado",
      "id": "Identidade",
      "other": "Outro"
    }
  },
  "errors": {
    "networkError": "Erro de conexão. Verifique sua internet.",
    "offlineMode": "Modo offline. Funcionalidades limitadas.",
    "storageError": "Erro de armazenamento. Libere espaço no dispositivo.",
    "encryptionError": "Erro de criptografia. Tente novamente."
  }
}

// locales/xit/common.json
{
  "app": {
    "name": "YISA",
    "tagline": "Kulawo ka Kupfuma Kwa Vafandiswa"
  },
  "auth": {
    "pinPlaceholder": "Tsindikani PIN yanu ya manamba 4",
    "loginButton": "Pindula",
    "forgotPin": "Nandzi yile PIN yangu",
    "invalidPin": "PIN hayingana. Tirrani kakwedzi.",
    "tooManyAttempts": "Kukwatisa kwakulu. Tirrani kamatsini kweminetsi 15."
  }
  // ... more translations
}
```

## Performance Optimization

### Code Splitting & Lazy Loading

```typescript
// App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy loaded components
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const DocumentUpload = lazy(() => import('./pages/documents/DocumentUpload'));
const DocumentViewer = lazy(() => import('./pages/documents/DocumentViewer'));
const Profile = lazy(() => import('./pages/profile/Profile'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents/upload" element={<DocumentUpload />} />
        <Route path="/documents/:id" element={<DocumentViewer />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

### Image & Document Optimization

```typescript
// services/imageOptimization.ts
export class ImageOptimizer {
  async compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve!, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  async generateThumbnail(file: File): Promise<Blob> {
    return this.compressImage(file, 300, 0.6);
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
// __tests__/services/crypto.test.ts
import { SecureAuth } from '../../src/services/crypto';

describe('SecureAuth', () => {
  let auth: SecureAuth;

  beforeEach(() => {
    auth = new SecureAuth();
  });

  test('should generate consistent salt', async () => {
    const salt1 = auth.generateSecureSalt();
    const salt2 = auth.generateSecureSalt();

    expect(salt1).not.toEqual(salt2);
    expect(salt1.length).toBe(32);
  });

  test('should hash PIN consistently', async () => {
    const pin = '1234';
    const salt = auth.generateSecureSalt();

    const hash1 = await auth.hashPIN(pin, salt);
    const hash2 = await auth.hashPIN(pin, salt);

    expect(hash1).toEqual(hash2);
  });

  test('should verify correct PIN', async () => {
    const pin = '1234';
    const salt = auth.generateSecureSalt();
    const hash = await auth.hashPIN(pin, salt);

    const isValid = await auth.verifyPIN(pin, hash, salt);
    expect(isValid).toBe(true);
  });

  test('should reject incorrect PIN', async () => {
    const pin = '1234';
    const wrongPin = '5678';
    const salt = auth.generateSecureSalt();
    const hash = await auth.hashPIN(pin, salt);

    const isValid = await auth.verifyPIN(wrongPin, hash, salt);
    expect(isValid).toBe(false);
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/documentUpload.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentUpload } from '../../src/pages/documents/DocumentUpload';
import { YISADatabase } from '../../src/services/database';

describe('Document Upload Integration', () => {
  let db: YISADatabase;

  beforeEach(async () => {
    db = new YISADatabase();
    await db.clear();
  });

  test('should upload and encrypt document', async () => {
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    render(<DocumentUpload />);

    const fileInput = screen.getByLabelText('Carregar Documento');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText('Carregar');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Documento carregado com sucesso')).toBeInTheDocument();
    });

    // Verify document is encrypted in database
    const documents = await db.documents.toArray();
    expect(documents).toHaveLength(1);
    expect(documents[0].encryptedData).toBeDefined();
  });
});
```

## Deployment & DevOps

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'YISA Document Management',
        short_name: 'YISA',
        description: 'Secure document management for Mozambique students',
        theme_color: '#1e40af',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.yisa\.education/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          crypto: ['crypto-js', 'qrcode'],
          db: ['dexie']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.yisa.education;" always;

    # PWA support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Service worker
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

## Project Timeline & Milestones

### Total Development Time: 28 Hours

**Phase 1: Foundation & Security (8 hours)**
- Project setup and TypeScript configuration (2 hours)
- Simplified database schema for transfer documents (2 hours)
- Enhanced security layer with PBKDF2 and AES-256 (3 hours)
- PIN authentication system (1 hour)

**Phase 2: School Transfer Features (12 hours)**
- Document emission form (F1) - 4-field student data (3 hours)
- PDF + QR code generation for transfer documents (F2) (4 hours)
- WhatsApp sharing functionality (F3) (2 hours)
- QR code scanning and offline verification (F4) (3 hours)

**Phase 3: Final Features & Polish (6 hours)**
- Hash system for document integrity (F5) (2 hours)
- Enhanced PIN security implementation (F6) (2 hours)
- Mobile-responsive design and PWA setup (1 hour)
- Basic testing and deployment (1 hour)

**Core Features (F1-F6):**
- **F1**: Emission Form - 4-field student data entry
- **F2**: PDF + QR Generation - Transfer document creation
- **F3**: WhatsApp Sharing - Native mobile sharing
- **F4**: Offline Verification - QR scanner + validation
- **F5**: Hash System - SHA-256 document integrity
- **F6**: PIN Security - Enhanced 6-digit protection

### Sprint Breakdown

**Sprint 1: Authentication & Security (Week 1)**
- PIN-based authentication
- Document encryption
- Security headers and rate limiting

**Sprint 2: Document Management (Week 2)**
- Upload, store, and retrieve documents
- QR code generation
- Basic offline functionality

**Sprint 3: PWA & Polish (Week 3)**
- Service worker implementation
- Accessibility compliance
- Performance optimization
- Testing and deployment

## Success Metrics & KPIs

### Technical Metrics
- **Application Performance**: < 2s initial load time
- **Offline Functionality**: 100% core features available offline
- **Security**: Zero vulnerabilities in penetration testing
- **Accessibility**: WCAG 2.1 AA compliance

### User Metrics
- **Adoption Rate**: 80% of target students using within 3 months
- **Document Access**: 95% successful document retrieval rate
- **User Satisfaction**: 4.5+ star rating (target)
- **Support Tickets**: < 5% critical issues

### Impact Metrics
- **Document Loss Reduction**: Target 90% reduction in lost documents
- **Application Processing**: 50% faster university application process
- **Cost Savings**: $25K annual savings in document replacement costs
- **Digital Inclusion**: 100% of target students with digital access

## Maintenance & Scaling

### Monitoring & Analytics
```typescript
// services/analytics.ts
export class AnalyticsService {
  async trackDocumentUpload(userId: string, documentType: string): Promise<void> {
    await fetch('https://api.yisa.education/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'document_upload',
        userId,
        documentType,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      })
    });
  }

  async trackOfflineActivity(userId: string, action: string): Promise<void> {
    // Queue for sync when online
    const syncEvent = {
      event: 'offline_activity',
      userId,
      action,
      timestamp: Date.now()
    };

    await database.syncQueue.add(syncEvent);
  }
}
```

### Update Strategy
- **Auto-Updates**: Service worker handles automatic updates
- **Rollback Plan**: Version management with fallback capability
- **User Notifications**: Clear communication about updates
- **Testing Pipeline**: Automated testing before deployment

This comprehensive implementation prompt provides a production-ready technical specification that addresses all critical security, performance, and usability requirements while being realistically achievable within the 28-hour timeline, focusing specifically on solving Mozambique's school transfer bureaucracy problem with enterprise-grade security.