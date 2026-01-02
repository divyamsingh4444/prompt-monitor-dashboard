import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CapturePromptRequest, CapturePromptResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: CapturePromptRequest = await request.json();

    // Validate required fields
    if (
      !body.id ||
      !body.site ||
      !body.url ||
      !body.prompt ||
      !body.timestamp
    ) {
      return NextResponse.json(
        { error: "Missing required fields: id, site, url, prompt, timestamp" },
        { status: 400 },
      );
    }

    // For now, we need to get device_id from somewhere
    // In the old backend, it comes from the JWT token
    // We'll need to add a way to identify the device
    // For now, accept device_id in the body or headers
    let deviceId = request.headers.get("X-Device-ID");

    // Also check if there's an instance_id we can use to look up the device
    if (!deviceId && body.instance_id) {
      // Look up device_id from browser_instances table
      const { data: browserInstance } = await supabase
        .from("browser_instances")
        .select("device_id")
        .eq("instance_id", body.instance_id)
        .single();

      if (browserInstance) {
        deviceId = browserInstance.device_id;
      }
    }

    // Insert the prompt
    const { error: insertError } = await supabase.from("prompts").insert({
      id: body.id,
      device_id: deviceId || null,
      site: body.site,
      url: body.url,
      prompt: body.prompt,
      timestamp: body.timestamp,
      selector: body.selector || null,
      conversation_id: body.conversation_id || null,
      trigger: body.trigger || null,
      page_title: body.page_title || null,
      browser_name: body.browser_name || "Chrome",
      browser_version: body.browser_version || null,
      profile_name: body.profile_name || null,
      username: body.username || "Unknown",
      agent_status: body.agent_status || "unknown",
      instance_id: body.instance_id || null,
      extension_version: body.extension_version || null,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      // Check for duplicate key error
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Prompt already exists" },
          { status: 409 },
        );
      }
      throw insertError;
    }

    const response: CapturePromptResponse = {
      status: "captured",
      prompt_id: body.id,
      message: "Prompt captured successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Prompt capture failed:", error);
    return NextResponse.json(
      { error: "Prompt capture failed" },
      { status: 500 },
    );
  }
}
