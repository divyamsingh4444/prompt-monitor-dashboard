/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for device heartbeat (optional metadata)
 */
export type HeartbeatRequest = {
  /**
   * Device ID (required until auth is implemented)
   */
  device_id: string;
  device_metadata?: {
    hostname?: string;
    ips?: Array<string>;
    macs?: Array<string>;
    os?: string;
  };
};
