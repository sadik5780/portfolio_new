import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
} from '@/lib/auth/session';
import { verifyAdminPassword, verifyAdminUsername } from '@/lib/security/password';
import { rateLimit, rateLimitHeaders } from '@/lib/security/rate-limit';
import { isAllowedOrigin } from '@/lib/security/origin';
import { getClientIp } from '@/lib/security/ip';
import { logSecurityEvent } from '@/lib/security/log';

export const runtime = 'nodejs';

// Constant floor delay on EVERY request (success or failure) so that successful
// logins don't become a timing oracle for username enumeration.
const BASE_DELAY_MS = 400;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface LoginBody {
  username?: unknown;
  password?: unknown;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // ── CSRF / same-origin defense ─────────────────────
  if (!isAllowedOrigin(request)) {
    logSecurityEvent('auth.login.origin_rejected', { ip, path: '/api/auth/login' });
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  // ── IP rate limit: 10 attempts / 15 min / IP ──────
  const ipLimit = rateLimit({
    key: `login:ip:${ip}`,
    limit: 10,
    windowSeconds: 60 * 15,
  });
  if (!ipLimit.ok) {
    logSecurityEvent('auth.login.rate_limited', { ip, scope: 'ip' });
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(ipLimit) },
    );
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    await sleep(BASE_DELAY_MS);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  // Basic input bounds (prevent absurd inputs that could slow bcrypt).
  if (!username || !password || username.length > 254 || password.length > 256) {
    await sleep(BASE_DELAY_MS);
    return NextResponse.json(
      { error: 'Username and password are required.' },
      { status: 400 },
    );
  }

  // ── Per-username rate limit: 5 attempts / 15 min ──
  // Defends the known admin user against a distributed-IP attack.
  const userLimit = rateLimit({
    key: `login:user:${username.toLowerCase()}`,
    limit: 5,
    windowSeconds: 60 * 15,
  });
  if (!userLimit.ok) {
    logSecurityEvent('auth.login.rate_limited', {
      ip,
      scope: 'user',
      user: username,
    });
    await sleep(BASE_DELAY_MS);
    return NextResponse.json(
      { error: 'Too many attempts for this account. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(userLimit) },
    );
  }

  if (!process.env.ADMIN_USER || (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD)) {
    logSecurityEvent('auth.login.misconfigured', { ip });
    return NextResponse.json(
      { error: 'Admin credentials not configured on the server.' },
      { status: 500 },
    );
  }

  // Evaluate both checks fully so timing does not leak which field was wrong.
  const userOk = verifyAdminUsername(username);
  const passOk = await verifyAdminPassword(password);

  if (!(userOk && passOk)) {
    await sleep(BASE_DELAY_MS);
    // Server-only diagnostic: which check failed + env-var presence/shape.
    // Never returned to client. Inspect host logs to debug prod-only failures.
    logSecurityEvent('auth.login.failed', {
      ip,
      user: username,
      userOk,
      passOk,
      expectedUserLen: process.env.ADMIN_USER?.length ?? 0,
      hasHash: Boolean(process.env.ADMIN_PASSWORD_HASH),
      hashPrefix: process.env.ADMIN_PASSWORD_HASH?.slice(0, 4) || null,
      hasPlain: Boolean(process.env.ADMIN_PASSWORD),
    });
    return NextResponse.json(
      { error: 'Invalid username or password.' },
      { status: 401 },
    );
  }

  const token = await signSession(username);

  // Production uses __Host- prefix (requires Secure + Path=/ + no Domain).
  const isProd = process.env.NODE_ENV === 'production';
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  logSecurityEvent('auth.login.ok', { ip, user: username });
  await sleep(BASE_DELAY_MS);
  return NextResponse.json({ ok: true });
}
