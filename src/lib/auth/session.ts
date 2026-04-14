import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// In production we use the __Host- prefix which forces Secure + Path=/ + no
// Domain, protecting the cookie from subdomain hijacks. Dev uses plain name
// because __Host- requires HTTPS.
export const SESSION_COOKIE =
  process.env.NODE_ENV === 'production'
    ? '__Host-sadik_admin_session'
    : 'sadik_admin_session';

// Reduced from 7 days → 2 hours. Shorter-lived sessions limit the blast
// radius of a stolen token. Override with SESSION_MAX_AGE_SECONDS if you
// need longer-running admin work (e.g. data migrations).
const DEFAULT_MAX_AGE = 60 * 60 * 2; // 2 hours
const envMaxAge = Number(process.env.SESSION_MAX_AGE_SECONDS);
export const SESSION_MAX_AGE_SECONDS =
  Number.isFinite(envMaxAge) && envMaxAge >= 60 && envMaxAge <= 60 * 60 * 24
    ? envMaxAge
    : DEFAULT_MAX_AGE;

export interface SessionPayload extends JWTPayload {
  sub: string; // admin username
  iat: number;
  exp: number;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'AUTH_SECRET is missing or too short (min 32 chars). Generate with: openssl rand -base64 48',
    );
  }
  return new TextEncoder().encode(secret);
}

/** Sign a session JWT for the given admin user. */
export async function signSession(username: string): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_MAX_AGE_SECONDS;

  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .setSubject(username)
    .sign(getSecret());
}

/**
 * Verify a session token. Returns the payload on success, null otherwise.
 * Never throws — callers should treat null as "not authenticated".
 */
export async function verifySession(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Constant-time string compare (for credential check).
 * Uses a simple manual implementation since Node's timingSafeEqual
 * is not available in Edge runtime.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
