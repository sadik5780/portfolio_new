import 'server-only';
import { headers } from 'next/headers';
import type { Currency } from '@/data/pricing';

/**
 * Pick the pricing currency based on the visitor's country, detected from
 * edge/geo headers set by the hosting provider (Vercel / Cloudflare / Netlify).
 *
 * - Visitors from India (country code `IN`) → INR
 * - Everyone else (and local dev, where no geo header is set) → USD
 *
 * This makes the page dynamic at request time (via `headers()`) — acceptable
 * since the contact page is already tiny and every lookup hits Supabase anyway.
 */
export function detectCurrencyFromHeaders(): Currency {
  const h = headers();
  const country = (
    h.get('x-vercel-ip-country') ??      // Vercel
    h.get('cf-ipcountry') ??             // Cloudflare
    h.get('x-nf-country-code') ??        // Netlify
    h.get('x-country-code') ??           // generic
    ''
  ).toUpperCase();

  return country === 'IN' ? 'inr' : 'usd';
}
