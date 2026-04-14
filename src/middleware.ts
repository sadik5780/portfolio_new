import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/auth/session';

/**
 * Middleware runs in the Edge runtime. Protects /admin/* and /api/admin/*
 * by verifying the session JWT in the cookie. Unauthenticated users are
 * redirected to /login (for pages) or receive 401 (for API routes).
 *
 * If an already-authenticated user hits /login, they get bounced to /admin.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  // Allow login page only when NOT authenticated
  if (pathname === '/login') {
    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect /admin pages → redirect to /login
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect /api/admin/* → 401 JSON
  if (pathname.startsWith('/api/admin')) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/api/admin/:path*'],
};
