# 📋 YISA - PRODUCT BACKLOG COMPLETO

**Projeto:** YISA - Plataforma de Documentos Escolares Digitais  
**Sprint:** MVP Hackathon (10-15 Nov 2025)  
**Equipa:** Grupo 1 (Pilar Educação)  
**Metodologia:** Scrum Adaptado para Hackathon

---

## 🎯 DEFINIÇÃO DO MVP

**Objetivo:** Sistema funcional que permite emitir, portar e verificar documentos escolares 100% offline.

**Critério de Sucesso:** Demo ao vivo (WiFi desligado) no dia 15 Nov que mostra:
1. Diretor gera documento em 90s
2. Aluno guarda no telemóvel offline
3. Escola verifica em 2s sem internet

---

## 📊 VISÃO GERAL DO BACKLOG

### **Estatísticas:**
- **Total de User Stories:** 21
- **Story Points Totais:** 89 pontos
- **Prioridade Alta (Must Have):** 13 stories (55 pontos)
- **Prioridade Média (Should Have):** 5 stories (24 pontos)
- **Prioridade Baixa (Nice to Have):** 3 stories (10 pontos)

### **Distribuição por Sprint:**
- **Sprint 1 (10-11 Nov):** Setup + Core Features (28 pontos)
- **Sprint 2 (12-13 Nov):** Features Avançadas + PWA (27 pontos)
- **Sprint 3 (14 Nov):** Polish + Testes (15 pontos)
- **Buffer (15 Nov manhã):** Contingência + Pitch

---

## 🚀 ÉPICO 1: INFRAESTRUTURA E SETUP

### **US-001: Setup do Projeto Base**
**Como** desenvolvedor  
**Quero** ter o ambiente de desenvolvimento configurado  
**Para que** possa começar a implementar features

**Critérios de Aceitação:**
- [ ] Projeto React 19 + Vite criado e rodando
- [ ] TypeScript configurado com tsconfig estrito
- [ ] Tailwind CSS + shadcn/ui instalados
- [ ] ESLint + Prettier configurados
- [ ] Git inicializado com .gitignore apropriado
- [ ] Estrutura de pastas criada (src/components, services, utils, pages)

**Story Points:** 3  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 1  
**Estimativa:** 2h  
**Dependências:** Nenhuma

**Notas Técnicas:**
```bash
npm create vite@latest yisa-mozambique -- --template react-ts
cd yisa-mozambique
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### **US-002: Configuração do Firebase**
**Como** desenvolvedor  
**Quero** ter Firebase configurado e funcional  
**Para que** possa armazenar dados e autenticar usuários

**Critérios de Aceitação:**
- [ ] Projeto criado no Firebase Console
- [ ] Firebase SDK instalado e configurado
- [ ] Authentication habilitado (Google OAuth)
- [ ] Firestore criado com regras de segurança básicas
- [ ] Storage configurado para backups de PDFs
- [ ] Variáveis de ambiente configuradas (.env.local)
- [ ] Teste de conexão bem-sucedido

**Story Points:** 3  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 1  
**Estimativa:** 2h  
**Dependências:** US-001

**Notas Técnicas:**
```typescript
// firebaseConfig exemplo
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "yisa-mozambique.firebaseapp.com",
  projectId: "yisa-mozambique",
  storageBucket: "yisa-mozambique.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

---

### **US-003: Design System Base (shadcn/ui)**
**Como** desenvolvedor  
**Quero** ter componentes UI consistentes  
**Para que** a interface seja profissional e rápida de construir

**Critérios de Aceitação:**
- [ ] shadcn/ui instalado e configurado
- [ ] Componentes base importados: Button, Input, Card, Dialog, Toast
- [ ] Paleta de cores YISA definida (Verde #10B981 + Azul #3B82F6)
- [ ] Typography configurada (Inter font)
- [ ] Layout base criado (Header, Sidebar, Content)
- [ ] Dark mode preparado (opcional)

**Story Points:** 2  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 1  
**Estimativa:** 1.5h  
**Dependências:** US-001

---

## 🔐 ÉPICO 2: AUTENTICAÇÃO E CONTROLE DE ACESSO

### **US-004: Login com Google OAuth**
**Como** diretor de escola  
**Quero** fazer login com minha conta Google institucional  
**Para que** possa aceder à plataforma de forma segura

**Critérios de Aceitação:**
- [ ] Botão "Entrar com Google" funcional
- [ ] Fluxo OAuth completo implementado
- [ ] Token de autenticação armazenado de forma segura
- [ ] Redirecionamento após login para dashboard
- [ ] Tratamento de erros (conta não autorizada, falha de rede)
- [ ] Loading state durante autenticação

**Story Points:** 5  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 1  
**Estimativa:** 3h  
**Dependências:** US-002

**Código de Referência:**
```typescript
// src/services/auth.ts
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
```

---

### **US-005: Perfis de Usuário (Diretor/Secretário)**
**Como** sistema  
**Quero** distinguir entre diretores e secretários  
**Para que** possa controlar permissões apropriadamente

**Critérios de Aceitação:**
- [ ] Estrutura de dados de perfil criada no Firestore
- [ ] Campo "role" (diretor | secretario) no perfil
- [ ] Escola associada ao usuário (schoolId)
- [ ] Primeira tela após login: selecionar escola (se novo usuário)
- [ ] Persistência de sessão (usuário não precisa relogar)

**Story Points:** 3  
**Prioridade:** 🟡 Média (Should Have)  
**Sprint:** 1  
**Estimativa:** 2h  
**Dependências:** US-004

**Modelo de Dados:**
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'diretor' | 'secretario';
  schoolId: string;
  schoolName: string;
  createdAt: Timestamp;
}
```

---

### **US-006: Proteção de Rotas**
**Como** sistema  
**Quero** proteger rotas autenticadas  
**Para que** apenas usuários logados acessem funcionalidades

**Critérios de Aceitação:**
- [ ] Higher-Order Component (ProtectedRoute) criado
- [ ] Redirecionamento para /login se não autenticado
- [ ] Loading state enquanto verifica autenticação
- [ ] Persistência de rota original (redirect após login)

**Story Points:** 2  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 1  
**Estimativa:** 1h  
**Dependências:** US-004

---

## 📄 ÉPICO 3: GERAÇÃO DE DOCUMENTOS

### **US-007: Formulário de Criação de Documento**
**Como** diretor  
**Quero** preencher dados do aluno num formulário  
**Para que** possa gerar o documento digital

**Critérios de Aceitação:**
- [ ] Formulário com campos obrigatórios:
  - Nome completo do aluno
  - Data de nascimento
  - Número de identificação (BI ou certidão)
  - Classe actual
  - Tipo de documento (Histórico | Transferência | Aproveitamento)
- [ ] Validação de campos em tempo real
- [ ] Pré-visualização dos dados antes de gerar
- [ ] Botão "Gerar Documento" habilitado apenas se válido
- [ ] Auto-completar escola do diretor

**Story Points:** 5  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 1  
**Estimativa:** 3h  
**Dependências:** US-006

**UI Mockup:**
```
┌────────────────────────────────────┐
│  Novo Documento Escolar            │
├────────────────────────────────────┤
│  Nome: [___________________]       │
│  Data Nasc: [__/__/____]           │
│  BI: [___________________]         │
│  Classe: [Dropdown: 1ª-12ª]       │
│  Tipo: [Radio: Histórico/Transfer] │
│                                    │
│  [Pré-visualizar] [Gerar]          │
└────────────────────────────────────┘
```

---

### **US-008: Geração de PDF com pdf-lib**
**Como** sistema  
**Quero** gerar PDF profissional a partir dos dados  
**Para que** o documento seja válido e bem formatado

**Critérios de Aceitação:**
- [ ] PDF gerado no formato A4 (595x842 pontos)
- [ ] Cabeçalho oficial:
  - "REPÚBLICA DE MOÇAMBIQUE"
  - "Ministério da Educação e Desenvolvimento Humano"
  - Logo da escola (se disponível)
- [ ] Dados do aluno formatados claramente
- [ ] Rodapé com:
  - Hash SHA-256 (primeiros 16 caracteres)
  - Data de emissão
  - Assinatura digital do diretor
  - "Verificável em yisa.co.mz/verify"
- [ ] PDF downloadável (botão de download)

**Story Points:** 8  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 1  
**Estimativa:** 4h  
**Dependências:** US-007

**Código de Referência:**
```typescript
import { PDFDocument, rgb } from 'pdf-lib';

async function generatePDF(data: StudentData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  
  page.drawText('REPÚBLICA DE MOÇAMBIQUE', {
    x: 50, y: 792, size: 16, color: rgb(0, 0, 0.6)
  });
  
  // ... adicionar conteúdo
  
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
```

---

### **US-009: Geração de QR Code Criptográfico**
**Como** sistema  
**Quero** gerar QR Code com hash verificável  
**Para que** o documento seja à prova de falsificação

**Critérios de Aceitação:**
- [ ] Hash SHA-256 gerado a partir de:
  - Dados do aluno (nome, BI, data nasc)
  - Escola emissora (schoolId, schoolName)
  - Timestamp de emissão
  - Tipo de documento
- [ ] Assinatura ECDSA do hash usando chave privada da escola
- [ ] QR Code gerado com URL: `yisa.co.mz/verify/{hash}`
- [ ] QR Code incorporado no PDF (canto superior direito, 5x5cm)
- [ ] QR Code legível por qualquer leitor padrão

**Story Points:** 8  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 1  
**Estimativa:** 4h  
**Dependências:** US-008

**Estrutura do QR Code:**
```json
{
  "v": "1.0",
  "hash": "a3f5c8d2e1b4f7a9c6d8e2f1b5a7c9d4",
  "school": "ESJ-MPT-001",
  "student": "João Silva",
  "type": "transfer",
  "issued": "2025-11-10T14:30:00Z",
  "sig": "304502210086..."
}
```

---

### **US-010: Salvar Documento no Firestore**
**Como** sistema  
**Quero** salvar metadados do documento no banco  
**Para que** possa rastrear documentos emitidos

**Critérios de Aceitação:**
- [ ] Documento salvo na collection `documents`
- [ ] Campos armazenados:
  - hash (ID do documento)
  - studentName, studentBI, studentDOB
  - schoolId, schoolName
  - documentType
  - issuedBy (UID do diretor)
  - issuedAt (timestamp)
  - signature (ECDSA)
  - status (active | revoked)
- [ ] Backup do PDF no Firebase Storage
- [ ] Registro de auditoria na collection `audit_log`

**Story Points:** 3  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 1  
**Estimativa:** 2h  
**Dependências:** US-009

---

## 📱 ÉPICO 4: PWA DO ALUNO (CARTEIRA DIGITAL)

### **US-011: Configuração PWA Base**
**Como** desenvolvedor  
**Quero** transformar a aplicação em PWA  
**Para que** funcione offline e seja instalável

**Critérios de Aceitação:**
- [ ] Vite PWA Plugin instalado e configurado
- [ ] Manifest.json criado com:
  - Nome: "YISA"
  - Ícones (192x192, 512x512)
  - Theme color: #10B981
  - Display: standalone
- [ ] Service Worker gerado automaticamente
- [ ] Estratégia de cache: NetworkFirst para APIs, CacheFirst para assets
- [ ] Teste de instalabilidade em Android/iOS

**Story Points:** 5  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 2  
**Estimativa:** 3h  
**Dependências:** US-001

**Configuração Vite PWA:**
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'YISA - Documentos Escolares',
        short_name: 'YISA',
        theme_color: '#10B981',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'firebase-storage' }
          }
        ]
      }
    })
  ]
});
```

---

### **US-012: Armazenamento Offline de Documentos**
**Como** aluno  
**Quero** guardar meus documentos no telemóvel offline  
**Para que** possa aceder sempre, mesmo sem internet

**Critérios de Aceitação:**
- [ ] IndexedDB configurado (via Dexie.js)
- [ ] Estrutura de dados:
  - id (hash do documento)
  - pdfBlob (Blob do PDF)
  - metadata (nome, escola, tipo, data)
  - cachedAt (timestamp)
- [ ] Capacidade de armazenar 10+ documentos (até 50MB)
- [ ] Botão "Guardar Offline" funcional
- [ ] Indicador visual de espaço usado

**Story Points:** 5  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 2  
**Estimativa:** 3h  
**Dependências:** US-011

**Código IndexedDB:**
```typescript
import Dexie, { Table } from 'dexie';

interface CachedDocument {
  id: string;
  pdfBlob: Blob;
  metadata: DocumentMetadata;
  cachedAt: number;
}

class YisaDB extends Dexie {
  documents!: Table<CachedDocument>;

  constructor() {
    super('YisaDB');
    this.version(1).stores({
      documents: 'id, cachedAt'
    });
  }
}

export const db = new YisaDB();
```

---

### **US-013: Interface da Carteira Digital**
**Como** aluno  
**Quero** ver meus documentos numa lista clara  
**Para que** possa aceder rapidamente ao que preciso

**Critérios de Aceitação:**
- [ ] Lista de documentos em cards
- [ ] Cada card mostra:
  - Tipo de documento (ícone + texto)
  - Nome da escola emissora
  - Data de emissão
  - Status: 🟢 Offline | 🟡 Sync pendente
- [ ] Tap no card → visualiza PDF fullscreen
- [ ] Swipe para apagar documento
- [ ] Botão "Partilhar QR Code"
- [ ] Empty state se não há documentos

**Story Points:** 5  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 2  
**Estimativa:** 3h  
**Dependências:** US-012

**UI Mockup:**
```
┌────────────────────────────────────┐
│  📚 Meus Documentos               │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐ │
│  │ 📄 Histórico Escolar         │ │
│  │ E.S. Josina Machel, Maputo   │ │
│  │ 10 Nov 2025  🟢 Offline      │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │ 📋 Declaração Transferência  │ │
│  │ E.S. Patrice Lumumba, Beira  │ │
│  │ 08 Nov 2025  🟡 Sincronizar  │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
```

---

### **US-014: Visualizador de PDF Offline**
**Como** aluno  
**Quero** visualizar PDF sem precisar de app externo  
**Para que** a experiência seja fluida

**Critérios de Aceitação:**
- [ ] Biblioteca PDF.js integrada
- [ ] PDF renderizado em canvas
- [ ] Controles: zoom, página anterior/próxima
- [ ] Funciona 100% offline (PDF vem do IndexedDB)
- [ ] Botão "Fechar" volta para lista
- [ ] Loading state enquanto renderiza

**Story Points:** 5  
**Prioridade:** 🟡 Média (Should Have)  
**Sprint:** 2  
**Estimativa:** 3h  
**Dependências:** US-013

---

## ✅ ÉPICO 5: VERIFICAÇÃO DE DOCUMENTOS

### **US-015: Scanner de QR Code (Webcam)**
**Como** escola de destino  
**Quero** escanear QR Code com webcam do computador  
**Para que** possa verificar documento rapidamente

**Critérios de Aceitação:**
- [ ] Biblioteca html5-qrcode integrada
- [ ] Botão "Escanear Documento"
- [ ] Acesso à câmera solicitado (permissão)
- [ ] Overlay com guia de alinhamento
- [ ] Feedback visual quando QR detectado
- [ ] Funciona em Chrome, Firefox, Safari

**Story Points:** 5  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 2  
**Estimativa:** 3h  
**Dependências:** US-006

**Código de Referência:**
```typescript
import { Html5Qrcode } from 'html5-qrcode';

const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  (decodedText) => {
    // decodedText = "yisa.co.mz/verify/a3f5c8..."
    verifyDocument(decodedText);
  }
);
```

---

### **US-016: Validação Criptográfica Offline**
**Como** sistema  
**Quero** validar assinatura ECDSA sem internet  
**Para que** verificação funcione sempre

**Critérios de Aceitação:**
- [ ] Extrai hash do QR Code
- [ ] Busca documento no Firestore (se online) ou cache local
- [ ] Valida assinatura ECDSA usando chave pública da escola
- [ ] Verifica se hash corresponde aos dados
- [ ] Checa se documento não foi revogado
- [ ] Tudo funciona offline (cache de chaves públicas)

**Story Points:** 8  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 2  
**Estimativa:** 4h  
**Dependências:** US-015

**Fluxo de Validação:**
```typescript
async function verifyDocument(qrData: string): Promise<VerificationResult> {
  const { hash, signature, school } = parseQR(qrData);
  
  // 1. Busca documento (online ou cache)
  const doc = await fetchDocument(hash);
  
  // 2. Valida assinatura
  const publicKey = await getSchoolPublicKey(school);
  const isValid = verifySignature(hash, signature, publicKey);
  
  // 3. Checa revogação
  const isRevoked = doc.status === 'revoked';
  
  return { isValid: isValid && !isRevoked, doc };
}
```

---

### **US-017: Tela de Resultado de Verificação**
**Como** escola de destino  
**Quero** ver resultado claro da verificação  
**Para que** possa tomar decisão sobre aceitação

**Critérios de Aceitação:**
- [ ] Tela com 3 estados possíveis:
  - ✅ **Verde:** "Documento Válido" + dados da escola/aluno
  - ⚠️ **Amarelo:** "Atenção" + motivo (expirado, etc.)
  - ❌ **Vermelho:** "Inválido" + alerta de falsificação
- [ ] Detalhes expandíveis: hash completo, timestamp
- [ ] Botão "Aceitar Transferência" (se válido)
- [ ] Botão "Reportar Irregularidade"
- [ ] Animação de sucesso/erro

**Story Points:** 5  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 2  
**Estimativa:** 2.5h  
**Dependências:** US-016

**UI Mockup (Válido):**
```
┌────────────────────────────────────┐
│           ✅                       │
│                                    │
│      DOCUMENTO VÁLIDO              │
│                                    │
│  Aluno: João Silva                 │
│  Escola: E.S. Josina Machel        │
│  Tipo: Transferência               │
│  Emitido: 10 Nov 2025              │
│                                    │
│  Hash: a3f5c8d2...                 │
│                                    │
│  [Aceitar Transferência]           │
│  [Ver Detalhes]                    │
│                                    │
└────────────────────────────────────┘
```

---

## 📊 ÉPICO 6: DASHBOARD ADMINISTRATIVO

### **US-018: Dashboard do Diretor**
**Como** diretor  
**Quero** ver estatísticas dos documentos da minha escola  
**Para que** possa acompanhar actividade

**Critérios de Aceitação:**
- [ ] Cards com métricas:
  - Total de documentos emitidos (últimos 30 dias)
  - Documentos verificados por outras escolas
  - Taxa de verificações bem-sucedidas (%)
  - Alertas de tentativas de falsificação
- [ ] Gráfico de linha: emissões por dia (Chart.js)
- [ ] Lista dos 10 últimos documentos emitidos
- [ ] Filtro por tipo de documento
- [ ] Atualização em tempo real (Firestore Realtime)

**Story Points:** 8  
**Prioridade:** 🟡 Média (Should Have)  
**Sprint:** 2  
**Estimativa:** 4h  
**Dependências:** US-010

---

### **US-019: Histórico de Auditoria**
**Como** diretor  
**Quero** ver log de todas as ações  
**Para que** possa auditar uso da plataforma

**Critérios de Aceitação:**
- [ ] Tabela com colunas:
  - Timestamp
  - Ação (emitiu | verificou | revogou)
  - Usuário (nome do diretor/secretário)
  - Documento (hash parcial)
  - Detalhes (escola verificadora, etc.)
- [ ] Paginação (20 registros por página)
- [ ] Filtro por data e tipo de ação
- [ ] Export para CSV

**Story Points:** 5  
**Prioridade:** 🟢 Baixa (Nice to Have)  
**Sprint:** 3  
**Estimativa:** 3h  
**Dependências:** US-018

---

### **US-020: Revogação de Documentos**
**Como** diretor  
**Quero** poder revogar um documento emitido incorrectamente  
**Para que** ele não seja mais válido

**Critérios de Aceitação:**
- [ ] Botão "Revogar" em cada documento no dashboard
- [ ] Modal de confirmação com motivo (textarea)
- [ ] Documento marcado como `status: 'revoked'` no Firestore
- [ ] Próxima verificação retorna ❌ Inválido
- [ ] Notificação para escola que verificou (se aplicável)
- [ ] Log de auditoria registrado

**Story Points:** 5  
**Prioridade:** 🟡 Média (Should Have)  
**Sprint:** 3  
**Estimativa:** 2.5h  
**Dependências:** US-018

---

## 🔄 ÉPICO 7: SINCRONIZAÇÃO E RESILIÊNCIA

### **US-021: Sincronização Inteligente**
**Como** sistema  
**Quero** sincronizar dados quando conexão voltar  
**Para que** nenhuma informação se perca

**Critérios de Aceitação:**
- [ ] Fila de sincronização (queue) no IndexedDB
- [ ] Detecção de conectividade (online/offline events)
- [ ] Retry automático com backoff exponencial
- [ ] Indicador visual de status: 🟢 Online | 🔴 Offline | 🟡 Sincronizando
- [ ] Toast notification quando sincronização completa
- [ ] Conflitos resolvidos (last-write-wins)

**Story Points:** 8  
**Prioridade:** 🟡 Média (Should Have)  
**Sprint:** 3  
**Estimativa:** 4h  
**Dependências:** US-012

**Código de Sincronização:**
```typescript
// src/services/sync.ts
class SyncQueue {
  async enqueue(operation: SyncOperation) {
    await db.syncQueue.add(operation);
    if (navigator.onLine) this.processQueue();
  }

  async processQueue() {
    const pending = await db.syncQueue.toArray();
    for (const op of pending) {
      try {
        await this.executeOperation(op);
        await db.syncQueue.delete(op.id);
      } catch (error) {
        op.retries++;
        if (op.retries > 3) {
          // Marca como failed
        }
      }
    }
  }
}

window.addEventListener('online', () => syncQueue.processQueue());
```

---

### **US-022: Tratamento de Erros e Fallbacks**
**Como** usuário  
**Quero** ver mensagens claras quando algo falha  
**Para que** saiba o que fazer

**Critérios de Aceitação:**
- [ ] Error boundaries no React (não crashar a app)
- [ ] Mensagens de erro amigáveis (não técnicas)
- [ ] Sugestões de ação para cada erro:
  - "Sem internet" → "Verifique sua conexão"
  - "Falha ao gerar PDF" → "Tente novamente"
  - "Documento não encontrado" → "QR Code pode estar corrompido"
- [ ] Botão "Reportar Problema" (abre email/WhatsApp)
- [ ] Logs de erro enviados para Firebase Analytics

**Story Points:** 3  
**Prioridade:** 🟡 Média (Should Have)  
**Sprint:** 3  
**Estimativa:** 2h  
**Dependências:** Todas as US anteriores

---

### **US-023: Recuperação Automática de Sessão**
**Como** usuário  
**Quero** que a app retome de onde parei se fechar  
**Para que** não perca progresso

**Critérios de Aceitação:**
- [ ] Estado da app persistido no localStorage
- [ ] Formulários salvam draft automaticamente (autosave)
- [ ] Após crash/reload, volta ao ponto onde estava
- [ ] Documentos em geração salvos temporariamente
- [ ] Toast "Retomando sessão anterior..." ao reabrir

**Story Points:** 3  
**Prioridade:** 🟢 Baixa (Nice to Have)  
**Sprint:** 3  
**Estimativa:** 1.5h  
**Dependências:** Todas as US anteriores

---

## 🎨 ÉPICO 8: POLISH E EXPERIÊNCIA DO USUÁRIO

### **US-024: Animações e Micro-Interações**
**Como** usuário  
**Quero** uma interface fluida e responsiva  
**Para que** a experiência seja profissional

**Critérios de Aceitação:**
- [ ] Loading spinners em todas as operações assíncronas
- [ ] Skeleton screens durante carregamento de listas
- [ ] Animações de transição suaves (Framer Motion)
- [ ] Feedback háptico em dispositivos móveis (vibração)
- [ ] Progress bar na geração de PDF (0% → 100%)
- [ ] Confetti animation ao gerar primeiro documento

**Story Points:** 3  
**Prioridade:** 🟢 Baixa (Nice to Have)  
**Sprint:** 3  
**Estimativa:** 2h  
**Dependências:** US-013, US-017

---

### **US-025: Responsividade Mobile-First**
**Como** usuário mobile  
**Quero** que a app funcione perfeitamente no telemóvel  
**Para que** não precise de computador

**Critérios de Aceitação:**
- [ ] Layout adaptativo para:
  - Mobile: 320px-767px
  - Tablet: 768px-1023px
  - Desktop: 1024px+
- [ ] Touch targets mínimos de 44x44px
- [ ] Menu hamburguer no mobile
- [ ] Formulários optimizados para teclado mobile
- [ ] Testado em Android (Chrome) e iOS (Safari)

**Story Points:** 5  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 3  
**Estimativa:** 3h  
**Dependências:** Todas as telas criadas

---

### **US-026: Onboarding e Tutorial**
**Como** novo usuário  
**Quero** entender como usar a plataforma  
**Para que** não fique perdido

**Critérios de Aceitação:**
- [ ] Tour guiado no primeiro acesso (react-joyride)
- [ ] Highlights nos botões principais
- [ ] 4 passos do tour:
  1. "Bem-vindo ao YISA"
  2. "Aqui você gera documentos"
  3. "Alunos guardam no telemóvel"
  4. "Verificação é instantânea"
- [ ] Opção "Pular Tutorial"
- [ ] Botão "Ajuda" que reabre tutorial

**Story Points:** 3  
**Prioridade:** 🟡 Média (Should Have)  
**Sprint:** 3  
**Estimativa:** 2h  
**Dependências:** US-018

---

## 🧪 ÉPICO 9: TESTES E QUALIDADE

### **US-027: Testes Manuais Críticos**
**Como** desenvolvedor  
**Quero** garantir que fluxos críticos funcionam  
**Para que** demo não falhe no hackathon

**Critérios de Aceitação:**
- [ ] Checklist de testes executada:
  - ✅ Gerar documento offline (WiFi desligado)
  - ✅ Verificar documento offline
  - ✅ PWA instalável no Android
  - ✅ PWA instalável no iOS
  - ✅ Sincronização ao religar internet
  - ✅ Verificação em 2 dispositivos diferentes
  - ✅ QR Code legível por app externa (Google Lens)
- [ ] Bugs críticos corrigidos
- [ ] 5 documentos de teste gerados

**Story Points:** 5  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 3  
**Estimativa:** 3h  
**Dependências:** Todas as US anteriores

---

### **US-028: Performance Optimization**
**Como** usuário  
**Quero** que a app seja rápida  
**Para que** não haja frustrações

**Critérios de Aceitação:**
- [ ] Lighthouse Score:
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 90+
  - SEO: 100
- [ ] Time to Interactive (TTI) < 3s
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Bundle size < 500KB (gzipped)
- [ ] Imagens optimizadas (WebP, lazy loading)

**Story Points:** 5  
**Prioridade:** 🟡 Média (Should Have)  
**Sprint:** 3  
**Estimativa:** 2.5h  
**Dependências:** Todas as features implementadas

---

## 📚 ÉPICO 10: DOCUMENTAÇÃO E DEPLOY

### **US-029: README.md Exemplar**
**Como** jurado do hackathon  
**Quero** entender o projeto rapidamente no GitHub  
**Para que** possa avaliar adequadamente

**Critérios de Aceitação:**
- [ ] Seções obrigatórias:
  - Logo YISA (banner)
  - Badges (build status, license, version)
  - Descrição do problema (dados reais)
  - Demo em GIF/vídeo (30s)
  - Features principais (lista com emojis)
  - Stack técnica
  - Como rodar localmente (passo-a-passo)
  - Como contribuir
  - Licença (MIT)
  - Créditos (equipa)
- [ ] Screenshots da interface
- [ ] Link para demo ao vivo
- [ ] Markdown formatado profissionalmente

**Story Points:** 3  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 3  
**Estimativa:** 2h  
**Dependências:** Nenhuma (pode ser feito em paralelo)

**Template README:**
```markdown
<div align="center">
  <img src="./docs/logo.svg" alt="YISA Logo" width="200"/>
  <h1>YISA - Leve sua educação consigo</h1>
  <p>Documentos escolares digitais verificáveis. Offline. Instantâneo.</p>
  
  [![Build](https://img.shields.io/badge/build-passing-brightgreen)]()
  [![License](https://img.shields.io/badge/license-MIT-blue)]()
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)]()
</div>

## 🎯 O Problema

25.000 alunos transferidos em 2024. 360.000 dias de aula perdidos...

[continua...]
```

---

### **US-030: Deploy em Produção**
**Como** equipa  
**Quero** ter a aplicação online e acessível  
**Para que** jurados possam testar

**Critérios de Aceitação:**
- [ ] Deploy no Vercel com domínio custom: yisa-moz.vercel.app
- [ ] SSL/HTTPS configurado automaticamente
- [ ] CI/CD configurado (deploy automático do main branch)
- [ ] Environment variables configuradas no Vercel
- [ ] Firebase produção configurado (projeto separado de dev)
- [ ] Analytics configurado (Google Analytics ou Plausible)
- [ ] Teste de carga básico (50 requisições simultâneas)

**Story Points:** 3  
**Prioridade:** 🔴 Alta (Must Have)  
**Sprint:** 3  
**Estimativa:** 1.5h  
**Dependências:** US-001, US-002

**Comandos de Deploy:**
```bash
# 1. Conectar Vercel
vercel login
vercel link

# 2. Configurar env vars
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... outras vars

# 3. Deploy
vercel --prod
```

---

### **US-031: Vídeo Demo (Backup)**
**Como** equipa  
**Quero** ter vídeo gravado da demo  
**Para que** se algo falhar ao vivo, tenhamos backup

**Critérios de Aceitação:**
- [ ] Vídeo de 60 segundos gravado
- [ ] Conteúdo:
  - 0-10s: Problema (dados na tela)
  - 10-40s: Demo funcionando (offline!)
  - 40-50s: Resultado e impacto
  - 50-60s: Logo + GitHub repo
- [ ] Qualidade: 1080p mínimo
- [ ] Legendas em português
- [ ] Upload no YouTube (unlisted)
- [ ] GIF de 5s para README

**Story Points:** 2  
**Prioridade:** 🟡 Média (Should Have)  
**Sprint:** 3  
**Estimativa:** 1.5h  
**Dependências:** US-027

---

## 📋 BACKLOG PRIORIZADO (ORDEM DE EXECUÇÃO)

### **SPRINT 1 (10-11 Nov) - 28 Story Points**

| Ordem | ID | User Story | Pontos | Tempo |
|-------|-----|-----------|--------|-------|
| 1 | US-001 | Setup do Projeto Base | 3 | 2h |
| 2 | US-002 | Configuração Firebase | 3 | 2h |
| 3 | US-003 | Design System Base | 2 | 1.5h |
| 4 | US-004 | Login Google OAuth | 5 | 3h |
| 5 | US-006 | Proteção de Rotas | 2 | 1h |
| 6 | US-007 | Formulário Criação Documento | 5 | 3h |
| 7 | US-008 | Geração PDF | 8 | 4h |

**Total: 28 pontos / 16.5 horas**

---

### **SPRINT 2 (12-13 Nov) - 31 Story Points**

| Ordem | ID | User Story | Pontos | Tempo |
|-------|-----|-----------|--------|-------|
| 8 | US-009 | QR Code Criptográfico | 8 | 4h |
| 9 | US-010 | Salvar Firestore | 3 | 2h |
| 10 | US-011 | Configuração PWA | 5 | 3h |
| 11 | US-012 | Armazenamento Offline | 5 | 3h |
| 12 | US-015 | Scanner QR Code | 5 | 3h |
| 13 | US-016 | Validação Criptográfica | 8 | 4h |
| 14 | US-017 | Tela Resultado Verificação | 5 | 2.5h |

**Total: 39 pontos / 21.5 horas**

---

### **SPRINT 3 (14 Nov) - 30 Story Points**

| Ordem | ID | User Story | Pontos | Tempo |
|-------|-----|-----------|--------|-------|
| 15 | US-013 | Interface Carteira Digital | 5 | 3h |
| 16 | US-025 | Responsividade Mobile | 5 | 3h |
| 17 | US-018 | Dashboard Diretor | 8 | 4h |
| 18 | US-021 | Sincronização Inteligente | 8 | 4h |
| 19 | US-027 | Testes Manuais Críticos | 5 | 3h |
| 20 | US-029 | README Exemplar | 3 | 2h |
| 21 | US-030 | Deploy Produção | 3 | 1.5h |
| 22 | US-031 | Vídeo Demo | 2 | 1.5h |

**Total: 39 pontos / 22 horas**

---

## 📈 GRÁFICO DE BURNDOWN (PREVISÃO)

```
Story Points
90 |●
   |  ●
   |    ●
60 |      ●
   |        ●
   |          ●
30 |            ●
   |              ●
 0 |________________●
   10  11  12  13  14  (Nov)
   
   Sprint 1  Sprint 2  Sprint 3
```

---

## 🎯 DEFINITION OF DONE (DoD)

### **Para cada User Story ser considerada DONE:**

✅ **Código:**
- [ ] Código implementado e funcional
- [ ] TypeScript sem erros de tipo
- [ ] ESLint sem warnings
- [ ] Commits com mensagens descritivas

✅ **Testes:**
- [ ] Testado manualmente em Chrome + Firefox
- [ ] Testado em dispositivo Android real
- [ ] Funciona offline (se aplicável)

✅ **UI/UX:**
- [ ] Interface responsiva (mobile + desktop)
- [ ] Loading states implementados
- [ ] Error handling com mensagens claras

✅ **Documentação:**
- [ ] Comentários em código complexo
- [ ] Props/interfaces documentadas
- [ ] README atualizado (se necessário)

✅ **Integração:**
- [ ] Merge na branch main sem conflitos
- [ ] Deploy automático funcionando
- [ ] Sem breaking changes

---

## 🚨 RISCOS E MITIGAÇÕES

### **RISCO 1: Complexidade da Criptografia (Alta Probabilidade, Alto Impacto)**
**Descrição:** Implementar ECDSA corretamente é complexo e pode ter bugs sutis.

**Mitigação:**
- Usar biblioteca testada (elliptic.js, não implementar do zero)
- Fazer prova de conceito no Sprint 1
- Ter fallback: se falhar, usar apenas SHA-256 (menos seguro, mas funcional)

---

### **RISCO 2: PWA não Funcionar Offline (Média Probabilidade, Alto Impacto)**
**Descrição:** Service Workers são complicados, cache pode não funcionar.

**Mitigação:**
- Usar Vite PWA Plugin (abstrai complexidade)
- Testar offline desde o Sprint 2
- Ter backup: se PWA falhar, mostrar apenas web app (perde nota, mas funciona)

---

### **RISCO 3: Firebase Limits (Baixa Probabilidade, Mé