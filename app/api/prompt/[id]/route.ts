import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Prompt } from "@/types";
import { handleApiError } from "@/lib/utils/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    // Transform database prompt to frontend Prompt type
    const prompt: Prompt = {
      id: data.id,
      device_id: data.device_id ?? null,
      site: data.site || "Unknown",
      prompt_text: data.prompt || "",
      timestamp:
        data.timestamp || new Date(data.created_at || Date.now()).getTime(),
      browser: data.browser_name || "",
      is_flagged: false, // Not in schema
      url: data.url ?? null,
      username: data.username ?? null,
    };

    return NextResponse.json(prompt);
  } catch (error) {
    return handleApiError(error, "fetching prompt");
  }
}
