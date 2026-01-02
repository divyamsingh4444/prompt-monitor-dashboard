import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ExtensionStatusRequest, ExtensionStatusResponse } from "@/types";
import { requireAuth, AuthError } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Authenticate using JWT token
    await requireAuth(request);

    const body: ExtensionStatusRequest = await request.json();

    // Validate required fields
    if (!body.instance_id || !body.status) {
      return NextResponse.json(
        { error: "Missing required fields: instance_id, status" },
        { status: 400 },
      );
    }

    // Check if browser instance exists
    const { data: existingInstance } = await supabase
      .from("browser_instances")
      .select("instance_id")
      .eq("instance_id", body.instance_id)
      .single();

    if (!existingInstance) {
      return NextResponse.json(
        { error: "Browser instance not registered" },
        { status: 404 },
      );
    }

    // Generate a status ID
    const statusId = uuidv4();
    const now = new Date().toISOString();

    // Insert extension status record
    const { error: insertError } = await supabase
      .from("extension_status")
      .insert({
        status_id: statusId,
        instance_id: body.instance_id,
        status: body.status,
        reported_at: now,
        reported_by: body.reported_by || null,
        metadata: body.metadata || null,
        created_at: now,
      });

    if (insertError) throw insertError;

    const response: ExtensionStatusResponse = {
      status: "reported",
      status_id: statusId,
      message: "Extension status reported successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Extension status report failed:", error);
    return NextResponse.json(
      { error: "Extension status report failed" },
      { status: 500 },
    );
  }
}
