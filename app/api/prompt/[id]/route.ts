import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Prompt } from "@/app/api/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Prompt not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    // Transform database prompt to frontend Prompt type
    const prompt: Prompt = {
      id: data.id,
      device_id: data.device_id,
      site: data.site || "Unknown",
      prompt_text: data.prompt || "",
      timestamp:
        data.timestamp || new Date(data.created_at || Date.now()).getTime(),
      browser: data.browser_name || "",
      is_flagged: false, // Not in schema
      url: data.url,
      username: data.username,
    };

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500 }
    );
  }
}
