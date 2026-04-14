import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client using the anon key.
 * Safe for reads; subject to RLS.
 */
let anonServerClient: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (anonServerClient) return anonServerClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  anonServerClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return anonServerClient;
}

/**
 * Service-role Supabase client — bypasses RLS.
 * NEVER expose to the browser. Used only by admin API routes and server code.
 */
let serviceRoleClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (serviceRoleClient) return serviceRoleClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Service-role Supabase client not configured. Set SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  serviceRoleClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'sadik-portfolio-admin' } },
  });
  return serviceRoleClient;
}

export function hasServiceRoleEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
