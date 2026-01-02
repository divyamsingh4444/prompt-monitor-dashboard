/**
 * JWT Verification for Device Authentication
 *
 * This module verifies JWT tokens sent by the extension/agent.
 * Tokens are signed with RS256 using the device's private key.
 * We verify using the device's public key stored in the database.
 */

import * as jose from "jose";
import { supabase } from "@/lib/supabase";

export interface JwtPayload {
  sub: string; // device_id
  jti?: string; // unique token ID for replay prevention
  exp?: number; // expiration timestamp
  iat?: number; // issued at timestamp
}

export interface VerifyResult {
  deviceId: string;
  payload: JwtPayload;
}

/**
 * Get device's public key from database
 */
async function getDevicePublicKey(deviceId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("devices")
      .select("public_key_pem")
      .eq("device_id", deviceId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.public_key_pem;
  } catch (error) {
    console.error("Failed to get device public key:", error);
    return null;
  }
}

/**
 * Check if token JTI has been used recently (within 5 minutes)
 */
async function isTokenUsed(jti: string): Promise<boolean> {
  try {
    // Clean up old tokens first (older than 5 minutes)
    await supabase
      .from("used_tokens")
      .delete()
      .lt("used_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // Check if this JTI was used
    const { data } = await supabase
      .from("used_tokens")
      .select("jti")
      .eq("jti", jti)
      .gte("used_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .single();

    return !!data;
  } catch {
    // If error (including not found), assume not used
    return false;
  }
}

/**
 * Mark token as used (for replay detection)
 */
async function markTokenUsed(
  jti: string,
  deviceId: string,
  exp?: number
): Promise<void> {
  try {
    const expiresAt = exp ? new Date(exp * 1000).toISOString() : null;

    await supabase.from("used_tokens").upsert(
      {
        jti,
        device_id: deviceId,
        used_at: new Date().toISOString(),
        expires_at: expiresAt,
      },
      { onConflict: "jti" }
    );
  } catch (error) {
    console.error("Failed to mark token as used:", error);
    // Non-critical error, don't throw
  }
}

/**
 * Verify JWT token and return device_id
 *
 * @param authorizationHeader - The Authorization header value (e.g., "Bearer <token>")
 * @returns VerifyResult with deviceId and payload, or throws an error
 */
export async function verifyToken(
  authorizationHeader: string | null
): Promise<VerifyResult> {
  if (!authorizationHeader) {
    throw new AuthError("No authorization header provided", 401);
  }

  if (!authorizationHeader.startsWith("Bearer ")) {
    throw new AuthError("Invalid authorization format", 401);
  }

  const token = authorizationHeader.slice(7); // Remove 'Bearer '

  try {
    // First, decode without verification to get device_id
    const unverified = jose.decodeJwt(token) as JwtPayload;

    if (!unverified.sub) {
      throw new AuthError("Invalid token: missing device_id", 401);
    }

    const deviceId = unverified.sub;

    // Get device public key from database
    const publicKeyPem = await getDevicePublicKey(deviceId);
    if (!publicKeyPem) {
      throw new AuthError("Device not registered", 401);
    }

    // Import the public key
    const publicKey = await jose.importSPKI(publicKeyPem, "RS256");

    // Verify the token signature
    const { payload } = await jose.jwtVerify(token, publicKey, {
      algorithms: ["RS256"],
    });

    const verifiedPayload = payload as unknown as JwtPayload;

    // Check JTI for replay prevention (log warning but don't block)
    if (verifiedPayload.jti) {
      const used = await isTokenUsed(verifiedPayload.jti);
      if (used) {
        console.warn(
          `Token reused within 5-minute window: ${verifiedPayload.jti}`
        );
        // Allow it but log warning - matching old backend behavior
      }

      // Mark token as used
      await markTokenUsed(verifiedPayload.jti, deviceId, verifiedPayload.exp);
    }

    console.log(`Token verified for device: ${deviceId}`);

    return {
      deviceId,
      payload: verifiedPayload,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    if (error instanceof jose.errors.JWTExpired) {
      throw new AuthError("Token expired", 401);
    }

    if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      throw new AuthError("Invalid token signature", 401);
    }

    if (
      error instanceof jose.errors.JWTInvalid ||
      error instanceof jose.errors.JWSInvalid
    ) {
      throw new AuthError("Invalid token", 401);
    }

    console.error("Token verification error:", error);
    throw new AuthError("Token verification failed", 401);
  }
}

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = "AuthError";
  }
}
