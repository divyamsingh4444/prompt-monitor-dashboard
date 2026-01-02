# Prompt Monitor Dashboard

A real-time monitoring dashboard for tracking AI prompts across multiple devices with compliance and security features.

## Features

- **Device Monitoring**: Track multiple devices with real-time status updates
- **Prompt Tracking**: Monitor AI prompts captured from various browsers and sites
- **Compliance Events**: Track blocked prompts and compliance violations
- **Event Logging**: Comprehensive event tracking with severity levels
- **Real-time Updates**: Auto-refresh functionality for live data

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + Shadcn
- **Type Generation**: type-crafter + Supabase CLI

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project
- Supabase CLI (for type generation)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd prompt-monitor-dashboard
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_ACCESS_TOKEN=your_personal_access_token  # Optional, for type generation
   ```

4. Generate types:

   ```bash
   pnpm run generate:types
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

```
prompt-monitor-dashboard/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   ├── device/            # Device detail pages
│   └── page.tsx           # Dashboard homepage
├── components/            # React components
├── lib/                   # Utility functions and hooks
│   ├── supabase.ts        # Supabase client
│   └── utils/             # Helper functions
├── types/                 # Central type exports (@/types)
│   ├── index.ts           # Re-exports all types
│   └── database.ts        # Database type aliases
├── src/generated/         # Generated type files
│   ├── types/             # type-crafter generated types
│   └── supabase/          # Supabase generated types
├── docs/                  # Documentation
│   └── specs/             # Type specifications
└── scripts/               # Build and generation scripts
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format all files with Prettier
- `pnpm generate:all` - Generate all types (API + database + Supabase)
- `pnpm generate:api` - Generate API types from OpenAPI spec
- `pnpm generate:types` - Generate database decoder types
- `pnpm generate:supabase:types` - Generate Supabase types only

## Type System

This project uses a comprehensive type generation system:

- **API Types**: Generated from `docs/openapi.yaml` using openapi-typescript-codegen
- **Database Types**: Generated from Supabase schema
- **Custom Decoders**: Runtime validation for JSONB fields (from type-crafter)

All types are exported from `@/types`, API client from `@/lib/api-client` - see [docs/type-system.md](./docs/type-system.md) for details.

## API Routes

The application provides RESTful API endpoints:

- `GET /api/stats` - Dashboard statistics
- `GET /api/devices` - List all devices
- `GET /api/devices/[id]` - Get device details
- `GET /api/devices/[id]/prompts` - Get device prompts
- `GET /api/devices/[id]/events` - Get device events
- `GET /api/devices/[id]/blocked` - Get blocked prompts
- `GET /api/prompt/[id]` - Get prompt details

See [docs/api.md](./docs/api.md) for detailed API documentation.

## Database Schema

The application uses the following Supabase tables:

- `devices` - Device information and status
- `prompts` - Captured AI prompts
- `device_events` - Device events and alerts
- `compliance_events` - Compliance violations and blocked prompts

See [docs/database.md](./docs/database.md) for the complete schema.

## Development

### Type Generation

Types are automatically generated from:

1. **OpenAPI Spec**: API types from `docs/openapi.yaml`
2. **Supabase Schema**: Database types from your Supabase project
3. **YAML Specs**: Database decoder types from `docs/specs/types.spec.yaml`

Run `pnpm run generate:all` to regenerate all types after schema changes.

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for code formatting
- No `any` or `unknown` types - all types are explicit

## Documentation

- [Developer Guide](./docs/development.md) - Complete guide for developers
- [Type System](./docs/type-system.md) - Type generation and usage
- [API Documentation](./docs/api.md) - API endpoints and usage
- [Database Schema](./docs/database.md) - Database structure
- [Architecture](./docs/architecture.md) - System architecture overview

## License

Private project
