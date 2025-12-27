// Centralized API client for Prompt Monitor backend

import type {
  Device,
  Prompt,
  DeviceEvent,
  Alert,
  BlockedPrompt,
  DashboardStats,
} from "./types";

const API_BASE_URL = "https://promptmonitor-backend.onrender.com";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    return this.fetch<DashboardStats>("/admin/stats");
  }

  // Device endpoints
  async getDevices(search?: string, status?: string): Promise<Device[]> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.fetch<Device[]>(`/admin/devices${query}`);
  }

  async getDevice(deviceId: string): Promise<Device> {
    return this.fetch<Device>(`/admin/devices/${deviceId}`);
  }

  // Prompt endpoints
  async getDevicePrompts(deviceId: string): Promise<Prompt[]> {
    return this.fetch<Prompt[]>(`/admin/prompts/${deviceId}`);
  }

  async getPrompt(promptId: string): Promise<Prompt> {
    return this.fetch<Prompt>(`/admin/prompt/${promptId}`);
  }

  // Event endpoints
  async getDeviceEvents(deviceId: string): Promise<DeviceEvent[]> {
    const response = await this.fetch<{ events: DeviceEvent[]; stats: object }>(
      `/admin/devices/${deviceId}/events`
    );
    return response.events || [];
  }

  // Alert endpoints
  async getDeviceAlerts(deviceId: string): Promise<Alert[]> {
    // Filter events to get only alert-type events
    const response = await this.fetch<{ events: DeviceEvent[]; stats: object }>(
      `/admin/devices/${deviceId}/events`
    );
    const events = response.events || [];
    // Extract events that are alerts (warnings or alerts based on severity)
    return events
      .filter(
        (event) => event.severity === "warning" || event.severity === "critical"
      )
      .map(
        (event) =>
          ({
            id: event.id,
            device_id: event.device_id,
            alert_type: event.event_type,
            severity: event.severity,
            matched_pattern: event.description,
            timestamp: event.timestamp,
          } as Alert)
      );
  }

  // Blocked prompts endpoints
  async getDeviceBlockedPrompts(deviceId: string): Promise<BlockedPrompt[]> {
    return this.fetch<BlockedPrompt[]>(`/admin/devices/${deviceId}/blocked`);
  }

  // Manual refresh trigger
  async refreshData(): Promise<{ success: boolean }> {
    return this.fetch<{ success: boolean }>("/api/refresh", {
      method: "POST",
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
