import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { handleApiError } from "@/lib/utils/server";

export async function GET() {
  try {
    // Read the OpenAPI spec file from docs folder
    const filePath = join(process.cwd(), "docs", "openapi.yaml");
    const fileContents = readFileSync(filePath, "utf8");

    // Return as YAML with proper content type
    return new NextResponse(fileContents, {
      headers: {
        "Content-Type": "application/x-yaml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return handleApiError(error, "loading OpenAPI specification");
  }
}
