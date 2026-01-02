/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for device registration
 */
export type RegisterDeviceRequest = {
  /**
   * Unique device identifier
   */
  device_id: string;
  /**
   * Device public key in PEM format for JWT verification
   */
  public_key_pem: string;
  /**
   * Device hostname
   */
  hostname: string;
  /**
   * List of MAC addresses
   */
  macs?: Array<string>;
  /**
   * List of IP addresses
   */
  ips?: Array<string>;
  /**
   * Operating system
   */
  os?: string;
  /**
   * List of detected browsers
   */
  browsers?: Array<string>;
};
