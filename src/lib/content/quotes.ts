import 'server-only';
import { getSupabaseAdmin, hasServiceRoleEnv } from '@/lib/supabase/server';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined';

export interface QuoteItem {
  description: string;
  amount: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  status: QuoteStatus;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  projectType: string;
  currency: string;
  items: QuoteItem[];
  subtotal: number;
  notes: string;
  deliveryDays: number;
  includesMaintenance: boolean;
  issueDate: string;
  validUntil: string;
  leadId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface QuoteRow {
  id: string;
  quote_number: string;
  status: QuoteStatus;
  client_name: string;
  client_email: string | null;
  client_company: string | null;
  project_type: string | null;
  currency: string;
  items: QuoteItem[];
  subtotal: number;
  notes: string | null;
  delivery_days: number;
  includes_maintenance: boolean;
  issue_date: string;
  valid_until: string;
  lead_id: string | null;
  created_at: string;
  updated_at: string;
}

function rowToQuote(row: QuoteRow): Quote {
  return {
    id: row.id,
    quoteNumber: row.quote_number,
    status: row.status,
    clientName: row.client_name,
    clientEmail: row.client_email ?? '',
    clientCompany: row.client_company ?? '',
    projectType: row.project_type ?? '',
    currency: row.currency,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: row.subtotal,
    notes: row.notes ?? '',
    deliveryDays: row.delivery_days,
    includesMaintenance: row.includes_maintenance,
    issueDate: row.issue_date,
    validUntil: row.valid_until,
    leadId: row.lead_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface QuoteInput {
  quoteNumber: string;
  status?: QuoteStatus;
  clientName: string;
  clientEmail?: string;
  clientCompany?: string;
  projectType?: string;
  currency: string;
  items: QuoteItem[];
  subtotal: number;
  notes?: string;
  deliveryDays: number;
  includesMaintenance: boolean;
  issueDate: string;
  validUntil: string;
  leadId?: string | null;
}

export async function listQuotes(): Promise<Quote[]> {
  if (!hasServiceRoleEnv()) return [];
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[quotes] list error', error.message);
    return [];
  }
  return ((data ?? []) as QuoteRow[]).map(rowToQuote);
}

export async function getQuote(id: string): Promise<Quote | null> {
  if (!hasServiceRoleEnv()) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return rowToQuote(data as QuoteRow);
}

export async function createQuote(input: QuoteInput): Promise<Quote> {
  if (!hasServiceRoleEnv()) throw new Error('Service role key required');
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('quotes')
    .insert({
      quote_number: input.quoteNumber,
      status: input.status ?? 'draft',
      client_name: input.clientName,
      client_email: input.clientEmail ?? null,
      client_company: input.clientCompany ?? null,
      project_type: input.projectType ?? null,
      currency: input.currency,
      items: input.items,
      subtotal: input.subtotal,
      notes: input.notes ?? null,
      delivery_days: input.deliveryDays,
      includes_maintenance: input.includesMaintenance,
      issue_date: input.issueDate,
      valid_until: input.validUntil,
      lead_id: input.leadId ?? null,
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to create quote');
  return rowToQuote(data as QuoteRow);
}

export async function updateQuote(id: string, input: Partial<QuoteInput>): Promise<Quote> {
  if (!hasServiceRoleEnv()) throw new Error('Service role key required');
  const supabase = getSupabaseAdmin();

  const patch: Record<string, unknown> = {};
  if (input.quoteNumber !== undefined) patch.quote_number = input.quoteNumber;
  if (input.status !== undefined) patch.status = input.status;
  if (input.clientName !== undefined) patch.client_name = input.clientName;
  if (input.clientEmail !== undefined) patch.client_email = input.clientEmail;
  if (input.clientCompany !== undefined) patch.client_company = input.clientCompany;
  if (input.projectType !== undefined) patch.project_type = input.projectType;
  if (input.currency !== undefined) patch.currency = input.currency;
  if (input.items !== undefined) patch.items = input.items;
  if (input.subtotal !== undefined) patch.subtotal = input.subtotal;
  if (input.notes !== undefined) patch.notes = input.notes;
  if (input.deliveryDays !== undefined) patch.delivery_days = input.deliveryDays;
  if (input.includesMaintenance !== undefined) patch.includes_maintenance = input.includesMaintenance;
  if (input.issueDate !== undefined) patch.issue_date = input.issueDate;
  if (input.validUntil !== undefined) patch.valid_until = input.validUntil;

  const { data, error } = await supabase
    .from('quotes')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to update quote');
  return rowToQuote(data as QuoteRow);
}

export async function deleteQuote(id: string): Promise<void> {
  if (!hasServiceRoleEnv()) throw new Error('Service role key required');
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('quotes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
