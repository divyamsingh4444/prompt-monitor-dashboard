/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeviceStatus } from "./DeviceStatus";
export type Device = {
  /**
   * Device identifier
   */
  id: string;
  /**
   * Device hostname
   */
  hostname: string;
  status: DeviceStatus;
  /**
   * Operating system
   */
  os: string;
  /**
   * Primary IP address
   */
  ip_address: string;
  /**
   * Last heartbeat timestamp (ISO 8601)
   */
  last_seen: string;
  /**
   * Number of browsers detected
   */
  browser_count: number;
  /**
   * Number of prompts captured today
   */
  prompts_today: number;
  /**
   * Total number of prompts captured
   */
  total_prompts: number;
  /**
   * Device registration timestamp (ISO 8601)
   */
  registered_at?: string | null;
};
