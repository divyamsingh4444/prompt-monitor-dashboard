/**
 * Type-safe API client generated from OpenAPI spec
 * This wraps the generated client with Next.js-specific configuration
 */

import {
  OpenAPI,
  StatisticsService,
  DevicesService,
  PromptsService,
  ApiError as GeneratedApiError,
} from "@/src/generated/api";
import type {
  StatsResponse,
  Device,
  Prompt,
  DeviceEventsResponse,
  BlockedPrompt,
  DeviceStatus,
  AuditTrailItem,
} from "@/src/generated/api";

// Configure base URL
if (typeof window !== "undefined") {
  OpenAPI.BASE = window.location.origin;
} else {
  OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
}

// Enhanced API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown,
    public originalError?: GeneratedApiError
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Wrapper to convert CancelablePromise to regular Promise with better errors
async function unwrapPromise<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error: unknown) {
    if (error instanceof GeneratedApiError) {
      const errorMessage =
        error.body?.error || error.message || `API Error: ${error.status}`;
      throw new ApiError(errorMessage, error.status, error.body, error);
    }
    if (error && typeof error === "object" && "status" in error) {
      const err = error as {
        status: number;
        body?: { error?: string };
        message?: string;
      };
      throw new ApiError(
        err.body?.error || err.message || "API Error",
        err.status,
        err.body
      );
    }
    throw error;
  }
}

// Type-safe API client
export const apiClient = {
  // Statistics
  getStats: async (): Promise<StatsResponse> => {
    return unwrapPromise(StatisticsService.getStats());
  },

  // Devices
  getDevices: async (params?: {
    search?: string;
    status?: DeviceStatus;
  }): Promise<Device[]> => {
    return unwrapPromise(
      DevicesService.listDevices(params?.search, params?.status)
    );
  },

  getDevice: async (id: string): Promise<Device> => {
    return unwrapPromise(DevicesService.getDevice(id));
  },

  getDevicePrompts: async (id: string): Promise<Prompt[]> => {
    return unwrapPromise(DevicesService.getDevicePrompts(id));
  },

  getDeviceEvents: async (id: string): Promise<DeviceEventsResponse> => {
    return unwrapPromise(DevicesService.getDeviceEvents(id));
  },

  getBlockedPrompts: async (id: string): Promise<BlockedPrompt[]> => {
    return unwrapPromise(DevicesService.getBlockedPrompts(id));
  },

  getDeviceAuditTrail: async (id: string): Promise<AuditTrailItem[]> => {
    return unwrapPromise(DevicesService.getDeviceAuditTrail(id));
  },

  // Prompts
  getPrompt: async (id: string): Promise<Prompt> => {
    return unwrapPromise(PromptsService.getPrompt(id));
  },
};
