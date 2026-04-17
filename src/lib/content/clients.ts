import 'server-only';
import { getSupabaseAdmin, hasServiceRoleEnv } from '@/lib/supabase/server';

export type ClientStatus = 'lead' | 'active' | 'completed' | 'inactive';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  country: string;
  currency: string;
  status: ClientStatus;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  country: string | null;
  currency: string;
  status: ClientStatus;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function rowToClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? '',
    phone: row.phone ?? '',
    company: row.company ?? '',
    address: row.address ?? '',
    country: row.country ?? '',
    currency: row.currency,
    status: row.status,
    source: row.source ?? '',
    notes: row.notes ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface ClientInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  country?: string;
  currency?: string;
  status?: ClientStatus;
  source?: string;
  notes?: string;
}

export async function listClients(): Promise<Client[]> {
  if (!hasServiceRoleEnv()) return [];
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('clients').select('*').order('created_at', { ascending: false });
  if (error) { console.error('[clients] list error', error.message); return []; }
  return ((data ?? []) as ClientRow[]).map(rowToClient);
}

export async function getClient(id: string): Promise<Client | null> {
  if (!hasServiceRoleEnv()) return null;
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('clients').select('*').eq('id', id).single();
  if (error || !data) return null;
  return rowToClient(data as ClientRow);
}

export async function createClient(input: ClientInput): Promise<Client> {
  if (!hasServiceRoleEnv()) throw new Error('Service role key required');
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('clients').insert({
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    company: input.company ?? null,
    address: input.address ?? null,
    country: input.country ?? null,
    currency: input.currency ?? 'USD',
    status: input.status ?? 'lead',
    source: input.source ?? null,
    notes: input.notes ?? null,
  }).select().single();
  if (error || !data) throw new Error(error?.message ?? 'Failed');
  return rowToClient(data as ClientRow);
}

export async function updateClient(id: string, input: Partial<ClientInput>): Promise<Client> {
  if (!hasServiceRoleEnv()) throw new Error('Service role key required');
  const sb = getSupabaseAdmin();
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.email !== undefined) patch.email = input.email;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.company !== undefined) patch.company = input.company;
  if (input.address !== undefined) patch.address = input.address;
  if (input.country !== undefined) patch.country = input.country;
  if (input.currency !== undefined) patch.currency = input.currency;
  if (input.status !== undefined) patch.status = input.status;
  if (input.source !== undefined) patch.source = input.source;
  if (input.notes !== undefined) patch.notes = input.notes;
  const { data, error } = await sb.from('clients').update(patch).eq('id', id).select().single();
  if (error || !data) throw new Error(error?.message ?? 'Failed');
  return rowToClient(data as ClientRow);
}

export async function deleteClient(id: string): Promise<void> {
  if (!hasServiceRoleEnv()) throw new Error('Service role key required');
  const sb = getSupabaseAdmin();
  const { error } = await sb.from('clients').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export interface ClientRelatedData {
  quotes: Array<{ id: string; quoteNumber: string; status: string; subtotal: number; currency: string; createdAt: string }>;
  invoices: Array<{ id: string; invoiceNumber: string; status: string; total: number; currency: string; createdAt: string }>;
  leads: Array<{ id: string; name: string; projectType: string | null; message: string; createdAt: string }>;
}

export async function getClientRelated(clientId: string): Promise<ClientRelatedData> {
  if (!hasServiceRoleEnv()) return { quotes: [], invoices: [], leads: [] };
  const sb = getSupabaseAdmin();

  const [qRes, iRes, lRes] = await Promise.all([
    sb.from('quotes').select('id, quote_number, status, subtotal, currency, created_at').eq('client_id', clientId).order('created_at', { ascending: false }),
    sb.from('invoices').select('id, invoice_number, status, total, currency, created_at').eq('client_id', clientId).order('created_at', { ascending: false }),
    sb.from('leads').select('id, name, project_type, message, created_at').eq('client_id', clientId).order('created_at', { ascending: false }),
  ]);

  return {
    quotes: ((qRes.data ?? []) as Array<{ id: string; quote_number: string; status: string; subtotal: number; currency: string; created_at: string }>).map((r) => ({
      id: r.id, quoteNumber: r.quote_number, status: r.status, subtotal: r.subtotal, currency: r.currency, createdAt: r.created_at,
    })),
    invoices: ((iRes.data ?? []) as Array<{ id: string; invoice_number: string; status: string; total: number; currency: string; created_at: string }>).map((r) => ({
      id: r.id, invoiceNumber: r.invoice_number, status: r.status, total: r.total, currency: r.currency, createdAt: r.created_at,
    })),
    leads: ((lRes.data ?? []) as Array<{ id: string; name: string; project_type: string | null; message: string; created_at: string }>).map((r) => ({
      id: r.id, name: r.name, projectType: r.project_type, message: r.message, createdAt: r.created_at,
    })),
  };
}
