/**
 * Service type is one of a fixed set of IDs the UI and server agree on.
 * The server looks up the price from the `pricing` settings row — never
 * from the client — so clients cannot forge amounts.
 */
export type ServiceType =
  | 'shopify'
  | `static:${string}`  // static tiers keyed by tier.id (e.g. static:starter)
  | 'custom-app';

export type PaymentCurrency = 'INR' | 'USD';

export interface CustomerInput {
  name: string;
  email: string;
  phone?: string;
}

export interface ResolvedPrice {
  amount: number;        // display amount (e.g. 50000 for ₹50,000)
  amountMinor: number;   // smallest unit for Razorpay (paise / cents)
  currency: PaymentCurrency;
  serviceLabel: string;
  breakdown: {
    base: number;
    features: number;
    total: number;
  };
  features: string[];
}

export interface PaymentRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  service_label: string;
  features: string[];
  amount: number;
  amount_minor: number;
  currency: PaymentCurrency;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  failure_reason: string | null;
  notes: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
