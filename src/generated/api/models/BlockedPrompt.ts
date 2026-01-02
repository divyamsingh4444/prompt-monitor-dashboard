/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BlockedPrompt = {
  /**
   * Blocked prompt identifier
   */
  id: string;
  /**
   * Associated device ID
   */
  device_id: string;
  /**
   * Site where prompt was blocked
   */
  site: string;
  /**
   * Reason for blocking
   */
  reason: string;
  /**
   * Timestamp when prompt was blocked (ISO 8601)
   */
  timestamp: string;
};
