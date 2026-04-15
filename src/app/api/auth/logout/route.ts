import { NextResponse } from 'next/server';
import { getSupabaseAuthServer } from '@/lib/supabase/auth-server';

export const runtime = 'nodejs';

export async function POST() {
  const supabase = getSupabaseAuthServer();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
