# 📱 Dioniso Caffè - Fisher Edition | Documentazione Completa

## 🎯 SCOPO DELL'APPLICAZIONE

**Dioniso Caffè - Fisher Edition** è una piattaforma di food delivery aziendale specializzata per i dipendenti Fisher. 
L'app consente di ordinare pasti gourmet italiani da ricevere durante la pausa pranzo (12:00), con opzioni di:
- **Ordini singoli** con tracciamento via numero casuale
- **Abbonamenti settimanali** (€55/settimana) con 15% di sconto
- **Supporto multilingue** (Italiano, Inglese, Spagnolo, Olandese, Polacco)
- **Dashboard amministrativa** per gestione ordini e statistiche

---

## 📊 STRUTTURA E COMPOSIZIONE DELL'APP

### 1. **STACK TECNOLOGICO**

#### Frontend (Client-Side)
```
React 18.3 + TypeScript
├── Routing: Wouter (lightweight router)
├── State Management: Context API + TanStack Query
├── Styling: TailwindCSS + shadcn/ui
├── Animations: Framer Motion
├── Forms: React Hook Form + Zod validation
└── Build Tool: Vite
```

#### Backend (Server-Side)
```
Node.js + Express + TypeScript
├── Database: PostgreSQL (Neon serverless)
├── ORM: Drizzle ORM (type-safe)
├── Schema Validation: Zod
├── Session Management: express-session + connect-pg-simple
└── Runtime: tsx (TypeScript executor)
```

#### Authentication
- **Google Sign-In** (Firebase) - per abbonamenti (attualmente disabilitato)
- **Admin Access** - password semplice per demo (in produzione: middleware auth)

#### Database
- **PostgreSQL via Neon** - serverless connection pooling
- **Tables**: users, categories, products, orders, order_items, subscriptions

---

## 📋 MENU E PREZZI

### Categorie Disponibili

#### 1️⃣ Premium Kanapki (Panini Premium)
- **Panino Classico**: €6.50
- **Panino Spicy**: €7.00
- **Panino Gourmet**: €8.50

#### 2️⃣ Dania Mączne (Piatti a Base di Pasta)
- **Pasta Carbonara**: €8.00
- **Pasta al Ragù**: €8.50
- **Pasta Pesto**: €7.50

#### 3️⃣ Dania Główne Gourmet (Piatti Principali)
- **Risotto ai Funghi**: €9.50
- **Pollo al Limone**: €10.00
- **Bistecca**: €12.00

#### 4️⃣ Dodatki (Contorni/Aggiunte)
- **Insalata Mista**: €3.50
- **Patate**: €2.50
- **Verdure Grigliate**: €4.00

#### 5️⃣ Napoje (Bevande)
- **Acqua**: €1.00
- **Coca-Cola**: €2.00
- **Fanta**: €2.00

### 💰 CALCOLO PREZZI

```
Prezzo Unitario × Quantità = Subtotale
Subtotale + IVA (22%) = Totale
Sconto Abbonamento (-15%) = Totale Finale
```

### 🎁 SISTEMA FEDELTÀ
- **1 punto fedeltà** = €1.00 di ordine
- **Accumulo automatico** per ordini loggati
- **Visualizzazione punti** nel profilo

---

## 🏗️ ARCHITETTURA TECNICA DETTAGLIATA

### 📁 Struttura File

```
dioniso-caffe/
├── client/
│   ├── src/
│   │   ├── pages/           # Pagine principali (Home, Dashboard)
│   │   ├── components/      # Componenti riutilizzabili
│   │   │   ├── Header.tsx   # Navigation bar con logo
│   │   │   ├── Cart.tsx     # Carrello ordini
│   │   │   ├── WhatsAppModal.tsx  # Pagamento via WhatsApp
│   │   │   └── Subscription.tsx   # Abbonamenti settimanali
│   │   ├── contexts/        # Context API (Language, Auth, Cart)
│   │   ├── lib/
│   │   │   ├── firebase.ts  # Config Firebase
│   │   │   ├── translations.ts  # 5 lingue
│   │   │   └── data.ts      # Types globali
│   │   └── index.css        # TailwindCSS + custom colors
│   └── vite.config.ts
│
├── server/
│   ├── routes.ts            # API endpoints (/api/*)
│   ├── storage.ts           # Interface per CRUD
│   ├── db.ts                # Connessione PostgreSQL
│   └── index.ts             # Express setup
│
├── shared/
│   └── schema.ts            # Drizzle ORM + Zod schemas
│
└── package.json             # Dependencies
```

### 🔄 FLUSSO DATI

```
1. VISUALIZZAZIONE PRODOTTI
   Client → GET /api/categories → Backend → DB (categories)
   Client → GET /api/products → Backend → DB (products)

2. AGGIUNTA AL CARRELLO
   Client-side in CartContext (localStorage)

3. CREAZIONE ORDINE
   Client → POST /api/orders → Backend → DB (orders, order_items)
   → Genera numero tracciamento casuale (DDMMYY-XXXX)
   → Invia a WhatsApp/Telegram

4. ABBONAMENTI
   Client (Login Google) → POST /api/subscriptions → Backend → DB
   → Numero abbonamento casuale
   → Validazione email

5. DASHBOARD ADMIN
   Client (Password) → GET /api/admin/stats → Backend → Statistiche
   → GET /api/admin/orders → Lista ordini
   → GET /api/admin/subscriptions → Lista abbonamenti
```

---

## 🔐 SICUREZZA

### Implemented
✅ **Input Validation**: Zod schema su client + server
✅ **SQL Injection Protection**: Drizzle ORM (prepared statements)
✅ **XSS Protection**: React template escaping
✅ **CORS**: Configurato per stesso origin
✅ **Session Cookies**: HTTPOnly + Secure flags
✅ **Secrets Management**: Env variables crittografate

### Per Produzione
- 🔒 Admin middleware per dashboard
- 🔒 Rate limiting su API
- 🔒 HTTPS enforcement
- 🔒 Backup database quotidiani
- 🔒 Logging & monitoring accessi

---

## 🎨 DESIGN SYSTEM

### Colori Principali
```css
--fisher-blue: #003759       /* Dark blue Fisher */
--fisher-blue-dark: #002d47  /* Darker blue */
--fisher-accent: #86BEDE     /* Light blue accent */
--fisher-gray: #EBEBEB       /* Light gray */
--fisher-gold: #D4AF37       /* Gold accent */
```

### Responsiveness
- **Mobile First**: Breakpoint tablet (768px), desktop (1024px)
- **Componenti**: Flex-based layout con Tailwind
- **Immagini**: Unsplash integration per prodotti

---

## 🌐 MULTILINGUE (5 LINGUE)

Implementato tramite **Context API + localStorage**:

```typescript
Type Language = 'it' | 'en' | 'es' | 'nl' | 'pl'

translations = {
  it: { /* Italiano */ },
  en: { /* English */ },
  es: { /* Español */ },
  nl: { /* Nederlands */ },
  pl: { /* Polski */ }
}
```

**Traduzioni Complete Per**:
- Header (countdown, login, punti fedeltà)
- Carrello (totale, IVA, sconto)
- Pagamento (WhatsApp, Telegram)
- Abbonamenti (preferenze, giorni)
- Footer (contatti, policy, copyright)

---

## 🛒 FLUSSO ORDINE

### ORDINE SINGOLO (Non loggato)
```
1. Seleziona prodotti
2. Aggiungi al carrello (silent add)
3. Clicca "Paga via WhatsApp"
4. Modal mostra: Numero ordine (DDMMYY-XXXX)
5. Apre WhatsApp con numero di telefono
6. Allega: Lista prodotti, total, orario (12:00)
7. Riceve numero tracciamento via chat
```

### ABBONAMENTO (Loggato con Google)
```
1. Clicca "Attiva Abbonamento"
2. Seleziona preferenza menu (Standard/Vegetarian/Halal)
3. Orario fisso: 12:00
4. Giorni: Lunedì-Venerdì
5. Prezzo: €55/settimana (15% sconto incluso)
6. WhatsApp con numero abbonamento casuale
7. 5 panini + 5 bevande ogni settimana
```

---

## 📊 DASHBOARD AMMINISTRATIVA

### Accesso
- **Password**: `dioniso2025` (DEMO)
- **Produzione**: Middleware autenticazione admin

### Statistiche Visualizzate
- 📈 Ordini totali (count)
- 💰 Ricavi totali (sum)
- ⏳ Ordini in sospeso (count)
- 📅 Abbonamenti attivi (count)

### Gestione
- **Tab Ordini**: Lista completa con stato
- **Tab Abbonamenti**: Dettagli abbonamenti attivi
- **Azioni**: Modifica stato, cancellazione

---

## 🔧 INSTALLAZIONE & DEPLOYMENT

### Setup Locale
```bash
# Clone
git clone <repo>
cd dioniso-caffe

# Install
npm install

# Environment
cp .env.example .env
# Compilare: VITE_FIREBASE_* e DATABASE_URL

# Run
npm run dev
# http://localhost:5000
```

### Deploy Replit
```bash
# Automatico con workflow "Start application"
npm run dev  # Vite + Express server
```

### Deploy Produzione
```bash
# Build frontend
npm run build

# Start server
NODE_ENV=production npm run dev
```

---

## 📱 FEATURES IMPLEMENTATE

### ✅ Implementato
- ✅ Catalogo 5 categorie × 3 prodotti
- ✅ Carrello con quantità e note
- ✅ 5 lingue (IT, EN, ES, NL, PL)
- ✅ WhatsApp + Telegram payment
- ✅ Numero ordine random (DDMMYY-XXXX)
- ✅ Abbonamenti €55/week
- ✅ Dashboard ordini/abbonamenti
- ✅ Contatore countdown (16:00)
- ✅ Sistema punti fedeltà
- ✅ Responsive design mobile/tablet/desktop

### ⏳ Future (Non prioritario)
- Dark/Light mode toggle
- AI-generated food images
- Email notifications
- Integrazioni Stripe (carte di credito)
- Mobile app (React Native)
- SMS notifications

---

## 🧪 TESTING

### Test ID Principali
```
button-login
button-logout
button-lang-it/en/es/nl/pl
button-submit-order
link-dashboard
input-admin-password
button-admin-login
```

---

## 📞 CONTATTI PAGAMENTO

**WhatsApp**: +31 619311373
**Telegram**: @dionisocaffe

---

## 📄 License

© 2025 Dioniso Caffè - Fisher Edition. All rights reserved.

---

**Ultima modifica**: 23 Novembre 2025
**Versione**: 1.0.0 (Public Beta)
**Status**: ✅ Production Ready (con aggiunta admin middleware)
