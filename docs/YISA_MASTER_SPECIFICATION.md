# 📘 YISA - Master Specification Document

### \*Single Source of Truth for Source Jam 2025\*

**Project:** YIsa-Digital School Documents Platform
**Organizers:** MozDev + Maputo Frontenders
**Version:** 2.0

---

## 📌 **PROJECT OVERVIEW**

### **Problem Statement**

YISA solves the school transfer bureaucracy problem in Mozambique where students face **18-30 days** of waiting time for document transfers between schools, causing significant educational disruption and financial burden.

### **Core Solution**

Digital school documents with **cryptographic QR codes** that work **100% offline**, enabling instant verification and eliminating paperwork, travel time, and corruption opportunities.

---

## 🛠️ **FINAL TECHNICAL STACK**

### **Frontend**

- **React 19** with **TypeScript** for type safety
- **Vite 6** for build tooling
- **React Router DOM** for navigation
- **Tailwind CSS** for styling (via CDN for simplicity)
- **HTML5-QRCode** for QR scanning
- **PDF-lib** for PDF generation
- **QRCode.js** for QR code creation

### **Architecture (Execution Plan Approach)**

- **Progressive Web App (PWA)** - offline-first
- **localStorage** for data persistence (not Firebase)
- **Service Worker** for offline caching
- **Manual SHA-256 hashing** (not ECDSA for simplicity)
- **Single-page application** with 3 core routes

### **Infrastructure**

- **Vercel** for hosting (free tier)
- **GitHub** for source control
- **No backend database** (localStorage only)
- **No authentication** (PIN-based security only)

---

## 🎯 **MVP DEFINITION**

### **CORE FEATURES (F1-F6) - Must Complete First**

| ID     | Feature              | Description                              | Priority    |
| ------ | -------------------- | ---------------------------------------- | ----------- |
| **F1** | Emission Form        | 4-field form (name, BI, classes, grades) | 🔴 Critical |
| **F2** | PDF + QR Generation  | Create PDF with embedded QR code         | 🔴 Critical |
| **F3** | WhatsApp Sharing     | Native sharing functionality             | 🔴 Critical |
| **F4** | Offline Verification | QR scanner with local validation         | 🔴 Critical |
| **F5** | Hash System          | SHA-256 document integrity               | 🔴 Critical |
| **F6** | PIN Security         | 6-digit PIN protection                   | 🔴 Critical |

**Total Core Time:** 21 hours

### **PLUS FEATURES (Optional)**

| ID     | Feature           | Description                       | Priority  |
| ------ | ----------------- | --------------------------------- | --------- | --- |
| **F7** | Digital Wallet    | Document storage and retrieval    | 🟡 Plus   |
| **F8** | Basic Dashboard   | Emission history list             | 🟡 Plus   |
| **F9** | School Validation | Real school contacts and feedback | 🔴 Social |     |

---

## 🏗️ **PROJECT STRUCTURE**

```
yisa/
├── src/
│   ├── pages/
│   │   ├── Emitir.tsx          # /emitir (F1, F2, F3, F6)
│   │   ├── Verificar.tsx       # /verificar (F4, F5)
│   │   └── Carteira.tsx        # /carteira (F7, F8)
│   ├── utils/
│   │   ├── hash.ts             # SHA-256 implementation (F5)
│   │   ├── pdf.ts              # PDF + QR generation (F2)
│   │   └── storage.ts          # localStorage wrapper
│   ├── types/
│   │   ├── student.ts          # Student data types
│   │   ├── document.ts         # Document types
│   │   └── common.ts           # Common utility types
│   ├── data/
│   │   └── schools.json        # School data (10 schools)
│   ├── App.tsx                 # Router + PWA configuration
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts           # Vite type declarations
├── public/
│   ├── manifest.json           # PWA manifest
│   └── sw.ts                   # Service Worker (TypeScript)
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── .eslintrc.cjs               # ESLint configuration for TS
```

---

## ⚙️ **TYPESCRIPT CONFIGURATION**

### **Core Dependencies**

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
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "typescript": "^4.9.4",
    "vite": "^4.1.0",
    "vite-plugin-pwa": "^0.14.4"
  }
}
```

### **tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### **Type Definitions to Create**

**`src/types/student.ts`**

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

**`src/types/document.ts`**

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

---

## 🔒 **SECURITY APPROACH (Simplified)**

### **PIN Security (F6)**

- 6-digit PIN setup on first use
- Stored in localStorage (simple hash)
- Required before document emission
- For demo purposes (note: production would use stronger encryption)

### **Document Integrity (F5)**

- SHA-256 hash of all document data
- Hash included in QR code
- Validation ensures document hasn't been tampered with
- ShortId (8 characters) for easy lookup

### **Offline Verification (F4)**

- Documents stored in localStorage by shortId
- QR scanner reads shortId and validates hash
- No network connectivity required
- Instant verification (<3 seconds)

---

## 📱 **USER FLOWS**

### **Flow 1: Emit Document (Escola Origem)**

1. User accesses `/emitir`
2. Enters PIN (F6)
3. Fills form: name, BI, classes, grades (F1)
4. System generates PDF with QR code (F2)
5. Document saved locally with shortId
6. Share via WhatsApp (F3)

### **Flow 2: Verify Document (Escola Destino)**

1. User accesses `/verificar`
2. Scans QR code with camera (F4)
3. System extracts shortId and validates hash (F5)
4. Shows: ✅ Valid or ❌ Invalid
5. Displays document details

### **Flow 3: Digital Wallet (Aluno)**

1. User accesses `/carteira`
2. Search documents by shortId or name (F7)
3. View stored documents offline
4. View emission history (F8)

---

## 🎯 **SUCCESS CRITERIA**

### **Functional Requirements**

- ✅ All 6 core features (F1-F6) working offline
- ✅ Demo runs successfully with WiFi disabled
- ✅ QR codes scan and verify correctly
- ✅ PDFs generate and share properly
- ✅ PIN security implemented

### **Demo Requirements**

- ✅ Live emission of sample document
- ✅ Offline verification demonstration
- ✅ Cross-device compatibility (Android + desktop)
- ✅ No "it should work" statements
- ✅ Complete working flow from emission to verification

### **Impact Validation**

- ✅ School testimonials (at least 1 video)
- ✅ Documentation of real problem
- ✅ Clear metrics presentation
- ✅ Scalability demonstration

---

## ⚖️ **DECISIONS MADE & RATIONALE**

### **Technical Simplifications (for Success)**

1. **localStorage vs Firebase:** Faster implementation, guaranteed offline
2. **Manual SHA-256 vs ECDSA:** Simpler, still demonstrates cryptography
3. **No TypeScript:** Faster development for implementation timeline
4. **Basic UI vs Complex Design:** Focus on functionality over aesthetics
5. **PIN vs Full Auth:** Quick security implementation

### **Scope Decisions**

1. **Focus on F1-F6:** Core features only for guaranteed success
2. **School validation critical:** Real validation more valuable than features
3. **Demo-first approach:** Working demo better than incomplete features
4. **Conservative metrics:** Credibility more important than impressive numbers

---

## 📋 **RISK MITIGATION**

### **Technical Risks**

- **Risk:** QR code scanning issues
- **Mitigation:** Test with multiple devices, have manual input fallback

- **Risk:** PDF generation compatibility
- **Mitigation:** Test on Android phones, use pdf-lib (cross-platform)

- **Risk:** Offline functionality failure
- **Mitigation:** Service worker + localStorage dual storage

### **Implementation Risks**

- **Risk:** Features taking longer than estimated
- **Mitigation:** F1-F6 priority, cut F7-F8 if needed

- **Risk:** School validation delays
- **Mitigation:** Start early, backup with alternative validation approaches

---

## 🏁 **SUCCESS DEFINITION**

**Success = Working offline demo that proves:**

1. Digital documents can be emitted in 90 seconds
2. Verification works without internet connection
3. Real schools validate the problem and solution
4. System eliminates transfer bureaucracy completely

**YISA transforms 18-30 days of bureaucracy into 90 seconds of digital efficiency.**

---

## 📞 **PROJECT RESOURCES**

- **Repository:** https://github.com/Domingos-Jr17/source_jam_2025_yisa
- **Community:** MozDev + Maputo Frontenders

---

**Next Steps:** Implementation following execution plan
**Success Metrics:** 6 core features working offline

