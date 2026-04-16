import 'server-only';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';

let cachedClient: Razorpay | null = null;

function getRazorpayKeys(): { keyId: string; keySecret: string } {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay keys are not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
    );
  }
  return { keyId, keySecret };
}

export function hasRazorpayEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET,
  );
}

export function getRazorpayClient(): Razorpay {
  if (cachedClient) return cachedClient;
  const { keyId, keySecret } = getRazorpayKeys();
  cachedClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return cachedClient;
}

/**
 * Verify the HMAC-SHA256 signature returned by the Razorpay checkout.
 * Signature payload format: `${order_id}|${payment_id}` signed with the
 * key secret. Uses `timingSafeEqual` to avoid timing-channel leaks.
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = getRazorpayKeys();
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest('hex');

  // Both must be the same length for timingSafeEqual
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(params.signature, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Verify a Razorpay webhook request. Razorpay signs the entire raw body
 * with the WEBHOOK secret (not the API secret) and sends the result in the
 * `X-Razorpay-Signature` header. The body MUST be the raw string — any
 * JSON re-serialization will break the hash.
 */
export function verifyWebhookSignature(params: {
  rawBody: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !params.signature) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(params.rawBody)
    .digest('hex');

  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(params.signature, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function hasWebhookEnv(): boolean {
  return Boolean(process.env.RAZORPAY_WEBHOOK_SECRET);
}
