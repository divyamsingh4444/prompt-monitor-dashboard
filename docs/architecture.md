# Architecture Documentation

This document provides an overview of the Prompt Monitor Dashboard architecture.

## System Overview

The Prompt Monitor Dashboard is a Next.js application that monitors AI prompts across multiple devices, providing real-time insights and compliance tracking.

## Architecture Layers

### Frontend Layer

**Framework**: Next.js 16 with App Router

**Key Components:**

- `app/page.tsx` - Main dashboard page
- `app/device/[id]/page.tsx` - Device detail page
- `components/` - Reusable UI components
- `lib/hooks/` - Custom React hooks

**State Management:**

- React hooks (`useState`, `useEffect`)
- Custom hooks for auto-refresh functionality
- Server-side data fetching with Next.js API routes

**Styling:**

- Tailwind CSS v4
- Custom cyberpunk theme with CSS variables
- Radix UI components for accessibility

### API Layer

**Location**: `app/api/`

**Architecture**: Next.js API Routes (App Router)

**Endpoints:**

- RESTful API design
- Type-safe request/response handling
- Error handling with proper HTTP status codes

**Data Flow:**

1. Frontend makes request to `/api/*`
2. API route queries Supabase
3. Data transformation and validation
4. Response sent back to frontend

### Data Layer

**Database**: Supabase (PostgreSQL)

**Client Setup:**

- Server-side client in `lib/supabase.ts`
- Uses anon key (RLS disabled)
- Type-safe queries with generated types

**Data Access Pattern:**

- Direct Supabase queries in API routes
- No ORM - uses Supabase client directly
- Type-safe with semantic type aliases (`DatabaseDevice`, `DatabasePrompt`, etc.)

### Type System Layer

**Type Generation:**

- `type-crafter` for custom types from YAML specs
- Supabase CLI for database schema types
- All types exported through `types/index.ts`

**Type Organization:**

- `types/index.ts` - Central export file (re-exports everything)
- `types/database.ts` - Database type aliases (`DatabaseDevice`, `DatabasePrompt`, etc.)
- `src/generated/types/` - Generated custom types and decoders
- `src/generated/supabase/` - Generated Supabase database types

**Type Categories:**

- Database types (from Supabase schema)
- API types (from YAML specs)
- Runtime decoders (for JSONB validation)
- Type aliases (semantic names for database tables)

## Data Flow

### Reading Data

```
Frontend Component
  ↓ (fetch)
API Route (/api/devices)
  ↓ (query)
Supabase Client
  ↓ (SQL)
PostgreSQL Database
  ↓ (results)
Supabase Client
  ↓ (transform)
API Route
  ↓ (JSON)
Frontend Component
```

### Type Safety Flow

```
Database Schema (Supabase)
  ↓ (generate)
SupabaseTypes.ts
  ↓ (export)
types/index.ts
  ↓ (import)
API Routes & Components
```

## Key Design Decisions

### 1. Type Generation

**Why**: Ensures type safety across the entire stack

- Database schema → TypeScript types
- API contracts → TypeScript types
- No manual type definitions

### 2. Central Type Exports

**Why**: Single source of truth for imports

- All types imported from `@/types`
- Type aliases organized in `types/database.ts`
- `types/index.ts` re-exports everything for convenience
- Easier refactoring
- Consistent import paths

### 3. Runtime Validation

**Why**: JSONB fields need runtime validation

- TypeScript types don't validate at runtime
- Decoders provide type-safe validation
- Prevents runtime errors

### 4. No ORM

**Why**: Supabase client is sufficient

- Direct SQL queries
- Type-safe with generated types
- Simpler than adding an ORM layer

### 5. API Routes Pattern

**Why**: Next.js API routes provide:

- Type-safe endpoints
- Server-side execution
- Easy deployment
- Built-in request/response handling

## File Organization

```
app/
├── api/              # API routes (backend)
├── device/           # Device detail pages
└── page.tsx          # Dashboard homepage

components/           # Reusable UI components
lib/
├── supabase.ts       # Supabase client
├── hooks/            # Custom React hooks
└── utils/            # Utility functions

types/                # Central type exports
├── index.ts          # Re-exports all types
└── database.ts       # Database type aliases
src/generated/        # Generated type files
docs/                 # Documentation
scripts/              # Build scripts
```

## Security Considerations

### Current Setup

- RLS disabled (using anon key)
- API routes are server-side only
- No sensitive data in client code

### Production Recommendations

1. **Enable RLS**: Add Row Level Security policies
2. **Authentication**: Add user authentication
3. **Rate Limiting**: Implement API rate limiting
4. **Input Validation**: Validate all inputs
5. **Error Handling**: Don't expose sensitive errors

## Performance Optimizations

1. **Auto-refresh**: Configurable refresh intervals
2. **Memoization**: React `useMemo` for filtered data
3. **Efficient Queries**: Direct Supabase queries
4. **Static Generation**: Next.js static generation where possible

## Development Workflow

1. **Schema Changes**: Update Supabase schema
2. **Type Generation**: Run `pnpm run generate:types`
3. **API Updates**: Update API routes with new types
4. **Frontend Updates**: Update components with new types
5. **Testing**: Test locally with `pnpm dev`

## Deployment

The application is designed to be deployed on Vercel:

1. Push to repository
2. Vercel automatically builds
3. Environment variables configured in Vercel dashboard
4. Application deployed

## Future Enhancements

Potential improvements:

- Real-time subscriptions with Supabase Realtime
- User authentication and authorization
- Advanced filtering and search
- Export functionality
- Alert notifications
- Historical data analysis
