import { type Severity, decodeSeverity } from "./index";
import {
  isJSON,
  decodeString,
  decodeNumber,
  decodeBoolean,
} from "type-decoder";

/**
 * @type { Device }
 */
export type Device = {
  /**
   * @type { string }
   * @memberof Device
   */
  id: string;
  /**
   * @type { string }
   * @memberof Device
   */
  hostname: string;
  /**
   * @type { StatusEnum }
   * @memberof Device
   */
  status: StatusEnum;
  /**
   * @type { string }
   * @memberof Device
   */
  os: string;
  /**
   * @type { string }
   * @memberof Device
   */
  ip_address: string;
  /**
   * @type { string }
   * @memberof Device
   */
  last_seen: string;
  /**
   * @type { number }
   * @memberof Device
   */
  browser_count: number;
  /**
   * @type { number }
   * @memberof Device
   */
  prompts_today: number;
  /**
   * @type { number }
   * @memberof Device
   */
  total_prompts: number;
  /**
   * @type { string }
   * @memberof Device
   */
  registered_at: string | null;
};

export function decodeDevice(rawInput: unknown): Device | null {
  if (isJSON(rawInput)) {
    const decodedId = decodeString(rawInput["id"]);
    const decodedHostname = decodeString(rawInput["hostname"]);
    const decodedStatus = decodeStatusEnum(rawInput["status"]);
    const decodedOs = decodeString(rawInput["os"]);
    const decodedIpAddress = decodeString(rawInput["ip_address"]);
    const decodedLastSeen = decodeString(rawInput["last_seen"]);
    const decodedBrowserCount = decodeNumber(rawInput["browser_count"]);
    const decodedPromptsToday = decodeNumber(rawInput["prompts_today"]);
    const decodedTotalPrompts = decodeNumber(rawInput["total_prompts"]);
    const decodedRegisteredAt = decodeString(rawInput["registered_at"]);

    if (
      decodedId === null ||
      decodedHostname === null ||
      decodedStatus === null ||
      decodedOs === null ||
      decodedIpAddress === null ||
      decodedLastSeen === null ||
      decodedBrowserCount === null ||
      decodedPromptsToday === null ||
      decodedTotalPrompts === null
    ) {
      return null;
    }

    return {
      id: decodedId,
      hostname: decodedHostname,
      status: decodedStatus,
      os: decodedOs,
      ip_address: decodedIpAddress,
      last_seen: decodedLastSeen,
      browser_count: decodedBrowserCount,
      prompts_today: decodedPromptsToday,
      total_prompts: decodedTotalPrompts,
      registered_at: decodedRegisteredAt,
    };
  }
  return null;
}
/**
 * @type { StatusEnum }
 */
export type StatusEnum =
  | "active"
  | "inactive"
  | "warning"
  | "error"
  | "compliance";

export function decodeStatusEnum(rawInput: unknown): StatusEnum | null {
  switch (rawInput) {
    case "active":
    case "inactive":
    case "warning":
    case "error":
    case "compliance":
      return rawInput;
  }
  return null;
}

/**
 * @type { Prompt }
 */
export type Prompt = {
  /**
   * @type { string }
   * @memberof Prompt
   */
  id: string;
  /**
   * @type { string }
   * @memberof Prompt
   */
  device_id: string | null;
  /**
   * @type { string }
   * @memberof Prompt
   */
  site: string;
  /**
   * @type { string }
   * @memberof Prompt
   */
  prompt_text: string;
  /**
   * @type { number }
   * @memberof Prompt
   */
  timestamp: number;
  /**
   * @type { string }
   * @memberof Prompt
   */
  browser: string;
  /**
   * @type { boolean }
   * @memberof Prompt
   */
  is_flagged: boolean;
  /**
   * @type { string }
   * @memberof Prompt
   */
  url: string | null;
  /**
   * @type { string }
   * @memberof Prompt
   */
  username: string | null;
};

export function decodePrompt(rawInput: unknown): Prompt | null {
  if (isJSON(rawInput)) {
    const decodedId = decodeString(rawInput["id"]);
    const decodedDeviceId = decodeString(rawInput["device_id"]);
    const decodedSite = decodeString(rawInput["site"]);
    const decodedPromptText = decodeString(rawInput["prompt_text"]);
    const decodedTimestamp = decodeNumber(rawInput["timestamp"]);
    const decodedBrowser = decodeString(rawInput["browser"]);
    const decodedIsFlagged = decodeBoolean(rawInput["is_flagged"]);
    const decodedUrl = decodeString(rawInput["url"]);
    const decodedUsername = decodeString(rawInput["username"]);

    if (
      decodedId === null ||
      decodedSite === null ||
      decodedPromptText === null ||
      decodedTimestamp === null ||
      decodedBrowser === null ||
      decodedIsFlagged === null
    ) {
      return null;
    }

    return {
      id: decodedId,
      device_id: decodedDeviceId,
      site: decodedSite,
      prompt_text: decodedPromptText,
      timestamp: decodedTimestamp,
      browser: decodedBrowser,
      is_flagged: decodedIsFlagged,
      url: decodedUrl,
      username: decodedUsername,
    };
  }
  return null;
}

/**
 * @type { DeviceEvent }
 */
export type DeviceEvent = {
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  id: string;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  device_id: string | null;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  event_type: string;
  /**
   * @type { Severity }
   * @memberof DeviceEvent
   */
  severity: Severity;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  description: string;
  /**
   * @type { number }
   * @memberof DeviceEvent
   */
  timestamp: number;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  site: string | null;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  browser_name: string | null;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  profile_name: string | null;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  username: string | null;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  url: string | null;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  prompt: string | null;
  /**
   * @type { string }
   * @memberof DeviceEvent
   */
  hostname: string | null;
};

export function decodeDeviceEvent(rawInput: unknown): DeviceEvent | null {
  if (isJSON(rawInput)) {
    const decodedId = decodeString(rawInput["id"]);
    const decodedDeviceId = decodeString(rawInput["device_id"]);
    const decodedEventType = decodeString(rawInput["event_type"]);
    const decodedSeverity = decodeSeverity(rawInput["severity"]);
    const decodedDescription = decodeString(rawInput["description"]);
    const decodedTimestamp = decodeNumber(rawInput["timestamp"]);
    const decodedSite = decodeString(rawInput["site"]);
    const decodedBrowserName = decodeString(rawInput["browser_name"]);
    const decodedProfileName = decodeString(rawInput["profile_name"]);
    const decodedUsername = decodeString(rawInput["username"]);
    const decodedUrl = decodeString(rawInput["url"]);
    const decodedPrompt = decodeString(rawInput["prompt"]);
    const decodedHostname = decodeString(rawInput["hostname"]);

    if (
      decodedId === null ||
      decodedEventType === null ||
      decodedSeverity === null ||
      decodedDescription === null ||
      decodedTimestamp === null
    ) {
      return null;
    }

    return {
      id: decodedId,
      device_id: decodedDeviceId,
      event_type: decodedEventType,
      severity: decodedSeverity,
      description: decodedDescription,
      timestamp: decodedTimestamp,
      site: decodedSite,
      browser_name: decodedBrowserName,
      profile_name: decodedProfileName,
      username: decodedUsername,
      url: decodedUrl,
      prompt: decodedPrompt,
      hostname: decodedHostname,
    };
  }
  return null;
}

/**
 * @type { Alert }
 */
export type Alert = {
  /**
   * @type { string }
   * @memberof Alert
   */
  id: string;
  /**
   * @type { string }
   * @memberof Alert
   */
  device_id: string | null;
  /**
   * @type { string }
   * @memberof Alert
   */
  alert_type: string;
  /**
   * @type { SeverityEnum }
   * @memberof Alert
   */
  severity: SeverityEnum;
  /**
   * @type { string }
   * @memberof Alert
   */
  matched_pattern: string;
  /**
   * @type { number }
   * @memberof Alert
   */
  timestamp: number;
};

export function decodeAlert(rawInput: unknown): Alert | null {
  if (isJSON(rawInput)) {
    const decodedId = decodeString(rawInput["id"]);
    const decodedDeviceId = decodeString(rawInput["device_id"]);
    const decodedAlertType = decodeString(rawInput["alert_type"]);
    const decodedSeverity = decodeSeverityEnum(rawInput["severity"]);
    const decodedMatchedPattern = decodeString(rawInput["matched_pattern"]);
    const decodedTimestamp = decodeNumber(rawInput["timestamp"]);

    if (
      decodedId === null ||
      decodedAlertType === null ||
      decodedSeverity === null ||
      decodedMatchedPattern === null ||
      decodedTimestamp === null
    ) {
      return null;
    }

    return {
      id: decodedId,
      device_id: decodedDeviceId,
      alert_type: decodedAlertType,
      severity: decodedSeverity,
      matched_pattern: decodedMatchedPattern,
      timestamp: decodedTimestamp,
    };
  }
  return null;
}
/**
 * @type { SeverityEnum }
 */
export type SeverityEnum = "warning" | "critical";

export function decodeSeverityEnum(rawInput: unknown): SeverityEnum | null {
  switch (rawInput) {
    case "warning":
    case "critical":
      return rawInput;
  }
  return null;
}

/**
 * @type { BlockedPrompt }
 */
export type BlockedPrompt = {
  /**
   * @type { string }
   * @memberof BlockedPrompt
   */
  id: string;
  /**
   * @type { string }
   * @memberof BlockedPrompt
   */
  device_id: string;
  /**
   * @type { string }
   * @memberof BlockedPrompt
   */
  site: string;
  /**
   * @type { string }
   * @memberof BlockedPrompt
   */
  reason: string;
  /**
   * @type { string }
   * @memberof BlockedPrompt
   */
  timestamp: string;
};

export function decodeBlockedPrompt(rawInput: unknown): BlockedPrompt | null {
  if (isJSON(rawInput)) {
    const decodedId = decodeString(rawInput["id"]);
    const decodedDeviceId = decodeString(rawInput["device_id"]);
    const decodedSite = decodeString(rawInput["site"]);
    const decodedReason = decodeString(rawInput["reason"]);
    const decodedTimestamp = decodeString(rawInput["timestamp"]);

    if (
      decodedId === null ||
      decodedDeviceId === null ||
      decodedSite === null ||
      decodedReason === null ||
      decodedTimestamp === null
    ) {
      return null;
    }

    return {
      id: decodedId,
      device_id: decodedDeviceId,
      site: decodedSite,
      reason: decodedReason,
      timestamp: decodedTimestamp,
    };
  }
  return null;
}

/**
 * @type { DashboardStats }
 */
export type DashboardStats = {
  /**
   * @type { number }
   * @memberof DashboardStats
   */
  total_devices: number;
  /**
   * @type { number }
   * @memberof DashboardStats
   */
  active_devices: number;
  /**
   * @type { number }
   * @memberof DashboardStats
   */
  inactive_devices: number;
  /**
   * @type { number }
   * @memberof DashboardStats
   */
  prompts_today: number;
};

export function decodeDashboardStats(rawInput: unknown): DashboardStats | null {
  if (isJSON(rawInput)) {
    const decodedTotalDevices = decodeNumber(rawInput["total_devices"]);
    const decodedActiveDevices = decodeNumber(rawInput["active_devices"]);
    const decodedInactiveDevices = decodeNumber(rawInput["inactive_devices"]);
    const decodedPromptsToday = decodeNumber(rawInput["prompts_today"]);

    if (
      decodedTotalDevices === null ||
      decodedActiveDevices === null ||
      decodedInactiveDevices === null ||
      decodedPromptsToday === null
    ) {
      return null;
    }

    return {
      total_devices: decodedTotalDevices,
      active_devices: decodedActiveDevices,
      inactive_devices: decodedInactiveDevices,
      prompts_today: decodedPromptsToday,
    };
  }
  return null;
}
