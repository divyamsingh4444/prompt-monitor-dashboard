import { isJSON, decodeString, decodeNumber } from "type-decoder";

/**
 * @type { DeviceEventMetadata }
 */
export type DeviceEventMetadata = {
  /**
   * @type { string }
   * @memberof DeviceEventMetadata
   */
  url: string | null;
  /**
   * @type { string }
   * @memberof DeviceEventMetadata
   */
  prompt: string | null;
};

export function decodeDeviceEventMetadata(
  rawInput: unknown,
): DeviceEventMetadata | null {
  if (isJSON(rawInput)) {
    const decodedUrl = decodeString(rawInput["url"]);
    const decodedPrompt = decodeString(rawInput["prompt"]);

    return {
      url: decodedUrl,
      prompt: decodedPrompt,
    };
  }
  return null;
}

/**
 * @type { ComplianceEventDetails }
 */
export type ComplianceEventDetails = {
  /**
   * @type { string }
   * @memberof ComplianceEventDetails
   */
  site: string | null;
  /**
   * @type { string }
   * @memberof ComplianceEventDetails
   */
  reason: string | null;
};

export function decodeComplianceEventDetails(
  rawInput: unknown,
): ComplianceEventDetails | null {
  if (isJSON(rawInput)) {
    const decodedSite = decodeString(rawInput["site"]);
    const decodedReason = decodeString(rawInput["reason"]);

    return {
      site: decodedSite,
      reason: decodedReason,
    };
  }
  return null;
}

/**
 * @type { Severity }
 */
export type Severity = "info" | "warning" | "critical";

export function decodeSeverity(rawInput: unknown): Severity | null {
  switch (rawInput) {
    case "info":
    case "warning":
    case "critical":
      return rawInput;
  }
  return null;
}

/**
 * @type { SupabaseError }
 */
export type SupabaseError = {
  /**
   * @type { string }
   * @memberof SupabaseError
   */
  code: string | null;
  /**
   * @type { string }
   * @memberof SupabaseError
   */
  message: string | null;
};

export function decodeSupabaseError(rawInput: unknown): SupabaseError | null {
  if (isJSON(rawInput)) {
    const decodedCode = decodeString(rawInput["code"]);
    const decodedMessage = decodeString(rawInput["message"]);

    return {
      code: decodedCode,
      message: decodedMessage,
    };
  }
  return null;
}

/**
 * @type { PromptCount }
 */
export type PromptCount = {
  /**
   * @type { string }
   * @memberof PromptCount
   */
  device_id: string | null;
  /**
   * @type { number }
   * @memberof PromptCount
   */
  timestamp: number | null;
};

export function decodePromptCount(rawInput: unknown): PromptCount | null {
  if (isJSON(rawInput)) {
    const decodedDeviceId = decodeString(rawInput["device_id"]);
    const decodedTimestamp = decodeNumber(rawInput["timestamp"]);

    return {
      device_id: decodedDeviceId,
      timestamp: decodedTimestamp,
    };
  }
  return null;
}
