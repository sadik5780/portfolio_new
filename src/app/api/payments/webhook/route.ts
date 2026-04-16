import { NextResponse } from 'next/server';
import {
  hasWebhookEnv,
  verifyWebhookSignature,
} from '@/lib/payments/razorpay';
import {
  getPaymentByOrderId,
  markPaymentFailed,
  markPaymentPaid,
} from '@/lib/payments/store';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import { logSecurityEvent } from '@/lib/security/log';
import { getClientIp } from '@/lib/security/ip';

export const runtime = 'nodejs';
// Never cache webhook responses.
export const dynamic = 'force-dynamic';

/**
 * Razorpay → server webhook. Survives the scenario where the user pays but
 * closes the tab before the client-side verify redirect fires. Razorpay
 * posts the final truth here asynchronously on every payment event.
 *
 * Configure in Razorpay Dashboard → Webhooks:
 *   URL:    https://www.sadikstudio.in/api/payments/webhook
 *   Secret: same value as RAZORPAY_WEBHOOK_SECRET env var
 *   Events: payment.captured, payment.failed, order.paid
 *
 * Security invariants:
 *   - Raw body is signed — we MUST read request.text(), not .json(),
 *     because any JSON re-serialization changes whitespace and breaks HMAC.
 *   - Signature is checked BEFORE any DB lookup to avoid leaking row
 *     existence through timing.
 *   - Handler is idempotent — Razorpay retries on 5xx for ~24h.
 */

interface RazorpayEvent {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
        error_description?: string;
        error_reason?: string;
      };
    };
    order?: {
      entity?: {
        id?: string;
        status?: string;
      };
    };
  };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (!hasWebhookEnv() || !hasServiceRoleEnv()) {
    // Fail-closed: if env isn't set, behave as if webhook isn't configured.
    // Razorpay will retry for ~24h, buying time to fix misconfiguration.
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 503 },
    );
  }

  const signature = request.headers.get('x-razorpay-signature') ?? '';

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'Could not read body' }, { status: 400 });
  }

  // ── Signature check (before any parsing or DB access) ──────
  const valid = verifyWebhookSignature({ rawBody, signature });
  if (!valid) {
    logSecurityEvent('payment.signature_invalid', {
      ip,
      scope: 'webhook',
    });
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 },
    );
  }

  // ── Parse event ─────────────────────────────────────────────
  let event: RazorpayEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = event.event ?? '';
  const orderId =
    event.payload?.payment?.entity?.order_id ??
    event.payload?.order?.entity?.id ??
    '';
  const razPaymentId = event.payload?.payment?.entity?.id ?? '';

  if (!orderId) {
    // Non-payment event we don't care about (e.g. refund, dispute). Accept
    // so Razorpay stops retrying, but no-op.
    return NextResponse.json({ ok: true, ignored: true });
  }

  // ── Locate our payment row ──────────────────────────────────
  const record = await getPaymentByOrderId(orderId);
  if (!record) {
    // Unknown order — accept the event so Razorpay doesn't retry, but log.
    // (Typically this means our create-order insert failed silently.)
    console.warn('[webhook] no matching payment row for order', orderId);
    return NextResponse.json({ ok: true, ignored: true });
  }

  // Idempotency guard — already paid.
  if (record.status === 'paid' && eventType !== 'payment.failed') {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  // ── Dispatch by event type ──────────────────────────────────
  try {
    switch (eventType) {
      case 'payment.captured':
      case 'order.paid': {
        if (!razPaymentId) {
          return NextResponse.json(
            { error: 'Missing payment id in event payload' },
            { status: 400 },
          );
        }
        await markPaymentPaid({
          id: record.id,
          razorpay_payment_id: razPaymentId,
          // Webhook events don't include the client-side signature; store
          // the webhook signature instead as an audit marker.
          razorpay_signature: `webhook:${signature.slice(0, 16)}`,
        });
        return NextResponse.json({ ok: true, status: 'paid' });
      }

      case 'payment.failed': {
        const reason =
          event.payload?.payment?.entity?.error_description ??
          event.payload?.payment?.entity?.error_reason ??
          'Payment failed';
        await markPaymentFailed({ id: record.id, reason });
        return NextResponse.json({ ok: true, status: 'failed' });
      }

      default:
        // Unsubscribed / unexpected event — accept so Razorpay doesn't retry.
        return NextResponse.json({ ok: true, ignored: eventType });
    }
  } catch (err) {
    // Return 500 so Razorpay retries — recoverable DB blips shouldn't drop
    // payment confirmations.
    console.error('[webhook] handler error', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Handler error' },
      { status: 500 },
    );
  }
}

// Razorpay sometimes sends a GET to validate the endpoint exists.
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'razorpay-webhook' });
}
