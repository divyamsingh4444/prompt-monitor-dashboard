/**
 * Database table type aliases
 * Provides cleaner, more semantic types for database tables
 *
 * Usage:
 *   import type { DatabaseDevice, DatabasePrompt } from "@/types";
 */

import type { Tables } from "@/src/generated/supabase/SupabaseTypes";

/**
 * Type alias for devices table row
 */
export type DatabaseDevice = Tables<"devices">;

/**
 * Type alias for prompts table row
 */
export type DatabasePrompt = Tables<"prompts">;

/**
 * Type alias for device_events table row
 */
export type DatabaseDeviceEvent = Tables<"device_events">;

/**
 * Type alias for compliance_events table row
 */
export type DatabaseComplianceEvent = Tables<"compliance_events">;
