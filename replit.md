# Loan Tracker CRM

## Overview

A comprehensive Loan Tracker CRM system built with React, TypeScript, and Tailwind CSS. The application manages the complete loan processing workflow from lead capture through document collection, bank applications, and final approval tracking. This is a client-side only application using localStorage for data persistence, with no backend server required for core functionality.

The system provides role-based access (admin/user), multi-stage workflow management, and responsive design supporting both desktop (table views) and mobile (card views) interfaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for state management and data synchronization
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design system

**Component Structure:**
- Page components in `client/src/pages/` for each major workflow stage
- Reusable UI components in `client/src/components/ui/` following shadcn/ui conventions
- Layout wrapper component providing consistent navigation and sidebar
- Custom hooks for mobile detection and toast notifications

**State Management:**
- localStorage as the primary data store (no backend database)
- TanStack Query for managing client-side cache and mutations
- Custom localStorage utilities in `client/src/lib/localStorage.ts` for CRUD operations
- Session management using localStorage for authentication state

**Routing Strategy:**
- Client-side routing using wouter (lightweight alternative to React Router)
- Protected routes with session validation redirecting to login when unauthenticated
- Route structure mirrors the workflow stages:
  - `/` - Login page
  - `/dashboard` - Analytics and statistics
  - `/leads` - Lead management
  - `/documents/*` - Document collection workflows
  - `/bank/*` - Bank application workflows
  - `/status/*` - Approval status tracking

### Data Architecture

**Storage Schema (defined in `shared/schema.ts`):**
- User authentication with hardcoded credentials (admin/user roles)
- Lead records with full contact info, loan type, and financial details
- Document records tracking collection status for 7 document types
- Bank applications with multi-bank selection and status tracking
- Workflow progression through serialNo-based linking

**Data Flow:**
1. Leads created → automatically added to document pending queue
2. Documents collected → moved to bank pending queue
3. Banks selected → applications created in status pending queue
4. Status updated → moved to status history with final decision

**localStorage Keys:**
- `users` - Authentication credentials
- `leads` - All lead records
- `documentPending` - Leads awaiting document collection
- `documentHistory` - Completed document collections
- `bankPending` - Leads ready for bank selection
- `bankHistory` - Submitted bank applications
- `bankStatusPending` - Applications awaiting status updates
- `bankStatusHistory` - Final application outcomes
- `activeUser` - Current session information
- `lastSerialNo` - Auto-incrementing lead identifier
- `lastBankAppNo` - Auto-incrementing bank application identifier

### Design System

**Tailwind Configuration:**
- Custom color palette using HSL variables for light/dark mode support
- Extended border radius values (.1875rem, .375rem, .5625rem)
- Custom shadow utilities for elevation system
- Responsive breakpoints (mobile: <768px, desktop: ≥768px)

**Component Styling Patterns:**
- Cards with elevation on hover (`hover-elevate` class)
- Consistent spacing using Tailwind scale (2, 3, 4, 6 units)
- Sticky table headers for long lists
- Mobile-first responsive design with conditional rendering
- Badge variants for status indicators with semantic colors

**Typography:**
- Default system font stack with fallbacks
- Footer text: `text-xs text-gray-400`
- Page titles: `text-2xl font-bold`
- Muted text for descriptions: `text-muted-foreground`

### Authentication & Authorization

**Authentication Pattern:**
- Hardcoded user credentials stored in localStorage on initialization
- Admin user: `admin` / `admin123`
- Standard user: `user` / `user123`
- Session stored as `activeUser` object with userId, role, and loginTime
- No password hashing (development/demo system only)

**Authorization:**
- Role-based access control (admin vs user)
- All routes protected except login page
- Session validation on each route change
- Automatic redirect to login on session expiration

### Build & Deployment

**Development:**
- Vite dev server with HMR
- TypeScript compilation with strict mode
- Path aliases for clean imports (@/, @shared/, @assets/)

**Production Build:**
- esbuild bundles server code (minimal server for static file serving)
- Vite builds optimized client bundle
- Static assets served from `dist/public`
- Single-page application with fallback to index.html

**Build Strategy:**
- Client and server built separately
- Server dependencies bundled for faster cold starts
- Select dependencies allowlisted for bundling (DB drivers, utilities)
- External dependencies loaded as modules

## External Dependencies

### UI Component Libraries
- **Radix UI Primitives**: Unstyled, accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui**: Pre-built component library built on Radix UI with Tailwind styling
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command palette component (if needed)
- **embla-carousel-react**: Carousel/slider component

### Data & Form Management
- **TanStack Query**: Client-side data fetching, caching, and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition
- **drizzle-zod**: Integration between Drizzle ORM schemas and Zod validators

### Database (Optional - Currently Not Used)
- **Drizzle ORM**: TypeScript ORM configured for PostgreSQL
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- Database configuration present but application uses localStorage instead
- Migration setup in `drizzle.config.ts` and `migrations/` directory

### Styling & Utilities
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Variant-based className composition
- **clsx / tailwind-merge**: Conditional className utilities
- **date-fns**: Date formatting and manipulation

### Backend Infrastructure (Minimal)
- **Express**: Lightweight HTTP server for serving static files
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)
- **express-session**: Session middleware (present for future use)

### Development Tools
- **TypeScript**: Static type checking
- **Vite**: Build tool and dev server
- **esbuild**: Fast JavaScript bundler for production
- **Replit-specific plugins**: Runtime error overlay, cartographer, dev banner

**Note:** While database infrastructure (Drizzle, Neon, PostgreSQL session store) is configured in the codebase, the current implementation relies entirely on localStorage for data persistence. The database setup provides a migration path for future server-side storage requirements.