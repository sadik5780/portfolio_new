import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession, type SessionPayload } from './session';

/**
 * Require an authenticated admin in a Server Component / page.
 * Redirects to /login if not authenticated.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) {
    redirect('/login');
  }
  return session;
}

/**
 * Guard an API route handler — returns either the session payload
 * or a 401 NextResponse. Used at the top of admin API routes as
 * defense-in-depth alongside the middleware.
 *
 *   const guard = await adminGuard();
 *   if (guard instanceof NextResponse) return guard;
 *   // otherwise guard is the session payload
 */
export async function adminGuard(): Promise<SessionPayload | NextResponse> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

/** Check if an admin session exists (for UI state, no redirect). */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
