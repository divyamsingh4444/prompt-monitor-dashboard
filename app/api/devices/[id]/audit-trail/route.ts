import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type {
  DatabaseDeviceEvent,
  DatabasePrompt,
  DatabaseComplianceEvent,
} from "@/types";
import {
  AuditTrailItem,
  decodeDeviceEventMetadata,
  decodeSeverity,
  decodeComplianceEventDetails,
} from "@/types";
import { handleApiError } from "@/lib/utils/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Query all sources in parallel
    const [
      deviceEventsResult,
      promptsResult,
      complianceEventsResult,
      browserInstancesResult,
    ] = await Promise.all([
      supabase
        .from("device_events")
        .select("*")
        .eq("device_id", id)
        .order("timestamp", { ascending: false }),
      supabase
        .from("prompts")
        .select("*")
        .eq("device_id", id)
        .order("timestamp", { ascending: false }),
      supabase
        .from("compliance_events")
        .select("*")
        .eq("device_id", id)
        .order("detected_at", { ascending: false }),
      supabase
        .from("browser_instances")
        .select("*")
        .eq("device_id", id)
        .order("discovered_at", { ascending: false }),
    ]);

    if (deviceEventsResult.error) throw deviceEventsResult.error;
    if (promptsResult.error) throw promptsResult.error;
    if (complianceEventsResult.error) throw complianceEventsResult.error;
    if (browserInstancesResult.error) throw browserInstancesResult.error;

    const auditTrail: AuditTrailItem[] = [];

    // Convert device_events to audit trail items
    const deviceEvents: DatabaseDeviceEvent[] = deviceEventsResult.data || [];
    for (const e of deviceEvents) {
      const metadata = decodeDeviceEventMetadata(e.metadata);
      const decodedSeverity = decodeSeverity(e.severity);
      const severityValue = decodedSeverity ?? "info";

      auditTrail.push({
        id: `device-event-${e.id}`,
        type: AuditTrailItem.type.DEVICE_EVENT,
        timestamp:
          e.timestamp || new Date(e.created_at || Date.now()).getTime(),
        severity: severityValue as AuditTrailItem.severity,
        event_type: e.event_type || "unknown",
        device_id: e.device_id,
        description: e.description || null,
        site: e.site ?? null,
        browser_name: e.browser_name ?? null,
        profile_name: e.profile_name ?? null,
        username: e.username ?? null,
        url: metadata?.url ?? null,
        prompt: metadata?.prompt ?? null,
        hostname: null,
      });
    }

    // Convert prompts to audit trail items
    const prompts: DatabasePrompt[] = promptsResult.data || [];
    for (const p of prompts) {
      auditTrail.push({
        id: `prompt-${p.id}`,
        type: AuditTrailItem.type.PROMPT,
        timestamp:
          p.timestamp || new Date(p.created_at || Date.now()).getTime(),
        event_type: "prompt",
        device_id: p.device_id ?? null,
        site: p.site || "Unknown",
        browser_name: p.browser_name ?? null,
        profile_name: p.profile_name ?? null,
        username: p.username ?? null,
        url: p.url ?? null,
        prompt_text: p.prompt || "",
        is_flagged: false,
        instance_id: p.instance_id ?? null,
      });
    }

    // Convert compliance_events to audit trail items
    const complianceEvents: DatabaseComplianceEvent[] =
      complianceEventsResult.data || [];
    for (const ce of complianceEvents) {
      const details = decodeComplianceEventDetails(ce.details);
      const decodedSeverity = decodeSeverity(ce.severity);
      const severityValue = decodedSeverity ?? "info";

      // Convert detected_at timestamp to milliseconds
      const timestamp = ce.detected_at
        ? new Date(ce.detected_at).getTime()
        : ce.created_at
        ? new Date(ce.created_at).getTime()
        : Date.now();

      auditTrail.push({
        id: `compliance-event-${ce.event_id}`,
        type: AuditTrailItem.type.COMPLIANCE_EVENT,
        timestamp,
        severity: severityValue as AuditTrailItem.severity,
        event_type: ce.event_type || "compliance",
        device_id: ce.device_id,
        event_id: ce.event_id,
        detected_at: ce.detected_at || undefined,
        user_context: ce.user_context ?? null,
        details: (ce.details as Record<string, any>) || null,
        resolved: ce.resolved ?? false,
        reason: details?.reason || ce.event_type || "Compliance event",
        site: details?.site ?? null,
        instance_id: ce.instance_id ?? null,
      });
    }

    // Convert browser_instances to audit trail items (registration events)
    const browserInstances = browserInstancesResult.data || [];
    for (const bi of browserInstances) {
      // Create event for browser discovery/registration
      const discoveredTimestamp = bi.discovered_at
        ? new Date(bi.discovered_at).getTime()
        : Date.now();

      auditTrail.push({
        id: `browser-${bi.instance_id}`,
        type: AuditTrailItem.type.BROWSER_EVENT,
        timestamp: discoveredTimestamp,
        event_type: "browser_registered",
        device_id: bi.device_id,
        instance_id: bi.instance_id,
        browser_name: bi.browser_name,
        browser_version: bi.browser_version ?? null,
        profile_name: bi.profile_name,
        description: `Browser ${bi.browser_name} (${bi.profile_name}) registered`,
      });
    }

    // Sort by timestamp descending (newest first)
    auditTrail.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(auditTrail);
  } catch (error) {
    return handleApiError(error, "fetching device audit trail");
  }
}
