/**
 * Authentication Middleware Helper
 *
 * Use this in API routes to require authentication.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AuthError, VerifyResult } from "./jwt-verify";

/**
 * Require authentication for an API route.
 * Returns the device_id if authenticated, or throws AuthError.
 *
 * Usage in API routes:
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   try {
 *     const { deviceId } = await requireAuth(request);
 *     // deviceId is now available
 *   } catch (error) {
 *     if (error instanceof AuthError) {
 *       return NextResponse.json({ error: error.message }, { status: error.statusCode });
 *     }
 *     throw error;
 *   }
 * }
 * ```
 */
export async function requireAuth(request: NextRequest): Promise<VerifyResult> {
  const authHeader = request.headers.get("Authorization");
  return verifyToken(authHeader);
}

/**
 * Optional authentication - returns deviceId if authenticated, null otherwise.
 * Does not throw errors for missing/invalid tokens.
 *
 * Useful for endpoints that work with or without auth.
 */
export async function optionalAuth(
  request: NextRequest
): Promise<VerifyResult | null> {
  try {
    return await requireAuth(request);
  } catch {
    return null;
  }
}

/**
 * Create an error response for authentication errors.
 */
export function createAuthErrorResponse(error: AuthError): NextResponse {
  return NextResponse.json(
    { error: error.message },
    { status: error.statusCode }
  );
}

// Re-export AuthError for convenience
export { AuthError };
