/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Prompt = {
  /**
   * Prompt identifier
   */
  id: string;
  /**
   * Associated device ID
   */
  device_id?: string | null;
  /**
   * Site where prompt was captured
   */
  site: string;
  /**
   * The prompt text
   */
  prompt_text: string;
  /**
   * Timestamp in epoch milliseconds
   */
  timestamp: number;
  /**
   * Browser name
   */
  browser: string;
  /**
   * Whether the prompt is flagged
   */
  is_flagged: boolean;
  /**
   * URL where prompt was captured
   */
  url?: string | null;
  /**
   * Username associated with the prompt
   */
  username?: string | null;
};
