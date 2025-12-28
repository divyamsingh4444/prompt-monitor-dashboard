# Type System Documentation

This project uses a comprehensive type generation system to ensure type safety across the entire codebase.

## Overview

All TypeScript types are generated from two sources:

1. **Supabase Database Schema** - Automatically generated from your Supabase project
2. **YAML Specifications** - Custom types defined in `docs/specs/types.spec.yaml`

## Type Sources

### Generated Types Location

```
src/generated/
├── types/          # type-crafter generated (DatabaseTypes, ApiTypes)
└── supabase/       # Supabase CLI generated (SupabaseTypes)
```

### Central Type Exports

All types are exported through `types/index.ts` and can be imported using:

```typescript
import type { Device, Tables, Database, Json } from "@/types";
import { decodeStringArray, decodeSeverity } from "@/types";
```

**Type Organization:**

```
types/
├── index.ts        # Central exports (re-exports all types)
└── database.ts     # Database type aliases (DatabaseDevice, etc.)
```

The `types/index.ts` file re-exports:

- All generated types from `src/generated/types`
- All Supabase types from `src/generated/supabase/SupabaseTypes`
- Database type aliases from `types/database.ts`

## Type Generation

### Generating Types

Run the following command to generate all types:

```bash
pnpm run generate:types
```

This command:

1. Generates types from YAML specs using type-crafter
2. Generates Supabase types from your database schema
3. Formats all generated files
4. Removes unused imports

### Individual Generation

- **Custom Types**: `pnpm run generate:types` (includes type-crafter)
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

### API Types (`ApiTypes.ts`)

Generated from `docs/specs/types.spec.yaml` for frontend API responses:

- `Device` - Device information with computed fields
- `Prompt` - Prompt data structure
- `DeviceEvent` - Device event information
- `Alert` - Alert information (filtered from events)
- `BlockedPrompt` - Blocked prompt information
- `DashboardStats` - Dashboard statistics

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
import type { Device, DashboardStats } from "@/types";

// Use in API routes
const device: Device = {
  id: deviceData.device_id,
  hostname: deviceData.hostname || "Unknown",
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

### Custom Types

1. Add type definition to `docs/specs/types.spec.yaml`
2. Run `pnpm run generate:types`
3. Types will be available in `@/types`

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
