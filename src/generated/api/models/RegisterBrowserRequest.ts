/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for browser instance registration
 */
export type RegisterBrowserRequest = {
  /**
   * Unique browser instance ID
   */
  instance_id: string;
  /**
   * Browser name (e.g., Chrome, Firefox)
   */
  browser_name: string;
  /**
   * Browser version
   */
  browser_version?: string | null;
  /**
   * Browser profile name
   */
  profile_name: string;
  /**
   * Path to browser profile
   */
  profile_path?: string | null;
  /**
   * Extension ID
   */
  extension_id?: string | null;
  /**
   * Extension version
   */
  extension_version?: string | null;
};
