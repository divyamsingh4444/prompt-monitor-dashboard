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

---

## Write Endpoints (POST)

The following endpoints are used by the extension and native agent to send data.

---

### Register Device

**POST** `/api/devices/register`

Register a new device with its public key and metadata. Called by the native agent on first run.

**Request Body:**

```typescript
{
  device_id: string;        // Required - Unique device identifier
  public_key_pem: string;   // Required - Device public key in PEM format
  hostname: string;         // Required - Device hostname
  macs?: string[];          // Optional - List of MAC addresses
  ips?: string[];           // Optional - List of IP addresses
  os?: string;              // Optional - Operating system
  browsers?: string[];      // Optional - List of detected browsers
}
```

**Response:**

```typescript
{
  status: "registered";
  device_id: string;
  message: string;
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/devices/register \
  -H "Content-Type: application/json" \
  -d '{"device_id": "dev-123", "public_key_pem": "-----BEGIN PUBLIC KEY-----...", "hostname": "my-laptop"}'
```

---

### Device Heartbeat

**POST** `/api/devices/heartbeat`

Update device last_heartbeat timestamp and optionally update metadata.

**Request Body:**

```typescript
{
  device_id: string;        // Required - Device ID
  device_metadata?: {       // Optional - Metadata to update
    hostname?: string;
    ips?: string[];
    macs?: string[];
    os?: string;
  }
}
```

**Response:**

```typescript
{
  status: "ok";
  device_id: string;
  message: string;
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/devices/heartbeat \
  -H "Content-Type: application/json" \
  -d '{"device_id": "dev-123"}'
```

---

### Capture Prompt

**POST** `/api/prompt`

Capture a single prompt from the extension.

**Headers:**

- `X-Device-ID` (optional) - Device ID if known

**Request Body:**

```typescript
{
  id: string;               // Required - UUID v4 message ID
  site: string;             // Required - Site where prompt was captured
  url: string;              // Required - URL where prompt was captured
  prompt: string;           // Required - The prompt text
  timestamp: number;        // Required - Epoch milliseconds
  selector?: string;        // Optional - DOM selector
  conversation_id?: string; // Optional - Conversation ID
  trigger?: string;         // Optional - What triggered the capture
  page_title?: string;      // Optional - Page title
  browser_name?: string;    // Optional - Browser name
  browser_version?: string; // Optional - Browser version
  profile_name?: string;    // Optional - Browser profile name
  username?: string;        // Optional - Username
  agent_status?: string;    // Optional - Native agent status
  instance_id?: string;     // Optional - Browser instance ID
  extension_version?: string; // Optional - Extension version
}
```

**Response:**

```typescript
{
  status: "captured";
  prompt_id: string;
  message: string;
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/prompt \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: dev-123" \
  -d '{"id": "uuid-v4-here", "site": "chatgpt.com", "url": "https://chatgpt.com", "prompt": "Hello world", "timestamp": 1704067200000}'
```

---

### Register Browser Instance

**POST** `/api/browsers/register`

Register a browser instance discovered by the extension.

**Headers:**

- `X-Device-ID` (required) - Device ID

**Request Body:**

```typescript
{
  instance_id: string;      // Required - Unique browser instance ID
  browser_name: string;     // Required - Browser name (e.g., Chrome, Firefox)
  profile_name: string;     // Required - Browser profile name
  browser_version?: string; // Optional - Browser version
  profile_path?: string;    // Optional - Path to browser profile
  extension_id?: string;    // Optional - Extension ID
  extension_version?: string; // Optional - Extension version
}
```

**Response:**

```typescript
{
  status: "registered";
  instance_id: string;
  message: string;
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/browsers/register \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: dev-123" \
  -d '{"instance_id": "browser-inst-1", "browser_name": "Chrome", "profile_name": "Default"}'
```

---

### Browser Heartbeat

**POST** `/api/browsers/heartbeat`

Update browser instance last_seen timestamp.

**Request Body:**

```typescript
{
  instance_id: string; // Required - Browser instance ID
}
```

**Response:**

```typescript
{
  status: "ok";
  instance_id: string;
  message: string;
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/browsers/heartbeat \
  -H "Content-Type: application/json" \
  -d '{"instance_id": "browser-inst-1"}'
```

---

### Report Extension Status

**POST** `/api/extension/status`

Report extension health status (enabled/disabled).

**Request Body:**

```typescript
{
  instance_id: string;      // Required - Browser instance ID
  status: string;           // Required - Status (e.g., "enabled", "disabled")
  reported_by?: string;     // Optional - Who/what reported the status
  metadata?: object;        // Optional - Additional metadata
}
```

**Response:**

```typescript
{
  status: "reported";
  status_id: string;
  message: string;
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/extension/status \
  -H "Content-Type: application/json" \
  -d '{"instance_id": "browser-inst-1", "status": "enabled"}'
```

---

### Report Compliance Event

**POST** `/api/compliance/event`

Report a compliance violation or tampering attempt.

**Headers:**

- `X-Device-ID` (required) - Device ID

**Request Body:**

```typescript
{
  event_type: string;       // Required - Type of compliance event
  severity: "info" | "warning" | "critical"; // Required
  detected_at: string;      // Required - ISO 8601 timestamp
  instance_id?: string;     // Optional - Browser instance ID
  user_context?: string;    // Optional - User context info
  details?: {               // Optional - Additional details
    site?: string;
    reason?: string;
  }
}
```

**Response:**

```typescript
{
  status: "reported";
  event_id: string;
  message: string;
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/compliance/event \
  -H "Content-Type: application/json" \
  -H "X-Device-ID: dev-123" \
  -d '{"event_type": "extension_disabled", "severity": "warning", "detected_at": "2024-01-01T00:00:00Z"}'
```

---

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad request (missing required fields, invalid data)
- `404` - Resource not found
- `409` - Conflict (e.g., duplicate prompt ID)
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
