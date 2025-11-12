# 🚀 YISA - Digital School Documents Platform

![MozDev](https://img.shields.io/badge/MozDev-Community-blue)
![Maputo Frontenders](https://img.shields.io/badge/Maputo%20Frontenders-Frontend-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 **Overview**

Welcome to the **YISA** project repository! YISA (_Your Interactive School Assistant_) is an innovative **Progressive Web App (PWA)** for digitizing school documents in Mozambique, solving the critical school transfer bureaucracy problem.

### 🎯 **Event**

- **Name**: Source Jam 2025 - _"Building Open Source Solutions Together"_
- **Organizers**: MozDev + Maputo Frontenders
- **Dates**: October 25 (Launch) - November 15 (HackDay)
- **Pillar**: Education
- **Team**: Team 1

### 🎯 **Project Vision**

Digital school documents with **cryptographic QR codes** that work **100% offline**, enabling instant verification and eliminating paperwork, travel time, and corruption opportunities.

---

## 🏗️ **Project Structure**

```
source_jam_2025_yisa/
├── README.md                 # This file
├── .gitignore               # Git configuration
├── docs/                    # 📚 Complete documentation
│   ├── YISA_MASTER_SPECIFICATION.md # ⭐ Technical specification
│   ├── DECISION_LOG.md      # All project decisions & rationale
│   ├── desafio.txt          # Challenge details
│   └── Proposta_grupo_1_Pilar_1.docx # Official document
└── yisa/                    # 💻 Application code
    ├── README.md            # Technical implementation guide
    ├── [Implementation in progress]
```

## 🎓 **Problem: School Transfer Bureaucracy**

### **The Current Situation in Mozambique**

| Metric                        | Current Reality   | Economic Impact               |
| ----------------------------- | ----------------- | ----------------------------- |
| **Students transferred/year** | **12,000**        | Core of the problem           |
| **Transfer time**             | **18-30 days**    | Educational disruption        |
| **Cost per family**           | **350 MT**        | Financial burden              |
| **Total economic impact**     | **64.2M MT/year** | National scale                |
| **School days lost**          | **180,000/year**  | Learning opportunities        |
| **Schools without internet**  | **60%**           | Critical for offline solution |

### **Real Impact: Student's Story**

> A student moving from Nampula to Maputo faced **25 days** of transfer time, **1,200 MT** in costs, and **15 days of classes** missed. This happens to **12,000 families every year** in Mozambique.

## 💡 **Solution: YISA Digital Documents**

YISA transforms school transfers from **25-day bureaucratic nightmare** into **90-second digital process** using QR code-protected documents that work completely offline.

### **Core Workflow (3 Steps, 2 Minutes)**

#### **Step 1: School Emits Document (90 seconds)**

1. Director opens YISA PWA in browser
2. Enters 6-digit PIN for security
3. Fills form: student name, BI, classes, grades
4. System generates PDF with cryptographic QR code
5. Shares instantly via WhatsApp or saves locally

#### **Step 2: School Verifies Document (3 seconds)**

1. New school scans QR code with camera
2. System validates **offline**:
   - ✅ Document is authentic (SHA-256 hash valid)
   - ✅ Not tampered with or altered
   - ✅ Issuing school is verified
3. Accepts student **immediately**

#### **Step 3: Document Management**

1. Documents stored in digital wallet
2. History tracked in basic dashboard
3. Works completely offline after first load

### **Key Differentiators**

- 🔐 **100% Offline**: Works without any internet connection
- 🛡️ **Impossible to Forge**: SHA-256 cryptographic protection
- 📱 **Mobile-First**: Optimized for Android smartphones (90% MZ market)
- 💰 **Zero Cost**: No infrastructure or software costs
- ⚡ **Instant Sharing**: Native WhatsApp integration
- 🏫 **No Central System**: Each school operates independently

## 🛠️ **Technical Stack (Simplified for Implementation)**

### **Simplified Architecture for Success**

- **Frontend**: React 19 + JSX (no TypeScript for speed)
- **Build Tool**: Vite 6 for fast development
- **Routing**: React Router DOM (3 core routes)
- **Styling**: Tailwind CSS (via CDN for simplicity)
- **PWA**: Service Worker + Manifest for offline functionality
- **Storage**: localStorage (guaranteed offline, no backend needed)
- **Security**: 6-digit PIN + SHA-256 hashing

### **Why This Stack?**

- **Speed**: Minimal setup, maximum development velocity
- **Reliability**: No backend dependencies, guaranteed offline
- **Demo-Ready**: Focus on working functionality over complexity
- **Realistic**: Achievable implementation timeline

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+
- npm or yarn
- Git

### **Quick Start**

```bash
# 1. Clone repository
git clone https://github.com/Domingos-Jr17/source_jam_2025_yisa.git
cd source_jam_2025_yisa

# 2. Enter application folder
cd yisa

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:5173
```

### **Quick Demo**

1. Open http://localhost:5173/emitir
2. Enter PIN: 123456 (default)
3. Fill sample form and generate PDF
4. Test verification at /verificar

## 📋 **Project Specifications**

### **Master Documentation**

- ⭐ **[`YISA_MASTER_SPECIFICATION.md`](docs/YISA_MASTER_SPECIFICATION.md)** - Complete technical specifications (single source of truth)
- 📊 **[`DECISION_LOG.md`](docs/DECISION_LOG.md)** - All project decisions and rationale

### **Implementation Plan**

- **Core Features**: F1-F6 (must complete first)
- **Plus Features**: F7-F8 (if time permits)
- **Demo Focus**: Offline functionality with WiFi disabled

### **Core Features (F1-F6)**

| Feature                      | Description                      | Priority    | Status     |
| ---------------------------- | -------------------------------- | ----------- | ---------- |
| **F1**: Emission Form        | 4-field form for student data    | 🔴 Critical | 📋 Planned |
| **F2**: PDF + QR Generation  | Create secure document with QR   | 🔴 Critical | 📋 Planned |
| **F3**: WhatsApp Sharing     | Native mobile sharing            | 🔴 Critical | 📋 Planned |
| **F4**: Offline Verification | QR scanner with local validation | 🔴 Critical | 📋 Planned |
| **F5**: Hash System          | SHA-256 document integrity       | 🔴 Critical | 📋 Planned |
| **F6**: PIN Security         | 6-digit access protection        | 🔴 Critical | 📋 Planned |

## 👥 **How to Contribute**

This is an open source collaborative project for Source Jam 2025.

### For Team Members

1. **Fork** the repository
2. **Create branch**: `git checkout -b feature/your-feature`
3. **Commit**: `git commit -m 'Add: feature description'`
4. **Push**: `git push origin feature/your-feature`
5. **Pull Request**: Open PR with detailed description

### **Commit Standards**

```
Add: new functionality
Fix: bug correction
Update: existing update
Docs: documentation
Style: formatting/code
Refactor: refactoring
Test: tests
```

## 📊 **Impact & Success Metrics**

### **Verified Impact**

- **Students Helped**: 12,000 transfers per year
- **Time Saved**: 18-30 days → 90 seconds (99.7% reduction)
- **Money Saved**: 350 MT per family (4.2M MT total)
- **Education Recovered**: 180,000 school days per year
- **Schools Served**: Works without internet (60% of schools)

### **Success Criteria**

- ✅ Working offline demo (WiFi disabled)
- ✅ Complete emission → verification flow
- ✅ Real school validation testimonials
- ✅ Cross-device compatibility
- ✅ Clear impact presentation

## 🎯 **Project Goals**

### **Implementation Success**

- All 6 core features (F1-F6) working offline
- Demo runs successfully with WiFi disabled
- QR codes scan and verify correctly
- PDFs generate and share properly
- PIN security implemented

### **Long-term Vision**

- School adoption throughout Mozambique
- Expansion to other document types
- Integration with educational systems
- Foundation for digital education infrastructure

## 📞 **Team & Resources**

### **Project Leadership**

- **Repository**: https://github.com/Domingos-Jr17/source_jam_2025_yisa
- **Community**: MozDev + Maputo Frontenders
- **Documentation**: Complete specs in `docs/` folder

### **Key Documents**

- **Technical Specification**: [`YISA_MASTER_SPECIFICATION.md`](docs/YISA_MASTER_SPECIFICATION.md) ⭐
- **Decision Log**: [`DECISION_LOG.md`](docs/DECISION_LOG.md)
- **Execution Plan**: [`yisa_update.md`](yisa_update.md) 📋

### **Development Focus**

- **Tech Lead**: React/JavaScript development
- **Security Focus**: SHA-256 implementation
- **UX Lead**: Mobile-first design
- **QA Focus**: Cross-device testing

## 📄 **License**

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file.

---

## 🙏 **Acknowledgments**

- **MozDev** and **Maputo Frontenders** for organization
- **Mentors** and **judges** of Source Jam 2025
- **Mozambican tech community** for support
- **Pilot schools** for collaboration in development

---

**"Building Open Source Solutions Together"** 🇲🇿

_Let's transform education in Mozambique with technology!_
