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
      .eq("device_id", id)
      .order("timestamp", { ascending: false });

    if (error) throw error;

    // Transform database prompts to frontend Prompt type
    const prompts: Prompt[] = (data || []).map((p: any) => ({
      id: p.id,
      device_id: p.device_id,
      site: p.site || "Unknown",
      prompt_text: p.prompt || "",
      timestamp: p.timestamp || new Date(p.created_at || Date.now()).getTime(),
      browser: p.browser_name || "",
      is_flagged: false, // Not in schema, default to false
      url: p.url,
      username: p.username,
    }));

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Error fetching device prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch device prompts" },
      { status: 500 }
    );
  }
}
