# YISA - Your Interactive School Assistant

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![Firebase](https://img.shields.io/badge/Firebase-yellow)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 **Sobre YISA**

**YISA** (*Your Interactive School Assistant*) é uma **Progressive Web App (PWA)** inovadora para digitalização de documentos escolares em Moçambique, desenvolvida como solução para o problema de transferências escolares.

### 🏆 **Contexto**
- **Projeto**: Source Jam 2025 - Grupo 1 (Pilar Educação)
- **Organizadores**: MozDev + Maputo Frontenders
- **Foco**: Solução open source para educação moçambicana
- **Diferencial**: Funciona 100% offline

## 📊 **O Problema Resolvido**

| Métrica | Situação Atual | Com YISA |
|---------|----------------|----------|
| Alunos transferidos/ano | 25.000 | 25.000 (processo digital) |
| Tempo de transferência | 18-45 dias | <1 hora |
| Dias letivos perdidos | 360.000-540.000 | ~0 |
| Custo administrativo | 64-210M MT | ~80% redução |
| Escolas sem internet | 60% | Funciona offline |

## 💡 **Nossa Solução**

### ✨ **Características Principais**

- 📱 **100% Offline**: Funciona sem conexão à internet
- 🔐 **QR Codes Criptográficos**: Assinatura digital ECDSA (nível Bitcoin)
- 📊 **Dashboard Analytics**: Estatísticas em tempo real
- 📱 **Mobile-First**: Otimizado para Android (90% mercado MZ)
- 🌍 **Multi-idioma**: Português + Ronga/Changana
- 🔄 **Sincronização Automática**: Quando conexão disponível

### 🛠️ **Arquitetura Técnica**

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

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Firebase (opcional para dev local)

### Instalação

```bash
# Clonar o repositório principal
git clone https://github.com/[username]/source_jam.git
cd source_jam/yisa

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves Firebase

# Iniciar desenvolvimento
npm run dev

# Abrir no navegador
# http://localhost:5173
```

### Variáveis de Ambiente

```bash
# .env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📦 **Scripts Disponíveis**

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run test         # Executar testes
npm run test:watch   # Testes em modo watch
npm run lint         # Linting do código
npm run lint:fix     # Corrigir linting automaticamente
npm run type-check   # Verificação TypeScript
npm run pwa-build    # Build otimizado para PWA
```

## 🏗️ **Estrutura do Projeto**

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes shadcn/ui
│   ├── forms/          # Formulários reutilizáveis
│   └── common/         # Componentes genéricos
├── pages/              # Páginas principais
│   ├── auth/           # Autenticação
│   ├── dashboard/      # Dashboard principal
│   ├── transfer/       # Transferências
│   └── qr/             # QR Code generation/scan
├── hooks/              # Hooks personalizados
│   ├── useAuth.ts      # Autenticação
│   ├── useOffline.ts   # Funcionalidade offline
│   └── useQR.ts        # QR Code operations
├── services/           # Serviços externos
│   ├── firebase.ts     # Configuração Firebase
│   ├── qr.ts           # QR Code generation/validation
│   └── storage.ts      # Local storage management
├── utils/              # Funções utilitárias
│   ├── crypto.ts       # Criptografia ECDSA
│   ├── validation.ts   # Validação de dados
│   └── offline.ts      # Offline helpers
├── types/              # Definições TypeScript
│   ├── auth.ts         # Tipos de autenticação
│   ├── school.ts       # Tipos de escola/aluno
│   └── qr.ts           # Tipos QR Code
├── assets/             # Assets estáticos
│   ├── images/         # Imagens
│   ├── icons/          # Ícones PWA
│   └── fonts/          # Fontes locais
└── styles/             # Estilos globais
    ├── globals.css     # CSS global
    └── components.css  # Estilos específicos
```

## 🔧 **Funcionalidades Principais**

### 1. 🔐 **Autenticação**
- Login com email/senha
- Recuperação de senha
- Perfis: Administrador, Secretária, Pai/Aluno
- Session persistente offline

### 2. 📱 **QR Code Management**
- Geração de QR codes criptográficos
- Validação offline instantânea
- Assinatura digital ECDSA
- Verificação de integridade

### 3. 📊 **Transferência Digital**
- Formulário digital de transferência
- Anexos digitizados (documentos)
- Histórico completo
- Status tracking em tempo real

### 4. 📈 **Dashboard Analytics**
- Estatísticas de transferências
- Métricas por escola/período
- Visualizações interativas
- Exportação de relatórios

### 5. 🔄 **Sincronização**
- Sync automático quando online
- Queue de operações offline
- Conflict resolution
- Backup em nuvem

## 🧪 **Desenvolvimento e Testes**

### Testing Setup

```bash
# Testes unitários
npm run test

# Testes E2E (Playwright)
npm run test:e2e

# Testes de acessibilidade
npm run test:a11y

# Performance testing
npm run test:performance
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatação automática
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

## 🔒 **Segurança**

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

## 🚀 **Deploy**

### Production Build

```bash
# Build otimizado
npm run build

# Testar build localmente
npm run preview

# Deploy para Vercel
vercel --prod
```

### Environment Variables
- Production: Configured in Vercel
- Staging: `.env.production`
- Development: `.env.local`

## 📋 **Product Backlog**

O backlog completo está disponível em `../docs/yisa_product_backlog.md`. Principais funcionalidades por sprint:

### Sprint 1 (Current - Source Jam)
- [x] Autenticação básica
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

## 🤝 **Como Contribuir**

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

**"YISA** - *Levar, Conduzir, Trazer* (Ronga/Changana)"

*Digitalizando a educação em Moçambique, uma transferência de cada vez.* 🇲🇿