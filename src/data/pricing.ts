/**
 * Pricing utilities.
 * Actual pricing data lives in the `settings` table under key `pricing`
 * and is fetched via `@/lib/content/settings` → `getPricing()`.
 */

export type Currency = 'inr' | 'usd';

export const CURRENCY_META: Record<
  Currency,
  { symbol: string; label: string; code: string }
> = {
  inr: { symbol: '₹', label: 'India (INR)', code: 'INR' },
  usd: { symbol: '$', label: 'International (USD)', code: 'USD' },
};

export function formatPrice(amount: number, currency: Currency): string {
  const symbol = CURRENCY_META[currency].symbol;
  return `${symbol}${amount.toLocaleString(currency === 'inr' ? 'en-IN' : 'en-US')}`;
}

export interface CalculatePriceInput {
  base: number;
  featurePrice: number;
  selectedCount: number;
}

export function calculateAppPrice({
  base,
  featurePrice,
  selectedCount,
}: CalculatePriceInput): { base: number; features: number; total: number } {
  const features = selectedCount * featurePrice;
  return { base, features, total: base + features };
}

// Re-export shared types for convenience
export type { PricingContent } from '@/lib/content/types';
