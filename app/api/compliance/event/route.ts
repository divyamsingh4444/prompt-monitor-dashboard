import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ComplianceEventRequest, ComplianceEventResponse } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body: ComplianceEventRequest = await request.json();

    // Validate required fields
    if (!body.event_type || !body.severity || !body.detected_at) {
      return NextResponse.json(
        { error: "Missing required fields: event_type, severity, detected_at" },
        { status: 400 },
      );
    }

    // Validate severity
    const validSeverities = ["info", "warning", "critical"];
    if (!validSeverities.includes(body.severity)) {
      return NextResponse.json(
        { error: "Invalid severity. Must be: info, warning, or critical" },
        { status: 400 },
      );
    }

    // Get device_id from header (temporary until auth is implemented)
    const deviceId = request.headers.get("X-Device-ID");
    if (!deviceId) {
      return NextResponse.json(
        { error: "Missing X-Device-ID header" },
        { status: 400 },
      );
    }

    // Check if device exists
    const { data: existingDevice } = await supabase
      .from("devices")
      .select("device_id")
      .eq("device_id", deviceId)
      .single();

    if (!existingDevice) {
      return NextResponse.json(
        { error: "Device not registered" },
        { status: 404 },
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
    console.error("Compliance event report failed:", error);
    return NextResponse.json(
      { error: "Compliance event report failed" },
      { status: 500 },
    );
  }
}
