# 🚀 YISA PROJECT IMPLEMENTATION PROMPT

## **Complete Prompt for Claude Code Implementation**

---

### **📋 PROJECT OVERVIEW**

**YISA (Your Interactive School Assistant)** is a Progressive Web App (PWA) that works **100% offline** to digitize school transfer documents in Mozambique. Students currently wait 18-30 days for document transfers between schools - YISA reduces this to 90 seconds using cryptographic QR codes.

**Core Problem**: 12,000 students/year face bureaucratic delays causing 180,000 lost school days and 64.2M MT in economic impact.

**Solution**: Digital documents with SHA-256 QR codes that work completely offline.

---

### **🎯 IMPLEMENTATION GOALS**

**Primary Objectives:**
1. Build a fully functional PWA that works 100% offline
2. Implement document emission and verification system using QR codes
3. Create mobile-first experience optimized for Android (90% MZ market)
4. Ensure 90-second document verification without internet connectivity
5. Complete all Core Features (F1-F6) within 21 hours development time

**Success Criteria:**
- ✅ Document emission in 90 seconds
- ✅ Offline verification in <3 seconds
- ✅ Zero network connectivity required for core operations
- ✅ Mobile-responsive design
- ✅ PWA installation capability

---

### **🛠️ TECHNICAL STACK (TypeScript)**

**Frontend Technologies:**
- **React 19** + **TypeScript** (type safety)
- **Vite 6** (build tooling & development server)
- **React Router DOM** (client-side routing)
- **Tailwind CSS** (utility-first styling via CDN)
- **Progressive Web App** (offline-first architecture)

**Core Libraries:**
- **HTML5-QRCode** (`^2.3.8`) - QR code scanning
- **PDF-lib** (`^1.17.1`) - PDF generation
- **QRCode.js** (`^1.5.1`) - QR code creation
- **Crypto API** (browser native) - SHA-256 hashing

**Development Tools:**
- **TypeScript** (`^4.9.4`) - Type safety
- **ESLint** (`^8.34.0`) - Code quality
- **Vite PWA Plugin** (`^0.14.4`) - PWA configuration

---

### **🏗️ PROJECT STRUCTURE TO IMPLEMENT**

```
yisa/
├── public/
│   ├── manifest.json         # PWA manifest
│   └── icons/               # PWA icons (192, 512, etc.)
├── src/
│   ├── pages/               # Main application pages
│   │   ├── Emitir.tsx       # /emitir - Document emission (F1,F2,F3,F6)
│   │   ├── Verificar.tsx    # /verificar - Document verification (F4,F5)
│   │   └── Carteira.tsx     # /carteira - Digital wallet (F7,F8)
│   ├── utils/               # Utility functions
│   │   ├── hash.ts          # SHA-256 implementation (F5)
│   │   ├── pdf.ts           # PDF + QR generation (F2)
│   │   └── storage.ts       # localStorage wrapper
│   ├── types/               # TypeScript definitions
│   │   ├── student.ts       # Student data types
│   │   ├── document.ts      # Document types
│   │   └── common.ts        # Common utility types
│   ├── data/
│   │   └── schools.json     # School data (10 schools)
│   ├── assets/
│   │   ├── icons/           # PWA icons
│   │   └── styles/          # CSS files
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── vite-env.d.ts        # Vite type declarations
│   └── worker.ts            # Service worker for PWA
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── .eslintrc.cjs            # ESLint configuration
└── .gitignore               # Git ignore rules
```

---

### **🔧 CORE FEATURES TO IMPLEMENT (F1-F6)**

#### **F1: Emission Form (3 hours)**
**Requirements:**
- 4-field form: student name, BI number, classes completed, grades
- Real-time form validation
- Auto-save functionality in localStorage
- Mobile-optimized input fields
- Clear error messages and loading states

**Implementation Details:**
```typescript
interface StudentFormData {
  name: string;
  bi: string;
  classes: string;
  grades: string;
}

// Form with validation
// Auto-save on input change
// PIN validation before submission
```

#### **F2: PDF + QR Generation (5 hours)**
**Requirements:**
- Generate PDF using pdf-lib with A4 format
- Create QR code containing document shortId (8 characters)
- Embed SHA-256 hash in PDF footer
- Professional school document layout
- Include school header and official formatting

**Implementation Details:**
```typescript
interface SchoolDocument {
  id: string;
  shortId: string; // 8-character unique ID
  student: Student;
  hash: string;    // SHA-256 hash
  issuedAt: Date;
  qrCode: string;  // Base64 QR code
  pdfUrl?: string;
}

// PDF generation with:
// - School header
// - Student information
// - QR code
// - SHA-256 hash
// - Official formatting
```

#### **F3: WhatsApp Sharing (2 hours)**
**Requirements:**
- Native sharing using `navigator.share()` API
- WhatsApp-specific sharing optimization
- Fallback to automatic download
- Cross-device compatibility
- Share success/error handling

**Implementation Details:**
```typescript
// Share functionality
const shareDocument = async (pdfBlob: Blob, shortId: string) => {
  // Try native share first
  // Fallback to WhatsApp web
  // Final fallback to download
};
```

#### **F4: Offline Verification (5 hours)**
**Requirements:**
- QR code scanner using html5-qrcode library
- Manual shortId input fallback
- Local hash validation
- Real-time verification feedback
- Document authenticity verification

**Implementation Details:**
```typescript
interface DocumentVerification {
  isValid: boolean;
  document?: SchoolDocument;
  error?: string;
}

// QR Scanner:
// - Camera access
// - QR code parsing
// - Document lookup by shortId
// - Hash validation
// - Visual feedback
```

#### **F5: Hash System (3 hours)**
**Requirements:**
- SHA-256 hash generation for document integrity
- Timestamp inclusion for uniqueness
- ShortId generation and mapping system
- Tamper detection mechanism
- Local hash storage and retrieval

**Implementation Details:**
```typescript
const generateDocumentHash = (student: Student, timestamp: Date): string => {
  // SHA-256 of student data + timestamp
  // Returns hex string
};

const generateShortId = (): string => {
  // 8-character unique identifier
  // Maps to full document hash
};
```

#### **F6: PIN Security (3 hours)**
**Requirements:**
- 6-digit PIN setup on first application use
- PIN validation before document emission
- Secure PIN storage in localStorage
- PIN change functionality
- Simple but effective security layer

**Implementation Details:**
```typescript
interface PinSecurity {
  setupPin: (pin: string) => void;
  validatePin: (pin: string) => boolean;
  changePin: (oldPin: string, newPin: string) => boolean;
  hasPin: () => boolean;
}
```

---

### **📱 USER FLOWS TO IMPLEMENT**

#### **Flow 1: Document Emission (Escola Origem)**
1. User opens `/emitir`
2. System checks for PIN setup (F6)
3. User fills 4-field form (F1)
4. System generates document hash (F5)
5. PDF created with embedded QR code (F2)
6. User shares via WhatsApp (F3)

#### **Flow 2: Document Verification (Escola Destino)**
1. User opens `/verificar`
2. QR code scanner activates (F4)
3. System extracts shortId from QR
4. Local validation of document hash (F5)
5. Display verification results

#### **Flow 3: PIN Management**
1. First-time use: PIN setup
2. Document emission: PIN validation
3. Settings: PIN change option

---

### **⚙️ TECHNICAL IMPLEMENTATION REQUIREMENTS**

#### **TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

#### **TypeScript Definitions to Create:**

**src/types/student.ts:**
```typescript
export interface Student {
  id: string;
  name: string;
  bi: string;
  classes: string[];
  grades: string[];
  createdAt: Date;
}

export interface StudentFormData {
  name: string;
  bi: string;
  classes: string;
  grades: string;
}
```

**src/types/document.ts:**
```typescript
export interface SchoolDocument {
  id: string;
  shortId: string;
  student: Student;
  hash: string;
  issuedAt: Date;
  qrCode: string;
  pdfUrl?: string;
}

export interface DocumentVerification {
  isValid: boolean;
  document?: SchoolDocument;
  error?: string;
}
```

#### **Package.json Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "qrcode": "^1.5.1",
    "pdf-lib": "^1.17.1",
    "html5-qrcode": "^2.3.8"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@types/qrcode": "^1.5.0",
    "@typescript-eslint/eslint-plugin": "^5.52.0",
    "@typescript-eslint/parser": "^5.52.0",
    "@vitejs/plugin-react": "^3.1.0",
    "eslint": "^8.34.0",
    "typescript": "^4.9.4",
    "vite": "^4.1.0",
    "vite-plugin-pwa": "^0.14.4"
  }
}
```

#### **PWA Configuration (vite.config.ts):**
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      },
      manifest: {
        name: 'YISA - Documentos Escolares',
        short_name: 'YISA',
        description: 'Plataforma de documentos escolares digitais',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

---

### **🔒 SECURITY IMPLEMENTATION**

#### **PIN Security (F6):**
- Hash PIN before storing (not plain text for production)
- Validate PIN before sensitive operations
- Rate limiting for PIN attempts
- Secure localStorage implementation

#### **Document Integrity (F5):**
- SHA-256 hash of all document data + timestamp
- Include school information in hash
- Tamper-evident verification
- Unique shortId to hash mapping

#### **Offline Security:**
- No sensitive data in network requests
- Local-only operations for core features
- Secure localStorage usage
- PIN-based access control

---

### **📋 IMPLEMENTATION PHASES (21 Hours Total)**

#### **Phase 1: Project Setup (2 hours)**
1. Initialize Vite + React + TypeScript project
2. Configure Tailwind CSS (CDN)
3. Setup ESLint and TypeScript
4. Create basic routing structure
5. Setup PWA configuration

#### **Phase 2: Core Form (F1 + F6) (5 hours)**
1. Implement PIN setup/validation system
2. Create 4-field emission form
3. Add form validation
4. Implement localStorage auto-save
5. Mobile-responsive design

#### **Phase 3: Document Generation (F2 + F5) (8 hours)**
1. Implement SHA-256 hash system
2. Create PDF generation with pdf-lib
3. Implement QR code generation
4. Create shortId mapping system
5. Design professional PDF layout

#### **Phase 4: Sharing & Verification (F3 + F4) (6 hours)**
1. Implement WhatsApp sharing functionality
2. Create QR code scanner
3. Add manual input fallback
4. Implement offline verification
5. Add visual feedback and error handling

---

### **🧪 TESTING REQUIREMENTS**

#### **Functional Testing:**
- Document emission flow end-to-end
- QR code scanning accuracy
- Offline verification functionality
- PIN security validation
- Cross-device compatibility

#### **Mobile Testing:**
- Responsive design on various screen sizes
- Touch interaction optimization
- Camera access for QR scanning
- PWA installation and offline behavior
- Performance on lower-end devices

#### **Offline Testing:**
- Complete functionality without internet
- Service worker cache behavior
- localStorage persistence
- QR verification offline
- PWA offline capabilities

---

### **🚀 DEPLOYMENT REQUIREMENTS**

#### **Production Build:**
```bash
# Build optimized PWA
npm run build

# Test PWA functionality
npm run preview

# Deploy to Vercel
vercel --prod
```

#### **PWA Testing Checklist:**
- [ ] Service worker registered and active
- [ ] App installs successfully on mobile
- [ ] Offline functionality works
- [ ] App launches in standalone mode
- [ ] Icons and splash screen display correctly

#### **Performance Targets:**
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3.8s
- **Cumulative Layout Shift**: <0.1
- **Bundle Size**: <50KB (gzipped)

---

### **🎯 SUCCESS METRICS TO TRACK**

#### **Technical Metrics:**
- Document generation time: <5 seconds
- QR scan time: <3 seconds
- Offline verification success rate: >99%
- PWA installation rate: >60%
- Bundle size optimization

#### **User Experience Metrics:**
- Document emission completion rate: >90%
- QR verification success rate: >95%
- Mobile usability score: >85/100
- Offline functionality reliability
- User satisfaction through feedback

---

### **📝 IMPLEMENTATION BEST PRACTICES**

#### **Code Quality:**
- Strict TypeScript configuration
- ESLint rules enforcement
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)
- Progressive enhancement approach

#### **Performance:**
- Lazy loading for non-critical features
- Efficient bundle splitting
- Service worker optimization
- Image and asset optimization
- Minimal external dependencies

#### **Security:**
- Input sanitization and validation
- Secure hash implementations
- PIN-based access control
- No sensitive data in logs
- HTTPS in production

#### **PWA Best Practices:**
- Offline-first architecture
- App-like user experience
- Background sync capabilities
- Push notification support (future)
- Installability promotion

---

## **🚀 READY TO IMPLEMENT**

This prompt provides everything needed to implement a complete, production-ready YISA PWA application that addresses a critical educational problem in Mozambique. The solution leverages modern web technologies to create an offline-first mobile experience that can dramatically reduce bureaucracy in school transfers while maintaining document integrity through cryptographic verification.

**Key Success Factors:**
- ✅ Complete technical specifications provided
- ✅ Clear implementation phases and timelines
- ✅ Detailed feature requirements and user flows
- ✅ Security and performance guidelines
- ✅ Testing and deployment procedures
- ✅ TypeScript configuration and type definitions

**Ready to start implementation with Claude Code! 🎯**