# YISA - Digital School Documents Platform

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![Firebase](https://img.shields.io/badge/Firebase-yellow)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 **About YISA**

**YISA** is an innovative **Progressive Web App (PWA)** for digitizing school documents in Mozambique, developed as a solution for the school transfer problem.

### 🏆 **Context**

- **Project**: Source Jam 2025 - Team 1 (Education Pillar)
- **Organizers**: MozDev + Maputo Frontenders
- **Focus**: Open source solution for Mozambican education
- **Differentiator**: Works 100% offline

## 📊 **The Problem Solved**

| Metric                    | Current Situation | With YISA                |
| ------------------------- | ----------------- | ------------------------ |
| Students transferred/year | 25,000            | 25,000 (digital process) |
| Transfer time             | 18-45 days        | <1 hour                  |
| School days lost          | 360,000-540,000   | ~0                       |
| Administrative cost       | 64-210M MZN       | ~80% reduction           |
| Schools without internet  | 60%               | Works offline            |

## 💡 **Our Solution**

### ✨ **Key Features**

- 📱 **100% Offline**: Works without internet connection
- 🔐 **Cryptographic QR Codes**: ECDSA digital signature (Bitcoin level)
- 📊 **Dashboard Analytics**: Real-time statistics
- 📱 **Mobile-First**: Optimized for Android (90% MZ market)
- 🌍 **Multi-language**: Portuguese + Ronga/Changana
- 🔄 **Automatic Synchronization**: When connection is available

### 🛠️ **Technical Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Service       │    │   Firebase      │
│                 │    │    Worker        │    │                 │
│ React 19        │◄──►│  (Offline Cache) │◄──►│   Backend       │
│ TypeScript      │    │                  │    │                 │
│ Tailwind CSS    │    │ QR Validation    │    │ Auth + Firestore│
│ shadcn/ui       │    │ Offline Storage  │    │   Storage       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 **Getting Started**

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account (optional for local dev)

### Installation

```bash
# Clone main repository
git clone https://github.com/Domingos-Jr17/source_jam_2025_yisa.git
cd source_jam_2025_yisa/yisa

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Firebase keys

# Start development
npm run dev

# Open in browser
# http://localhost:5173
```

### Environment Variables

```bash
# .env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📦 **Available Scripts**

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run test         # Run tests
npm run test:watch   # Tests in watch mode
npm run lint         # Code linting
npm run lint:fix     # Auto-fix linting
npm run type-check   # TypeScript checking
npm run pwa-build    # Optimized PWA build
```

## 🏗️ **Project Structure**

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Reusable forms
│   └── common/         # Generic components
├── pages/              # Main pages
│   ├── auth/           # Authentication
│   ├── dashboard/      # Main dashboard
│   ├── transfer/       # Transfers
│   └── qr/             # QR Code generation/scan
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Authentication
│   ├── useOffline.ts   # Offline functionality
│   └── useQR.ts        # QR Code operations
├── services/           # External services
│   ├── firebase.ts     # Firebase configuration
│   ├── qr.ts           # QR Code generation/validation
│   └── storage.ts      # Local storage management
├── utils/              # Utility functions
│   ├── crypto.ts       # ECDSA cryptography
│   ├── validation.ts   # Data validation
│   └── offline.ts      # Offline helpers
├── types/              # TypeScript definitions
│   ├── auth.ts         # Authentication types
│   ├── school.ts       # School/student types
│   └── qr.ts           # QR Code types
├── assets/             # Static assets
│   ├── images/         # Images
│   ├── icons/          # PWA icons
│   └── fonts/          # Local fonts
└── styles/             # Global styles
    ├── globals.css     # Global CSS
    └── components.css  # Specific styles
```

## 🔧 **Core Features**

### 1. 🔐 **Authentication**

- Email/password login
- Password recovery
- Profiles: Admin, Secretary, Parent/Student
- Persistent offline session

### 2. 📱 **QR Code Management**

- Cryptographic QR code generation
- Instant offline validation
- ECDSA digital signature
- Integrity verification

### 3. 📊 **Digital Transfer**

- Digital transfer form
- Digitized attachments (documents)
- Complete history
- Real-time status tracking

### 4. 📈 **Dashboard Analytics**

- Transfer statistics
- Metrics by school/period
- Interactive visualizations
- Report export

### 5. 🔄 **Synchronization**

- Automatic sync when online
- Offline operation queue
- Conflict resolution
- Cloud backup

## 🧪 **Development and Testing**

### Testing Setup

```bash
# Unit tests
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Accessibility tests
npm run test:a11y

# Performance tests
npm run test:performance
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Auto formatting
npm run format

# Pre-commit hooks
npm run prepare
```

## 📱 **PWA Features**

### Service Worker

- Cache strategy: Cache First, Network Fallback
- Offline sync queue
- Background updates
- Push notifications

### App Manifest

- Installable PWA
- App icon set
- Splash screens
- Orientation: portrait

### Offline Support

- Core functionality 100% offline
- Data persistence (IndexedDB)
- Conflict resolution on sync
- Graceful degradation

## 🔒 **Security**

### Cryptographic Implementation

- ECDSA key pairs (secp256k1)
- QR code content encryption
- Digital signatures
- Key rotation support

### Data Protection

- End-to-end encryption
- Local storage encryption
- Secure key management
- GDPR compliance ready

## 🚀 **Deployment**

### Production Build

```bash
# Optimized build
npm run build

# Test build locally
npm run preview

# Deploy to Vercel
vercel --prod
```

### Environment Variables

- Production: Configured in Vercel
- Staging: `.env.production`
- Development: `.env.local`

## 📋 **Product Backlog**

Complete backlog available in `../docs/yisa_product_backlog.md`. Main features by sprint:

### Sprint 1 (Current - Source Jam)

- [x] Basic authentication
- [x] QR code generation
- [x] Offline foundation
- [ ] Transfer form
- [ ] Basic dashboard

### Sprint 2 (Post-Competition)

- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Admin panel
- [ ] School management

### Sprint 3 (Future)

- [ ] Mobile app (React Native)
- [ ] API integration (MINEDH)
- [ ] Advanced reporting
- [ ] Parent portal

## 🎯 **Performance Metrics**

### Core Web Vitals Targets

- **LCP**: <2.5s
- **FID**: <100ms
- **CLS**: <0.1
- **TTI**: <3.8s

### Offline Performance

- **Cache Hit Rate**: >95%
- **Sync Success Rate**: >99%
- **Offline Load Time**: <1s
- **Storage Efficiency**: <50MB

## 🤝 **How to Contribute**

### Development Workflow

1. **Setup Environment**

   ```bash
   git checkout -b feature/your-feature
   npm install
   cp .env.example .env
   ```

2. **Development**

   ```bash
   npm run dev
   npm run test:watch
   ```

3. **Code Quality**

   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

4. **Submit PR**
   - Branch: `feature/*` or `fix/*`
   - Tests: Passing
   - Coverage: >80%
   - Documentation: Updated

### Commit Standards

```bash
# Feature
git commit -m "feat(transfer): add digital form validation"

# Bug fix
git commit -m "fix(qr): resolve scanner camera issues"

# Documentation
git commit -m "docs(readme): update setup instructions"
```

## 📞 **Support**

### Issues and Bugs

- **GitHub Issues**: Report bugs and feature requests
- **Discord**: Real-time support during Source Jam
- **Documentation**: See `../docs/` folder

### Development Team

- **Frontend Lead**: [Name] - React/TypeScript/PWA
- **Backend Lead**: [Name] - Firebase/Security
- **UI/UX Lead**: [Name] - Design/User Experience
- **QA Lead**: [Name] - Testing/Accessibility

## 📄 **License**

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Source Jam 2025** organizers and mentors
- **MozDev** and **Maputo Frontenders** communities
- **Firebase team** for the generous free tier
- **Open source contributors** to React, Vite, and shadcn/ui

---

**"YISA** - _To Carry, To Lead, To Bring_ (Ronga/Changana)"

_Digitizing education in Mozambique, one transfer at a time._ 🇲🇿
