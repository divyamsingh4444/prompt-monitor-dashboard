# Database Schema Documentation

This document describes the Supabase database schema used by the Prompt Monitor Dashboard.

## Overview

The database uses PostgreSQL via Supabase with the following main tables:

- `devices` - Device information and status
- `prompts` - Captured AI prompts
- `device_events` - Device events and alerts
- `compliance_events` - Compliance violations

## Tables

### devices

Stores information about monitored devices.

| Column           | Type      | Description                    |
| ---------------- | --------- | ------------------------------ |
| `device_id`      | text (PK) | Unique device identifier       |
| `hostname`       | text      | Device hostname                |
| `os`             | text      | Operating system               |
| `ips`            | jsonb     | Array of IP addresses (JSONB)  |
| `browsers`       | jsonb     | Array of browser names (JSONB) |
| `macs`           | jsonb     | Array of MAC addresses (JSONB) |
| `last_heartbeat` | timestamp | Last heartbeat timestamp       |
| `registered_at`  | timestamp | Device registration timestamp  |
| `public_key_pem` | text      | Device public key              |

**Notes:**

- `ips` and `browsers` are JSONB arrays of strings
- Device status is computed from `last_heartbeat` (active if within 5 minutes)
- `registered_at` is used for sorting devices (newest first)

---

### prompts

Stores captured AI prompts from devices.

| Column         | Type      | Description                              |
| -------------- | --------- | ---------------------------------------- |
| `id`           | uuid (PK) | Unique prompt identifier                 |
| `device_id`    | text (FK) | Reference to devices.device_id           |
| `site`         | text      | Website/source where prompt was captured |
| `prompt`       | text      | The actual prompt text                   |
| `timestamp`    | bigint    | Epoch timestamp in milliseconds          |
| `browser_name` | text      | Browser name                             |
| `url`          | text      | URL where prompt was captured            |
| `username`     | text      | Username (if available)                  |
| `created_at`   | timestamp | Record creation timestamp                |

**Notes:**

- `timestamp` is stored as bigint (milliseconds since epoch)
- Used to calculate `prompts_today` by filtering timestamps >= today's midnight

---

### device_events

Stores events and alerts from devices.

| Column         | Type      | Description                                       |
| -------------- | --------- | ------------------------------------------------- |
| `id`           | uuid (PK) | Unique event identifier                           |
| `device_id`    | text (FK) | Reference to devices.device_id                    |
| `event_type`   | text      | Type of event                                     |
| `severity`     | text      | Severity level: "info", "warning", "critical"     |
| `description`  | text      | Event description                                 |
| `timestamp`    | bigint    | Event timestamp (milliseconds)                    |
| `site`         | text      | Source site                                       |
| `browser_name` | text      | Browser name                                      |
| `profile_name` | text      | Browser profile name                              |
| `username`     | text      | Username                                          |
| `metadata`     | jsonb     | Additional metadata (contains `url` and `prompt`) |
| `created_at`   | timestamp | Record creation timestamp                         |

**Notes:**

- `metadata` is a JSONB object that may contain:
  - `url`: string
  - `prompt`: string
- Events with severity "warning" or "critical" are treated as alerts
- `timestamp` is stored as bigint (milliseconds since epoch)

---

### compliance_events

Stores compliance violations and blocked prompts.

| Column       | Type      | Description                                  |
| ------------ | --------- | -------------------------------------------- |
| `id`         | uuid (PK) | Unique compliance event identifier           |
| `device_id`  | text (FK) | Reference to devices.device_id               |
| `details`    | jsonb     | Event details (contains `site` and `reason`) |
| `created_at` | timestamp | Record creation timestamp                    |

**Notes:**

- `details` is a JSONB object containing:
  - `site`: string
  - `reason`: string
- This table is used for the "blocked prompts" feature

---

## Relationships

```
devices (1) ──< (many) prompts
devices (1) ──< (many) device_events
devices (1) ──< (many) compliance_events
```

## Indexes

Recommended indexes for performance:

```sql
-- Device lookups
CREATE INDEX idx_devices_device_id ON devices(device_id);
CREATE INDEX idx_devices_last_heartbeat ON devices(last_heartbeat);

-- Prompt queries
CREATE INDEX idx_prompts_device_id ON prompts(device_id);
CREATE INDEX idx_prompts_timestamp ON prompts(timestamp);
CREATE INDEX idx_prompts_device_timestamp ON prompts(device_id, timestamp);

-- Event queries
CREATE INDEX idx_device_events_device_id ON device_events(device_id);
CREATE INDEX idx_device_events_timestamp ON device_events(timestamp);
CREATE INDEX idx_device_events_severity ON device_events(severity);

-- Compliance events
CREATE INDEX idx_compliance_events_device_id ON compliance_events(device_id);
```

## Row Level Security (RLS)

Currently, RLS is disabled on all tables. The application uses the anon key for all operations.

For production, consider enabling RLS with appropriate policies.

## Data Types

### JSONB Fields

Several fields use JSONB for flexible data storage:

- `devices.ips` - Array of IP addresses: `["192.168.1.1", "10.0.0.1"]`
- `devices.browsers` - Array of browser names: `["Chrome", "Firefox"]`
- `devices.macs` - Array of MAC addresses
- `device_events.metadata` - Object: `{ url: string, prompt: string }`
- `compliance_events.details` - Object: `{ site: string, reason: string }`

These fields are decoded at runtime using type-safe decoders.

### Timestamps

- `timestamp` fields in `prompts` and `device_events` are stored as `bigint` (milliseconds since epoch)
- `last_heartbeat` and `registered_at` in `devices` are stored as `timestamp`
- `created_at` fields are PostgreSQL timestamps

## Computed Fields

Several fields are computed in the API layer:

- **Device Status**: Calculated from `last_heartbeat` (active if within 5 minutes)
- **Browser Count**: Count of items in `browsers` JSONB array
- **IP Address**: First item from `ips` JSONB array
- **Prompts Today**: Count of prompts with `timestamp >= today's midnight`
- **Total Prompts**: Count of all prompts for a device

These are not stored in the database but computed on-the-fly in API routes.
