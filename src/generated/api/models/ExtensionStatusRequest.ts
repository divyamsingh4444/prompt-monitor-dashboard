/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for extension status report
 */
export type ExtensionStatusRequest = {
  /**
   * Browser instance ID
   */
  instance_id: string;
  /**
   * Extension status (e.g., enabled, disabled)
   */
  status: string;
  /**
   * Who/what reported the status
   */
  reported_by?: string | null;
  /**
   * Additional metadata
   */
  metadata?: Record<string, any> | null;
};
