/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DeviceEvent = {
  /**
   * Event identifier
   */
  id: string;
  /**
   * Associated device ID
   */
  device_id?: string | null;
  /**
   * Type of event
   */
  event_type: string;
  /**
   * Event severity level
   */
  severity: DeviceEvent.severity;
  /**
   * Event description
   */
  description: string;
  /**
   * Timestamp in epoch milliseconds
   */
  timestamp: number;
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
   * Prompt text if applicable
   */
  prompt?: string | null;
  /**
   * Hostname
   */
  hostname?: string | null;
};
export namespace DeviceEvent {
  /**
   * Event severity level
   */
  export enum severity {
    INFO = "info",
    WARNING = "warning",
    CRITICAL = "critical",
  }
}
