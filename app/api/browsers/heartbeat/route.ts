import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type {
  BrowserHeartbeatRequest,
  BrowserHeartbeatResponse,
} from "@/types";
import { requireAuth, AuthError } from "@/lib/auth";
import { handleApiError } from "@/lib/utils/server";

export async function POST(request: NextRequest) {
  try {
    // Authenticate using JWT token
    await requireAuth(request);

    const body: BrowserHeartbeatRequest = await request.json();

    // Validate required fields
    if (!body.instance_id) {
      return NextResponse.json(
        { error: "Missing required field: instance_id" },
        { status: 400 }
      );
    }

    // Check if browser instance exists
    const { data: existingInstance, error: checkError } = await supabase
      .from("browser_instances")
      .select("instance_id")
      .eq("instance_id", body.instance_id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (!existingInstance) {
      return NextResponse.json(
        { error: "Browser instance not registered" },
        { status: 404 }
      );
    }

    // Update last_seen timestamp
    const { error: updateError } = await supabase
      .from("browser_instances")
      .update({
        last_seen: new Date().toISOString(),
      })
      .eq("instance_id", body.instance_id);

    if (updateError) throw updateError;

    const response: BrowserHeartbeatResponse = {
      status: "ok",
      instance_id: body.instance_id,
      message: "Browser heartbeat recorded",
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return handleApiError(error, "recording browser heartbeat");
  }
}
