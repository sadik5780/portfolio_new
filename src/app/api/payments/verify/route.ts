import { NextResponse } from 'next/server';
import { verifyPaymentSignature, hasRazorpayEnv } from '@/lib/payments/razorpay';
import {
  getPaymentById,
  markPaymentFailed,
  markPaymentPaid,
} from '@/lib/payments/store';
import { hasServiceRoleEnv } from '@/lib/supabase/server';

export const runtime = 'nodejs';

interface VerifyBody {
  paymentId?: string;            // our DB row id
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

export async function POST(request: Request) {
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
