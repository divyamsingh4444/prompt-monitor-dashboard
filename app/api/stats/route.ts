import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleApiError } from "@/lib/utils/server";

export async function GET() {
  try {
    // Get total devices count
    const { count: totalDevices, error: devicesError } = await supabase
      .from("devices")
      .select("*", { count: "exact", head: true });

    if (devicesError) throw devicesError;

    // Get active devices (devices with heartbeat in last 5 minutes)
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const { count: activeDevices, error: activeError } = await supabase
      .from("devices")
      .select("*", { count: "exact", head: true })
      .gte("last_heartbeat", fiveMinutesAgo.toISOString());

    if (activeError) throw activeError;

    // Get inactive devices
    const inactiveDevices = (totalDevices || 0) - (activeDevices || 0);

    // Get prompts today (count prompts from today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    // Count prompts where timestamp >= today's midnight
    // Note: timestamp is stored as bigint (milliseconds since epoch)
    const { count: promptsToday, error: promptsError } = await supabase
      .from("prompts")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", todayTimestamp.toString());

    if (promptsError) throw promptsError;

    return NextResponse.json({
      total_devices: totalDevices || 0,
      active_devices: activeDevices || 0,
      inactive_devices: inactiveDevices,
      prompts_today: promptsToday || 0,
    });
  } catch (error) {
    return handleApiError(error, "fetching dashboard stats");
  }
}
