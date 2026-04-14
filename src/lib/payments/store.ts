import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { PaymentRow } from './types';

interface CreatePendingInput {
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  service_label: string;
  features: string[];
  amount: number;
  amount_minor: number;
  currency: 'INR' | 'USD';
  razorpay_order_id: string;
}

export async function createPendingPayment(
  input: CreatePendingInput,
): Promise<PaymentRow> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('payments')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(`Failed to create payment row: ${error.message}`);
  return data as PaymentRow;
}

export async function getPaymentById(id: string): Promise<PaymentRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[payments] getPaymentById', error.message);
    return null;
  }
  return (data as PaymentRow) ?? null;
}

export async function getPaymentByOrderId(
  orderId: string,
): Promise<PaymentRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('razorpay_order_id', orderId)
    .maybeSingle();
  if (error) {
    console.error('[payments] getPaymentByOrderId', error.message);
    return null;
  }
  return (data as PaymentRow) ?? null;
}

export async function markPaymentPaid(params: {
  id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<PaymentRow> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('payments')
    .update({
      status: 'paid',
      razorpay_payment_id: params.razorpay_payment_id,
      razorpay_signature: params.razorpay_signature,
      failure_reason: null,
    })
    .eq('id', params.id)
    .select()
    .single();
  if (error) throw new Error(`Failed to mark payment paid: ${error.message}`);
  return data as PaymentRow;
}

export async function markPaymentFailed(params: {
  id: string;
  reason: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase
    .from('payments')
    .update({ status: 'failed', failure_reason: params.reason })
    .eq('id', params.id);
}

export async function listPayments(): Promise<PaymentRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[payments] list', error.message);
    return [];
  }
  return (data ?? []) as PaymentRow[];
}
