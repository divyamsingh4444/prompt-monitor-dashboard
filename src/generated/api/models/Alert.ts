/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Alert derived from device events with warning or critical severity
 */
export type Alert = {
  /**
   * Alert identifier
   */
  id: string;
  /**
   * Associated device ID
   */
  device_id?: string | null;
  /**
   * Type of alert
   */
  alert_type: string;
  /**
   * Alert severity
   */
  severity: Alert.severity;
  /**
   * Pattern that triggered the alert
   */
  matched_pattern: string;
  /**
   * Timestamp in epoch milliseconds
   */
  timestamp: number;
};
export namespace Alert {
  /**
   * Alert severity
   */
  export enum severity {
    WARNING = "warning",
    CRITICAL = "critical",
  }
}
