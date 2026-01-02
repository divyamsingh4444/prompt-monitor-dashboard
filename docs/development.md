# Developer Guide

This guide will help you get started with development on the Prompt Monitor Dashboard.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Common Development Tasks](#common-development-tasks)
- [Code Style & Conventions](#code-style--conventions)
- [Working with Types](#working-with-types)
- [Working with API Routes](#working-with-api-routes)
- [Working with Components](#working-with-components)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)
- [Git Workflow](#git-workflow)

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm** - Install with `npm install -g pnpm`
- **Supabase Account** - [Sign up](https://supabase.com)
- **Supabase CLI** (optional) - For type generation: `npm install -g supabase`
- **Git** - For version control
- **VS Code** (recommended) - With extensions:
  - ESLint
  - Prettier
  - TypeScript

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd prompt-monitor-dashboard
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional (for type generation)
SUPABASE_ACCESS_TOKEN=your_personal_access_token
```

**Getting Supabase Credentials:**

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key

**Getting Supabase Access Token (for type generation):**

1. Go to [Supabase Account Tokens](https://supabase.com/dashboard/account/tokens)
2. Create a new Personal Access Token
3. Add it to `.env.local`

### 4. Generate Types

```bash
pnpm run generate:types
```

This generates:

- Custom types from YAML specs
- Supabase database types
- Formats all generated files

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Typical Development Cycle

1. **Create/Update Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**

   - Write code following project conventions
   - Update types if needed (see [Working with Types](#working-with-types))

3. **Test Locally**

   ```bash
   pnpm dev
   ```

4. **Check Code Quality**

   ```bash
   pnpm lint
   pnpm format
   ```

5. **Regenerate Types** (if schema changed)

   ```bash
   pnpm run generate:types
   ```

6. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

## Project Structure

```
prompt-monitor-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (backend)
│   │   ├── devices/              # Device endpoints
│   │   ├── prompt/               # Prompt endpoints
│   │   └── stats/                # Stats endpoint
│   ├── device/                   # Device detail pages
│   │   └── [id]/                 # Dynamic route
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard homepage
│
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── dashboard-header.tsx      # Dashboard header
│   └── device-card.tsx          # Device card component
│
├── lib/                          # Utilities and helpers
│   ├── api-client.ts             # Type-safe API client (uses generated services)
│   ├── hooks/                    # Custom React hooks
│   ├── supabase.ts               # Supabase client
│   └── utils/                    # Utility functions
│       └── decoders.ts           # JSONB decoders
│
├── types/                        # Type definitions
│   ├── index.ts                  # Central type exports
│   └── database.ts               # Database type aliases
│
├── src/generated/                # Generated files (DO NOT EDIT)
│   ├── api/                      # OpenAPI generated (types + services)
│   ├── types/                    # type-crafter generated (database decoders)
│   └── supabase/                 # Supabase generated
│
├── docs/                         # Documentation
│   ├── specs/                    # Type specifications
│   └── *.md                      # Documentation files
│
├── scripts/                      # Build scripts
│   ├── generate-supabase-types.sh
│   └── fix-unused-imports.js
│
├── .env.local                    # Environment variables (gitignored)
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript config
└── tailwind.config.ts            # Tailwind CSS config
```

## Common Development Tasks

### Adding a New API Endpoint

1. **Define in OpenAPI spec** (`docs/openapi.yaml`):

   ```yaml
   paths:
     /api/example:
       get:
         summary: Example endpoint
         operationId: getExample
         responses:
           "200":
             content:
               application/json:
                 schema:
                   $ref: "#/components/schemas/ExampleResponse"

   components:
     schemas:
       ExampleResponse:
         type: object
         properties:
           data:
             type: string
   ```

2. **Regenerate types**:

   ```bash
   pnpm run generate:all
   ```

3. **Add to API client** (`lib/api-client.ts`):

   ```typescript
   import { ExampleService } from "@/src/generated/api";
   import type { ExampleResponse } from "@/src/generated/api";

   export const apiClient = {
     // ... existing methods
     getExample: async (): Promise<ExampleResponse> => {
       return unwrapPromise(ExampleService.getExample());
     },
   };
   ```

4. **Implement the route** (`app/api/example/route.ts`):

   ```typescript
   import { NextRequest, NextResponse } from "next/server";
   import { supabase } from "@/lib/supabase";
   import type { ExampleResponse } from "@/types";

   export async function GET(request: NextRequest) {
     try {
       // Your implementation
       return NextResponse.json({ data: "example" });
     } catch (error) {
       return NextResponse.json({ error: "Failed" }, { status: 500 });
     }
   }
   ```

5. **Test the endpoint**:
   ```bash
   curl http://localhost:3000/api/example
   ```

### Adding a New Component

1. Create component file in `components/`:

   ```typescript
   // components/example-component.tsx
   "use client";

   interface ExampleComponentProps {
     // Props definition
   }

   export function ExampleComponent({}: ExampleComponentProps) {
     return <div>Example</div>;
   }
   ```

2. Import and use:
   ```typescript
   import { ExampleComponent } from "@/components/example-component";
   ```

### Adding a New Database Table Type Alias

1. Add to `types/database.ts`:

   ```typescript
   export type DatabaseNewTable = Tables<"new_table">;
   ```

2. Import from `@/types`:
   ```typescript
   import type { DatabaseNewTable } from "@/types";
   ```

### Updating Database Schema

1. Update schema in Supabase dashboard
2. Regenerate types:
   ```bash
   pnpm run generate:supabase:types
   ```
3. Update API routes to use new fields
4. Update frontend components if needed

### Adding a New Custom Type

1. Add type definition to `docs/specs/types.spec.yaml`
2. Regenerate types:
   ```bash
   pnpm run generate:types
   ```
3. Import from `@/types`:
   ```typescript
   import type { YourNewType } from "@/types";
   ```

## Code Style & Conventions

### TypeScript

- **Strict Mode**: Always enabled
- **No `any` or `unknown`**: Use explicit types
- **Type Imports**: Always import types from `@/types`
  ```typescript
  import type { Device, DatabaseDevice } from "@/types";
  ```

### Naming Conventions

- **Components**: PascalCase (`DeviceCard.tsx`)
- **Files**: kebab-case (`device-card.tsx`)
- **Functions**: camelCase (`fetchDevices`)
- **Types**: PascalCase (`Device`, `DatabaseDevice`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### File Organization

- **One component per file**
- **Co-locate related files** (e.g., component + types)
- **Group imports**: External → Internal → Types

  ```typescript
  // External
  import { NextRequest, NextResponse } from "next/server";

  // Internal
  import { supabase } from "@/lib/supabase";

  // Types
  import type { Device } from "@/types";
  ```

### Code Formatting

- **Prettier**: Auto-format on save (recommended)
- **Manual formatting**:
  ```bash
  pnpm format
  ```

### ESLint Rules

- Follow Next.js ESLint config
- Fix auto-fixable issues:
  ```bash
  pnpm lint:fix
  ```

## Working with Types

### Importing Types

**Always import types from `@/types` and API client from `@/lib/api-client`:**

```typescript
// ✅ Correct - Types from @/types, client from @/lib/api-client
import { apiClient, ApiError } from "@/lib/api-client";
import type {
  Device,
  StatsResponse,
  DeviceStatus,
  DatabaseDevice,
} from "@/types";

// ❌ Wrong - Don't import types from api-client or directly from generated files
import type { Device } from "@/lib/api-client";
import type { Device } from "@/src/generated/api/models/Device";
```

### Using Database Types

```typescript
import type { DatabaseDevice } from "@/types";

// Type-safe database query result
const device: DatabaseDevice = await supabase
  .from("devices")
  .select("*")
  .single();
```

### Using API Types

```typescript
import type { Device, Prompt } from "@/types";

// Type-safe API response
const device: Device = {
  id: "123",
  hostname: "laptop",
  // ... other fields
};
```

### Working with JSONB Fields

Always use decoders for JSONB fields:

```typescript
import { decodeStringArray } from "@/lib/utils/decoders";
import type { DatabaseDevice } from "@/types";

const device: DatabaseDevice = await getDevice();
const ips = decodeStringArray(device.ips); // Safe decoding
```

### Adding New Type Aliases

1. Edit `types/database.ts`
2. Add your alias:
   ```typescript
   export type DatabaseYourTable = Tables<"your_table">;
   ```
3. Import from `@/types` (automatically available)

## Working with API Routes

### API Route Structure

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { YourType, DatabaseYourType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // 1. Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    // 2. Query Supabase
    const { data, error } = await supabase.from("table_name").select("*");

    if (error) throw error;

    // 3. Transform data
    const transformed: YourType[] = data.map(/* transform */);

    // 4. Return response
    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
```

### Error Handling

Always handle errors properly:

```typescript
try {
  // Your code
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json(
    { error: "User-friendly error message" },
    { status: 500 }
  );
}
```

### Query Parameters

```typescript
const searchParams = request.nextUrl.searchParams;
const search = searchParams.get("search");
const status = searchParams.get("status");
```

### Dynamic Routes

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Use id
}
```

## Working with Components

### Component Structure

```typescript
"use client"; // If using client-side features

import type { Device } from "@/types";

interface ComponentProps {
  device: Device;
  onAction?: () => void;
}

export function Component({ device, onAction }: ComponentProps) {
  // Component logic
  return <div>{/* JSX */}</div>;
}
```

### Using Hooks

```typescript
import { useState, useEffect } from "react";
import { useAutoRefresh } from "@/lib/hooks/use-auto-refresh";

export function Component() {
  const [data, setData] = useState<Device[]>([]);

  const { refresh, isRefreshing } = useAutoRefresh({
    onRefresh: fetchData,
    interval: 60000,
  });

  // Component logic
}
```

### Fetching Data

```typescript
import { apiClient, ApiError } from "@/lib/api-client";
import type { Device } from "@/types";

const fetchDevices = async () => {
  try {
    const devices = await apiClient.getDevices();
    setDevices(devices);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}:`, error.message);
    } else {
      console.error("Failed to fetch devices:", error);
    }
  }
};
```

## Debugging

### Development Tools

1. **Browser DevTools**: Inspect network requests, console logs
2. **React DevTools**: Inspect component state and props
3. **VS Code Debugger**: Set breakpoints in API routes

### Console Logging

```typescript
// Use descriptive prefixes
console.log("[API] Fetching devices...");
console.error("[API] Error fetching devices:", error);
```

### Type Checking

```bash
# Check TypeScript errors
pnpm run build
```

### Network Debugging

1. Open browser DevTools → Network tab
2. Check API request/response
3. Verify Supabase queries in Supabase dashboard

### Common Issues

- **Type errors**: Regenerate types with `pnpm run generate:types`
- **Import errors**: Ensure imports use `@/types` for types
- **Runtime errors**: Check console for detailed error messages

## Troubleshooting

### Types Not Updating

**Problem**: Types don't reflect database changes

**Solution**:

```bash
# Regenerate Supabase types
pnpm run generate:supabase:types

# Or regenerate all types
pnpm run generate:types
```

### Import Errors

**Problem**: Cannot find module `@/types`

**Solution**:

- Check `tsconfig.json` has correct path aliases
- Restart TypeScript server in VS Code
- Ensure types are generated: `pnpm run generate:types`

### Supabase Connection Issues

**Problem**: Cannot connect to Supabase

**Solution**:

1. Check `.env.local` has correct credentials
2. Verify Supabase project is active
3. Check network connectivity
4. Verify RLS policies (if enabled)

### Build Errors

**Problem**: Build fails with type errors

**Solution**:

```bash
# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Regenerate types
pnpm run generate:types

# Try building again
pnpm build
```

### Port Already in Use

**Problem**: Port 3000 already in use

**Solution**:

```bash
# Use different port
pnpm dev -- -p 3001
```

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Commit Messages

Follow conventional commits:

```
feat: add device filtering
fix: resolve type error in API route
docs: update development guide
refactor: reorganize type exports
```

### Before Committing

1. Run linter: `pnpm lint`
2. Format code: `pnpm format`
3. Check types: `pnpm run build`
4. Test locally: `pnpm dev`

### Pull Requests

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Update documentation if needed
5. Create PR with clear description

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Getting Help

- Check existing documentation in `docs/`
- Review similar code in the codebase
- Check TypeScript errors for hints
- Review Supabase dashboard for data issues

---

**Happy Coding! 🚀**
