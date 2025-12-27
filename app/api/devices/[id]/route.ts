import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Device } from "@/app/api/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("device_id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Device not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    // Calculate prompts counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const { data: promptsData, error: promptsError } = await supabase
      .from("prompts")
      .select("timestamp")
      .eq("device_id", id);

    if (promptsError) throw promptsError;

    // Convert timestamps to numbers if they're strings (Supabase bigint can come as string)
    const promptsToday =
      promptsData?.filter((p: any) => {
        const timestamp =
          typeof p.timestamp === "string"
            ? parseInt(p.timestamp, 10)
            : p.timestamp;
        return timestamp && timestamp >= todayTimestamp;
      }).length || 0;
    const totalPrompts = promptsData?.length || 0;

    // Determine status based on last_heartbeat
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    const lastHeartbeat = data.last_heartbeat
      ? new Date(data.last_heartbeat)
      : null;
    const isActive = lastHeartbeat && lastHeartbeat >= fiveMinutesAgo;
    const deviceStatus = isActive ? "active" : "inactive";

    // Extract IP from JSONB array
    const ipAddress =
      Array.isArray(data.ips) && data.ips.length > 0 ? data.ips[0] : "N/A";

    // Count browsers from JSONB array
    const browserCount = Array.isArray(data.browsers)
      ? data.browsers.length
      : 0;

    // Transform database device to frontend Device type
    const device: Device = {
      id: data.device_id,
      hostname: data.hostname || "Unknown",
      status: deviceStatus,
      os: data.os || "Unknown",
      ip_address: ipAddress,
      last_seen: data.last_heartbeat || new Date().toISOString(),
      browser_count: browserCount,
      prompts_today: promptsToday,
      total_prompts: totalPrompts,
    };

    return NextResponse.json(device);
  } catch (error) {
    console.error("Error fetching device:", error);
    return NextResponse.json(
      { error: "Failed to fetch device" },
      { status: 500 }
    );
  }
}
