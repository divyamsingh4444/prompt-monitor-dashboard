---
name: Implement Write APIs with Authentication
overview: Implement JWT-based device authentication and 7 POST endpoints across 4 phases to enable data ingestion from extension and native agent, replacing the old FastAPI backend.
todos: []
---

# Implement Write APIs - Phase 1 &

2

## Overview

Currently, the dashboard is **read-only**. We need to implement POST endpoints so the extension and native agent can send data. This plan implements 6 critical write APIs across 2 phases.

## Phase 1: Core Data Ingestion (3 APIs)

### 1. POST /api/devices/register

**Purpose**: Register new devices when native agent first runs**Database**: Insert into `devices` table**Fields**: `device_id`, `public_key_pem`, `hostname`, `macs`, `ips`, `os`, `browsers`, `registered_at`**Location**: `app/api/devices/register/route.ts`

### 2. POST /api/devices/heartbeat

**Purpose**: Update device `last_heartbeat` and optional metadata (hostname, IPs, MACs, OS, browsers)**Database**: Update `devices` table (upsert pattern - update if exists, create if not)**Location**: `app/api/devices/heartbeat/route.ts`

### 3. POST /api/prompt

**Purpose**: Capture individual prompts from extension**Database**: Insert into `prompts` table**Fields**: All prompt fields including `device_id`, `instance_id`, `site`, `url`, `prompt`, `timestamp`, `browser_name`, `profile_name`, `username`, etc.**Location**: `app/api/prompt/route.ts`

## Phase 2: Extension & Compliance Support (4 APIs)

### 4. POST /api/browsers/register

**Purpose**: Register browser instances discovered by extension**Database**: Insert into `browser_instances` table**Fields**: `instance_id`, `device_id`, `browser_name`, `browser_version`, `profile_name`, `profile_path`, `extension_id`, `extension_version`, `discovered_at`**Location**: `app/api/browsers/register/route.ts`

### 5. POST /api/browsers/heartbeat

**Purpose**: Update browser instance `last_seen` timestamp**Database**: Update `browser_instances.last_seen`**Location**: `app/api/browsers/heartbeat/route.ts`

### 6. POST /api/extension/status

**Purpose**: Report extension health status (enabled/disabled)**Database**: Insert into `extension_status` table**Fields**: `status_id`, `instance_id`, `status`, `reported_at`, `reported_by`, `metadata`**Location**: `app/api/extension/status/route.ts`

### 7. POST /api/compliance/event

**Purpose**: Report compliance violations (tamper detection, blocked prompts)**Database**: Insert into `compliance_events` table**Fields**: `event_id`, `device_id`, `instance_id`, `event_type`, `severity`, `detected_at`, `user_context`, `details` (JSONB)**Location**: `app/api/compliance/event/route.ts`

## Implementation Details

### Common Patterns

1. **Request Validation**: Validate required fields, handle missing/null values
2. **JSONB Handling**: Use decoders for JSONB fields when reading, store as JSON when writing
3. **Error Handling**: Return appropriate HTTP status codes (400 for validation, 500 for server errors)
4. **Upsert Logic**: For heartbeat endpoints, update if record exists, create if not
5. **Timestamps**: Use `NOW()` for database timestamps, accept epoch milliseconds from clients

### Type Updates Required

1. **OpenAPI Spec** (`docs/openapi.yaml`):

- Add request/response schemas for all 7 POST endpoints
- Define request body types (e.g., `RegisterDeviceRequest`, `HeartbeatRequest`, `PromptRequest`)

2. **Type Generation**:

- Run `pnpm run generate:all` after OpenAPI updates
- Types will be available in `@/types`

3. **API Client** (`lib/api-client.ts`):

- Add methods for each POST endpoint (optional - only if frontend needs to call them)

### Database Considerations

- **devices table**: Supports upsert via `device_id` (primary key)
- **prompts table**: Auto-generates `created_at`, accepts `timestamp` as bigint
- **browser_instances table**: Uses `instance_id` as primary key
- **extension_status table**: Auto-generates `created_at`, `reported_at`
- **compliance_events table**: Auto-generates `created_at`, accepts `detected_at`

### Missing: Authentication

**Note**: The old project required authentication for POST endpoints, but the new project currently has RLS disabled. For now, we'll implement endpoints without auth. Authentication can be added later as a separate security layer (e.g., API keys, JWT tokens, or Supabase RLS policies).

## File Structure

```javascript
app/api/
├── devices/
│   ├── register/
│   │   └── route.ts          # NEW
│   └── heartbeat/
│       └── route.ts          # NEW
├── prompt/
│   └── route.ts              # NEW (not [id], just /prompt)
├── browsers/
│   ├── register/
│   │   └── route.ts          # NEW
│   └── heartbeat/
│       └── route.ts          # NEW
├── extension/
│   └── status/
│       └── route.ts          # NEW
└── compliance/
    └── event/
        └── route.ts          # NEW
```

## Testing Strategy

1. **Manual Testing**: Use curl/Postman to test each endpoint
2. **Validation**: Test with missing fields, invalid data types
3. **Database Verification**: Check Supabase dashboard to confirm data is inserted correctly
4. **Integration**: Test with actual extension/agent (if available)

## Order of Implementation

1. Update `docs/openapi.yaml` with all 7 endpoint definitions
2. Run `pnpm run generate:all` to generate types
3. Implement Phase 1 APIs (devices/register, devices/heartbeat, prompt)
