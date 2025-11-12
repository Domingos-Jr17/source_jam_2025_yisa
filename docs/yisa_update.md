# **YISA - PLANO DE EXECUÇÃO**

---

## **O PROBLEMA (FOCADO)**

**Contexto**

Quando um aluno se transfere entre escolas em Moçambique, o processo actual é:

1. Aluno pede histórico na escola de origem
2. Escola emite documento fisico
3. Aluno leva documento à escola destino (pessoalmente)
4. Escola destino verifica autenticidade ligando para escola origem
5. Processo demora **5-18 dias úteis**

**Custo**: Transporte, tempo perdido, fraudes, stress familiar.

---

## **A SOLUÇÃO (YISA-PLATAFORMA DE DOCUMENTOS ESCOLARES DIGITAIS)**

**Como Funciona (3 Passos, 2 minutos)**

### **PASSO 1: Escola de Origem Emite (2 minutos)**

1. Diretor abre **YISA PWA** no telemóvel/computador
2. Digita **PIN de 6 dígitos** (configurado na 1ª instalação)
3. Preenche formulário:
   - Nome do aluno
   - Número de BI
   - Classes concluídas
   - Notas
4. Sistema gera **PDF com QR Code criptográfico** (SHA-256 + timestamp)
5. **Partilha via WhatsApp** ou baixa PDF

### **PASSO 2: Aluno Porta**

- **Com smartphone**: Guarda PDF no telemóvel → QR contém shortId → Acessa `yisa.co.mz/{shortId}` → Clica "Guardar" → Documento armazena offline
- **Sem smartphone**: Imprime documento (QR funciona em papel)

### **PASSO 3: Escola Destino Verifica (5 segundos)**

1. Recebe documento (digital ou impresso)
2. Abre **YISA PWA** na aba "Verificar"
3. Escaneia QR Code
4. Sistema valida **offline**:
   - ✅ Documento autêntico (hash válido)
   - ✅ Não adulterado
   - ✅ Escola emissora verificável
5. Aceita aluno imediatamente

**Diferencial**

- **Funciona 100% offline** (hash validado localmente)
- **Impossível falsificar** (SHA-256 + timestamp)
- **Não requer sistema central** (cada escola é autónoma)
- **Custo zero** (open source)
- **Partilha instantânea** (WhatsApp nativo)

---

## **MVP FINAL - O QUE VAMOS REALMENTE FAZER**

### **PRINCÍPIO: UMA PWA, TRÊS ROTAS, ZERO COMPLEXIDADE**

**Arquitetura:** Single React App (Vite + PWA Plugin) com React Router

```
yisa-transfer/
├── src/
│   ├── pages/
│   │   ├── Emitir.jsx          # /emitir
│   │   ├── Verificar.jsx       # /verificar
│   │   └── Carteira.jsx        # /carteira (opcional, se sobrar tempo)
│   ├── utils/
│   │   ├── hash.js             # SHA-256
│   │   ├── pdf.js              # pdf-lib + qrcode
│   │   └── storage.js          # IndexedDB wrapper simples
│   └── data/
│       └── schools.json        # 10 escolas apenas
```

### **CORE (Fase 1) - NÃO CORTAMOS NADA** 🔴

| ID     | Funcionalidade            | Descrição Técnica                                                                    | Pontos |
| ------ | ------------------------- | ------------------------------------------------------------------------------------ | ------ |
| **F1** | **Formulário de Emissão** | Form React com 4 campos: nome, BI, classes, notas. Auto-save no localStorage         | 3      |
| **F2** | **Geração de PDF + QR**   | pdf-lib cria PDF A4. qrcode.js gera QR com shortId (8 chars). Hash SHA-256 no rodapé | 5      |
| **F3** | **Partilha WhatsApp**     | `navigator.share()` com fallback para download automático                            | 2      |
| **F4** | **Verificação Offline**   | Scanner QR (html5-qrcode) + input manual. Validação via IndexedDB local              | 5      |
| **F5** | **Sistema de Hash**       | Gera SHA-256 dos dados + timestamp. Armazena em IndexedDB com shortId como key       | 3      |
| **F6** | **Segurança PIN**         | Setup PIN (6 dígitos) na 1ª execução. Hash armazenado. Requer PIN antes de emitir    | 3      |

**Total CORE: 21 pontos**

---

### **PLUS (Fase 2) - SÓ SE CORE ESTIVER 100%** ✅

| ID     | Funcionalidade       | Descrição Técnica                                                                        | Pontos |
| ------ | -------------------- | ---------------------------------------------------------------------------------------- | ------ |
| **F7** | **Carteira Lite**    | Página `/carteira` que busca documento pelo shortId e guarda em IndexedDB                | 3      |
| **F8** | **Dashboard Mínimo** | Em `/emitir`, aba "Histórico" com lista de documentos emitidos (apenas local)            | 3      |
| **F9** | **Validação Social** | **VERDADEIRA PRIORIDADE**: Contactar escolas, gravar vídeos, obter feedback de interesse | **8**  |

**Total PLUS: 14 pontos (F9 é o mais importante)**

---

### **NICE TO HAVE (Fase 3) - PROBABILIDADE 10%** 🟡

| ID      | Funcionalidade        | Descrição Técnica                        | Pontos |
| ------- | --------------------- | ---------------------------------------- | ------ |
| **F10** | **Assinatura Visual** | Canvas para rabisco do diretor (mock)    | 2      |
| **F11** | **Modo Kiosk**        | Fullscreen API                           | 1      |
| **F12** | **Analytics**         | Contador de docs emitidos (localStorage) | 1      |

**Total NICE: 4 pontos (Cortar sem pena)**

---

## **PLANO DE TRABALHO REALISTA**

### **REGRAS DE OURO:**

1. **Foco em funcionalidade**: Priorizar features CORE que funcionam offline
2. **Validação real**: Contactar escolas para feedback autêntico antes de finalizar
3. **Simplicidade técnica**: Usar abordagens simples que demonstrem o conceito
4. **If CORE não estiver pronto, cortar PLUS todo.**

---

| Fase   | Foco Principal                                                | Entrega da Fase                                            | Prioridade                                        |
| ------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------- | --- |
| **1**  | Setup Vite + Router + Tailwind. Estrutura inicial.            | **VALIDAÇÃO**: Contactar escolas. Agendar demonstrações.   | Projeto roda. Reuniões agendadas.                 | 🔴  |
| **2**  | **F1**: Formulário básico (4 campos) com validação.           | **F5**: Criar `hash.js` e integrar no form.                | Form gera objeto de dados válido. Hash calculado. | 🔴  |
| **3**  | **F2**: Implementar `pdf.js` (gera PDF vazio primeiro).       | **F2**: Adicionar dados ao PDF. Gerar QR Code com shortId. | PDF baixável com QR visível.                      | 🔴  |
| **4**  | **F3**: Botão de partilha/teste de download.                  | **F4**: Implementar scanner base (lê QR).                  | PDF <-> Scanner funcionam juntos.                 | 🔴  |
| **5**  | **F6**: Criar lógica de PIN (setup + validação).              | **F4**: Integrar validação do hash no scanner.             | Demo offline funcional (core completo).           | 🔴  |
| **6**  | **F7**: Carteira (busca por ID, salva local).                 | **F8**: Dashboard (lista docs emitidos).                   | Carteira funciona se sobrou tempo.                | 🟡  |
| **7**  | **F9**: **DIA DE VALIDAÇÃO**. Visitar escolas. Gravar vídeos. | **F9**: Escrever follow-up. Preparar documentação.         | Vídeos gravados. Feedback documentado.            | 🔴  |
| **8**  | Revisão e melhoria: O que melhorar?                           | Implementar melhorias críticas do feedback.                | Sistema refinado com feedback real.               | 🟡  |
| **9**  | **F4**: Teste final offline em múltiplos dispositivos.        | Preparar documentação de demonstração.                     | 0 bugs críticos. Sistema estável.                 | 🔴  |
| **10** | Preparar documentação do projeto.                             | Revisar todos os fluxos.                                   | Documentação completa.                            | 🟡  |
| **11** | Testes finais e ajustes.                                      | Finalização e preparação para deploy.                      | Sistema pronto para produção.                     | 🔴  |

---

### **Fase de Demonstração ao Vivo**

- **What to show**: CORE funcional (emitir + verificar offline)
- **What to ask**:
  - "Quanto tempo economizaria?"
  - "Qual a principal preocupação?"
  - "Usaria se fosse grátis?"
- **What to record**: Testemunhos de 30 segundos com autorização

### **Fase de Follow-up**

- Enviar comunicação: "Obrigado! Anexamos o vídeo. Podemos usar na apresentação?"
- **Resultado**: Feedback positivo de interesse = validação do problema

---

## **SIMPLIFICAÇÕES TÉCNICAS**

### **1. IndexedDB = localStorage**

```javascript
// Não precisam de Dexie ou wrappers complexos
const storage = {
  save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  get: (key) => JSON.parse(localStorage.getItem(key)),
  delete: (key) => localStorage.removeItem(key),
};
```

### **2. QR Code = Texto Puro**

```javascript
// QR contém apenas: "YISA:A7K9P2M4"
// Verificador extrai shortId e busca
```

### **3. Schools.json Inline**

```javascript
// No topo do componente:
const SCHOOLS = [
  { code: "ESJ-MPT-001", name: "Josina Machel" },
  // ...
];
```

### **4. PIN = localStorage (sem hash, para MVP)**

```javascript
// Simplificado para demonstração, mas funcional
// Em produção: "Usaríamos crypto.subtle para segurança adicional."
```

---

## **O QUE AVALIAMOS (Além do código)**

| Critério           | Foco | Como Vencer                                                     |
| ------------------ | ---- | --------------------------------------------------------------- |
| **Problema Real**  | 🔴   | Mostrar evidência de directores sobre problemas actuais         |
| **Demo Funcional** | 🔴   | CORE offline a funcionar. Sem bugs. Sem "deixa ver se funciona" |
| **Impacto**        | 🟡   | Demonstrar benefícios reais e quantificáveis                    |
| **Escalabilidade** | 🟡   | "Open source, 0 custo, funciona em dispositivos básicos"        |
| **Inovação**       | 🟡   | "Offline-first com SHA-256 em PWAs"                             |

**Conclusão: Validação real de problemas > horas de código isoladas.**

---

## **MENSAGEM FINAL**

**"Não vamos construir o produto perfeito. Vamos construir a solução correcta para o problema certo."**

**Regras de Ouro:**

- **Priorizar funcionalidade que demonstra valor real** sobre features complexas.

**É possível transformar a educação em Moçambique com tecnologia. Mas só se focarmos no que realmente importa.**

**Vamos construir com propósito e inteligência.**
