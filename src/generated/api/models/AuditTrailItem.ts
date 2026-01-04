/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Unified audit trail item merging all event sources
 */
export type AuditTrailItem = {
  /**
   * Item identifier
   */
  id: string;
  /**
   * Type of audit trail item
   */
  type: AuditTrailItem.type;
  /**
   * Timestamp in epoch milliseconds
   */
  timestamp: number;
  /**
   * Event severity level (if applicable)
   */
  severity?: AuditTrailItem.severity;
  /**
   * Event type/category
   */
  event_type: string;
  /**
   * Associated device ID
   */
  device_id?: string | null;
  /**
   * Event description
   */
  description?: string | null;
  /**
   * Site associated with event
   */
  site?: string | null;
  /**
   * Browser name
   */
  browser_name?: string | null;
  /**
   * Browser profile name
   */
  profile_name?: string | null;
  /**
   * Username
   */
  username?: string | null;
  /**
   * URL associated with event
   */
  url?: string | null;
  /**
   * Prompt text (for device events)
   */
  prompt?: string | null;
  /**
   * Prompt text (for prompts)
   */
  prompt_text?: string | null;
  /**
   * Whether prompt is flagged
   */
  is_flagged?: boolean | null;
  /**
   * Compliance event ID
   */
  event_id?: string | null;
  /**
   * When compliance event was detected
   */
  detected_at?: string | null;
  /**
   * User context for compliance event
   */
  user_context?: string | null;
  /**
   * Additional details (JSONB)
   */
  details?: Record<string, any> | null;
  /**
   * Whether compliance event is resolved
   */
  resolved?: boolean | null;
  /**
   * Reason for compliance event/blocking
   */
  reason?: string | null;
  /**
   * Browser instance ID
   */
  instance_id?: string | null;
  /**
   * Browser version
   */
  browser_version?: string | null;
  /**
   * Hostname
   */
  hostname?: string | null;
};
export namespace AuditTrailItem {
  /**
   * Type of audit trail item
   */
  export enum type {
    DEVICE_EVENT = "device_event",
    PROMPT = "prompt",
    COMPLIANCE_EVENT = "compliance_event",
    BROWSER_EVENT = "browser_event",
  }
  /**
   * Event severity level (if applicable)
   */
  export enum severity {
    INFO = "info",
    WARNING = "warning",
    CRITICAL = "critical",
  }
}
