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

  // Transform API device response to frontend Device type
  private transformDevice(apiDevice: any): Device {
    return {
      id: apiDevice.device_id,
      hostname: apiDevice.hostname,
      status: apiDevice.status === "offline" ? "inactive" : apiDevice.status,
      os: apiDevice.os || "Unknown",
      ip_address: apiDevice.ips?.[0] || "N/A",
      last_seen: apiDevice.last_heartbeat,
      browser_count: apiDevice.browsers?.length || 0,
      prompts_today: apiDevice.prompts_today || 0,
      total_prompts: apiDevice.prompt_count || 0,
    };
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
    const apiDevices = await this.fetch<any[]>(`/admin/devices${query}`);
    return apiDevices.map((d) => this.transformDevice(d));
  }

  async getDevice(deviceId: string): Promise<Device> {
    const apiDevice = await this.fetch<any>(`/admin/devices/${deviceId}`);
    return this.transformDevice(apiDevice);
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
