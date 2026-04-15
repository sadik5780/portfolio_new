import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareSupabase } from '@/lib/supabase/middleware-client';

/**
 * Edge-runtime middleware.
 *
 * Protects /admin/* and /api/admin/* using the Supabase session cookie AND
 * an ADMIN_EMAILS allow-list. Both checks live here so we don't bounce
 * non-admin users in a redirect loop between /login and /admin.
 *
 * Also refreshes the Supabase session cookie on every matched request.
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const supabase = createMiddlewareSupabase(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.toLowerCase() ?? null;
  const isAdmin = email ? getAllowedEmails().has(email) : false;

  // /login → bounce to /admin ONLY if the session belongs to an admin.
  // Non-admin signed-in users must still be able to see /login (otherwise
  // they loop forever with the admin guard).
  if (pathname === '/login') {
    if (isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return response;
  }

  // /admin/* → need an admin session. Anything else → /login.
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      // Signed in but not on the allow-list → tell them why instead of
      // silently bouncing them back to a blank login form.
      if (user) url.searchParams.set('error', 'not_admin');
      return NextResponse.redirect(url);
    }
    return response;
  }

  // /api/admin/* → 401 (no session) or 403 (session but not admin).
  if (pathname.startsWith('/api/admin')) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/api/admin/:path*'],
};
