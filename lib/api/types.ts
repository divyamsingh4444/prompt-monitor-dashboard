export interface Device {
  id: string;
  hostname: string;
  status: "active" | "inactive" | "warning" | "error" | "compliance";
  os: string;
  ip_address: string;
  last_seen: string;
  browser_count: number;
  prompts_today: number;
  total_prompts: number;
}

export interface Prompt {
  id: string;
  device_id: string;
  site: string;
  prompt_text: string;
  timestamp: string;
  browser: string;
  is_flagged: boolean;
}

export interface DeviceEvent {
  id: string;
  device_id?: string;
  event_type: string;
  severity: "info" | "warning" | "critical";
  description: string;
  timestamp: number; // Epoch timestamp in milliseconds
  site?: string;
  browser_name?: string;
  profile_name?: string;
  username?: string;
  url?: string;
  prompt?: string;
  hostname?: string;
}

export interface Alert {
  id: string;
  device_id?: string;
  alert_type: string;
  severity: "warning" | "critical";
  matched_pattern: string;
  timestamp: number;
}

export interface BlockedPrompt {
  id: string;
  device_id: string;
  site: string;
  reason: string;
  timestamp: string;
}

export interface DashboardStats {
  total_devices: number;
  active_devices: number;
  inactive_devices: number;
  prompts_today: number;
}
