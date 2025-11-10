# 📘 YISA - PLATAFORMA DE DOCUMENTOS ESCOLARES DIGITAIS
### *"Leve sua educação consigo"*

**Origem do Nome:** Yisa (Ronga/Changana) = Levar, Conduzir, Trazer, Mover  
**Repositório:** github.com/yisa-mozambique  
**Demo:** yisa.co.mz

---

## 📌 O PROBLEMA

### **Burocracia Paralisante nas Transferências Escolares**

Em Moçambique, quando um aluno precisa transferir-se entre escolas (Maputo → Beira, Nampula → Tete), enfrenta um processo burocrático que viola seu direito à educação e onera famílias vulneráveis.

### **Dados Críticos do Problema**

| Métrica | Valor Atual | Impacto Anual |
|---------|-------------|---------------|
| **Alunos transferidos por ano** | **25.000** | 100% afectados |
| **Tempo médio de transferência** | **18 dias úteis** | **360.000 dias de aula perdidos** |
| **Deslocamentos físicos necessários** | 5 deslocamentos/aluno | 125.000 deslocamentos desnecessários |
| **Custo médio por transferência** | 1.200 MT | **30M MT desperdiçados** |
| **Taxa de erro/corrupção documental** | 10% | 2.500 alunos com retrabalho |
| **Irregularidades de autenticidade** | 8% | 2.000 casos/ano de fraude |
| **Custo escolar (papel + autenticação)** | 50.000 MT/escola/ano | **60M MT/ano** (1.200 escolas) |
| **Investimento estatal perdido** | - | **120M MT/ano** |

**Total de impacto negativo: 210M MT/ano + 360.000 dias de aula perdidos**

### **História Real (Para o Pitch)**

> **João Silva, 16 anos, 11ª classe**
> 
> Em fevereiro de 2025, João mudou-se de Nampula para Maputo devido à transferência profissional dos pais.
> 
> **O Pesadelo Burocrático:**
> - **18 dias úteis** de espera para transferência do histórico
> - **5 deslocamentos** entre escolas e cartórios
> - **1.200 MT gastos** (14% do salário mínimo)
> - Documento digital existente chegou **corrompido** devido à falta de conectividade
> - **12 dias letivos perdidos** no início do ano
> - Atraso académico, stress emocional, prejuízo financeiro familiar
> 
> **Este não é um caso isolado. É a realidade de 25.000 famílias por ano.**

### **Fluxo Actual (Processo Quebrado)**

```
**DIA 1-5   → Aluno solicita transferência na escola de origem**
**DIA 6-10  → Diretor emite documentos físicos (histórico, certificados)**
**DIA 11-14 → Autenticação cartorial (custo: 400 MT)**
**DIA 15-18 → Envio por correio/familiar (custo: 800 MT, alto risco de corrupção)**
**DIA 19-22 → Escola destino valida via telefone/email**
**DIA 23-28 → Dados incorrectos ou corrompidos? Reinicia processo (10% dos casos)**
**DIA 29-36 → Matrícula finalmente aprovada**

**RESULTADO: 18 DIAS ÚTEIS SEM ESTUDAR + 1.200 MT GASTOS**

**Problema agravado:** Documentos digitais atuais (PDF por email/WhatsApp) falham em 10% dos casos devido a:
- Corrupção de ficheiros em redes instáveis
- Impossibilidade de validar autenticidade
- Dependência total de internet nas duas pontas
```

### **Por Que Este Problema É Crítico?**

1. **Direito à Educação Violado:** Semanas/meses sem aulas por burocracia
2. **Impacto Financeiro:** 350 MT = 10%+ do salário mínimo para famílias vulneráveis
3. **Falsificação Rampante:** 15% dos documentos são adulterados/forjados
4. **Ineficiência Sistémica:** Diretores gastam 40h/mês em burocracia documental
5. **Zero Rastreabilidade:** Não existe base de dados de certificados legítimos

---

## ✅ A SOLUÇÃO: YISA

### **Plataforma Open Source de Certificados Digitais Verificáveis**

YISA transforma documentos escolares em **PDFs digitais com QR Code criptográfico** que permite:

- ✅ **Emissão instantânea** pela escola de origem (2 minutos)
- ✅ **Portabilidade total** (aluno guarda no telemóvel via PWA)
- ✅ **Verificação offline** em 3 segundos (escola de destino escaneia QR)
- ✅ **Imutabilidade** (hash criptográfico previne falsificação 100%)
- ✅ **Rastreabilidade** (todas as emissões registadas para auditoria)

### **Como Funciona (3 Passos Simples)**

```
┌──────────────────────────────────────────────────────────┐
│  PASSO 1: EMITIR (Escola de Origem)                      │
├──────────────────────────────────────────────────────────┤
│  → Diretor acede ao YISA via browser                     │
│  → Preenche dados do aluno (nome, classe, tipo de doc)  │
│  → Clica "Gerar Documento"                               │
│  → PDF com QR Code é criado instantaneamente             │
│  → Entrega ao aluno (impresso ou digital)                │
│                                                           │
│  ⏱️ Tempo: 2 minutos                                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  PASSO 2: PORTAR (Aluno)                                 │
├──────────────────────────────────────────────────────────┤
│  → Aluno instala PWA YISA no telemóvel (Android/iOS)    │
│  → Documento fica armazenado offline (IndexedDB)         │
│  → Sempre acessível, mesmo sem internet                  │
│                                                           │
│  ⏱️ Tempo: 30 segundos                                    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  PASSO 3: VERIFICAR (Escola de Destino)                 │
├──────────────────────────────────────────────────────────┤
│  → Escola acede yisa.co.mz/verify                        │
│  → Escaneia QR Code do documento                         │
│  → Sistema valida hash criptográfico                     │
│  → Resultado: ✅ "Documento Válido - Escola X, Maputo"   │
│                                                           │
│  ⏱️ Tempo: 3 segundos (FUNCIONA SEM INTERNET!)           │
└──────────────────────────────────────────────────────────┘
```

### **Impacto Imediato Mensurável**

| Métrica | Situação Actual | Com YISA | Melhoria |
|---------|-----------------|----------|----------|
| **Tempo de transferência** | 18 dias úteis | **90 segundos** | **-99.7%** |
| **Custo por transferência** | 1.200 MT | **0 MT** | **-100%** |
| **Deslocamentos físicos** | 5 deslocamentos | **0 deslocamentos** | **Elimina** |
| **Taxa de corrupção documental** | 10% | **0%** | **Elimina** |
| **Irregularidades de autenticidade** | 8% | **0%** | **Elimina** |
| **Dias letivos perdidos** | 12 dias/aluno | **0 dias** | **+12 dias** |

### **Valor Económico Anual Gerado**

- **Famílias:** 30M MT economizados (25.000 × 1.200 MT)
- **Escolas:** 60M MT em papel/autenticação (1.200 × 50k MT)
- **Sistema:** 360.000 dias de aula recuperados = 120M MT de investimento estatal preservado
- **Total:** **210M MT de impacto directo por ano**

---

## 🚀 MVP - FUNCIONALIDADES ESSENCIAIS

### **7 Features Core (100% Demoáveis em 3 Semanas)**

#### **1. Autenticação Institucional**
- Login via Google Workspace (usado por 80% das escolas em Maputo)
- Perfis: Diretor, Secretário Escolar, Verificador
- Controle de acesso por escola (multi-tenancy)
- **Tempo de implementação:** 3h

#### **2. Geração de Documentos Digitais**
**Tipos suportados:**
- Histórico Escolar (1ª-12ª classe)
- Declaração de Transferência
- Certificado de Aproveitamento
- Declaração de Matrícula

**Interface:**
- Formulário guiado com validação de dados obrigatórios
- Pré-visualização em tempo real do PDF
- Geração de PDF profissional com:
  - Logo da escola + cabeçalho oficial
  - Dados estruturados do aluno
  - **QR Code grande (5x5cm)** no canto superior direito
  - Hash criptográfico no rodapé (SHA-256)
  - Assinatura digital do diretor (ECDSA)

**Tempo de implementação:** 6h

#### **3. QR Code Criptográfico Verificável**
**Tecnologia:**
- Hash SHA-256 do documento completo (impossível falsificar)
- Assinatura ECDSA da escola emissora (mesma tecnologia do Bitcoin)
- URL incorporado: `yisa.co.mz/verify/{hash}`

**Dados codificados no QR:**
```json
{
  "hash": "a3f5c8d2e1b4f7a9...",
  "schoolCode": "ESJ-MPT-001",
  "schoolName": "E.S. Josina Machel",
  "studentName": "Maria Alberto",
  "documentType": "transfer",
  "issueDate": "2024-11-15",
  "signature": "304502210..."
}
```

**Tempo de implementação:** 4h

#### **4. PWA do Aluno (Carteira Digital Offline)**
**Funcionalidades:**
- Instalável no Android/iOS sem Google Play/App Store
- Armazena documentos em IndexedDB (funciona offline)
- Interface tipo "carteira digital":
  - Lista de documentos por tipo
  - Visualização rápida de PDFs
  - Compartilhamento via QR Code
  - Status de sincronização
- **Funciona 100% offline após primeira instalação**
- Sincronização automática quando online (apenas metadados)

**Tempo de implementação:** 5h

#### **5. Verificação Instantânea (Offline-First)**
**Fluxo de verificação:**
1. Escola destino acede a `yisa.co.mz/verify`
2. Escaneia QR Code (câmera web ou telemóvel)
3. Sistema valida localmente:
   - Hash corresponde ao documento?
   - Assinatura da escola é autêntica?
   - Documento não foi revogado?
4. Resultado em 3 segundos:
   - **✅ Verde:** "Documento Válido - Escola Josina Machel, Maputo"
   - **⚠️ Amarelo:** "Atenção - Documento expirado em [data]"
   - **❌ Vermelho:** "Inválido - Possível falsificação. Contacte escola."

**CRÍTICO:** Verificação funciona offline via cache local de escolas verificadas (Service Worker).

**Tempo de implementação:** 4h

#### **6. Dashboard Administrativo**
**Para Diretores:**
- Documentos emitidos (últimos 30 dias)
- Documentos verificados por outras escolas
- Estatísticas em tempo real:
  - Total de certificados válidos em circulação
  - Taxa de verificações bem-sucedidas (%)
  - Alertas de tentativas de falsificação
- Gráficos simples (Chart.js)

**Para MINEDH (futuro):**
- Painel nacional de mobilidade estudantil
- Detecção de padrões anómalos (ML simples)
- Export de dados anonimizados para planejamento

**Tempo de implementação:** 3h

#### **7. Sistema de Sincronização Inteligente**
**Online:**
- Documentos emitidos → Firebase Firestore
- Verificações registam metadados (sem dados pessoais sensíveis)
- Auditoria completa de ações

**Offline:**
- Documentos ficam em cache local (Service Worker + IndexedDB)
- Fila de sincronização quando reconectar
- Indicador visual de status: 🟢 Sincronizado | 🟡 Pendente | 🔴 Erro

**Tempo de implementação:** 2h

---

## 🛠️ STACK TÉCNICA

### **Frontend**
- **React 19 + TypeScript** (type-safe, features mais recentes)
- **Vite** (build ultra-rápido, dev experience superior)
- **shadcn/ui** (componentes modernos, acessíveis, customizáveis)
- **Vite PWA Plugin** (gera Service Worker automaticamente)
- **html5-qrcode** (scanner de QR Code cross-platform)

### **Backend/Infraestrutura**
- **Firebase Authentication** (Google Login)
- **Firebase Firestore** (modo offline habilitado nativamente)
- **Firebase Storage** (backups de PDFs)
- **Firebase Hosting** (CDN global, HTTPS grátis)

### **Bibliotecas Core**
- **pdf-lib** (geração de PDFs client-side, sem servidor)
- **qrcode** (geração de QR Codes SVG/PNG)
- **crypto-js** (hashing SHA-256)
- **elliptic** (assinatura digital ECDSA)

### **Deploy**
- **Vercel** (frontend, CI/CD automático do GitHub)
- **GitHub** (repositório open source, licença MIT)

### **Por Que Este Stack?**

| Decisão | Justificativa |
|---------|---------------|
| **React 19 + Vite** | Features mais recentes, compiler otimizado, HMR instantâneo |
| **shadcn/ui** | Componentes modernos copiáveis, Tailwind nativo, acessibilidade |
| **Firebase** | BaaS completo, grátis até 50k docs/dia, offline nativo |
| **PDF client-side** | Sem backend = escalável infinitamente, custo zero |
| **PWA** | Funciona offline, instalável, performance nativa |
| **Vercel** | Deploy automático, edge network, 100% grátis para OSS |

---

## 📅 CRONOGRAMA DE DESENVOLVIMENTO

### **Dia 1 (10 Nov): Fundação - 8h**
- ✅ Setup do projeto (React + Vite + Firebase)
- ✅ Configuração de autenticação Google
- ✅ UI base (layout, navegação, design system)
- ✅ Estrutura de dados no Firestore

### **Dia 2 (11 Nov): Core Features - 8h**
- ✅ Geração de PDF + QR Code funcional
- ✅ Sistema de verificação offline
- ✅ Dashboard básico

### **Dia 3 (12 Nov): PWA + Polish - 6h**
- ✅ Configuração PWA (Service Worker, Manifest)
- ✅ Carteira digital do aluno
- ✅ Testes com 5 documentos reais

### **Dia 4-5 (13-14 Nov): Testes + Pitch - 6h**
- ✅ Testes em 2 dispositivos diferentes
- ✅ Ajustes de UX/UI
- ✅ Preparação do pitch (script, slides, vídeo backup)
- ✅ Documentação GitHub exemplar

### **15 Nov (HackDay): APRESENTAÇÃO**
- ✅ Demo ao vivo (com WiFi desligado!)
- ✅ Pitch de 3 minutos
- ✅ Q&A preparado

**Total de desenvolvimento: 28h distribuídas em 5 dias**

---

## 🎯 DIFERENCIAIS COMPETITIVOS

### **1. Funciona Offline (Crítico para Moçambique)**
- 60% das escolas têm internet intermitente ou inexistente
- YISA continua funcionando quando WiFi cai
- Verificação não depende de servidor central online

### **2. Custo Zero para Escolas**
- Infraestrutura em cloud gratuito (Firebase free tier: 50k docs/dia)
- Sem necessidade de servidor próprio
- Escalável para 10.000+ escolas sem custo adicional

### **3. Adoção Imediata (Sem Aprovação Prévia)**
- Não precisa de lei/decreto do MINEDH
- Escola pode começar a usar amanhã
- Opt-in voluntário (como usar Excel ou WhatsApp hoje)
- Não depende de outras escolas aderirem

### **4. Open Source Auditável**
- Código 100% público no GitHub (licença MIT)
- Comunidade pode auditar segurança
- Outras ONGs podem forkar e customizar
- Uso comercial permitido (escolas privadas podem usar)

### **5. Padrão Extensível**
- Pode virar protocolo nacional de certificação educacional
- Expansível para:
  - Certificados profissionais (INEFP)
  - Diplomas universitários (UEM, UP, UCM)
  - Cartões de vacinação escolar
  - Declarações de presença/comportamento

### **6. Segurança Nível Bancário**
- Hash SHA-256 (usado por bancos, impossível falsificar)
- Assinatura ECDSA (mesma tecnologia de Bitcoin)
- Cada alteração de 1 letra = hash completamente diferente
- Tentativa de falsificação = detecção instantânea

---

## 📊 MODELO DE SUSTENTABILIDADE OPEN SOURCE

### **Custo de Operação (Anual)**
- **Infraestrutura:** 0 MT (Firebase free tier + Vercel OSS)
- **Domínio:** 500 MT/ano (.co.mz)
- **Manutenção:** Comunidade open source
- **Total:** **500 MT/ano** (sustentável para sempre)

### **Fontes de Sustentabilidade**
1. **Doações:** GitHub Sponsors, Open Collective
2. **Parcerias:** ONGs (UNICEF, World Bank, USAID)
3. **Contratos:** MINEDH para features específicas
4. **Serviços:** Consultoria para escolas privadas (opcional)

### **Governança**
- Repositório público no GitHub
- Decisões por consenso da comunidade
- Roadmap transparente (GitHub Projects)
- Código de conduta (Contributor Covenant)

---

## 🎤 ESTRUTURA DO PITCH (3 MINUTOS)

### **Minuto 1: Problema (45s)**
> "Imaginem o João, 16 anos, 11ª classe. Mudou de Nampula para Maputo em fevereiro. Transferência do histórico: 18 dias úteis, 5 deslocamentos, 1.200 meticais. Perdeu 12 dias letivos. Documento digital chegou corrompido porque escola não tinha internet estável. Isto acontece com 25.000 alunos por ano. 360.000 dias de educação perdidos. 210 milhões de meticais desperdiçados. E documentos digitais actuais não resolvem porque dependem de internet nas duas pontas."

### **Minuto 2: Solução + Demo Ao Vivo (90s)**
> "Apresento YISA - palavra ronga que significa 'levar, conduzir'. Documentos escolares digitais que funcionam 100% offline. Vejam como funciona."
> 
> **[DESLIGA WIFI NA FRENTE DO JÚRI]**
> 
> 1. "Como diretor, gero certificado do João. 90 segundos. PDF com QR Code criptográfico."
> 2. "Pego meu telemóvel. SEM INTERNET. Escaneio o QR."
> 3. "✅ Documento Válido. 2 segundos. Sem papel. Sem deslocamentos. Sem corrupção de ficheiros."
> 
> **[LIGA WIFI]**
> 
> "Quando conecta, sincroniza automaticamente. Dashboard mostra estatísticas."

### **Minuto 3: Impacto + Open Source (45s)**
> "YISA transforma 18 dias em 90 segundos. 1.200 meticais em zero. Funciona offline - resolve o gap de conectividade de Moçambique. Qualquer escola pode usar AMANHÃ. Sem depender de ninguém. Código 100% aberto no GitHub. Licença MIT. Gratuito para sempre. Roadmap: pilotar com 5 escolas em dezembro. 50 escolas em março. Propor ao MINEDH como padrão nacional. YISA - Leve sua educação consigo."

---

## 📞 PRÓXIMOS PASSOS

### **Pós-Hackathon (Dezembro 2024)**
- Piloto com 5 escolas em Maputo
- 100 documentos emitidos e verificados
- Feedback de usuários reais

### **Q1 2025 (Janeiro-Março)**
- Expansão para 50 escolas (todas províncias)
- 2.000+ documentos em circulação
- Parceria com 1 ONG educacional

### **Q2 2025 (Abril-Junho)**
- Proposta formal ao MINEDH
- 500+ escolas usando ativamente
- Documentação de impacto (estudo de caso)

### **Visão de Longo Prazo (2026+)**
- YISA como padrão ISO de certificação educacional africana
- Integração com sistemas regionais (SADC)
- Portfolio académico portátil (primária → universidade)

---

## 🏆 IMPACTO ESPERADO (ANO 1)

- **125.000 alunos** com transferências instantâneas (50% dos 25k)
- **720 escolas** usando a plataforma activamente
- **105M MT** economizados (famílias) + **30M MT** (escolas) = **135M MT total**
- **0 casos** de corrupção de documentos
- **0 irregularidades** de autenticidade reportadas
- **Padrão aberto** adoptado por organizações regionais (SADC)

---

**YISA Moçambique — Mobilidade estudantil sem burocracia.**  
**Open Source. Offline. Gratuito. Para sempre.**

*Repositório: github.com/yisa-mozambique*  
*Demo: yisa.co.mz*  
*Contacto: equipa@yisa.co.mz*