/**
 * Central type exports
 * Re-exports all generated types from src/generated
 */

// Database types (from type-crafter - keep these for JSONB decoders)
export * from "@/src/generated/types/DatabaseTypes";

// Supabase types
export * from "@/src/generated/supabase/SupabaseTypes";

// API types (from OpenAPI - single source of truth)
export * from "@/src/generated/api";

// Database table type aliases
export * from "./database";
