# Type System Documentation

This project uses a comprehensive type generation system to ensure type safety across the entire codebase.

## Overview

All TypeScript types are generated from three sources:

1. **OpenAPI Specification** - API types generated from `docs/openapi.yaml`
2. **Supabase Database Schema** - Automatically generated from your Supabase project
3. **YAML Specifications** - Database decoder types defined in `docs/specs/types.spec.yaml`

## Type Sources

### Generated Types Location

```
src/generated/
├── api/            # OpenAPI generated (API types + services)
├── types/          # type-crafter generated (DatabaseTypes, decoders)
└── supabase/       # Supabase CLI generated (SupabaseTypes)
```

### Central Type Exports

All types are exported through `types/index.ts` and can be imported using:

```typescript
// Types from @/types
import type {
  Device,
  StatsResponse,
  DeviceStatus,
  DatabaseDevice,
} from "@/types";
import {
  decodeStringArray,
  decodeSeverity,
  DeviceStatus,
  DeviceEvent,
} from "@/types";

// API client from @/lib/api-client
import { apiClient, ApiError } from "@/lib/api-client";
```

**Type Organization:**

```
types/
├── index.ts        # Central exports (re-exports all types via export *)
└── database.ts     # Database type aliases (DatabaseDevice, etc.)
```

The `types/index.ts` file uses `export *` to re-export from:

- `src/generated/api` - OpenAPI generated types (Device, StatsResponse, DeviceStatus, etc.)
- `src/generated/types/DatabaseTypes` - Database decoder types
- `src/generated/supabase/SupabaseTypes` - Supabase types
- `types/database.ts` - Database type aliases

## Type Generation

### Generating All Types

Run the following command to generate all types:

```bash
pnpm run generate:all
```

This command:

1. Generates API types from OpenAPI spec using openapi-typescript-codegen
2. Generates database decoder types from YAML specs using type-crafter
3. Generates Supabase types from your database schema
4. Formats all generated files
5. Removes unused imports

### Individual Generation

- **API Types**: `pnpm run generate:api` (from OpenAPI spec)
- **Database Types**: `pnpm run generate:types` (includes type-crafter + Supabase)
- **Supabase Types**: `pnpm run generate:supabase:types`

## Type Categories

### Database Types (`DatabaseTypes.ts`)

Generated from `docs/specs/types.spec.yaml` using type-crafter:

- `StringArray` - Type for JSONB string arrays
- `DeviceEventMetadata` - Metadata structure for device events
- `ComplianceEventDetails` - Details structure for compliance events
- `Severity` - Enum: "info" | "warning" | "critical"
- `SupabaseError` - Error structure from Supabase
- `PromptCount` - Query result type for prompt counts

Each type includes a corresponding `decode*` function for runtime validation.

### Supabase Types (`SupabaseTypes.ts`)

Generated from your Supabase database schema:

- `Database` - Complete database type
- `Tables<T>` - Helper type for table rows (use type aliases from `@/types` instead)
- `TablesInsert<T>` - Helper type for inserts
- `TablesUpdate<T>` - Helper type for updates
- `Json` - Type for JSONB fields

**Recommended**: Use type aliases from `@/types` (`DatabaseDevice`, `DatabasePrompt`, etc.) instead of `Tables<"table_name">` for better code readability. These aliases are defined in `types/database.ts` and re-exported through `types/index.ts`.

### API Types (OpenAPI Generated)

Generated from `docs/openapi.yaml` using openapi-typescript-codegen:

- `Device` - Device information with computed fields
- `DeviceStatus` - Enum: active, inactive, warning, error, compliance
- `Prompt` - Prompt data structure
- `DeviceEvent` - Device event information (with severity enum)
- `Alert` - Alert information (with severity enum)
- `BlockedPrompt` - Blocked prompt information
- `StatsResponse` - Dashboard statistics
- `DeviceEventsResponse` - Events with stats

Also generates service classes (`DevicesService`, `PromptsService`, etc.) used by `lib/api-client.ts`.

## Runtime Validation

### Decoders

The project uses `type-decoder` for runtime validation of JSONB fields:

```typescript
import { decodeStringArray } from "@/lib/utils/decoders";

// Safely decode JSONB array
const ips = decodeStringArray(deviceData.ips);
```

Available decoders:

- `decodeStringArray` - Validates string arrays (in `lib/utils/decoders.ts`)
- `decodeDeviceEventMetadata` - Validates device event metadata
- `decodeComplianceEventDetails` - Validates compliance event details
- `decodeSeverity` - Validates severity enum
- `decodeSupabaseError` - Validates Supabase errors

### Why Decoders?

JSONB fields from Supabase are typed as `Json | null`, which is a union type that could be any JSON value. Decoders provide:

- Runtime type safety
- Validation before use
- Type narrowing for TypeScript

## Type Usage Examples

### Database Types

```typescript
import type { DatabaseDevice } from "@/types";

// Use semantic type aliases for database tables
const device: DatabaseDevice = await supabase
  .from("devices")
  .select("*")
  .single();
```

**Note**: We use type aliases (`DatabaseDevice`, `DatabasePrompt`, etc.) instead of `Tables<"table_name">` for better readability and maintainability. These aliases are defined in `types/database.ts` and re-exported through `types/index.ts`, so you can import them directly from `@/types`.

### API Types

```typescript
import type { Device, StatsResponse } from "@/types";
import { DeviceStatus } from "@/types";

// Use in API routes
const device: Device = {
  id: deviceData.device_id,
  hostname: deviceData.hostname || "Unknown",
  status: DeviceStatus.ACTIVE,
  // ... other fields
};
```

### JSONB Decoding

```typescript
import { decodeStringArray } from "@/lib/utils/decoders";
import type { DatabaseDevice } from "@/types";

const deviceData: DatabaseDevice = await getDevice();

// Safely decode JSONB array
const ips = decodeStringArray(deviceData.ips);
const ipAddress = ips && ips.length > 0 ? ips[0] : "N/A";
```

## Adding New Types

### API Types (for new endpoints)

1. Add endpoint and schema to `docs/openapi.yaml`
2. Run `pnpm run generate:all`
3. Types and services will be available in `@/types`
4. Add method to `lib/api-client.ts` using the generated service

### Database Decoder Types

1. Add type definition to `docs/specs/types.spec.yaml`
2. Run `pnpm run generate:types`
3. Decoders will be available in `@/types`

### Database Types

1. Update your Supabase schema
2. Run `pnpm run generate:supabase:types`
3. Types will be automatically available in `@/types`

### Database Type Aliases

If you add a new table and want to create a type alias for it:

1. Add the alias to `types/database.ts`:
   ```typescript
   export type DatabaseNewTable = Tables<"new_table">;
   ```
2. The alias will be automatically available through `@/types` since `types/index.ts` re-exports from `database.ts`

## Best Practices

1. **Always import from `@/types`** - Never import directly from generated files
2. **Use decoders for JSONB** - Always validate JSONB fields at runtime
3. **Regenerate after schema changes** - Run `pnpm run generate:types` after any schema updates
4. **No `any` or `unknown`** - All types should be explicit
5. **Use type guards** - When needed, create type guards for complex validations
