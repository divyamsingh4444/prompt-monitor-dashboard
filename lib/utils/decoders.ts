/**
 * Runtime validation decoders for JSONB fields from Supabase
 * These provide type-safe runtime validation for JSON data
 */

import { decodeArray, decodeString } from "type-decoder";

/**
 * Type for string arrays stored in JSONB columns
 */
export type StringArray = string[];

/**
 * Decodes a JSONB field that should be a string array
 * Returns null if the input is not a valid string array
 */
export function decodeStringArray(rawInput: unknown): StringArray | null {
  return decodeArray(rawInput, decodeString);
}
