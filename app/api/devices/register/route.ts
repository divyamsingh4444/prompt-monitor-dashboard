import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { RegisterDeviceRequest, RegisterDeviceResponse } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { handleApiError } from "@/lib/utils/server";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterDeviceRequest = await request.json();

    // Validate required fields
    if (!body.device_id || !body.public_key_pem || !body.hostname) {
      return NextResponse.json(
        {
          error: "Missing required fields: device_id, public_key_pem, hostname",
        },
        { status: 400 }
      );
    }

    // Check if device exists
    const { data: existingDevice } = await supabase
      .from("devices")
      .select("device_id")
      .eq("device_id", body.device_id)
      .single();

    const isNewRegistration = !existingDevice;

    if (existingDevice) {
      // Update existing device
      const { error: updateError } = await supabase
        .from("devices")
        .update({
          public_key_pem: body.public_key_pem,
          hostname: body.hostname,
          macs: body.macs || [],
          ips: body.ips || [],
          os: body.os || "",
          browsers: body.browsers || [],
          last_heartbeat: new Date().toISOString(),
        })
        .eq("device_id", body.device_id);

      if (updateError) throw updateError;
    } else {
      // Insert new device
      const { error: insertError } = await supabase.from("devices").insert({
        device_id: body.device_id,
        public_key_pem: body.public_key_pem,
        hostname: body.hostname,
        macs: body.macs || [],
        ips: body.ips || [],
        os: body.os || "",
        browsers: body.browsers || [],
        last_heartbeat: new Date().toISOString(),
        registered_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;
    }

    // Log registration event to device_events
    const eventId = uuidv4();
    const eventTimestamp = Date.now();
    const eventType = isNewRegistration ? "registration" : "update";
    const description = `Device ${
      isNewRegistration ? "registered" : "updated"
    } - Hostname: ${body.hostname} | OS: ${
      body.os || "Unknown"
    } | IPs: ${JSON.stringify(body.ips || [])} | Browsers: ${JSON.stringify(
      body.browsers || []
    )}`;

    const { error: eventError } = await supabase.from("device_events").insert({
      id: eventId,
      device_id: body.device_id,
      event_type: eventType,
      timestamp: eventTimestamp,
      severity: "info",
      description: description,
      metadata: {
        hostname: body.hostname,
        os: body.os || "",
        ips: body.ips || [],
        macs: body.macs || [],
        browsers: body.browsers || [],
      },
    });

    if (eventError) {
      console.warn("Failed to log device event:", eventError);
      // Don't fail the registration if event logging fails
    }

    const response: RegisterDeviceResponse = {
      status: "registered",
      device_id: body.device_id,
      message: "Device registered successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error, "registering device");
  }
}
