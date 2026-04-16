import 'server-only';

/**
 * Zoho Invoice API wrapper.
 *
 * Self Client OAuth flow:
 *   1. Long-lived refresh_token stored in ZOHO_REFRESH_TOKEN (never expires
 *      unless revoked).
 *   2. Exchange refresh_token → short-lived access_token (1h TTL) on demand.
 *   3. Module-level cache for the access_token so we don't hammer Zoho's
 *      auth endpoint on every request.
 *
 * All endpoints live under `https://www.zohoapis.in/invoice/v3` for the
 * India data center; organization_id is appended as a query param to every
 * request by `zohoFetch`.
 */

interface ZohoTokenResponse {
  access_token: string;
  expires_in: number; // seconds
  token_type: 'Bearer';
}

interface CachedToken {
  token: string;
  expiresAt: number; // epoch ms
}

let cachedToken: CachedToken | null = null;

function getEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env var: ${key}`);
  return v;
}

function apiDomain(): string {
  return process.env.ZOHO_API_DOMAIN ?? 'https://www.zohoapis.in';
}

function accountsDomain(): string {
  // Matches the API domain — .in for India data center, .com for global.
  return apiDomain().includes('zoho.in')
    ? 'https://accounts.zoho.in'
    : 'https://accounts.zoho.com';
}

export function hasZohoEnv(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN &&
      process.env.ZOHO_ORG_ID,
  );
}

async function refreshAccessToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: getEnv('ZOHO_CLIENT_ID'),
    client_secret: getEnv('ZOHO_CLIENT_SECRET'),
    refresh_token: getEnv('ZOHO_REFRESH_TOKEN'),
  });

  const res = await fetch(`${accountsDomain()}/oauth/v2/token`, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // Token refresh is fast and time-critical — don't let Next cache this.
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Zoho token refresh failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as Partial<ZohoTokenResponse> & { error?: string };
  if (data.error || !data.access_token) {
    throw new Error(`Zoho token refresh error: ${data.error ?? 'unknown'}`);
  }

  // Refresh 60s before actual expiry to avoid edge-case TTL races.
  const ttlSec = typeof data.expires_in === 'number' ? data.expires_in : 3600;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (ttlSec - 60) * 1000,
  };
  return data.access_token;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }
  return refreshAccessToken();
}

type ZohoJson = Record<string, unknown>;

async function zohoFetch<T = ZohoJson>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = await getAccessToken();
  const orgId = getEnv('ZOHO_ORG_ID');
  const separator = path.includes('?') ? '&' : '?';
  const url = `${apiDomain()}/invoice/v3${path}${separator}organization_id=${orgId}`;

  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  const data = (await res.json().catch(() => ({}))) as ZohoJson & {
    code?: number;
    message?: string;
  };

  if (!res.ok || (data.code !== undefined && data.code !== 0)) {
    throw new Error(
      `Zoho API ${options.method ?? 'GET'} ${path} failed: ` +
        `${data.message ?? res.statusText} (${res.status})`,
    );
  }

  return data as T;
}

// ─── Typed helpers ─────────────────────────────────────────────────

interface ZohoContact {
  contact_id: string;
  contact_name: string;
  email: string;
}

interface ZohoInvoice {
  invoice_id: string;
  invoice_number: string;
  invoice_url: string;
  total: number;
  status: string;
}

/**
 * Look up a Zoho contact by email; create one if not found. Returns the
 * contact id used to attach invoices/payments.
 */
export async function findOrCreateContact(params: {
  name: string;
  email: string;
  phone?: string;
}): Promise<string> {
  const q = encodeURIComponent(params.email);
  const search = await zohoFetch<{ contacts?: ZohoContact[] }>(
    `/contacts?email_contains=${q}`,
  );
  const existing = search.contacts?.find(
    (c) => c.email?.toLowerCase() === params.email.toLowerCase(),
  );
  if (existing) return existing.contact_id;

  const result = await zohoFetch<{ contact: ZohoContact }>('/contacts', {
    method: 'POST',
    body: {
      contact_name: params.name,
      contact_persons: [
        {
          first_name: params.name,
          email: params.email,
          phone: params.phone ?? '',
          is_primary_contact: true,
        },
      ],
    },
  });
  return result.contact.contact_id;
}

/**
 * Create an invoice in "sent" status so Zoho automatically emails it to the
 * customer. Returns the invoice id + number + customer-portal URL.
 */
export async function createInvoice(params: {
  contactId: string;
  serviceName: string;
  serviceDescription?: string;
  amount: number;
  currency: 'INR' | 'USD';
  paymentReference?: string;
}): Promise<{ id: string; number: string; url: string }> {
  const result = await zohoFetch<{ invoice: ZohoInvoice }>('/invoices', {
    method: 'POST',
    body: {
      customer_id: params.contactId,
      currency_code: params.currency,
      line_items: [
        {
          name: params.serviceName,
          description:
            params.serviceDescription ??
            (params.paymentReference
              ? `Paid via Razorpay (ref: ${params.paymentReference})`
              : ''),
          rate: params.amount,
          quantity: 1,
        },
      ],
      // Let Zoho generate the invoice number.
    },
  });

  return {
    id: result.invoice.invoice_id,
    number: result.invoice.invoice_number,
    url: result.invoice.invoice_url,
  };
}

/**
 * Record a customer payment that fully pays off an invoice. Marks the
 * invoice status as "paid" in Zoho. Safe to call after a successful
 * Razorpay capture so the Zoho record stays in sync with reality.
 */
export async function recordPayment(params: {
  invoiceId: string;
  contactId: string;
  amount: number;
  referenceNumber: string;
  mode?: string;
  date?: string; // ISO yyyy-mm-dd
}): Promise<void> {
  await zohoFetch('/customerpayments', {
    method: 'POST',
    body: {
      customer_id: params.contactId,
      payment_mode: params.mode ?? 'Razorpay',
      amount: params.amount,
      reference_number: params.referenceNumber,
      date: params.date ?? new Date().toISOString().slice(0, 10),
      invoices: [
        {
          invoice_id: params.invoiceId,
          amount_applied: params.amount,
        },
      ],
    },
  });
}

/** Convenience: send the invoice email to the customer explicitly. */
export async function emailInvoice(invoiceId: string): Promise<void> {
  await zohoFetch(`/invoices/${invoiceId}/status/sent`, { method: 'POST' });
}
