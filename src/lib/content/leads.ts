import 'server-only';
import { getSupabaseAdmin, hasServiceRoleEnv } from '@/lib/supabase/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/client';
import type { Lead } from './types';

interface InsertLeadInput {
  name: string;
  email: string;
  project_type?: string | null;
  budget?: string | null;
  message: string;
  currency?: string | null;
}

/**
 * Insert a contact-form submission. Uses the service role key if available
 * (bypasses RLS), otherwise falls back to the anon client (requires the
 * `public insert leads` RLS policy).
 */
export async function insertLead(input: InsertLeadInput): Promise<void> {
  if (!hasSupabaseEnv()) {
    // Dev-time fallback: log only.
    console.log('[leads] Supabase not configured, logging lead:', input);
    return;
  }

  const client = hasServiceRoleEnv() ? getSupabaseAdmin() : getSupabaseServer();
  const { error } = await client.from('leads').insert({
    name: input.name,
    email: input.email,
    project_type: input.project_type ?? null,
    budget: input.budget ?? null,
    message: input.message,
    currency: input.currency ?? 'inr',
  });

  if (error) {
    console.error('[leads] insert error', error.message);
    throw new Error('Failed to save inquiry');
  }
}

/** Admin-only: list all leads, newest first. Requires service role. */
export async function listLeads(): Promise<Lead[]> {
  if (!hasServiceRoleEnv()) return [];

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[leads] list error', error.message);
    return [];
  }
  return (data ?? []) as Lead[];
}

export async function deleteLead(id: string): Promise<void> {
  if (!hasServiceRoleEnv()) {
    throw new Error('Service role key is required to delete leads');
  }
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
