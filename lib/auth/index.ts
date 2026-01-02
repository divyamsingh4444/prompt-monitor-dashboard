/**
 * Authentication module exports
 */

export { verifyToken, AuthError } from "./jwt-verify";
export type { JwtPayload, VerifyResult } from "./jwt-verify";

export {
  requireAuth,
  optionalAuth,
  createAuthErrorResponse,
} from "./middleware";
