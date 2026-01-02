/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request body for capturing a prompt
 */
export type CapturePromptRequest = {
  /**
   * UUID v4 message ID
   */
  id: string;
  /**
   * Site where prompt was captured
   */
  site: string;
  /**
   * URL where prompt was captured
   */
  url: string;
  /**
   * The prompt text
   */
  prompt: string;
  /**
   * Timestamp in epoch milliseconds
   */
  timestamp: number;
  /**
   * DOM selector for the prompt input
   */
  selector?: string | null;
  /**
   * Conversation ID if applicable
   */
  conversation_id?: string | null;
  /**
   * What triggered the prompt capture
   */
  trigger?: string | null;
  /**
   * Page title
   */
  page_title?: string | null;
  /**
   * Browser name
   */
  browser_name?: string | null;
  /**
   * Browser version
   */
  browser_version?: string | null;
  /**
   * Browser profile name
   */
  profile_name?: string | null;
  /**
   * Username
   */
  username?: string | null;
  /**
   * Status of native agent
   */
  agent_status?: string | null;
  /**
   * Browser instance ID
   */
  instance_id?: string | null;
  /**
   * Extension version
   */
  extension_version?: string | null;
};
