import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { DatabaseDeviceEvent } from "@/types";
import { DeviceEvent } from "@/src/generated/api";
import { decodeDeviceEventMetadata, decodeSeverity } from "@/types";
import { handleApiError } from "@/lib/utils/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
    const eventsList: DatabaseDeviceEvent[] = data || [];
    const events: DeviceEvent[] = eventsList.map((e) => {
      // Extract url and prompt from metadata JSONB if present using decoder
      const metadata = decodeDeviceEventMetadata(e.metadata);
      const url = metadata?.url ?? null;
      const prompt = metadata?.prompt ?? null;

      // Decode severity with fallback to "info"
      const decodedSeverity = decodeSeverity(e.severity);
      const severityValue = decodedSeverity ?? "info";
      // Map to generated enum
      const severity =
        severityValue === "critical"
          ? DeviceEvent.severity.CRITICAL
          : severityValue === "warning"
            ? DeviceEvent.severity.WARNING
            : DeviceEvent.severity.INFO;

      return {
        id: e.id,
        device_id: e.device_id,
        event_type: e.event_type || "unknown",
        severity,
        description: e.description || "",
        timestamp:
          e.timestamp || new Date(e.created_at || Date.now()).getTime(),
        site: e.site ?? null,
        browser_name: e.browser_name ?? null,
        profile_name: e.profile_name ?? null,
        username: e.username ?? null,
        url: url ?? null,
        prompt: prompt ?? null,
        hostname: null, // Not in schema
      };
    });

    // Calculate stats
    const stats = {
      total: events.length,
      critical: events.filter(
        (e) => e.severity === DeviceEvent.severity.CRITICAL,
      ).length,
      warning: events.filter((e) => e.severity === DeviceEvent.severity.WARNING)
        .length,
      info: events.filter((e) => e.severity === DeviceEvent.severity.INFO)
        .length,
    };

    return NextResponse.json({ events, stats });
  } catch (error) {
    return handleApiError(error, "fetching device events");
  }
}
