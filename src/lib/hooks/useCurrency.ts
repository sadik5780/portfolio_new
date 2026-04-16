'use client';

import { useEffect, useState } from 'react';
import type { Currency } from '@/data/pricing';

const STORAGE_KEY = 'sadik-currency';

function readStoredCurrency(): Currency | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'inr' || v === 'usd' ? v : null;
  } catch {
    return null;
  }
}

/**
 * Detect currency by timezone — India = INR, everyone else = USD.
 * Timezone is more reliable than navigator.language (many Indian users
 * browse with an en-US locale) and doesn't require a network call.
 */
function detectByTimezone(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'inr';
  } catch {
    // Fall through.
  }
  return 'usd';
}

/**
 * Client-side currency with manual-override support.
 *
 * Priority on mount:
 *   1. User's manually-stored preference in localStorage (if any)
 *   2. Timezone detection (Asia/Kolkata → INR, else USD)
 *
 * Server render always uses USD as the safe default. After hydration the
 * real value is applied — there's a single flash of "$" → "₹" for Indian
 * visitors on first paint, which is acceptable for the scope.
 *
 * Returns [currency, setCurrency] — setCurrency persists to localStorage.
 */
export function useCurrency(): [Currency, (c: Currency) => void] {
  const [currency, setCurrencyState] = useState<Currency>('usd');

  useEffect(() => {
    const stored = readStoredCurrency();
    if (stored) {
      setCurrencyState(stored);
      return;
    }
    setCurrencyState(detectByTimezone());
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // Storage might be blocked (Safari private mode); no-op.
    }
  };

  return [currency, setCurrency];
}
