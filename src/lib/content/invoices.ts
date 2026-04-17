import 'server-only';
import { getSupabaseAdmin, hasServiceRoleEnv } from '@/lib/supabase/server';

export type InvoiceStatus = 'draft' | 'unpaid' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientAddress: string;
  projectType: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes: string;
  paymentMethod: string;
  dueDate: string;
  issueDate: string;
  paidDate: string | null;
  quoteId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceRow {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  client_name: string;
  client_email: string | null;
  client_company: string | null;
  client_address: string | null;
  project_type: string | null;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  payment_method: string | null;
  due_date: string;
  issue_date: string;
  paid_date: string | null;
  quote_id: string | null;
  created_at: string;
  updated_at: string;
}

function rowToInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    status: row.status,
    clientName: row.client_name,
    clientEmail: row.client_email ?? '',
    clientCompany: row.client_company ?? '',
    clientAddress: row.client_address ?? '',
    projectType: row.project_type ?? '',
    currency: row.currency,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: row.subtotal,
    taxAmount: row.tax_amount,
    total: row.total,
    notes: row.notes ?? '',
    paymentMethod: row.payment_method ?? '',
    dueDate: row.due_date,
    issueDate: row.issue_date,
    paidDate: row.paid_date,
    quoteId: row.quote_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface InvoiceInput {
  invoiceNumber: string;
  status?: InvoiceStatus;
  clientName: string;
  clientEmail?: string;
  clientCompany?: string;
  clientAddress?: string;
  projectType?: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount?: number;
  total: number;
  notes?: string;
  paymentMethod?: string;
  dueDate: string;
  issueDate: string;
  paidDate?: string | null;
  quoteId?: string | null;
}

export async function listInvoices(): Promise<Invoice[]> {
  if (!hasServiceRoleEnv()) return [];
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
  if (error) { console.error('[invoices] list error', error.message); return []; }
  return ((data ?? []) as InvoiceRow[]).map(rowToInvoice);
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  if (!hasServiceRoleEnv()) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
  if (error || !data) return null;
  return rowToInvoice(data as InvoiceRow);
}

export async function createInvoice(input: InvoiceInput): Promise<Invoice> {
  if (!hasServiceRoleEnv()) throw new Error('Service role key required');
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('invoices').insert({
    invoice_number: input.invoiceNumber,
    status: input.status ?? 'unpaid',
    client_name: input.clientName,
    client_email: input.clientEmail ?? null,
    client_company: input.clientCompany ?? null,
    client_address: input.clientAddress ?? null,
    project_type: input.projectType ?? null,
    currency: input.currency,
    items: input.items,
    subtotal: input.subtotal,
    tax_amount: input.taxAmount ?? 0,
    total: input.total,
    notes: input.notes ?? null,
    payment_method: input.paymentMethod ?? null,
    due_date: input.dueDate,
    issue_date: input.issueDate,
    paid_date: input.paidDate ?? null,
    quote_id: input.quoteId ?? null,
  }).select().single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to create invoice');
  return rowToInvoice(data as InvoiceRow);
}

export async function updateInvoice(id: string, input: Partial<InvoiceInput>): Promise<Invoice> {
  if (!hasServiceRoleEnv()) throw new Error('Service role key required');
  const supabase = getSupabaseAdmin();
  const patch: Record<string, unknown> = {};
  if (input.invoiceNumber !== undefined) patch.invoice_number = input.invoiceNumber;
  if (input.status !== undefined) patch.status = input.status;
  if (input.clientName !== undefined) patch.client_name = input.clientName;
  if (input.clientEmail !== undefined) patch.client_email = input.clientEmail;
  if (input.clientCompany !== undefined) patch.client_company = input.clientCompany;
  if (input.clientAddress !== undefined) patch.client_address = input.clientAddress;
  if (input.projectType !== undefined) patch.project_type = input.projectType;
  if (input.currency !== undefined) patch.currency = input.currency;
  if (input.items !== undefined) patch.items = input.items;
  if (input.subtotal !== undefined) patch.subtotal = input.subtotal;
  if (input.taxAmount !== undefined) patch.tax_amount = input.taxAmount;
  if (input.total !== undefined) patch.total = input.total;
  if (input.notes !== undefined) patch.notes = input.notes;
  if (input.paymentMethod !== undefined) patch.payment_method = input.paymentMethod;
  if (input.dueDate !== undefined) patch.due_date = input.dueDate;
  if (input.issueDate !== undefined) patch.issue_date = input.issueDate;
  if (input.paidDate !== undefined) patch.paid_date = input.paidDate;
  const { data, error } = await supabase.from('invoices').update(patch).eq('id', id).select().single();
  if (error || !data) throw new Error(error?.message ?? 'Failed to update invoice');
  return rowToInvoice(data as InvoiceRow);
}

export async function deleteInvoice(id: string): Promise<void> {
  if (!hasServiceRoleEnv()) throw new Error('Service role key required');
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
