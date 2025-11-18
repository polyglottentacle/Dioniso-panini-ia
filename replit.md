# Dioniso Caffè - Fisher Edition

## Overview

Dioniso Caffè is a corporate food delivery web application built for Fisher employees. The platform provides an Italian gourmet menu ordering system with multilingual support (Italian, English, Spanish, Dutch), subscription services, and WhatsApp-based payment integration. The application features a modern, responsive UI with advanced product browsing, cart management, loyalty programs, and an administrative dashboard for order management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing
- TailwindCSS for styling with shadcn/ui component library
- Framer Motion for animations
- TanStack Query (React Query) for data fetching and state management

**Design System:**
- Custom Fisher brand theming (primary colors: #003759 blue, #EBEBEB gray, #86BEDE accent)
- Responsive mobile-first design
- Extensive use of Radix UI primitives for accessibility
- CSS custom properties for theming support

**State Management:**
- Context API for global state (Language, Auth, Cart, Favorites, Animations)
- Local state with React hooks
- LocalStorage for persistence (cart, favorites, language preference)
- React Query for server state management

**Key Features:**
- Multilingual support with context-based translations
- Product catalog with category filtering
- Shopping cart with quantity management and notes
- Favorites/wishlist system
- Loyalty points tracking
- Subscription management for weekly meal plans
- WhatsApp integration for order placement and payment
- Countdown timer for order deadlines
- Animation toggle for performance optimization

### Backend Architecture

**Technology Stack:**
- Node.js with Express
- TypeScript with ES modules
- Drizzle ORM for database operations
- Neon serverless PostgreSQL database
- Session management with connect-pg-simple

**API Design:**
- RESTful API structure under `/api` prefix
- Route handlers organized in `server/routes.ts`
- Storage layer abstraction through `IStorage` interface
- Zod schemas for validation

**Data Models:**
- Users (authentication, loyalty points, admin flags)
- Categories (multilingual product categories)
- Products (multilingual with pricing, dietary flags)
- Orders (customer info, delivery details, status tracking)
- Order Items (product quantities and customization)
- Subscriptions (weekly meal plans with preferences)

### Database Architecture

**Technology:**
- PostgreSQL via Neon serverless platform
- Drizzle ORM for type-safe database access
- Schema-first approach with migrations

**Schema Design:**
- Shared schema definitions in `shared/schema.ts`
- Insert schemas generated with drizzle-zod
- Relational data modeling (orders -> order items, users -> subscriptions)
- JSON columns for flexible data (subscription preferences)

**Key Tables:**
- `users`: Authentication and loyalty tracking
- `categories`: Product categorization with translations
- `products`: Menu items with multilingual content
- `orders`: Order tracking with customer details
- `order_items`: Line items for orders
- `subscriptions`: Weekly meal plan management

### Authentication & Authorization

**Strategy:**
- Firebase Authentication for Google Sign-In
- Redirect-based OAuth flow for mobile compatibility
- Custom backend user sync with Firebase tokens
- Session-based authentication post-login
- Admin role flag for dashboard access

**Implementation:**
- Firebase SDK client-side integration
- Custom `/api/users/firebase-auth` endpoint for user creation/sync
- Context-based auth state management
- Protected routes (dashboard requires admin flag)

### External Dependencies

**Third-Party Services:**
- Firebase Authentication (Google Sign-In)
- Neon Database (serverless PostgreSQL)
- WhatsApp Business API (order placement via deep links)
- Unsplash (placeholder images for products)

**Key Libraries:**
- `@neondatabase/serverless`: PostgreSQL connection pooling
- `drizzle-orm`: Type-safe ORM
- `@tanstack/react-query`: Data fetching and caching
- `framer-motion`: Animation library
- `date-fns`: Date formatting and manipulation
- `zod`: Schema validation
- `wouter`: Lightweight routing
- `@radix-ui/*`: Accessible component primitives

**Payment Integration:**
- WhatsApp-based order confirmation (no direct payment processing)
- Order number generation with date-based formatting
- Manual payment coordination through WhatsApp Business

**Build & Deployment:**
- Vite for frontend bundling
- esbuild for server bundling
- Environment-based configuration
- Replit-specific plugins for development environment
- Development mode with HMR via Vite middleware