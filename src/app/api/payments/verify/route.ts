import { NextResponse } from 'next/server';
import { verifyPaymentSignature, hasRazorpayEnv } from '@/lib/payments/razorpay';
import {
  getPaymentById,
  markPaymentFailed,
  markPaymentPaid,
} from '@/lib/payments/store';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import { rateLimit, rateLimitHeaders } from '@/lib/security/rate-limit';
import { isAllowedOrigin } from '@/lib/security/origin';
import { getClientIp } from '@/lib/security/ip';
import { logSecurityEvent } from '@/lib/security/log';

export const runtime = 'nodejs';

interface VerifyBody {
  paymentId?: string;            // our DB row id
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (!isAllowedOrigin(request)) {
    logSecurityEvent('payment.origin_rejected', {
      ip,
      path: '/api/payments/verify',
    });
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  // Verify is called once per legitimate checkout — so generous limit, but
  // present to stop signature-grinding attacks against a known orderId.
  const limit = rateLimit({
    key: `payments:verify:ip:${ip}`,
    limit: 30,
    windowSeconds: 60 * 10,
  });
  if (!limit.ok) {
    logSecurityEvent('payment.rate_limited', { ip, scope: 'verify' });
    return NextResponse.json(
      { error: 'Too many verification attempts.' },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  if (!hasRazorpayEnv() || !hasServiceRoleEnv()) {
    return NextResponse.json(
      { error: 'Payments are not fully configured on the server.' },
      { status: 503 },
    );
  }

  let body: VerifyBody;
  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const paymentId = typeof body.paymentId === 'string' ? body.paymentId : '';
  const orderId =
    typeof body.razorpay_order_id === 'string' ? body.razorpay_order_id : '';
  const razPaymentId =
    typeof body.razorpay_payment_id === 'string' ? body.razorpay_payment_id : '';
  const signature =
    typeof body.razorpay_signature === 'string' ? body.razorpay_signature : '';

  if (!paymentId || !orderId || !razPaymentId || !signature) {
    return NextResponse.json(
      { error: 'Missing payment verification fields.' },
      { status: 422 },
    );
  }

  // ── Step 1: lookup + sanity-check ────────────────
  // The paymentId anchors the request to OUR row; we refuse to verify a
  // signature for an order that doesn't match what we created.
  const record = await getPaymentById(paymentId);
  if (!record) {
    return NextResponse.json(
      { error: 'Payment record not found.' },
      { status: 404 },
    );
  }
  if (record.razorpay_order_id !== orderId) {
    // Don't leak which field mismatched.
    return NextResponse.json(
      { error: 'Payment verification failed.' },
      { status: 400 },
    );
  }
  if (record.status === 'paid') {
    // Idempotent success — re-verifying an already-paid row is safe.
    return NextResponse.json({
      ok: true,
      paymentId: record.id,
      status: 'paid',
    });
  }

  // ── Step 2: HMAC signature verification ─────────
  const valid = verifyPaymentSignature({
    orderId,
    paymentId: razPaymentId,
    signature,
  });

  if (!valid) {
    logSecurityEvent('payment.signature_invalid', {
      ip,
      paymentId,
      orderId,
    });
    await markPaymentFailed({
      id: paymentId,
      reason: 'Invalid signature (tampered client payload)',
    });
    return NextResponse.json(
      { error: 'Payment verification failed.' },
      { status: 400 },
    );
  }

  // ── Step 3: mark paid ───────────────────────────
  try {
    await markPaymentPaid({
      id: paymentId,
      razorpay_payment_id: razPaymentId,
      razorpay_signature: signature,
    });
    return NextResponse.json({
      ok: true,
      paymentId,
      status: 'paid',
    });
  } catch (err) {
    console.error('[verify] mark paid error', err);
    return NextResponse.json(
      { error: 'Could not finalize payment.' },
      { status: 500 },
    );
  }
}
