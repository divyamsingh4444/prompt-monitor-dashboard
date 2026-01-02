/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeviceEvent } from "./DeviceEvent";
export type DeviceEventsResponse = {
  events: Array<DeviceEvent>;
  stats: {
    /**
     * Total number of events
     */
    total: number;
    /**
     * Number of critical events
     */
    critical: number;
    /**
     * Number of warning events
     */
    warning: number;
    /**
     * Number of info events
     */
    info: number;
  };
};
