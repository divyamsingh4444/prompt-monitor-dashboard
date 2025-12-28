import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { BlockedPrompt, DatabaseComplianceEvent } from "@/types";
import { decodeComplianceEventDetails } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Use compliance_events table for blocked prompts
    // Filter for events that might represent blocked prompts
    const { data, error } = await supabase
      .from("compliance_events")
      .select("*")
      .eq("device_id", id)
      .order("detected_at", { ascending: false });

    if (error) throw error;

    // Transform compliance events to BlockedPrompt type
    const eventsList: DatabaseComplianceEvent[] = data || [];
    const blockedPrompts: BlockedPrompt[] = eventsList.map((ce) => {
      // Extract site from details JSONB if present using decoder
      const details = decodeComplianceEventDetails(ce.details);
      const site = details?.site ?? "Unknown";

      return {
        id: ce.event_id,
        device_id: ce.device_id,
        site: site,
        reason: details?.reason || ce.event_type || "Blocked",
        timestamp: ce.detected_at || ce.created_at || new Date().toISOString(),
      };
    });

    return NextResponse.json(blockedPrompts);
  } catch (error) {
    console.error("Error fetching blocked prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocked prompts" },
      { status: 500 },
    );
  }
}
