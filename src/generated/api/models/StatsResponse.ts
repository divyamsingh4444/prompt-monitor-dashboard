/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StatsResponse = {
  /**
   * Total number of devices
   */
  total_devices: number;
  /**
   * Number of active devices (heartbeat within last 5 minutes)
   */
  active_devices: number;
  /**
   * Number of inactive devices
   */
  inactive_devices: number;
  /**
   * Number of prompts captured today
   */
  prompts_today: number;
};
