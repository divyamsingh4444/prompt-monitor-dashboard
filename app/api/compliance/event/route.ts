import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ComplianceEventRequest, ComplianceEventResponse } from "@/types";
import { requireAuth, AuthError } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { handleApiError } from "@/lib/utils/server";

export async function POST(request: NextRequest) {
  try {
    // Authenticate using JWT token
    const { deviceId } = await requireAuth(request);

    const body: ComplianceEventRequest = await request.json();

    // Validate required fields
    if (!body.event_type || !body.severity || !body.detected_at) {
      return NextResponse.json(
        { error: "Missing required fields: event_type, severity, detected_at" },
        { status: 400 }
      );
    }

    // Validate severity
    const validSeverities = ["info", "warning", "critical"];
    if (!validSeverities.includes(body.severity)) {
      return NextResponse.json(
        { error: "Invalid severity. Must be: info, warning, or critical" },
        { status: 400 }
      );
    }

    // Generate an event ID
    const eventId = uuidv4();
    const now = new Date().toISOString();

    // Insert compliance event
    const { error: insertError } = await supabase
      .from("compliance_events")
      .insert({
        event_id: eventId,
        device_id: deviceId,
        instance_id: body.instance_id || null,
        event_type: body.event_type,
        severity: body.severity,
        detected_at: body.detected_at,
        reported_at: now,
        user_context: body.user_context || null,
        details: body.details || null,
        resolved: false,
        created_at: now,
      });

    if (insertError) throw insertError;

    const response: ComplianceEventResponse = {
      status: "reported",
      event_id: eventId,
      message: "Compliance event reported successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return handleApiError(error, "reporting compliance event");
  }
}
