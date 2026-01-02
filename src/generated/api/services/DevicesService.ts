/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BlockedPrompt } from "../models/BlockedPrompt";
import type { Device } from "../models/Device";
import type { DeviceEventsResponse } from "../models/DeviceEventsResponse";
import type { DeviceStatus } from "../models/DeviceStatus";
import type { Prompt } from "../models/Prompt";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class DevicesService {
  /**
   * List all devices
   * Returns a list of all devices with computed statistics. Supports filtering and searching.
   * @param search Search by hostname, ID, or IP address
   * @param status Filter by device status
   * @returns Device Successful response
   * @throws ApiError
   */
  public static listDevices(
    search?: string,
    status?: DeviceStatus,
  ): CancelablePromise<Array<Device>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/devices",
      query: {
        search: search,
        status: status,
      },
      errors: {
        500: `Server error`,
      },
    });
  }
  /**
   * Get device details
   * Returns detailed information about a specific device.
   * @param id Device ID
   * @returns Device Successful response
   * @throws ApiError
   */
  public static getDevice(id: string): CancelablePromise<Device> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/devices/{id}",
      path: {
        id: id,
      },
      errors: {
        404: `Device not found`,
        500: `Server error`,
      },
    });
  }
  /**
   * Get device prompts
   * Returns all prompts captured from a specific device.
   * @param id Device ID
   * @returns Prompt Successful response
   * @throws ApiError
   */
  public static getDevicePrompts(id: string): CancelablePromise<Array<Prompt>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/devices/{id}/prompts",
      path: {
        id: id,
      },
      errors: {
        500: `Server error`,
      },
    });
  }
  /**
   * Get device events
   * Returns all events associated with a device, including statistics.
   * @param id Device ID
   * @returns DeviceEventsResponse Successful response
   * @throws ApiError
   */
  public static getDeviceEvents(
    id: string,
  ): CancelablePromise<DeviceEventsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/devices/{id}/events",
      path: {
        id: id,
      },
      errors: {
        500: `Server error`,
      },
    });
  }
  /**
   * Get blocked prompts
   * Returns all blocked prompts (compliance events) for a device.
   * @param id Device ID
   * @returns BlockedPrompt Successful response
   * @throws ApiError
   */
  public static getBlockedPrompts(
    id: string,
  ): CancelablePromise<Array<BlockedPrompt>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/devices/{id}/blocked",
      path: {
        id: id,
      },
      errors: {
        500: `Server error`,
      },
    });
  }
}
