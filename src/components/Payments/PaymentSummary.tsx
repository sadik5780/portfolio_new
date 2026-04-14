'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice, type Currency } from '@/data/pricing';
import { loadRazorpayScript, type RazorpaySuccessResponse } from './razorpay-script';
import styles from './PaymentSummary.module.scss';

export interface CheckoutRequest {
  service: string;                  // 'shopify' | 'static:<id>' | 'custom-app'
  serviceLabel: string;             // display name
  currency: Currency;               // 'inr' | 'usd'
  features: string[];               // feature IDs for custom-app
  breakdown: {
    base: number;
    features: number;
    total: number;
  };
}

interface PaymentSummaryProps {
  open: boolean;
  onClose: () => void;
  request: CheckoutRequest | null;
}

type Phase = 'idle' | 'creating' | 'opening' | 'verifying' | 'error';

export default function PaymentSummary({
  open,
  onClose,
  request,
}: PaymentSummaryProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Reset on re-open
  useEffect(() => {
    if (open) {
      setPhase('idle');
      setError(null);
    }
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'idle') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, phase]);

  if (!request) return null;

  const { serviceLabel, breakdown, currency, service, features } = request;
  const busy = phase !== 'idle' && phase !== 'error';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setPhase('creating');

    try {
      // ── 1. Create order on the server ──────────
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          currency: currency.toUpperCase(),
          features,
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
          },
        }),
      });

      const orderData = (await orderRes.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        paymentId?: string;
        orderId?: string;
        amount?: number;
        currency?: 'INR' | 'USD';
        serviceLabel?: string;
        keyId?: string;
      };

      if (!orderRes.ok || !orderData.ok) {
        throw new Error(orderData.error ?? 'Could not create order');
      }

      const { paymentId, orderId, amount, currency: orderCurrency, keyId } =
        orderData;
      if (!paymentId || !orderId || !amount || !orderCurrency || !keyId) {
        throw new Error('Invalid response from server');
      }

      // ── 2. Load Razorpay script ────────────────
      await loadRazorpayScript();

      // ── 3. Open checkout ──────────────────────
      setPhase('opening');
      const rzp = new window.Razorpay({
        key: keyId,
        order_id: orderId,
        amount,
        currency: orderCurrency,
        name: 'Sadik',
        description: orderData.serviceLabel ?? serviceLabel,
        theme: { color: '#6366f1' },
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        handler: async (resp: RazorpaySuccessResponse) => {
          await verifyAndRedirect({
            paymentId,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            // User closed the Razorpay modal without paying. Return to idle.
            setPhase('idle');
          },
        },
      });

      rzp.on('payment.failed', (failure) => {
        console.error('[razorpay] payment failed', failure);
        setPhase('error');
        setError(failure.error.description || 'Payment failed. Please try again.');
      });

      rzp.open();
    } catch (err) {
      setPhase('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const verifyAndRedirect = async (payload: {
    paymentId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setPhase('verifying');
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        paymentId?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'Verification failed');
      }
      onClose();
      router.push(`/payment/success?id=${payload.paymentId}`);
    } catch (err) {
      setPhase('error');
      setError(
        err instanceof Error
          ? err.message
          : 'Payment succeeded but verification failed — contact support.',
      );
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={phase === 'idle' ? onClose : undefined}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Confirm payment"
          >
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
              disabled={busy}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={styles.head}>
              <span className={styles.label}>Checkout</span>
              <h2 className={styles.title}>{serviceLabel}</h2>
              <p className={styles.sub}>
                Review your order and enter your contact details.
              </p>
            </div>

            {/* ── Breakdown ─────────────────── */}
            <div className={styles.breakdown}>
              <div className={styles.row}>
                <span>Base price</span>
                <span className={styles.amount}>
                  {formatPrice(breakdown.base, currency)}
                </span>
              </div>
              {breakdown.features > 0 && (
                <div className={styles.row}>
                  <span>
                    Features (&nbsp;{features.length}&nbsp;)
                  </span>
                  <span className={styles.amount}>
                    + {formatPrice(breakdown.features, currency)}
                  </span>
                </div>
              )}
              <div className={styles.divider} />
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmount}>
                  {formatPrice(breakdown.total, currency)}
                </span>
              </div>
              <div className={styles.note}>
                Secure checkout powered by Razorpay. You&apos;ll receive an email
                receipt once payment is confirmed.
              </div>
            </div>

            {/* ── Form ─────────────────────── */}
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="ps-name" className={styles.fieldLabel}>Full name</label>
                <input
                  id="ps-name"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={busy}
                  placeholder="Jane Doe"
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label htmlFor="ps-email" className={styles.fieldLabel}>Email</label>
                  <input
                    id="ps-email"
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={busy}
                    placeholder="jane@company.com"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="ps-phone" className={styles.fieldLabel}>
                    Phone <span className={styles.hint}>(optional)</span>
                  </label>
                  <input
                    id="ps-phone"
                    type="tel"
                    className={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    disabled={busy}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  className={styles.alert}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                className={styles.payBtn}
                disabled={busy}
              >
                {phase === 'idle' && (
                  <>
                    Pay {formatPrice(breakdown.total, currency)}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </>
                )}
                {phase === 'creating' && (
                  <>
                    <span className={styles.spinner} /> Preparing secure checkout…
                  </>
                )}
                {phase === 'opening' && <>Opening Razorpay…</>}
                {phase === 'verifying' && (
                  <>
                    <span className={styles.spinner} /> Verifying payment…
                  </>
                )}
                {phase === 'error' && <>Try again</>}
              </button>

              <p className={styles.legal}>
                By paying, you agree to the scope outlined in the quote and to
                a 30%/40%/30% delivery milestone schedule.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
