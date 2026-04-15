import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAuthServer } from '@/lib/supabase/auth-server';

export const runtime = 'nodejs';

/**
 * OAuth / email-link callback. Supabase sends the user here after they click
 * a password-reset or magic-link email. We exchange the `code` in the URL for
 * a real session (cookie) and forward to `next` (defaults to /admin).
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/admin';

  if (code) {
    const supabase = getSupabaseAuthServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.search = `?error=${encodeURIComponent(error.message)}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  const redirectUrl = url.clone();
  redirectUrl.pathname = next;
  redirectUrl.search = '';
  return NextResponse.redirect(redirectUrl);
}
