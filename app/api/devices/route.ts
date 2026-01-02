import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Device, PromptCount, DatabaseDevice } from "@/types";
import { decodeStringArray } from "@/lib/utils/decoders";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    // Get all devices
    const { data: devicesData, error: devicesError } = await supabase
      .from("devices")
      .select("*");

    if (devicesError) throw devicesError;

    // Get prompts counts for today and total for each device
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const { data: promptsData, error: promptsError } = await supabase
      .from("prompts")
      .select("device_id, timestamp");

    if (promptsError) throw promptsError;

    // Calculate prompts counts per device
    const promptsCounts = new Map<string, { today: number; total: number }>();
    if (promptsData) {
      promptsData.forEach((p: PromptCount) => {
        if (!p.device_id) return;
        const counts = promptsCounts.get(p.device_id) || { today: 0, total: 0 };
        counts.total++;
        // Convert timestamp to number if it's a string (Supabase bigint can come as string)
        const timestamp =
          typeof p.timestamp === "string"
            ? parseInt(p.timestamp, 10)
            : p.timestamp;
        if (
          timestamp &&
          typeof timestamp === "number" &&
          timestamp >= todayTimestamp
        ) {
          counts.today++;
        }
        promptsCounts.set(p.device_id, counts);
      });
    }

    // Transform database devices to frontend Device type
    const devicesList: DatabaseDevice[] = devicesData || [];
    let devices: Device[] = devicesList.map((d) => {
      // Determine status based on last_heartbeat (active if within last 5 minutes)
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      const lastHeartbeat = d.last_heartbeat
        ? new Date(d.last_heartbeat)
        : null;
      const isActive = lastHeartbeat && lastHeartbeat >= fiveMinutesAgo;
      const deviceStatus = isActive ? "active" : "inactive";

      // Extract IP from JSONB array using decoder
      const ips = decodeStringArray(d.ips);
      const ipAddress = ips && ips.length > 0 ? ips[0] : "N/A";

      // Count browsers from JSONB array using decoder
      const browsers = decodeStringArray(d.browsers);
      const browserCount = browsers ? browsers.length : 0;

      // Get prompts counts
      const counts = promptsCounts.get(d.device_id) || { today: 0, total: 0 };

      return {
        id: d.device_id,
        hostname: d.hostname || "Unknown",
        status: deviceStatus,
        os: d.os || "Unknown",
        ip_address: ipAddress,
        last_seen: d.last_heartbeat || new Date().toISOString(),
        browser_count: browserCount,
        prompts_today: counts.today,
        total_prompts: counts.total,
        registered_at: d.registered_at, // Keep for sorting
      };
    });

    // Sort by registered_at descending (newest first)
    devices.sort((a, b) => {
      const dateA = a.registered_at ? new Date(a.registered_at).getTime() : 0;
      const dateB = b.registered_at ? new Date(b.registered_at).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });

    // Apply status filter if provided
    if (status) {
      devices = devices.filter((d) => d.status === status);
    }

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      devices = devices.filter(
        (d) =>
          d.hostname.toLowerCase().includes(searchLower) ||
          d.id.toLowerCase().includes(searchLower) ||
          d.ip_address.includes(search)
      );
    }

    return NextResponse.json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json(
      { error: "Failed to fetch devices" },
      { status: 500 }
    );
  }
}
