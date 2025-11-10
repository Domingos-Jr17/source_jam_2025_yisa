# 🚀 Source Jam 2025 - Grupo 1 (Pilar Educação)

![MozDev](https://img.shields.io/badge/MozDev-Community-blue)
![Maputo Frontenders](https://img.shields.io/badge/Maputo%20Frontenders-Frontend-purple)
![Source Jam](https://img.shields.io/badge/Source%20Jam-2025-green)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 **Visão Geral**

Bem-vindo ao repositório do **Grupo 1 - Pilar Educação** do **Source Jam 2025**! Este projeto está sendo desenvolvido como parte da competição organizada pelas comunidades **MozDev** e **Maputo Frontenders**.

### 🎯 **Evento**
- **Nome**: Source Jam 2025 - *"Building Open Source Solutions Together"*
- **Organizadores**: MozDev + Maputo Frontenders
- **Datas**: 25 Outubro (Lançamento) - 15 Novembro (HackDay)
- **Pilar**: Educação
- **Equipa**: Grupo 1

## 🏗️ **Estrutura do Projeto**

```
source_jam/
├── README.md                 # Este ficheiro
├── .gitignore               # Ignorar arquivos do Git
├── docs/                    # 📚 Documentação do projeto
│   ├── yisa_proposal.md     # Proposta completa do YISA
│   ├── yisa_final_proposal.md # Versão final da proposta
│   ├── yisa_product_backlog.md # Backlog do produto
│   ├── desafio.txt          # Desafio do Source Jam
│   └── Proposta_grupo_1_Pilar_1.docx # Documento oficial
└── yisa/                    # 💻 Código da aplicação
    ├── README.md            # README específico do YISA
    ├── package.json         # Dependências e scripts
    ├── src/                 # Código fonte React
    └── public/              # Assets estáticos
```

## 🎓 **Nosso Projeto: YISA**

### **YISA** - *Your Interactive School Assistant*

YISA é uma **Progressive Web App (PWA)** inovadora para digitalização de documentos escolares em Moçambique, focada em resolver o problema de transferências escolares.

#### 📊 **O Problema**
- **25.000 alunos** transferidos anualmente
- **18-45 dias** de burocracia para transferência
- **360.000+ dias letivos** perdidos anualmente
- **60% das escolas** sem internet estável

#### 💡 **A Solução**
- **100% Offline**: Funciona sem conexão à internet
- **QR Codes Criptográficos**: Assinatura digital ECDSA
- **Mobile-First**: Otimizado para smartphones Android
- **Dashboard Analytics**: Estatísticas em tempo real
- **Multi-idioma**: Português + línguas locais

#### 🛠️ **Stack Tecnológico**
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **PWA**: Service Workers + offline-first architecture
- **Deploy**: Vercel + GitHub open source

## 🚀 **Começar a Desenvolver**

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Git

### Setup Inicial

```bash
# 1. Clonar repositório
git clone https://github.com/[username]/source_jam.git
cd source_jam

# 2. Entrar na pasta da aplicação
cd yisa

# 3. Instalar dependências
npm install

# 4. Iniciar desenvolvimento
npm run dev

# 5. Abrir no navegador
# http://localhost:5173
```

## 👥 **Como Contribuir**

Este é um projeto open source colaborativo para o Source Jam 2025.

### Para Membros da Equipa

1. **Fazer Fork** do repositório
2. **Criar branch**: `git checkout -b feature/sua-funcionalidade`
3. **Commit**: `git commit -m 'Add: descrição da funcionalidade'`
4. **Push**: `git push origin feature/sua-funcionalidade`
5. **Pull Request**: Abrir PR com descrição detalhada

### Padrões de Commit
```
Add: nova funcionalidade
Fix: correção de bug
Update: atualização existente
Docs: documentação
Style: formatação/código
Refactor: refatoração
Test: testes
```

### Branches
- `main` : Branch principal (produção)
- `develop` : Branch de desenvolvimento
- `feature/*` : Funcionalidades específicas
- `hotfix/*` : Correções urgentes

## 📋 **Documentação**

Toda a documentação do projeto está na pasta `docs/`:

- [`yisa_proposal.md`](docs/yisa_proposal.md) - Proposta completa
- [`yisa_product_backlog.md`](docs/yisa_product_backlog.md) - Backlog detalhado
- [`yisa_final_proposal.md`](docs/yisa_final_proposal.md) - Versão final
- [`desafio.txt`](docs/desafio.txt) - Desafio do Source Jam 2025

## 🎯 **Objetivos para Source Jam**

### MVP (Meta para 15 Novembro)
- [ ] Autenticação de utilizadores completa
- [ ] Geração e validação de QR codes
- [ ] Funcionalidade 100% offline
- [ ] Dashboard administrativo básico
- [ ] Demo impactante para apresentação

### Critérios de Sucesso
- **Impacto Social**: Solução real para problema moçambicano
- **Inovação**: PWA offline-first criptográfica
- **Execução**: Código limpo, documentado e testável
- **Apresentação**: Demo técnica memorável

## 📊 **Métricas de Impacto**

- **Educação**: 540.000 dias letivos recuperados/ano
- **Econômico**: 210 milhões MT economizados/ano
- **Tecnológico**: Primeira solução PWA educacional em Moçambique
- **Escalabilidade**: 1.200 escolas em 2 anos

## 🏆 **Competição Source Jam**

### Pilares
- **🎓 Educação** - Nosso pilar com YISA
- **🚗 Mobilidade** - Soluções de transporte
- **💼 Empregabilidade** - Oportunidades de trabalho

### Critérios de Avaliação
1. **Inovação** - Criatividade e originalidade
2. **Impacto** - Benefício real para Moçambique
3. **Execução** - Qualidade técnica e implementação
4. **Apresentação** - Clareza e impacto da demo
5. **Open Source** - Qualidade da documentação e colaboração

## 🔗 **Links Importantes**

- **Source Jam 2025**: [Informações do evento](docs/desafio.txt)
- **MozDev**: [Comunidade MozDev](https://mozdev.org)
- **Maputo Frontenders**: [Comunidade Frontend](https://maputofrontenders.org)
- **Projeto YISA**: Ver pasta `yisa/` e seu README específico

## 📞 **Contacto da Equipa**

- **Canal de Comunicação**: Discord do Source Jam 2025
- **GitHub Issues**: Para bugs e sugestões técnicas
- **Email**: [email-da-equipa]
- **Documentação**: Ver pasta `docs/`

## 📄 **Licença**

Este projeto está licenciado sob **MIT License** - ver ficheiro [LICENSE](LICENSE).

---

## 🙏 **Agradecimentos**

- **MozDev** e **Maputo Frontenders** pela organização
- **Mentores** e **jurados** do Source Jam 2025
- **Comunidade tech** de Moçambique pelo apoio
- **Escolas piloto** pela colaboração no desenvolvimento

---

**"Building Open Source Solutions Together"** 🇲🇿

*Vamos transformar a educação em Moçambique com tecnologia!*