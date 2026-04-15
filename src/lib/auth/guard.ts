import 'server-only';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { getSupabaseAuthServer } from '@/lib/supabase/auth-server';

export interface AdminUser {
  id: string;
  email: string;
}

/**
 * Allow-list of admin emails, comma-separated in ADMIN_EMAILS. Supabase Auth
 * lets anyone with an account sign in, so we gate admin routes here.
 */
function getAllowedEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return new Set();
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

async function loadAdminUser(): Promise<AdminUser | null> {
  const supabase = getSupabaseAuthServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;

  const email = data.user.email.toLowerCase();
  if (!getAllowedEmails().has(email)) return null;

  return { id: data.user.id, email };
}

/**
 * Require an authenticated admin in a Server Component / page.
 * Redirects to /login if not authenticated or not on the allow-list.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await loadAdminUser();
  if (!user) redirect('/login');
  return user;
}

/**
 * Guard an API route handler — returns either the admin user payload
 * or a 401/403 NextResponse. Used at the top of admin API routes as
 * defense-in-depth alongside the middleware.
 */
export async function adminGuard(): Promise<AdminUser | NextResponse> {
  const supabase = getSupabaseAuthServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const email = data.user.email.toLowerCase();
  if (!getAllowedEmails().has(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return { id: data.user.id, email };
}

/** Check if an admin session exists (for UI state, no redirect). */
export async function getSession(): Promise<AdminUser | null> {
  return loadAdminUser();
}
