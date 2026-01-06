import { NextResponse } from "next/server";
import { decodeSupabaseError } from "@/types";

/**
 * Handles API errors and returns appropriate HTTP status codes
 * - 4xx for client/application errors (not found, bad request)
 * - 5xx for infrastructure/server errors
 *
 * @param error - The error to handle
 * @param context - Context string for logging (e.g., "fetching device")
 * @returns NextResponse with appropriate status code and error message
 */
export function handleApiError(
  error: unknown,
  context: string
): NextResponse<{ error: string }> {
  // Log the error with context
  console.error(`Error ${context}:`, error);

  // Check if it's a Supabase error (they have a code property)
  // Try to decode as Supabase error, but also check for direct code property
  const supabaseError = decodeSupabaseError(error);
  const directSupabaseError =
    error && typeof error === "object" && "code" in error
      ? {
          code: (error as { code?: string }).code,
          message: (error as { message?: string }).message,
        }
      : null;

  const errorToUse = supabaseError || directSupabaseError;

  if (errorToUse && errorToUse.code) {
    // Handle known Supabase error codes
    switch (errorToUse.code) {
      case "PGRST116":
        // No rows returned - resource not found
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );

      case "PGRST202":
        // Invalid input format
        return NextResponse.json(
          { error: "Invalid request format" },
          { status: 400 }
        );

      case "PGRST301":
        // Duplicate key violation
        return NextResponse.json(
          { error: "Resource already exists" },
          { status: 409 }
        );

      case "23505":
        // Unique violation (PostgreSQL)
        return NextResponse.json(
          { error: "Resource already exists" },
          { status: 409 }
        );

      case "23503":
        // Foreign key violation (PostgreSQL)
        return NextResponse.json(
          { error: "Invalid reference" },
          { status: 400 }
        );

      case "23502":
        // Not null violation (PostgreSQL)
        return NextResponse.json(
          { error: "Missing required field" },
          { status: 400 }
        );

      default:
        // Unknown Supabase error - check if it's a connection error
        const errorMessage = errorToUse.message?.toLowerCase() || "";
        if (
          errorMessage.includes("connection") ||
          errorMessage.includes("timeout") ||
          errorMessage.includes("network") ||
          errorMessage.includes("database")
        ) {
          // Database connection/infrastructure error
          return NextResponse.json(
            { error: "Service temporarily unavailable" },
            { status: 500 }
          );
        }
        // Unknown application error - treat as 400
        return NextResponse.json(
          { error: errorToUse.message || "Invalid request" },
          { status: 400 }
        );
    }
  }

  // Check if it's an Error object with useful information
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Check for infrastructure errors
    if (
      errorMessage.includes("connection") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("network") ||
      errorMessage.includes("database") ||
      errorMessage.includes("econnrefused") ||
      errorMessage.includes("enotfound")
    ) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 500 }
      );
    }

    // Check for not found patterns
    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("does not exist") ||
      errorMessage.includes("no such")
    ) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Check for validation/bad request patterns
    if (
      errorMessage.includes("invalid") ||
      errorMessage.includes("validation") ||
      errorMessage.includes("malformed") ||
      errorMessage.includes("bad request")
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
  }

  // Default: unknown error - treat as infrastructure error (500)
  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}
