import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Prompt, DatabasePrompt } from "@/types";
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
      .eq("device_id", id)
      .order("timestamp", { ascending: false });

    if (error) throw error;

    // Transform database prompts to frontend Prompt type
    const promptsList: DatabasePrompt[] = data || [];
    const prompts: Prompt[] = promptsList.map((p) => ({
      id: p.id,
      device_id: p.device_id ?? null,
      site: p.site || "Unknown",
      prompt_text: p.prompt || "",
      timestamp: p.timestamp || new Date(p.created_at || Date.now()).getTime(),
      browser: p.browser_name || "",
      is_flagged: false, // Not in schema, default to false
      url: p.url ?? null,
      username: p.username ?? null,
    }));

    return NextResponse.json(prompts);
  } catch (error) {
    return handleApiError(error, "fetching device prompts");
  }
}
