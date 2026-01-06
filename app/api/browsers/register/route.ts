import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { RegisterBrowserRequest, RegisterBrowserResponse } from "@/types";
import { requireAuth, AuthError } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { handleApiError } from "@/lib/utils/server";

export async function POST(request: NextRequest) {
  try {
    // Authenticate using JWT token
    const { deviceId } = await requireAuth(request);

    const body: RegisterBrowserRequest = await request.json();

    // Validate required fields
    if (!body.instance_id || !body.browser_name || !body.profile_name) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: instance_id, browser_name, profile_name",
        },
        { status: 400 }
      );
    }

    // Check if browser instance exists
    const { data: existingInstance, error: checkError } = await supabase
      .from("browser_instances")
      .select("instance_id")
      .eq("device_id", deviceId)
      .eq("browser_name", body.browser_name)
      .eq("profile_name", body.profile_name)
      .single();

    const now = new Date().toISOString();

    if (existingInstance) {
      // Update existing browser instance
      const { error: updateError } = await supabase
        .from("browser_instances")
        .update({
          browser_version: body.browser_version || null,
          profile_path: body.profile_path || null,
          extension_id: body.extension_id || null,
          extension_version: body.extension_version || null,
          last_seen: now,
        })
        .eq("device_id", deviceId)
        .eq("browser_name", body.browser_name)
        .eq("profile_name", body.profile_name);

      if (updateError) throw updateError;

      // Create device event for browser update
      const eventId = uuidv4();
      const eventTimestamp = Date.now();
      await supabase.from("device_events").insert({
        id: eventId,
        device_id: deviceId,
        event_type: "browser_updated",
        timestamp: eventTimestamp,
        severity: "info",
        description: `Browser ${body.browser_name} (${body.profile_name}) updated`,
        browser_name: body.browser_name,
        profile_name: body.profile_name,
        metadata: {
          instance_id: existingInstance.instance_id,
          browser_version: body.browser_version,
          extension_version: body.extension_version,
        },
      });

      // Return the existing instance_id
      const response: RegisterBrowserResponse = {
        status: "registered",
        instance_id: existingInstance.instance_id,
        message: "Browser instance updated successfully",
      };

      return NextResponse.json(response);
    } else {
      // Insert new browser instance
      const { error: insertError } = await supabase
        .from("browser_instances")
        .insert({
          instance_id: body.instance_id,
          device_id: deviceId,
          browser_name: body.browser_name,
          browser_version: body.browser_version || null,
          profile_name: body.profile_name,
          profile_path: body.profile_path || null,
          extension_id: body.extension_id || null,
          extension_version: body.extension_version || null,
          discovered_at: now,
          last_seen: now,
        });

      if (insertError) {
        // If it's a duplicate key error, try to get existing record
        if (insertError.code === "23505") {
          // Race condition - another request created it, fetch and return it
          const { data: raceInstance } = await supabase
            .from("browser_instances")
            .select("instance_id")
            .eq("device_id", deviceId)
            .eq("browser_name", body.browser_name)
            .eq("profile_name", body.profile_name)
            .single();

          if (raceInstance) {
            const response: RegisterBrowserResponse = {
              status: "registered",
              instance_id: raceInstance.instance_id,
              message: "Browser instance already registered",
            };
            return NextResponse.json(response);
          }
        }
        throw insertError;
      }

      // Create device event for browser registration
      const eventId = uuidv4();
      const eventTimestamp = Date.now();
      await supabase.from("device_events").insert({
        id: eventId,
        device_id: deviceId,
        event_type: "browser_registered",
        timestamp: eventTimestamp,
        severity: "info",
        description: `Browser ${body.browser_name} (${body.profile_name}) registered`,
        browser_name: body.browser_name,
        profile_name: body.profile_name,
        metadata: {
          instance_id: body.instance_id,
          browser_version: body.browser_version,
          extension_version: body.extension_version,
        },
      });
    }

    // Return response for new registration
    const response: RegisterBrowserResponse = {
      status: "registered",
      instance_id: body.instance_id,
      message: "Browser instance registered successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return handleApiError(error, "registering browser");
  }
}
