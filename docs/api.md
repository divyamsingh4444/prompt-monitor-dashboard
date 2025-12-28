# API Documentation

This document describes all API endpoints available in the Prompt Monitor Dashboard.

## Base URL

All API routes are prefixed with `/api` and are Next.js API routes.

## Authentication

Currently, API routes use Supabase with Row Level Security (RLS) disabled. The anon key is sufficient for all operations.

## Endpoints

### Dashboard Statistics

**GET** `/api/stats`

Returns dashboard statistics including device counts and prompt metrics.

**Response:**

```typescript
{
  total_devices: number;
  active_devices: number;
  inactive_devices: number;
  prompts_today: number;
}
```

**Example:**

```bash
curl http://localhost:3000/api/stats
```

---

### List Devices

**GET** `/api/devices`

Returns a list of all devices with computed statistics.

**Query Parameters:**

- `search` (optional) - Search by hostname, ID, or IP address
- `status` (optional) - Filter by status: "active", "inactive", "warning", "error", "compliance"

**Response:**

```typescript
Device[] // Array of Device objects
```

**Device Object:**

```typescript
{
  id: string;
  hostname: string;
  status: "active" | "inactive" | "warning" | "error" | "compliance";
  os: string;
  ip_address: string;
  last_seen: string; // ISO timestamp
  browser_count: number;
  prompts_today: number;
  total_prompts: number;
  registered_at: string | null; // ISO timestamp
}
```

**Example:**

```bash
curl "http://localhost:3000/api/devices?search=laptop&status=active"
```

---

### Get Device Details

**GET** `/api/devices/[id]`

Returns detailed information about a specific device.

**Response:**

```typescript
Device; // Single Device object
```

**Example:**

```bash
curl http://localhost:3000/api/devices/device-123
```

---

### Get Device Prompts

**GET** `/api/devices/[id]/prompts`

Returns all prompts captured from a specific device.

**Response:**

```typescript
Prompt[] // Array of Prompt objects
```

**Prompt Object:**

```typescript
{
  id: string;
  device_id: string | null;
  site: string;
  prompt_text: string;
  timestamp: number; // Epoch milliseconds
  browser: string;
  is_flagged: boolean;
  url: string | null;
  username: string | null;
}
```

**Example:**

```bash
curl http://localhost:3000/api/devices/device-123/prompts
```

---

### Get Device Events

**GET** `/api/devices/[id]/events`

Returns all events associated with a device.

**Response:**

```typescript
{
  events: DeviceEvent[];
  stats: {
    total: number;
    critical: number;
    warning: number;
    info: number;
  };
}
```

**DeviceEvent Object:**

```typescript
{
  id: string;
  device_id: string | null;
  event_type: string;
  severity: "info" | "warning" | "critical";
  description: string;
  timestamp: number; // Epoch milliseconds
  site: string | null;
  browser_name: string | null;
  profile_name: string | null;
  username: string | null;
  url: string | null;
  prompt: string | null;
  hostname: string | null;
}
```

**Example:**

```bash
curl http://localhost:3000/api/devices/device-123/events
```

---

### Get Blocked Prompts

**GET** `/api/devices/[id]/blocked`

Returns all blocked prompts (compliance events) for a device.

**Response:**

```typescript
BlockedPrompt[] // Array of BlockedPrompt objects
```

**BlockedPrompt Object:**

```typescript
{
  id: string;
  device_id: string;
  site: string;
  reason: string;
  timestamp: string; // ISO timestamp
}
```

**Example:**

```bash
curl http://localhost:3000/api/devices/device-123/blocked
```

---

### Get Prompt Details

**GET** `/api/prompt/[id]`

Returns detailed information about a specific prompt.

**Response:**

```typescript
Prompt; // Single Prompt object
```

**Example:**

```bash
curl http://localhost:3000/api/prompt/prompt-uuid-123
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `404` - Resource not found
- `500` - Server error

Error response format:

```typescript
{
  error: string; // Error message
}
```

## Data Transformations

API routes perform several transformations:

1. **Status Calculation**: Device status is computed from `last_heartbeat` (active if within 5 minutes)
2. **JSONB Decoding**: JSONB fields (like `ips`, `browsers`) are decoded using runtime validators
3. **Timestamp Conversion**: Bigint timestamps are converted to numbers (milliseconds)
4. **Aggregations**: Prompt counts are calculated by querying the prompts table

## Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting for production use.

## CORS

API routes are designed for same-origin requests. If you need CORS, configure it in `next.config.mjs`.
