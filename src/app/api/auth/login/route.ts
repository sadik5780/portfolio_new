import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  safeEqual,
  signSession,
} from '@/lib/auth/session';

export const runtime = 'nodejs';

// Minimum delay on every login attempt to slow brute-force scanning.
const FAILURE_DELAY_MS = 600;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface LoginBody {
  username?: unknown;
  password?: unknown;
}

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!username || !password) {
    await sleep(FAILURE_DELAY_MS);
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 },
    );
  }

  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return NextResponse.json(
      { error: 'Admin credentials not configured on the server.' },
      { status: 500 },
    );
  }

  // Evaluate BOTH comparisons so timing doesn't leak which field was wrong.
  const userOk = safeEqual(username, expectedUser);
  const passOk = safeEqual(password, expectedPassword);

  if (!(userOk && passOk)) {
    await sleep(FAILURE_DELAY_MS);
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 },
    );
  }

  const token = await signSession(username);

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true });
}
