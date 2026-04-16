import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import { getPaymentById } from '@/lib/payments/store';
import { syncPaymentToZoho } from '@/lib/payments/zoho-sync';
import { hasZohoEnv } from '@/lib/integrations/zoho-invoice';
import { isAllowedOrigin } from '@/lib/security/origin';

export const runtime = 'nodejs';

interface Params {
  params: { id: string };
}

/**
 * Manually trigger Zoho Invoice sync for an existing payment row. Used to
 * backfill payments that were captured before the Zoho integration existed,
 * or to retry after a transient Zoho API failure.
 *
 * Idempotent on zoho_invoice_id — if the row already has one, this is a
 * no-op and returns the existing invoice details.
 */
export async function POST(request: Request, { params }: Params) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  if (!hasZohoEnv()) {
    return NextResponse.json(
      { error: 'Zoho integration is not configured on the server.' },
      { status: 503 },
    );
  }

  const payment = await getPaymentById(params.id);
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found.' }, { status: 404 });
  }

  if (payment.status !== 'paid') {
    return NextResponse.json(
      { error: 'Can only sync paid payments.' },
      { status: 400 },
    );
  }

  await syncPaymentToZoho(payment);

  // Re-read so the admin UI sees the freshly-written fields.
  const updated = await getPaymentById(params.id);
  revalidatePath('/admin/payments');

  if (updated?.zoho_sync_error && !updated.zoho_invoice_id) {
    return NextResponse.json(
      { ok: false, error: updated.zoho_sync_error },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    invoiceId: updated?.zoho_invoice_id,
    invoiceNumber: updated?.zoho_invoice_number,
    invoiceUrl: updated?.zoho_invoice_url,
  });
}
