import { NextResponse } from 'next/server';
import { getRazorpayClient, hasRazorpayEnv } from '@/lib/payments/razorpay';
import { resolveServerPrice } from '@/lib/payments/pricing';
import { createPendingPayment } from '@/lib/payments/store';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import type {
  CustomerInput,
  PaymentCurrency,
  ServiceType,
} from '@/lib/payments/types';

export const runtime = 'nodejs';

interface CreateOrderBody {
  service?: string;
  currency?: string;
  features?: unknown;
  customer?: Partial<CustomerInput>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCustomer(c: Partial<CustomerInput> | undefined): {
  ok: true;
  customer: CustomerInput;
} | { ok: false; error: string } {
  if (!c || typeof c !== 'object') {
    return { ok: false, error: 'Customer details are required.' };
  }
  const name = typeof c.name === 'string' ? c.name.trim() : '';
  const email = typeof c.email === 'string' ? c.email.trim() : '';
  const phone =
    typeof c.phone === 'string' && c.phone.trim().length > 0
      ? c.phone.trim()
      : undefined;

  if (name.length < 2) return { ok: false, error: 'Name is required.' };
  if (name.length > 120) return { ok: false, error: 'Name is too long.' };
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Valid email required.' };
  if (phone && phone.length > 30) {
    return { ok: false, error: 'Phone number looks too long.' };
  }
  return { ok: true, customer: { name, email, phone } };
}

function parseCurrency(raw: unknown): PaymentCurrency | null {
  if (typeof raw !== 'string') return null;
  const upper = raw.toUpperCase();
  return upper === 'INR' || upper === 'USD' ? upper : null;
}

function parseService(raw: unknown): ServiceType | null {
  if (typeof raw !== 'string') return null;
  if (raw === 'shopify' || raw === 'custom-app') return raw;
  if (raw.startsWith('static:') && raw.length <= 40) {
    return raw as ServiceType;
  }
  return null;
}

function parseFeatures(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((v): v is string => typeof v === 'string')
    .slice(0, 50); // hard cap for sanity
}

export async function POST(request: Request) {
  if (!hasRazorpayEnv()) {
    return NextResponse.json(
      { error: 'Razorpay is not configured on the server.' },
      { status: 503 },
    );
  }
  if (!hasServiceRoleEnv()) {
    return NextResponse.json(
      { error: 'Payment storage is not configured (missing SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 503 },
    );
  }

  let body: CreateOrderBody;
  try {
    body = (await request.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── Validate shape ───────────────────────────────
  const service = parseService(body.service);
  if (!service) {
    return NextResponse.json(
      { error: 'Unknown or missing service.' },
      { status: 422 },
    );
  }
  const currency = parseCurrency(body.currency);
  if (!currency) {
    return NextResponse.json(
      { error: 'Currency must be INR or USD.' },
      { status: 422 },
    );
  }
  const cust = validateCustomer(body.customer);
  if (!cust.ok) {
    return NextResponse.json({ error: cust.error }, { status: 422 });
  }
  const features = parseFeatures(body.features);

  // ── Resolve authoritative price on the server ──
  const price = await resolveServerPrice({ service, currency, features });
  if (!price) {
    return NextResponse.json(
      { error: 'Could not price the selected service. Please refresh and try again.' },
      { status: 422 },
    );
  }

  // Razorpay enforces a minimum of 100 paise / $1 — catch misconfiguration early.
  if (price.amountMinor < 100) {
    return NextResponse.json(
      { error: 'Amount is below the minimum payable.' },
      { status: 422 },
    );
  }

  // ── Create Razorpay order ───────────────────────
  let order;
  try {
    order = await getRazorpayClient().orders.create({
      amount: price.amountMinor,
      currency: price.currency,
      receipt: `rcpt_${Date.now().toString(36)}`,
      notes: {
        service,
        service_label: price.serviceLabel,
        feature_count: String(features.length),
        customer_email: cust.customer.email,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Razorpay order creation failed';
    console.error('[create-order] razorpay error', msg);
    return NextResponse.json(
      { error: `Razorpay: ${msg}` },
      { status: 502 },
    );
  }

  // ── Persist pending payment row ─────────────────
  try {
    const row = await createPendingPayment({
      name: cust.customer.name,
      email: cust.customer.email,
      phone: cust.customer.phone ?? null,
      service_type: service,
      service_label: price.serviceLabel,
      features: price.features,
      amount: price.amount,
      amount_minor: price.amountMinor,
      currency: price.currency,
      razorpay_order_id: order.id,
    });

    return NextResponse.json({
      ok: true,
      paymentId: row.id,
      orderId: order.id,
      amount: price.amountMinor,
      currency: price.currency,
      serviceLabel: price.serviceLabel,
      breakdown: price.breakdown,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    // If DB insert fails, the Razorpay order still exists but is unreferenced.
    // That's fine — unpaid orders expire automatically and have no financial impact.
    const msg = err instanceof Error ? err.message : 'Payment record failed';
    console.error('[create-order] db error', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
