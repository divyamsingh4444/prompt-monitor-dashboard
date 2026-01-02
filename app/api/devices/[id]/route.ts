import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Device, PromptCount, DatabaseDevice } from "@/types";
import { DeviceStatus, decodeSupabaseError } from "@/types";
import { decodeStringArray } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("device_id", id)
      .single();

    if (error) {
      const decodedError = decodeSupabaseError(error);
      if (decodedError && decodedError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Device not found" },
          { status: 404 },
        );
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const deviceData: DatabaseDevice = data;

    // Calculate prompts counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const { data: promptsData, error: promptsError } = await supabase
      .from("prompts")
      .select("device_id, timestamp")
      .eq("device_id", id);

    if (promptsError) throw promptsError;

    // Convert timestamps to numbers if they're strings (Supabase bigint can come as string)
    const promptsList: PromptCount[] = promptsData || [];
    const promptsToday = promptsList.filter((p) => {
      const timestamp =
        typeof p.timestamp === "string"
          ? parseInt(p.timestamp, 10)
          : p.timestamp;
      return (
        timestamp &&
        typeof timestamp === "number" &&
        timestamp >= todayTimestamp
      );
    }).length;
    const totalPrompts = promptsList.length;

    // Determine status based on last_heartbeat
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    const lastHeartbeat = deviceData.last_heartbeat
      ? new Date(deviceData.last_heartbeat)
      : null;
    const isActive = lastHeartbeat && lastHeartbeat >= fiveMinutesAgo;
    const deviceStatus = isActive ? DeviceStatus.ACTIVE : DeviceStatus.INACTIVE;

    // Extract IP from JSONB array using decoder
    const ips = decodeStringArray(deviceData.ips);
    const ipAddress = ips && ips.length > 0 ? ips[0] : "N/A";

    // Count browsers from JSONB array using decoder
    const browsers = decodeStringArray(deviceData.browsers);
    const browserCount = browsers ? browsers.length : 0;

    // Transform database device to frontend Device type
    const device: Device = {
      id: deviceData.device_id,
      hostname: deviceData.hostname || "Unknown",
      status: deviceStatus,
      os: deviceData.os || "Unknown",
      ip_address: ipAddress,
      last_seen: deviceData.last_heartbeat || new Date().toISOString(),
      browser_count: browserCount,
      prompts_today: promptsToday,
      total_prompts: totalPrompts,
      registered_at: deviceData.registered_at ?? null,
    };

    return NextResponse.json(device);
  } catch (error) {
    console.error("Error fetching device:", error);
    return NextResponse.json(
      { error: "Failed to fetch device" },
      { status: 500 },
    );
  }
}
