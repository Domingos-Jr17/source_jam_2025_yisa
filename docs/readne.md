# YISA - Your Interactive School Assistant

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![Firebase](https://img.shields.io/badge/Firebase-yellow)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Projeto

**YISA** (Your Interactive School Assistant) é uma plataforma inovadora para digitalização e gestão de documentos escolares em Moçambique, focada em resolver o problema de transferências escolares que afeta milhares de famílias todos os anos.

### 🏆 **Source Jam 2025**

Este projeto está sendo desenvolvido para o **Source Jam 2025**, organizado pelas comunidades **MozDev** e **Maputo Frontenders**:

- **Evento**: Source Jam 2025 - "Building Open Source Solutions Together"
- **Pilar**: Educação
- **Equipa**: Grupo 1 - Pilar Educação
- **Datas**: 25 Outubro (Lançamento) - 15 Novembro (HackDay)
- **Foco**: Soluções open source para problemas reais de Moçambique

## 📊 **O Problema**

- **25.000 alunos** transferidos anualmente em Moçambique
- **18-45 dias** de burocracia para transferência
- **360.000-540.000 dias letivos** perdidos anualmente
- **64-210 milhões MT** desperdiçados em custos administrativos
- **60% das escolas** sem conexão estável à internet

## 💡 **A Solução**

YISA é uma **PWA (Progressive Web App)** que funciona **100% offline** com:

- 📱 **Transferência Digital**: QR codes criptográficos com assinatura ECDSA
- 🔄 **Validação Offline**: Verificação instantânea sem necessidade de internet
- 📊 **Dashboard Analytics**: Estatísticas em tempo real
- 🔐 **Segurança Avançada**: Criptografia nível Bitcoin
- 📱 **Design Mobile-First**: Otimizado para smartphones Android (90% do mercado)
- 🌍 **Multi-idioma**: Português, Inglês, e línguas locais (Ronga/Changana)

## 🛠️ **Stack Tecnológico**

### Frontend

- **React 19** com TypeScript
- **Vite 6** para build e desenvolvimento
- **shadcn/ui** para componentes modernos
- **Tailwind CSS** para styling
- **PWA** com Service Workers para funcionalidade offline

### Backend

- **Firebase Authentication** para gestão de usuários
- **Firestore Database** para dados estruturados
- **Firebase Storage** para armazenamento de arquivos
- **Firebase Functions** para lógica serverless

### Deploy & Infraestrutura

- **Vercel** para frontend hosting
- **GitHub** com código aberto (licença MIT)
- **Chrome DevTools** para auditoria PWA

## 🚀 **Getting Started**

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Firebase (opcional para desenvolvimento local)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/[username]/yisa.git
cd yisa

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Abrir no navegador
# http://localhost:5173
```

### Variáveis de Ambiente

```bash
# Criar ficheiro .env
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
npm run preview      # Preview do build de produção
npm run test         # Executar testes
npm run lint         # Linting do código
npm run type-check   # Verificação de tipos TypeScript
```

## 👥 **Como Contribuir**

Este projeto é open source e contribuições são bem-vindas! Aqui estão as diretrizes:

### Para Membros da Equipa

1. **Fazer Fork** do repositório
2. Criar **branch** para funcionalidade: `git checkout -b feature/nova-funcionalidade`
3. Fazer **commit** das mudanças: `git commit -m 'Add: nova funcionalidade'`
4. Fazer **push** para o branch: `git push origin feature/nova-funcionalidade`
5. Abrir **Pull Request** com descrição detalhada

### Padrões de Commit

```
Add: nova funcionalidade
Fix: correção de bug
Update: atualização de funcionalidade existente
Docs: documentação
Style: formatação, semântica
Refactor: refatoração de código
Test: adicionar testes
```

### Estrutura de Pastas

```
src/
├── components/     # Componentes React reutilizáveis
├── pages/         # Páginas principais da aplicação
├── hooks/         # Hooks personalizados
├── utils/         # Funções utilitárias
├── types/         # Definições TypeScript
├── services/      # Serviços Firebase e APIs
└── assets/        # Imagens, fonts, etc.
```

## 📋 **Product Backlog**

O backlog completo está disponível em `yisa_product_backlog.md`. Principais funcionalidades:

### MVP (Minimum Viable Product)

- [x] Autenticação de utilizadores
- [x] Geração de QR codes criptográficos
- [x] Validador offline de documentos
- [ ] Dashboard para administração
- [ ] Sistema de backup/sincronização

### V2.0

- [ ] Integração com sistema MINEDH
- [ ] Versão mobile nativa (React Native)
- [ ] Analytics avançados
- [ ] Multi-escolas

## 🎯 **Impacto Esperado**

### Social

- **540.000 dias letivos** recuperados anualmente
- **25.000 famílias** beneficiadas diretamente
- Redução da burocracia educacional

### Económico

- **210 milhões MT** economizados anualmente
- Redução de custos administrativos em escolas
- Maior eficiência no sistema educativo

### Tecnológico

- Primeira solução PWA offline-first para educação em Moçambique
- Demonstração de capacitação técnica local
- Contribuição para ecossistema tech moçambicano

## 📊 **Métricas de Sucesso**

- **Adoção**: 1.200 escolas em 2 anos
- **Impacto**: 100.000 alunos beneficiados
- **Performance**: 99.9% uptime, <3s load time
- **Acessibilidade**: 100% funcional offline

## 🔮 **Visão Futura**

### Curto Prazo (6 meses)

- Lançamento oficial no Source Jam 2025
- Piloto com 50 escolas em Maputo
- Certificação ISO 27001 (segurança)

### Médio Prazo (1-2 anos)

- Expansão para todas as províncias
- Integração com INEFP
- Versão mobile nativa

### Longo Prazo (3-5 anos)

- Expansão para SADC (Comunidade de Desenvolvimento da África Austral)
- Adaptation para outros setores (saúde, documentos governamentais)
- Certificação digital nacional

## 📞 **Contacto**

- **Equipa**: Grupo 1 - Pilar Educação (Source Jam 2025)
- **Email**: [team-email]
- **Discord**: [canal-da-equipa]
- **GitHub Issues**: Para bugs e sugestões

## 📄 **Licença**

Este projeto está licenciado sob a **Licença MIT** - ver ficheiro [LICENSE](LICENSE) para detalhes.

---

## 🙏 **Agradecimentos**

- **MozDev** e **Maputo Frontenders** pela organização do Source Jam 2025
- Comunidade tech de Moçambique pelo suporte e mentoria
- Escolas piloto pela colaboração no desenvolvimento
- Todos os contribuidores open source

---

**"YISA** - do dialeto Ronga/Changana, significa **"Levar, Conduzir, Trazer"** - exatamente o que fazemos com a educação digital em Moçambique." 🇲🇿
