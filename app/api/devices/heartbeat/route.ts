import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { HeartbeatRequest, HeartbeatResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: HeartbeatRequest = await request.json();

    // Validate required fields
    if (!body.device_id) {
      return NextResponse.json(
        { error: "Missing required field: device_id" },
        { status: 400 },
      );
    }

    const deviceId = body.device_id;
    const deviceMetadata = body.device_metadata;

    // Check if device exists
    const { data: existingDevice, error: checkError } = await supabase
      .from("devices")
      .select("device_id")
      .eq("device_id", deviceId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (!existingDevice) {
      return NextResponse.json(
        { error: "Device not registered" },
        { status: 404 },
      );
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
    console.error("Heartbeat failed:", error);
    return NextResponse.json({ error: "Heartbeat failed" }, { status: 500 });
  }
}
