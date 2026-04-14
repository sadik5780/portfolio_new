import 'server-only';
import { getPricing } from '@/lib/content/settings';
import type { PricingContent } from '@/lib/content/types';
import type {
  PaymentCurrency,
  ResolvedPrice,
  ServiceType,
} from './types';

/**
 * Resolve the authoritative price for a given service on the server.
 * NEVER trust any amount sent by the client — re-compute it here from
 * the pricing settings in the database, and use THIS number for Razorpay.
 *
 * Returns null if the service ID / feature set is invalid.
 */
export async function resolveServerPrice(params: {
  service: ServiceType;
  currency: PaymentCurrency;
  features?: string[];
}): Promise<ResolvedPrice | null> {
  const pricing = await getPricing();
  const currencyKey = params.currency === 'INR' ? 'inr' : 'usd';

  // ── Shopify ───────────────────────────────────────
  if (params.service === 'shopify') {
    const amount = pricing.shopify[currencyKey];
    if (!amount || amount <= 0) return null;
    return makeResolved({
      amount,
      currency: params.currency,
      serviceLabel: 'Shopify Store Development',
      breakdown: { base: amount, features: 0, total: amount },
      features: [],
    });
  }

  // ── Static website tiers ──────────────────────────
  if (params.service.startsWith('static:')) {
    const tierId = params.service.slice('static:'.length);
    const tier = pricing.static_tiers.find((t) => t.id === tierId);
    if (!tier) return null;
    const amount = tier[currencyKey];
    if (!amount || amount <= 0) return null;
    return makeResolved({
      amount,
      currency: params.currency,
      serviceLabel: `Static Website — ${tier.name}`,
      breakdown: { base: amount, features: 0, total: amount },
      features: [],
    });
  }

  // ── Custom app builder ────────────────────────────
  if (params.service === 'custom-app') {
    return resolveCustomAppPrice({
      pricing,
      currency: params.currency,
      features: params.features ?? [],
    });
  }

  return null;
}

function resolveCustomAppPrice(args: {
  pricing: PricingContent;
  currency: PaymentCurrency;
  features: string[];
}): ResolvedPrice | null {
  const { pricing, currency, features } = args;
  const currencyKey = currency === 'INR' ? 'inr' : 'usd';

  const base = pricing.app.base[currencyKey];
  const perFeature = pricing.app.feature_price[currencyKey];
  if (!base || base <= 0 || perFeature < 0) return null;

  // Only accept feature IDs that exist in the current pricing config.
  const validIds = new Set(pricing.app.features.map((f) => f.id));
  const validFeatures = features
    .filter((id) => typeof id === 'string' && validIds.has(id))
    // de-dupe while preserving order
    .filter((id, i, arr) => arr.indexOf(id) === i);

  const featureCost = validFeatures.length * perFeature;
  const total = base + featureCost;

  // Name the selected features for admin / invoice display.
  const selectedNames = pricing.app.features
    .filter((f) => validFeatures.includes(f.id))
    .map((f) => f.name);

  const label = validFeatures.length
    ? `Custom Web App (${validFeatures.length} feature${validFeatures.length === 1 ? '' : 's'})`
    : 'Custom Web App (base)';

  return makeResolved({
    amount: total,
    currency,
    serviceLabel: label,
    breakdown: { base, features: featureCost, total },
    features: selectedNames,
  });
}

function makeResolved(partial: {
  amount: number;
  currency: PaymentCurrency;
  serviceLabel: string;
  breakdown: { base: number; features: number; total: number };
  features: string[];
}): ResolvedPrice {
  return {
    ...partial,
    // Razorpay always expects the smallest currency unit.
    // ₹1 = 100 paise, $1 = 100 cents.
    amountMinor: Math.round(partial.amount * 100),
  };
}
