# Análise do Fluxo do Usuário - YISA

## Visão Geral

O YISA (Your Interactive School Assistant) é uma aplicação web progressiva (PWA) para digitalização de documentos escolares em Moçambique. O sistema foi projetado para funcionar 100% offline, resolvendo o problema de burocracia na transferência de estudantes entre escolas.

## Fluxos Principais do Usuário

### 1. Fluxo de Autenticação

```mermaid
graph TD
    A[Acesso à Aplicação] --> B{Usuário Autenticado?}
    B -->|Não| C[Exibir Botão "Entrar"]
    B -->|Sim| D[Acesso Completo]
    C --> E[Clique em "Entrar"]
    E --> F[Modal de Login]
    F --> G{Novo Usuário?}
    G -->|Sim| H[Formulário de Registro]
    G -->|Não| I[Formulário de Login]
    H --> J[Informar Nome e PIN]
    I --> K[Informar PIN]
    J --> L[Criar Sessão]
    K --> M[Validar PIN]
    L --> N[Armazenar Sessão Localmente]
    M --> O{PIN Válido?}
    O -->|Sim| N
    O -->|Não| P[Exibir Erro]
    N --> D
```

### 2. Fluxo de Emissão de Documentos

```mermaid
graph TD
    A[Acesso à Página Inicial] --> B[Clique em "Emitir Documento"]
    B --> C{Usuário Autenticado?}
    C -->|Não| D[Redirecionar para Login]
    C -->|Sim| E[Página de Emissão]
    D --> E
    E --> F[Preencher Formulário]
    F --> G[Informações do Estudante]
    G --> H[Informações Escolares]
    H --> I[Validação em Tempo Real]
    I --> J{Formulário Válido?}
    J -->|Não| K[Exibir Erros]
    J -->|Sim| L[Clique em "Emitir Documento"]
    L --> M[Gerar Hash SHA-256]
    M --> N[Criar Objeto do Documento]
    N --> O[Gerar QR Code]
    O --> P[Gerar PDF]
    P --> Q[Armazenar no IndexedDB]
    Q --> R[Redirecionar para Carteira]
    R --> S[Exibir Mensagem de Sucesso]
```

### 3. Fluxo de Verificação de Documentos

```mermaid
graph TD
    A[Acesso à Página Inicial] --> B[Clique em "Verificar Documento"]
    B --> C[Página de Verificação]
    C --> D{Método de Verificação}
    D -->|Scanner| E[Iniciar Câmera]
    D -->|Upload| F[Upload de Imagem]
    E --> G[Escanear QR Code]
    F --> H[Processar Imagem]
    G --> I[Dados do QR Code]
    H --> I
    I --> J[Validar Formato]
    J --> K{QR Code Válido?}
    K -->|Não| L[Exibir Erro]
    K -->|Sim| M[Verificar Checksum]
    M --> N{Checksum Válido?}
    N -->|Não| O[Documento Alterado]
    N -->|Sim| P[Buscar no IndexedDB]
    P --> Q{Documento Encontrado?}
    Q -->|Não| R[Documento Não Encontrado]
    Q -->|Sim| S[Comparar Hash]
    S --> T{Hash Confere?}
    T -->|Não| U[Documento Inválido]
    T -->|Sim| V[Verificar Validade]
    V --> W{Documento Expirado?}
    W -->|Sim| X[Documento Expirado]
    W -->|Não| Y[Documento Válido]
    Y --> Z[Exibir Informações do Documento]
```

### 4. Fluxo da Carteira Digital

```mermaid
graph TD
    A[Acesso à Página Inicial] --> B[Clique em "Minha Carteira"]
    B --> C{Usuário Autenticado?}
    C -->|Não| D[Redirecionar para Login]
    C -->|Sim| E[Página da Carteira]
    D --> E
    E --> F[Carregar Documentos]
    F --> G[Exibir Estatísticas]
    G --> H[Lista de Documentos]
    H --> I{Ação do Usuário}
    I -->|Visualizar| J[Detalhes do Documento]
    I -->|Partilhar| K[Modal de Partilha]
    I -->|Baixar| L[Download do PDF]
    I -->|Eliminar| M[Confirmação de Exclusão]
    K --> N[WhatsApp/Nativo]
    M --> O{Confirmado?}
    O -->|Sim| P[Excluir Documento]
    O -->|Não| H
```

## Análise dos Fluxos

### Pontos Fortes

1. **Segurança Robusta**

   - Autenticação por PIN de 6 dígitos
   - Hash SHA-256 para integridade dos documentos
   - Verificação offline de QR codes
   - Auditoria completa de operações

2. **Funcionalidade Offline**

   - Armazenamento local com IndexedDB
   - Service Worker para cache
   - Funcionamento completo sem internet

3. **Experiência do Usuário**

   - Interface limpa e intuitiva
   - Validação em tempo real
   - Feedback visual claro
   - Acessibilidade bem implementada

4. **Arquitetura Técnica**
   - Componentes bem estruturados
   - Separação clara de responsabilidades
   - Hooks customizados reutilizáveis
   - Estado centralizado com Zustand

### Problemas Identificados

#### 1. Fluxo de Autenticação

**Problema:** Não há recuperação de PIN esquecido

- Impacto: Usuários podem perder acesso permanentemente
- Risco: Alto - pode resultar em perda de dados

**Problema:** Limite de tentativas sem notificação clara

- Impacto: Usuário pode ser bloqueado sem entender o motivo
- Risco: Médio - afeta experiência do usuário

#### 2. Fluxo de Emissão de Documentos

**Problema:** Não há salvamento automático de rascunhos

- Impacto: Perda de dados se a página for fechada acidentalmente
- Risco: Médio - frustração do usuário

**Problema:** Validação de BI apenas por formato

- Impacto: Pode aceitar BIs inválidos mas com formato correto
- Risco: Baixo - pode ser corrigido posteriormente

#### 3. Fluxo de Verificação

**Problema:** Não há verificação manual alternativa

- Impacto: Se a câmera falhar, não há como verificar
- Risco: Médio - bloqueia fluxo principal

**Problema:** Não há histórico de verificações

- Impacto: Impossível rastrear verificações anteriores
- Risco: Baixo - melhoria de usabilidade

#### 4. Fluxo da Carteira

**Problema:** Não há sincronização entre dispositivos

- Impacto: Usuário não pode acessar documentos em outro dispositivo
- Risco: Alto - limita utilidade do sistema

**Problema:** Não há backup automático na nuvem

- Impacto: Perda permanente se o dispositivo for perdido/danificado
- Risco: Alto - perda irreversível de dados

## Recomendações de Melhoria

### 1. Melhorias Críticas (Alta Prioridade)

#### Autenticação

- Implementar recuperação de PIN via email ou perguntas de segurança
- Adicionar notificação clara de tentativas restantes
- Implementar autenticação biométrica (fingerprint/face ID)

#### Carteira Digital

- Implementar sincronização com nuvem opcional
- Adicionar backup automático criptografado
- Permitir exportação/importação de documentos

### 2. Melhorias Importantes (Média Prioridade)

#### Emissão de Documentos

- Implementar salvamento automático de rascunhos
- Adicionar validação mais robusta de BI
- Permitir anexar documentos adicionais

#### Verificação

- Adicionar entrada manual de código como alternativa
- Implementar histórico de verificações
- Adicionar verificação em lote

### 3. Melhorias de Usabilidade (Baixa Prioridade)

#### Interface

- Adicionar modo escuro
- Implementar atalhos de teclado
- Melhorar responsividade em dispositivos pequenos

#### Funcionalidades

- Adicionar modelos de documentos
- Implementar assinatura digital
- Adicionar compartilhamento direto com outras escolas

## Fluxo Otimizado Proposto

### 1. Autenticação Melhorada

```mermaid
graph TD
    A[Acesso à Aplicação] --> B{Usuário Autenticado?}
    B -->|Não| C[Exibir Botão "Entrar"]
    B -->|Sim| D[Acesso Completo]
    C --> E[Clique em "Entrar"]
    E --> F[Modal de Login]
    F --> G{Novo Usuário?}
    G -->|Sim| H[Formulário de Registro]
    G -->|Não| I[Formulário de Login]
    H --> J[Informar Nome, Email e PIN]
    I --> K[Informar PIN ou Biometria]
    J --> L[Validar Email]
    L --> M[Criar Sessão]
    K --> N[Validar PIN/Biometria]
    M --> O[Armazenar Sessão Localmente]
    N --> P{Credenciais Válidas?}
    P -->|Sim| O
    P -->|Não| Q[Exibir Erro com Tentativas Restantes]
    Q --> R{Bloqueado?}
    R -->|Sim| S[Opção de Recuperação]
    R -->|Não| I
    S --> T[Enviar Email de Recuperação]
    T --> U[Redefinir PIN]
    U --> O
    O --> D
```

### 2. Fluxo de Emissão com Salvamento

```mermaid
graph TD
    A[Acesso à Página de Emissão] --> B[Carregar Rascunhos Salvos]
    B --> C{Existem Rascunhos?}
    C -->|Sim| D[Exibir Opção de Continuar]
    C -->|Não| E[Formulário em Branco]
    D --> F{Continuar Rascunho?}
    F -->|Sim| G[Carregar Dados do Rascunho]
    F -->|Não| E
    G --> H[Preencher Formulário]
    E --> H
    H --> I[Salvamento Automático a cada 30s]
    I --> J[Validação em Tempo Real]
    J --> K{Formulário Válido?}
    K -->|Não| L[Exibir Erros]
    K -->|Sim| M[Clique em "Emitir Documento"]
    L --> H
    M --> N[Confirmar Dados]
    N --> O{Confirmado?}
    O -->|Não| H
    O -->|Sim| P[Gerar Hash SHA-256]
    P --> Q[Criar Objeto do Documento]
    Q --> R[Gerar QR Code]
    R --> S[Gerar PDF]
    S --> T[Armazenar no IndexedDB]
    T --> U[Sincronizar com Nuvem]
    U --> V[Remover Rascunho]
    V --> W[Redirecionar para Carteira]
    W --> X[Exibir Mensagem de Sucesso]
```

## Conclusão

O fluxo atual do usuário no YISA é bem estruturado e funcional, atendendo aos requisitos principais do sistema. No entanto, existem oportunidades significativas de melhoria, especialmente nas áreas de:

1. **Recuperação de acesso** - Crítico para evitar perda de dados
2. **Sincronização e backup** - Essencial para segurança dos dados
3. **Resiliência do fluxo** - Alternativas para falhas técnicas
4. **Experiência do usuário** - Redução de atritos e pontos de frustração

A implementação das melhorias sugeridas, especialmente as de alta prioridade, tornará o sistema mais robusto, seguro e amigável para os usuários finais em Moçambique.
