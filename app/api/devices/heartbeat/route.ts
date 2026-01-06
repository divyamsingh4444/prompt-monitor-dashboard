import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { HeartbeatRequest, HeartbeatResponse } from "@/types";
import { requireAuth, AuthError } from "@/lib/auth";
import { handleApiError } from "@/lib/utils/server";

export async function POST(request: NextRequest) {
  try {
    // Authenticate using JWT token
    const { deviceId } = await requireAuth(request);

    // Parse optional body for metadata
    let deviceMetadata: HeartbeatRequest["device_metadata"] = undefined;
    try {
      const body: HeartbeatRequest = await request.json();
      deviceMetadata = body.device_metadata;
    } catch {
      // Body is optional for heartbeat
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      last_heartbeat: new Date().toISOString(),
    };

    // Add optional metadata updates
    if (deviceMetadata) {
      if (deviceMetadata.hostname) {
        updateData.hostname = deviceMetadata.hostname;
      }
      if (deviceMetadata.ips) {
        updateData.ips = deviceMetadata.ips;
      }
      if (deviceMetadata.macs) {
        updateData.macs = deviceMetadata.macs;
      }
      if (deviceMetadata.os) {
        updateData.os = deviceMetadata.os;
      }
    }

    // Update device
    const { error: updateError } = await supabase
      .from("devices")
      .update(updateData)
      .eq("device_id", deviceId);

    if (updateError) throw updateError;

    const response: HeartbeatResponse = {
      status: "ok",
      device_id: deviceId,
      message: "Heartbeat recorded",
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return handleApiError(error, "recording heartbeat");
  }
}
