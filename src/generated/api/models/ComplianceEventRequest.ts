/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for compliance event report
 */
export type ComplianceEventRequest = {
  /**
   * Browser instance ID
   */
  instance_id?: string | null;
  /**
   * Type of compliance event
   */
  event_type: string;
  /**
   * Event severity
   */
  severity: ComplianceEventRequest.severity;
  /**
   * When the event was detected (ISO 8601)
   */
  detected_at: string;
  /**
   * User context information
   */
  user_context?: string | null;
  /**
   * Additional event details (JSONB)
   */
  details?: {
    site?: string;
    reason?: string;
  } | null;
};
export namespace ComplianceEventRequest {
  /**
   * Event severity
   */
  export enum severity {
    INFO = "info",
    WARNING = "warning",
    CRITICAL = "critical",
  }
}
