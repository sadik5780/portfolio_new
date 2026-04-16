'use client';

import { formatPrice } from '@/data/pricing';
import { useCurrency } from '@/lib/hooks/useCurrency';

interface OfferingPriceProps {
  inr: number;
  usd: number;
  prefix?: string;
  className?: string;
}

/**
 * Client-side offering price. Reads the user's currency preference (timezone
 * detection + localStorage override) and formats the amount accordingly.
 *
 * Used on server-rendered pages (e.g. /services) so the starting-price span
 * can still switch currency after hydration without forcing the whole page
 * to be dynamic.
 */
export default function OfferingPrice({
  inr,
  usd,
  prefix,
  className,
}: OfferingPriceProps) {
  const [currency] = useCurrency();
  const amount = currency === 'inr' ? inr : usd;
  return (
    <span className={className}>
      {prefix ? `${prefix} ` : ''}
      {formatPrice(amount, currency)}
    </span>
  );
}
