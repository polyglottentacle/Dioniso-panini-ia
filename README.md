# 🍝 Dioniso Caffè - Fisher Edition

Una piattaforma moderna di food delivery aziendale per i dipendenti Fisher, con supporto per ordini singoli e abbonamenti settimanali.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Languages](https://img.shields.io/badge/Languages-5-blue)
![License](https://img.shields.io/badge/License-Private-red)

## 🎯 Caratteristiche Principali

- 📱 **Responsive Design**: Mobile, tablet, desktop
- 🌐 **Multilingue**: Italiano, Inglese, Spagnolo, Olandese, Polacco
- 🛒 **Carrello Intelligente**: Quantità, note speciali, calcolo IVA
- 🔔 **Countdown Timer**: Ordina entro le 16:00
- 💰 **Sistema Fedeltà**: Accumulazione punti su ordini
- 📅 **Abbonamenti**: €55/settimana con 15% sconto
- 📊 **Dashboard Admin**: Gestione ordini e statistiche
- 📲 **Pagamento Social**: WhatsApp + Telegram

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+
- npm

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/dioniso-caffe.git
cd dioniso-caffe

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Configurare variabili d'ambiente

# Start dev server
npm run dev
# Visita http://localhost:5000
```

## 📖 Documentazione

Vedi [APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md) per documentazione tecnica completa.

Vedi [SECURITY.md](./SECURITY.md) per dettagli sicurezza.

## 🏗️ Stack Tecnologico

**Frontend**:
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- Wouter (routing)
- Framer Motion (animations)
- TanStack Query (data fetching)

**Backend**:
- Node.js + Express
- PostgreSQL (Neon)
- Drizzle ORM
- Express Session

**Database**:
- PostgreSQL serverless
- Tables: users, categories, products, orders, order_items, subscriptions

## 📁 Struttura Progetto

```
dioniso-caffe/
├── client/src/
│   ├── pages/              # Home, Dashboard
│   ├── components/         # Componenti riutilizzabili
│   ├── contexts/           # Context API
│   ├── lib/                # Utilities, translations, Firebase
│   └── index.css           # Styling globale
├── server/
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # CRUD operations
│   └── db.ts               # Database connection
├── shared/
│   └── schema.ts           # Zod + Drizzle schemas
└── package.json
```

## 🔐 Dashboard Admin

**Accesso**: http://localhost:5000/dashboard
**Password**: `dioniso2025` (DEMO - cambiare in produzione)

Features:
- 📈 Statistiche ordini
- 📋 Lista ordini dettagliata
- 📅 Gestione abbonamenti
- 💰 Ricavi totali

## 🌍 Multilingue

Lingue supportate:
- 🇮🇹 Italiano (IT)
- 🇬🇧 Inglese (EN)
- 🇪🇸 Spagnolo (ES)
- 🇳🇱 Olandese (NL)
- 🇵🇱 Polacco (PL)

Cambio lingua via bottone in header.

## 💳 Metodi Pagamento

- **WhatsApp**: +31 619311373
- **Telegram**: @dionisocaffe

Ordine → numero tracciamento → contatta via chat

## 📊 Menu e Prezzi

### Categorie
1. **Premium Kanapki** (€6.50-€8.50)
2. **Dania Mączne** (€7.50-€8.50)
3. **Dania Główne Gourmet** (€9.50-€12.00)
4. **Dodatki** (€2.50-€4.00)
5. **Napoje** (€1.00-€2.00)

### Abbonamenti
**€55/settimana** 
- 5 panini a scelta
- 5 bevande incluse
- 15% sconto sul prezzo standard
- Lunedì-Venerdì, orario fisso 12:00

## 🧪 Test

### Run tests
```bash
npm run test
```

### Test IDs utilizzati
- `button-login`, `button-logout`
- `button-lang-it`, `button-lang-en`, etc.
- `input-admin-password`, `button-admin-login`

## 📈 Performance

- ⚡ Vite HMR (Hot Module Replacement)
- 🚀 Code splitting automatico
- 📦 Bundle size ottimizzato (~150KB gzipped)
- 🎨 Lazy loading immagini

## 🔐 Sicurezza

- ✅ Zod validation (client + server)
- ✅ Drizzle ORM (SQL injection protection)
- ✅ Session management (HTTPOnly cookies)
- ✅ CORS configured
- ✅ Input sanitization

Vedi [SECURITY.md](./SECURITY.md) per dettagli completi.

## 🛠️ Contribuire

Questo è un progetto privato per Fisher. Per modifiche:
1. Fork repository
2. Crea branch feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Changelog

### v1.0.0 (23 Nov 2025)
- ✅ Launch iniziale
- ✅ 5 lingue supportate
- ✅ Ordini + abbonamenti
- ✅ Dashboard admin
- ✅ Pagamento WhatsApp/Telegram

## 📞 Support

Email: info@dionisocaffe.com
WhatsApp: +31 619311373

## 📄 License

Proprietario - © 2025 Dioniso Caffè. All rights reserved.

---

**Made with ❤️ for Fisher employees**
