/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BlockedPrompt } from "../models/BlockedPrompt";
import type { Device } from "../models/Device";
import type { DeviceEventsResponse } from "../models/DeviceEventsResponse";
import type { DeviceStatus } from "../models/DeviceStatus";
import type { HeartbeatRequest } from "../models/HeartbeatRequest";
import type { HeartbeatResponse } from "../models/HeartbeatResponse";
import type { Prompt } from "../models/Prompt";
import type { RegisterDeviceRequest } from "../models/RegisterDeviceRequest";
import type { RegisterDeviceResponse } from "../models/RegisterDeviceResponse";
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
  /**
   * Register a new device
   * Register a new device with its public key and metadata. This is called by the native agent on first run.
   * @param requestBody
   * @returns RegisterDeviceResponse Device registered successfully
   * @throws ApiError
   */
  public static registerDevice(
    requestBody: RegisterDeviceRequest,
  ): CancelablePromise<RegisterDeviceResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/devices/register",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        400: `Invalid request`,
        500: `Server error`,
      },
    });
  }
  /**
   * Send device heartbeat
   * Update device last_heartbeat timestamp and optionally update metadata. Requires authentication.
   * @param requestBody
   * @returns HeartbeatResponse Heartbeat recorded successfully
   * @throws ApiError
   */
  public static deviceHeartbeat(
    requestBody?: HeartbeatRequest,
  ): CancelablePromise<HeartbeatResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/devices/heartbeat",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        401: `Authentication required`,
        500: `Server error`,
      },
    });
  }
}
