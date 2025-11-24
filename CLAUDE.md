# CLAUDE.md - AI Assistant Guide

## Project Overview

**Dioniso Caffè - Fisher Edition** is a modern food delivery web application built for Fisher company employees. It enables single orders and weekly subscription management with multilingual support (5 languages), loyalty program, and social payment integration (WhatsApp/Telegram).

### Core Features
- 🛒 Shopping cart with customization
- 📅 Weekly subscription system (€55/week)
- 💰 Loyalty points program (Bronze/Silver/Gold tiers)
- 🌐 5 languages (IT, EN, ES, NL, PL)
- 📊 Admin dashboard for order management
- 📲 WhatsApp/Telegram payment flow
- 🔔 4:00 PM order deadline countdown
- ⭐ Favorites system
- 🔐 Google Sign-In authentication

---

## Tech Stack

### Frontend
- **React 18.3** + TypeScript
- **Vite** - Build tool with HMR
- **TailwindCSS** + **shadcn/ui** - Styling
- **Wouter** - Lightweight routing
- **Framer Motion** - Animations
- **TanStack Query** - Server state management
- **Context API** - Client state management
- **Firebase Auth** - Google Sign-In

### Backend
- **Node.js** + **Express 4.21**
- **PostgreSQL** (Neon serverless)
- **Drizzle ORM** - Type-safe database queries
- **Zod** - Schema validation
- **Express Session** - Session management

### Development Tools
- **tsx** - TypeScript execution
- **esbuild** - Server bundling
- **Drizzle Kit** - Database migrations
- **TypeScript 5.6** - Strict mode enabled

---

## Architecture Overview

### Monorepo Structure
```
/home/user/Dioniso-panini-ia/
├── client/src/          # Frontend React application
│   ├── components/      # React components
│   ├── contexts/        # Context providers (5 total)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities, translations, Firebase
│   ├── pages/           # Route pages (HomePage, DashboardPage)
│   ├── App.tsx          # Main app with routing
│   └── main.tsx         # Entry point
├── server/              # Backend Express application
│   ├── db.ts            # Database connection
│   ├── index.ts         # Express server setup
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # CRUD operations layer
│   └── vite.ts          # Vite dev integration
├── shared/              # Shared TypeScript types
│   └── schema.ts        # Drizzle + Zod schemas
└── attached_assets/     # Static assets (mascot, images)
```

### Data Flow Pattern
```
User Interaction
  → React Component
  → Context/Hook
  → TanStack Query
  → API Endpoint
  → Zod Validation
  → Storage Layer
  → Drizzle ORM
  → PostgreSQL
```

---

## Database Schema

### Tables

**`users`** - User accounts and loyalty data
```typescript
{
  id: serial PRIMARY KEY
  username: text UNIQUE NOT NULL
  password: text NOT NULL
  displayName: text
  email: text
  avatar: text
  loyaltyPoints: integer DEFAULT 0
  loyaltyLevel: text DEFAULT 'bronze'  // bronze|silver|gold
  isAdmin: boolean DEFAULT false
}
```

**`categories`** - Product categories (multilingual)
```typescript
{
  id: serial PRIMARY KEY
  nameIt: text NOT NULL
  nameEn: text NOT NULL
  nameEs: text NOT NULL
  slug: text UNIQUE NOT NULL
}
```

**`products`** - Menu items (multilingual)
```typescript
{
  id: serial PRIMARY KEY
  categoryId: integer NOT NULL → categories.id
  nameIt, nameEn, nameEs: text NOT NULL
  descriptionIt, descriptionEn, descriptionEs: text NOT NULL
  price: integer NOT NULL  // in cents (€8.50 = 850)
  imageUrl: text NOT NULL
  isPopular: boolean DEFAULT false
  isVegetarian: boolean DEFAULT false
  isCustomizable: boolean DEFAULT false
}
```

**`orders`** - Customer orders
```typescript
{
  id: serial PRIMARY KEY
  userId: integer NULLABLE → users.id  // null for guest orders
  customerName: text
  customerEmail: text
  customerPhone: text
  status: text DEFAULT 'pending'  // pending|processing|completed|cancelled
  total: integer NOT NULL  // in cents
  deliveryFloor: text NOT NULL
  deliveryTime: text NOT NULL
  notes: text
  createdAt: timestamp DEFAULT now()
}
```

**`order_items`** - Items in each order
```typescript
{
  id: serial PRIMARY KEY
  orderId: integer NOT NULL → orders.id
  productId: integer NOT NULL → products.id
  quantity: integer NOT NULL
  price: integer NOT NULL  // price at time of order
  customizations: json
}
```

**`subscriptions`** - Weekly subscriptions
```typescript
{
  id: serial PRIMARY KEY
  userId: integer NOT NULL → users.id
  menuPreference: text DEFAULT 'standard'  // standard|vegetarian|halal|glutenFree
  preferredDays: json NOT NULL  // ['mon', 'tue', 'wed', 'thu', 'fri']
  preferredTime: text NOT NULL  // '12:00'
  isActive: boolean DEFAULT true
  createdAt: timestamp DEFAULT now()
}
```

### Database Operations

All database operations go through the **Storage Layer** (`/server/storage.ts`):
- **IStorage interface** - Defines all CRUD methods
- **DatabaseStorage class** - Production PostgreSQL implementation
- **MemStorage class** - In-memory fallback for development

Key methods:
- User: `getUser()`, `createUser()`, `updateLoyaltyPoints()`
- Products: `getAllProducts()`, `getProductById()`
- Orders: `createOrder()`, `getAllOrders()`, `updateOrderStatus()`
- Admin: `getDashboardStats()`, `getAllSubscriptions()`

---

## API Endpoints

All endpoints are defined in `/server/routes.ts` with Zod validation.

### Public Endpoints

**Products**
- `GET /api/categories` - All product categories
- `GET /api/products` - All products (optional: `?categoryId=1`)
- `GET /api/products/:id` - Single product by ID

**Orders**
- `POST /api/orders` - Create order with items
  ```json
  {
    "userId": 123,  // optional
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "total": 2500,
    "deliveryFloor": "3rd Floor",
    "deliveryTime": "12:00",
    "notes": "Extra sauce",
    "items": [
      {
        "productId": 5,
        "quantity": 2,
        "price": 850,
        "customizations": {}
      }
    ]
  }
  ```
- `GET /api/orders/:userId` - All orders for user

**Subscriptions** (requires Google Sign-In)
- `POST /api/subscriptions` - Create weekly subscription
  ```json
  {
    "userId": 123,
    "menuPreference": "vegetarian",
    "preferredDays": ["mon", "tue", "wed", "thu", "fri"],
    "preferredTime": "12:00"
  }
  ```
- `GET /api/subscriptions/:userId` - Active subscription for user

**Authentication**
- `POST /api/users/firebase-auth` - Sync Firebase user with database
- `GET /api/users/:id/loyalty` - Get loyalty points/level

### Admin Endpoints

**⚠️ WARNING**: No authentication middleware currently implemented!

- `GET /api/admin/stats` - Dashboard statistics (orders, revenue, subscriptions)
- `GET /api/admin/orders` - All orders (not filtered by user)
- `PATCH /api/admin/orders/:id/status` - Update order status
  ```json
  { "status": "completed" }
  ```
- `GET /api/admin/subscriptions` - All active subscriptions

---

## Frontend Architecture

### Routing (Wouter)

```typescript
// /client/src/App.tsx
<Switch>
  <Route path="/" component={HomePage} />
  <Route path="/dashboard" component={DashboardPage} />
  <Route component={NotFound} />
</Switch>
```

Only 2 main routes - simple navigation structure.

### Context Providers (5 Total)

**1. LanguageContext** (`/contexts/LanguageContext.tsx`)
- Current language state (it, en, es, nl, pl)
- Translation function: `t(key, params)`
- Persisted to localStorage
- Updates `<html lang="...">` attribute

```typescript
const { t, language, setLanguage } = useLanguage()
t('header.login')  // "Accedi con Google"
t('whatsapp.delivery', { time: '12:00' })  // Parameter substitution
```

**2. AuthContext** (`/contexts/AuthContext.tsx`)
- Firebase Google Sign-In
- User state management
- `signInWithGoogle()`, `logout()` functions
- Syncs Firebase user to database via `/api/users/firebase-auth`

**3. CartContext** (`/contexts/CartContext.tsx`)
- Shopping cart items array
- `addToCart()`, `removeFromCart()`, `updateQuantity()`
- Cart open/close state
- Persisted to localStorage

**4. FavoritesContext** (`/contexts/FavoritesContext.tsx`)
- Favorite product IDs array
- `addToFavorites()`, `removeFromFavorites()`
- Persisted to localStorage

**5. AnimationContext** (`/contexts/AnimationContext.tsx`)
- Animation enable/disable toggle
- Page transition wrapper component
- User preference persistence

### Key Components

**Layout Components**
- `Header.tsx` - Navigation, cart icon, countdown timer, language switcher
- `Footer.tsx` - Contact info, social links, copyright
- `HeroSection.tsx` - Welcome banner with Dioniso mascot
- `CategoryTabs.tsx` - Product category filtering

**Feature Components**
- `ProductGrid.tsx` - Product listing with filters
- `ProductCard.tsx` - Individual product display, add to cart
- `Cart.tsx` - Sliding sidebar cart with checkout
- `WhatsAppModal.tsx` - Order confirmation, generates tracking number
- `Subscription.tsx` - Weekly subscription signup form
- `FavoritesSection.tsx` - Quick access to favorite products
- `LoyaltyProgram.tsx` - Points display, tier badge
- `CountdownTimer.tsx` - 4:00 PM deadline countdown

**Dashboard Components** (`/components/dashboard/`)
- `StatsCards.tsx` - KPI cards (orders, revenue, subscriptions)
- `OrdersTable.tsx` - Order list with status updates
- `SubscriptionsTable.tsx` - Active subscriptions list

**UI Components** (`/components/ui/`)
- 44 shadcn/ui components (Button, Card, Dialog, etc.)
- All based on Radix UI primitives
- Fully typed with TypeScript
- Customizable via CVA (Class Variance Authority)

### State Management Strategy

**Server State** (TanStack Query)
- Products list
- User orders
- Dashboard statistics
- Automatic caching and refetching

**Client State** (Context API)
- Shopping cart
- User authentication
- Language preference
- Favorites list
- Animation settings

**Local Component State** (useState/useReducer)
- Form inputs
- Modal open/close
- Loading states
- UI interactions

**Persistent State** (localStorage)
- Cart items
- Favorites
- Language preference
- Animation preference

---

## Multilanguage System

### Implementation (`/client/src/lib/translations.ts`)

5 supported languages:
- 🇮🇹 Italian (it) - Default
- 🇬🇧 English (en)
- 🇪🇸 Spanish (es)
- 🇳🇱 Dutch (nl)
- 🇵🇱 Polish (pl)

### Translation Keys Structure
```typescript
export const translations = {
  it: {
    header: {
      login: "Accedi con Google",
      logout: "Esci",
      cart: "Carrello"
    },
    // ... 90+ keys
  },
  en: { /* ... */ },
  // ...
}
```

### Usage Pattern
```typescript
const { t, language, setLanguage } = useLanguage()

// Simple translation
<h1>{t('hero.title')}</h1>

// With parameters
<p>{t('whatsapp.delivery', { time: deliveryTime })}</p>

// Change language
<button onClick={() => setLanguage('en')}>English</button>
```

### Product Translations
Products have 3 language columns in database:
- `nameIt`, `descriptionIt`
- `nameEn`, `descriptionEn`
- `nameEs`, `descriptionEs`

Dutch/Polish use English as fallback.

---

## Special Features

### 1. Loyalty Program

**Point System**
- Earn 1 point per €1 spent
- Automatic calculation on order creation
- Three tiers:
  - Bronze: 0-249 points
  - Silver: 250-499 points
  - Gold: 500+ points

**Implementation**: `/server/storage.ts`
```typescript
async updateLoyaltyPoints(userId: number, points: number) {
  const user = await this.getUser(userId)
  const newPoints = (user?.loyaltyPoints || 0) + points

  let newLevel = 'bronze'
  if (newPoints >= 500) newLevel = 'gold'
  else if (newPoints >= 250) newLevel = 'silver'

  await db.update(users)
    .set({ loyaltyPoints: newPoints, loyaltyLevel: newLevel })
    .where(eq(users.id, userId))
}
```

### 2. Subscription System

**Weekly Executive Subscription**
- Price: €55/week (15% discount)
- 5 meals + 5 drinks per week
- Fixed delivery: Monday-Friday, 12:00 PM
- Menu preferences: Standard, Vegetarian, Halal, Gluten-Free

**Workflow**
1. User must be logged in (Google Sign-In required)
2. Select menu preference and delivery days
3. System creates subscription record in database
4. Generates subscription tracking number
5. Opens WhatsApp/Telegram for payment confirmation

### 3. WhatsApp/Telegram Payment

**Order Number Generation** (`/components/WhatsAppModal.tsx`)
```typescript
const generateOrderNumber = () => {
  const day = today.getDate().toString().padStart(2, '0')
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const year = today.getFullYear().toString().slice(-2)
  const randomDigits = Math.floor(1000 + Math.random() * 9000)
  return `${day}${month}${year}-${randomDigits}`  // "241124-5847"
}
```

**Message Template**
```
Ciao! Ho completato l'ordine #241124-5847

🛒 Ordine:
- 2x Panino Deluxe (€17.00)
- 1x Coca Cola (€2.00)

💰 Totale: €19.00
🕐 Consegna: 12:00
📍 Piano: 3rd Floor

Note: Extra sauce please
```

Contact: +31 619311373 (WhatsApp/Telegram)

### 4. Countdown Timer

**Purpose**: Remind users of 4:00 PM order deadline
**Location**: Header component
**Display**: Hours and minutes remaining until 16:00
**Translated**: All 5 languages

### 5. Animation Toggle

**Feature**: Users can disable animations for better performance
**Technology**: Framer Motion
**Animated Elements**:
- Page transitions
- Product card hover effects
- Cart slide-in/out
- Modal appearances
- Button interactions

---

## Development Workflow

### Setup

```bash
# Clone repository
git clone <repository-url>
cd Dioniso-panini-ia

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with actual values

# Push database schema
npm run db:push

# Start development server
npm run dev
# Visits http://localhost:5000
```

### Environment Variables Required

```bash
# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host:port/database

# Firebase (OPTIONAL - only for Google Sign-In and subscriptions)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id

# Environment
NODE_ENV=development
```

### Available Scripts

```bash
npm run dev       # Start dev server (tsx + Vite HMR)
npm run build     # Build frontend + backend for production
npm run start     # Start production server
npm run check     # TypeScript type checking
npm run db:push   # Push schema changes to database
```

### Development Server

- **Frontend**: Vite dev server with HMR on http://localhost:5000
- **Backend**: Express API on same port (proxied by Vite)
- **Hot Reload**: Automatic for both client and server code

---

## Common Tasks and Recipes

### Adding a New Product

**Option 1: Static Data** (Simple, no database)

Edit `/client/src/lib/data.ts`:
```typescript
export const products: Product[] = [
  {
    id: 99,
    categoryId: 1,
    nameIt: "Panino Supremo",
    nameEn: "Supreme Sandwich",
    nameEs: "Panino Supremo",
    descriptionIt: "Con ingredienti premium",
    descriptionEn: "With premium ingredients",
    descriptionEs: "Con ingredientes premium",
    price: 950,  // €9.50 in cents
    imageUrl: "https://images.unsplash.com/photo-...",
    isPopular: true,
    isVegetarian: false,
    isCustomizable: true
  }
]
```

**Option 2: Database** (Dynamic, requires admin UI)

1. Create admin endpoint in `/server/routes.ts`:
```typescript
app.post("/api/admin/products", async (req, res) => {
  const product = insertProductSchema.parse(req.body)
  const newProduct = await storage.createProduct(product)
  res.json(newProduct)
})
```

2. Add method to storage layer
3. Create admin form component

### Adding a New API Endpoint

1. Define Zod schema in `/shared/schema.ts`:
```typescript
export const myRequestSchema = z.object({
  field1: z.string(),
  field2: z.number()
})
```

2. Add route in `/server/routes.ts`:
```typescript
app.post("/api/my-endpoint", async (req, res, next) => {
  try {
    const data = myRequestSchema.parse(req.body)
    const result = await storage.myOperation(data)
    res.json(result)
  } catch (error) {
    next(error)
  }
})
```

3. Add storage method in `/server/storage.ts`:
```typescript
async myOperation(data: MyRequest): Promise<MyResponse> {
  return await db.query.myTable.findFirst(...)
}
```

4. Use in frontend with TanStack Query:
```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const res = await fetch('/api/my-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  }
})
```

### Adding a New Translation Key

Edit `/client/src/lib/translations.ts`:

```typescript
export const translations = {
  it: {
    mySection: {
      myKey: "Testo in italiano",
      withParam: "Ciao {{name}}"
    }
  },
  en: {
    mySection: {
      myKey: "Text in English",
      withParam: "Hello {{name}}"
    }
  },
  // ... repeat for es, nl, pl
}
```

Use in component:
```typescript
const { t } = useLanguage()
<p>{t('mySection.myKey')}</p>
<p>{t('mySection.withParam', { name: 'John' })}</p>
```

### Creating a New Component

1. Create file in `/client/src/components/MyComponent.tsx`:
```typescript
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

interface MyComponentProps {
  title: string
  onAction: () => void
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  const { t } = useLanguage()

  return (
    <div className="p-4 rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      <Button onClick={onAction}>{t('button.action')}</Button>
    </div>
  )
}
```

2. Import and use:
```typescript
import MyComponent from "@/components/MyComponent"
<MyComponent title="Hello" onAction={() => console.log('clicked')} />
```

### Modifying Database Schema

1. Edit `/shared/schema.ts`:
```typescript
export const myTable = pgTable("my_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow()
})
```

2. Push to database:
```bash
npm run db:push
```

3. Add TypeScript types:
```typescript
export type MyTable = typeof myTable.$inferSelect
export type InsertMyTable = typeof myTable.$inferInsert
```

4. Update storage layer with CRUD methods

### Adding Admin Authentication

**Current state**: No auth middleware (demo password only)

**Recommended implementation**:

1. Add middleware in `/server/routes.ts`:
```typescript
const requireAdmin = async (req, res, next) => {
  const userId = req.session?.userId
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  const user = await storage.getUser(userId)
  if (!user?.isAdmin) {
    return res.status(403).json({ error: "Not authorized" })
  }

  next()
}
```

2. Apply to admin routes:
```typescript
app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  // ... handler
})
```

3. Update frontend to handle 401/403 responses

---

## Styling and Design

### TailwindCSS Configuration

**Fisher Brand Colors** (`tailwind.config.ts`):
```typescript
colors: {
  fisher: {
    blue: '#003366',    // Primary brand color
    gold: '#FFD700',    // Accent color
    gray: '#6B7280',    // Secondary text
    accent: '#FF6B35'   // Call-to-action
  }
}
```

**Custom Animations**:
- `accordion-down` / `accordion-up`
- Automatic animation utilities via `tailwindcss-animate`

### shadcn/ui Components

All UI components are in `/client/src/components/ui/`.

**Usage pattern**:
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default" size="lg">Click Me</Button>
  </CardContent>
</Card>
```

**Available variants**:
- Button: default, destructive, outline, secondary, ghost, link
- Badge: default, secondary, destructive, outline
- Alert: default, destructive

### Responsive Design

**Breakpoints** (Tailwind defaults):
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

**Usage**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

---

## Testing Conventions

### Test IDs for E2E Testing

All interactive elements have `data-testid` attributes:

**Authentication**
- `button-login` - Google Sign-In button
- `button-logout` - Logout button

**Language Switcher**
- `button-lang-it` - Italian
- `button-lang-en` - English
- `button-lang-es` - Spanish
- `button-lang-nl` - Dutch
- `button-lang-pl` - Polish

**Admin Dashboard**
- `input-admin-password` - Password input
- `button-admin-login` - Login button

**Cart**
- `button-add-to-cart-{productId}` - Add product to cart
- `button-checkout` - Checkout button

### Manual Testing Checklist

Before committing major changes:

1. Test all 5 languages switch correctly
2. Test cart add/remove/update quantity
3. Test order creation and WhatsApp modal
4. Test subscription flow (requires Google Sign-In)
5. Test dashboard with demo password
6. Test responsive design (mobile, tablet, desktop)
7. Test animations on/off toggle
8. Test countdown timer displays correctly

---

## Security Considerations

### Current Security Measures

✅ **Implemented**
- Zod validation on all API inputs (client + server)
- Drizzle ORM prevents SQL injection (prepared statements)
- React template escaping prevents XSS
- HTTPOnly session cookies (JavaScript cannot access)
- Secrets in environment variables (never committed)
- CORS configured for Express

### Security Gaps (⚠️ FOR PRODUCTION)

**Critical**
- ❌ No admin authentication middleware
- ❌ No rate limiting on API endpoints
- ❌ No HTTPS enforcement
- ❌ Demo admin password (`dioniso2025`) hardcoded

**Important**
- ⚠️ No CSRF protection
- ⚠️ No request size limits
- ⚠️ No input sanitization beyond Zod
- ⚠️ No audit logging
- ⚠️ No database backups configured

**Recommended for Production**
1. Implement proper admin authentication with JWT
2. Add rate limiting (express-rate-limit)
3. Enforce HTTPS in production
4. Add helmet.js for security headers
5. Implement CSRF tokens for forms
6. Add request size limits
7. Set up automated database backups
8. Add audit logging for admin actions
9. Use environment-specific secrets (not demo password)

### Sensitive Data

**Never commit to git**:
- `.env` file
- `DATABASE_URL` connection string
- Firebase API keys
- Session secrets
- Admin passwords

**Always use `.env.example`** for documentation.

---

## Build and Deployment

### Production Build

```bash
# Build frontend and backend
npm run build

# Output:
# - Frontend: /dist/public/
# - Backend: /dist/index.js
```

**Build process**:
1. Vite builds React app (code splitting, minification)
2. esbuild bundles Express server (ESM format)
3. Static assets copied to `/dist/public/`

### Running Production

```bash
NODE_ENV=production npm run start
# Listens on port 5000
```

**Production behavior**:
- Serves static files from `/dist/public/`
- No Vite dev server (HMR disabled)
- Optimized bundle sizes
- Source maps excluded

### Deployment Platforms

**Replit** (Current host)
- Automatic deployment on git push
- Built-in PostgreSQL support
- Configuration in `.replit` file

**Vercel**
```bash
# Build command
npm run build

# Output directory
dist/public

# Install command
npm install
```

**Railway**
- PostgreSQL + Node.js support
- Automatic DATABASE_URL injection
- Zero-config deployment

**Fly.io**
- Requires Dockerfile
- PostgreSQL via Fly Postgres
- Global edge deployment

### Database Migrations

```bash
# Push schema changes to database
npm run db:push

# Generate migration files (optional)
npx drizzle-kit generate:pg

# Apply migrations manually
psql $DATABASE_URL < migrations/0001_migration.sql
```

**Migration workflow**:
1. Edit `/shared/schema.ts`
2. Run `npm run db:push` (applies directly)
3. Commit schema changes to git

For production, use migration files instead of push.

---

## Important Notes for AI Assistants

### General Guidelines

1. **Always read before editing** - Use Read tool first, then Edit
2. **Preserve existing patterns** - Follow the established conventions
3. **Type safety first** - Ensure full TypeScript compliance
4. **Test all languages** - Changes affecting UI should work in all 5 languages
5. **Validate inputs** - Add Zod schemas for all new API endpoints
6. **Use existing components** - Check shadcn/ui before creating new UI components

### Code Style Conventions

**Naming**
- Components: `PascalCase.tsx`
- Functions/variables: `camelCase`
- Database tables: `snake_case`
- API routes: `/kebab-case`
- CSS classes: `kebab-case`

**File Organization**
- One component per file
- Colocate related components (e.g., dashboard components together)
- Shared types in `/shared/schema.ts`
- Utilities in `/lib/` directory

**TypeScript**
- Always use explicit types for function parameters
- Avoid `any` type (use `unknown` if truly unknown)
- Use type inference for return types when obvious
- Export types from schema file

**React**
- Use functional components only (no class components)
- Prefer hooks over Context when state is local
- Use React.memo for expensive components
- Always provide keys for lists

### Common Pitfalls to Avoid

1. **Don't use deprecated patterns**
   - ❌ `componentDidMount` (use `useEffect`)
   - ❌ Class components (use functions)
   - ❌ Inline styles (use Tailwind classes)

2. **Don't break multilanguage support**
   - ❌ Hardcoded strings in components
   - ✅ Use `t('translation.key')` for all user-facing text

3. **Don't forget price formatting**
   - Prices stored in cents (850 = €8.50)
   - Always divide by 100 for display
   - Use `toFixed(2)` for decimal places

4. **Don't bypass validation**
   - ❌ Direct database writes without Zod schema
   - ✅ Parse with Zod before storage operations

5. **Don't create security vulnerabilities**
   - Never concatenate SQL strings (use Drizzle ORM)
   - Always validate user input (Zod + type checking)
   - Never expose sensitive data in API responses

### When Making Changes

**Adding features**:
1. Check if similar feature exists
2. Use existing patterns and components
3. Add translations for all 5 languages
4. Update relevant documentation
5. Test in multiple languages
6. Verify responsive design

**Fixing bugs**:
1. Reproduce the issue
2. Identify root cause (don't patch symptoms)
3. Fix at the appropriate layer (frontend/backend/database)
4. Test the fix thoroughly
5. Check for similar issues elsewhere

**Refactoring**:
1. Ensure full test coverage first (if tests exist)
2. Make small, incremental changes
3. Verify functionality after each change
4. Don't mix refactoring with feature additions
5. Keep git commits focused

### Database Operations

**Always use Drizzle ORM**:
```typescript
// ✅ Good - Type-safe, SQL injection protected
await db.select().from(products).where(eq(products.id, productId))

// ❌ Bad - Raw SQL, vulnerable to injection
await db.execute(sql`SELECT * FROM products WHERE id = ${productId}`)
```

**Use transactions for multiple operations**:
```typescript
await db.transaction(async (tx) => {
  await tx.insert(orders).values(orderData)
  await tx.insert(orderItems).values(itemsData)
})
```

### Performance Considerations

**Frontend**:
- Use `React.memo()` for expensive list items
- Lazy load images with `loading="lazy"`
- Minimize Context re-renders (split contexts if needed)
- Use TanStack Query caching effectively

**Backend**:
- Add database indexes for frequently queried columns
- Use `db.select()` with specific columns (not `SELECT *`)
- Implement pagination for large result sets
- Cache expensive computations

**Database**:
- Create indexes: `CREATE INDEX idx_orders_user_id ON orders(user_id)`
- Use `LIMIT` for paginated queries
- Avoid N+1 queries (use joins)

---

## Quick Reference

### File Paths
- Main app: `/client/src/App.tsx`
- API routes: `/server/routes.ts`
- Database schema: `/shared/schema.ts`
- Translations: `/client/src/lib/translations.ts`
- Product data: `/client/src/lib/data.ts`
- Storage layer: `/server/storage.ts`

### Port and URLs
- Dev server: http://localhost:5000
- API base: http://localhost:5000/api
- Admin dashboard: http://localhost:5000/dashboard
- Admin password: `dioniso2025` (DEMO ONLY)

### Database Connection
- Provider: Neon PostgreSQL serverless
- Connection: `DATABASE_URL` environment variable
- ORM: Drizzle with `@neondatabase/serverless`

### Key Dependencies
- React Router: **Wouter** (not React Router)
- State Management: **Context API** + **TanStack Query**
- Styling: **TailwindCSS** + **shadcn/ui**
- Forms: **React Hook Form** + **Zod**
- Icons: **lucide-react**
- Animations: **Framer Motion**

### Contact Information
- WhatsApp: +31 619311373
- Telegram: @dionisocaffe
- Company: Fisher (ASF Fischer NL)

---

## Version History

### v1.0.0 (November 23, 2025)
- Initial launch
- 5 languages supported (IT, EN, ES, NL, PL)
- Order system with cart
- Weekly subscriptions
- Admin dashboard
- Google Sign-In authentication
- WhatsApp/Telegram payment integration
- Loyalty program (Bronze/Silver/Gold)
- Countdown timer for 4:00 PM deadline

---

## Resources

- **Main Documentation**: [APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md)
- **Security Analysis**: [SECURITY.md](./SECURITY.md)
- **Deployment Guide**: [DEPLOY_TO_GITHUB.md](./DEPLOY_TO_GITHUB.md)
- **AI Presentation**: [CLAUDE_AI_PRESENTATION.md](./CLAUDE_AI_PRESENTATION.md)
- **Project Overview**: [README.md](./README.md)

---

**Last Updated**: November 24, 2025

**Note**: This guide is for AI assistants working with the Dioniso Caffè codebase. Always prioritize user requirements, maintain code quality, and follow security best practices.
