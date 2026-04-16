import 'server-only';
import {
  createInvoice,
  findOrCreateContact,
  hasZohoEnv,
  recordPayment,
} from '@/lib/integrations/zoho-invoice';
import { saveZohoSync } from './store';
import type { PaymentRow } from './types';

/**
 * After a Razorpay payment is captured, mirror it in Zoho Invoice:
 *   1. Find or create a Zoho contact keyed by email.
 *   2. Create an invoice with the service as a single line item.
 *   3. Record a customer payment that fully closes the invoice.
 *   4. Persist the Zoho ids/URL on the payment row.
 *
 * Idempotency: if the payment row already has a zoho_invoice_id, this is
 * a no-op — safe to re-run when the webhook retries.
 *
 * Failure mode: errors are caught, logged, and written to zoho_sync_error
 * on the payment row. The payment itself stays "paid" regardless; Zoho
 * sync is best-effort. Admins can retry manually later.
 */
export async function syncPaymentToZoho(payment: PaymentRow): Promise<void> {
  if (!hasZohoEnv()) return;
  if (payment.zoho_invoice_id) return; // already synced

  try {
    const contactId = await findOrCreateContact({
      name: payment.name,
      email: payment.email,
      phone: payment.phone ?? undefined,
    });

    const invoice = await createInvoice({
      contactId,
      serviceName: payment.service_label,
      serviceDescription: payment.features.length
        ? `Features: ${payment.features.join(', ')}`
        : undefined,
      amount: payment.amount,
      currency: payment.currency,
      paymentReference: payment.razorpay_payment_id ?? payment.razorpay_order_id,
    });

    await recordPayment({
      invoiceId: invoice.id,
      contactId,
      amount: payment.amount,
      referenceNumber:
        payment.razorpay_payment_id ?? payment.razorpay_order_id,
      mode: 'Razorpay',
    });

    await saveZohoSync({
      id: payment.id,
      contactId,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      invoiceUrl: invoice.url,
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[zoho-sync] failed', payment.id, message);
    await saveZohoSync({
      id: payment.id,
      error: message.slice(0, 500),
    }).catch(() => {
      // If even the error-write fails, we've done all we can.
    });
  }
}
