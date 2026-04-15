import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client wired to the Next.js cookies() store. Use in
 * Server Components, route handlers, and server actions to read the logged-in
 * user's session and hit Supabase with that user's identity (RLS-aware).
 *
 * Create a fresh instance per request — do NOT memoize module-level, because
 * cookies() is request-scoped.
 */
export function getSupabaseAuthServer(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  const store = cookies();

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          store.set({ name, value, ...options });
        } catch {
          // cookies() is read-only in pure Server Components — ignore.
          // Route handlers / server actions are allowed to set cookies.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          store.set({ name, value: '', ...options });
        } catch {
          // Same as above — best effort in RSC context.
        }
      },
    },
  });
}
