import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { DeviceEvent } from "@/app/api/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("device_events")
      .select("*")
      .eq("device_id", id)
      .order("timestamp", { ascending: false });

    if (error) throw error;

    // Transform database events to frontend DeviceEvent type
    const events: DeviceEvent[] = (data || []).map((e: any) => {
      // Extract url and prompt from metadata JSONB if present
      const metadata = e.metadata || {};
      const url = e.url || metadata.url;
      const prompt = metadata.prompt;

      return {
        id: e.id,
        device_id: e.device_id,
        event_type: e.event_type || "unknown",
        severity: e.severity || "info",
        description: e.description || "",
        timestamp:
          e.timestamp || new Date(e.created_at || Date.now()).getTime(),
        site: e.site,
        browser_name: e.browser_name,
        profile_name: e.profile_name,
        username: e.username,
        url: url,
        prompt: prompt,
        hostname: undefined, // Not in schema
      };
    });

    // Calculate stats
    const stats = {
      total: events.length,
      critical: events.filter((e) => e.severity === "critical").length,
      warning: events.filter((e) => e.severity === "warning").length,
      info: events.filter((e) => e.severity === "info").length,
    };

    return NextResponse.json({ events, stats });
  } catch (error) {
    console.error("Error fetching device events:", error);
    return NextResponse.json(
      { error: "Failed to fetch device events" },
      { status: 500 }
    );
  }
}
