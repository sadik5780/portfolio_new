'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice, type Currency } from '@/data/pricing';
import type { PricingContent } from '@/lib/content/types';
import type { Offering } from '@/data/offerings';
import PaymentSummary, { type CheckoutRequest } from '@/components/Payments/PaymentSummary';
import styles from './QuoteBuilder.module.scss';

interface QuoteBuilderProps {
  pricing: PricingContent;
  offerings: Offering[];
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function QuoteBuilder({ pricing, offerings }: QuoteBuilderProps) {
  const search = useSearchParams();
  const initialSlug = search.get('service') || offerings[0].slug;
  const initialTier = search.get('tier');

  const [activeSlug, setActiveSlug] = useState<string>(initialSlug);
  const [staticTierId, setStaticTierId] = useState<string>(
    initialTier || pricing.static_tiers[1]?.id || pricing.static_tiers[0].id,
  );
  const [appFeatures, setAppFeatures] = useState<Set<string>>(new Set());
  const [mobileFeatures, setMobileFeatures] = useState<Set<string>>(new Set());

  // All quotes shown in USD regardless of visitor location.
  const currency = 'usd' as const;

  // Reset feature sets when switching service
  useEffect(() => {
    setAppFeatures(new Set());
    setMobileFeatures(new Set());
  }, [activeSlug]);

  const offering = offerings.find((o) => o.slug === activeSlug)!;

  // ── Calculate live price ───────────────────────
  const breakdown = useMemo(() => {
    if (offering.pricingKey === 'static_tiers') {
      const tier =
        pricing.static_tiers.find((t) => t.id === staticTierId) ??
        pricing.static_tiers[0];
      return {
        base: tier[currency],
        addOns: 0,
        addOnLabel: tier.name,
        total: tier[currency],
      };
    }
    if (offering.pricingKey === 'shopify') {
      return {
        base: pricing.shopify[currency],
        addOns: 0,
        addOnLabel: '',
        total: pricing.shopify[currency],
      };
    }
    const cfg = offering.pricingKey === 'app' ? pricing.app : pricing.mobile;
    const featureSet = offering.pricingKey === 'app' ? appFeatures : mobileFeatures;
    const base = cfg.base[currency];
    const addOns = featureSet.size * cfg.feature_price[currency];
    return {
      base,
      addOns,
      addOnLabel: `${featureSet.size} feature${featureSet.size === 1 ? '' : 's'}`,
      total: base + addOns,
    };
  }, [offering, pricing, currency, staticTierId, appFeatures, mobileFeatures]);

  // ── Form ───────────────────────────────────────
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // ── Payment modal ──────────────────────────────
  const [payOpen, setPayOpen] = useState(false);

  /**
   * Map the UI-facing offering to the server-side ServiceType contract.
   * Server supports: 'shopify' | 'static:<tier-id>' | 'custom-app'.
   * Mobile offerings fall back to the quote-request flow (too bespoke to
   * checkout directly — they need a scoping call).
   */
  const checkoutRequest: CheckoutRequest | null = useMemo(() => {
    let service: string | null = null;
    let featureIds: string[] = [];

    if (offering.pricingKey === 'shopify') {
      service = 'shopify';
    } else if (offering.pricingKey === 'static_tiers') {
      service = `static:${staticTierId}`;
    } else if (offering.pricingKey === 'app') {
      service = 'custom-app';
      featureIds = Array.from(appFeatures);
    }

    if (!service) return null;

    return {
      service,
      serviceLabel: offering.name,
      currency,
      features: featureIds,
      breakdown: {
        base: breakdown.base,
        features: breakdown.addOns,
        total: breakdown.total,
      },
    };
  }, [offering, staticTierId, appFeatures, currency, breakdown]);

  const toggleFeature = (
    setter: typeof setAppFeatures,
    id: string,
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => {
    setAppFeatures(new Set());
    setMobileFeatures(new Set());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const featureNames = (() => {
      if (offering.pricingKey === 'app') {
        return pricing.app.features
          .filter((f) => appFeatures.has(f.id))
          .map((f) => f.name);
      }
      if (offering.pricingKey === 'mobile') {
        return pricing.mobile.features
          .filter((f) => mobileFeatures.has(f.id))
          .map((f) => f.name);
      }
      if (offering.pricingKey === 'static_tiers') {
        return [breakdown.addOnLabel];
      }
      return [];
    })();

    const messageParts = [
      `Service: ${offering.name}`,
      `Estimate: ${formatPrice(breakdown.total, currency)} (${currency.toUpperCase()})`,
      featureNames.length ? `Features: ${featureNames.join(', ')}` : null,
      form.message ? `\nNotes:\n${form.message}` : null,
    ].filter(Boolean);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          projectType: offering.name,
          budget: `${formatPrice(breakdown.total, currency)} (estimated)`,
          message: messageParts.join('\n'),
          currency,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Submission failed');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className={styles.successTitle}>Quote request received</h2>
        <p className={styles.successCopy}>
          I&apos;ll review your scope and send a fixed quote with a proposed
          timeline within 24 hours. Look out for an email at{' '}
          <strong>{form.email}</strong>.
        </p>
        <p className={styles.successMeta}>
          Your tentative estimate: <strong>{formatPrice(breakdown.total, currency)}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {/* ── Step 1: pick a service ──────────────── */}
      <div className={styles.step}>
        <div className={styles.stepHead}>
          <span className={styles.stepNum}>1</span>
          <h2 className={styles.stepTitle}>Pick a service</h2>
        </div>
        <div className={styles.serviceGrid}>
          {offerings.map((o) => {
            const active = o.slug === activeSlug;
            return (
              <button
                key={o.slug}
                type="button"
                className={`${styles.serviceCard} ${active ? styles.serviceCardActive : ''}`}
                onClick={() => setActiveSlug(o.slug)}
                aria-pressed={active}
              >
                <div className={styles.serviceCardIcon} aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={o.icon} />
                  </svg>
                </div>
                <span className={styles.serviceCardName}>{o.name}</span>
                <span className={styles.serviceCardPrice}>
                  from {formatPrice(o.startingUsd, currency)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Step 2: configure ───────────────────── */}
      <div className={styles.step}>
        <div className={styles.stepHead}>
          <span className={styles.stepNum}>2</span>
          <h2 className={styles.stepTitle}>Configure {offering.name.toLowerCase()}</h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={styles.configBody}
          >
            {/* Static — pick a tier */}
            {offering.pricingKey === 'static_tiers' && (
              <div className={styles.tierRow}>
                {pricing.static_tiers.map((tier) => {
                  const active = tier.id === staticTierId;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      className={`${styles.tierOption} ${active ? styles.tierOptionActive : ''}`}
                      onClick={() => setStaticTierId(tier.id)}
                      aria-pressed={active}
                    >
                      <div className={styles.tierOptionHead}>
                        <span className={styles.tierOptionName}>{tier.name}</span>
                        <span className={styles.tierOptionPrice}>
                          {formatPrice(tier[currency], currency)}
                        </span>
                      </div>
                      <p className={styles.tierOptionDesc}>{tier.description}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Shopify — fixed scope, just show what's included */}
            {offering.pricingKey === 'shopify' && (
              <div className={styles.fixedScope}>
                <p className={styles.fixedScopeNote}>
                  The Shopify build is a fixed scope at{' '}
                  <strong>{formatPrice(pricing.shopify[currency], currency)}</strong>.
                  Headless Hydrogen and complex integrations are quoted
                  separately — describe what you need in the message field below.
                </p>
                <ul className={styles.fixedScopeList}>
                  {offering.features.map((f) => (
                    <li key={f}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* App OR Mobile — feature picker */}
            {(offering.pricingKey === 'app' || offering.pricingKey === 'mobile') && (
              <FeaturePicker
                features={
                  offering.pricingKey === 'app'
                    ? pricing.app.features
                    : pricing.mobile.features
                }
                selected={offering.pricingKey === 'app' ? appFeatures : mobileFeatures}
                onToggle={(id) =>
                  toggleFeature(
                    offering.pricingKey === 'app' ? setAppFeatures : setMobileFeatures,
                    id,
                  )
                }
                featurePrice={
                  offering.pricingKey === 'app'
                    ? pricing.app.feature_price[currency]
                    : pricing.mobile.feature_price[currency]
                }
                currency={currency}
                onReset={reset}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Live quote summary + step 3 form ───── */}
      <div className={styles.summarySection}>
        <aside className={styles.summary} aria-live="polite">
          <span className={styles.summaryLabel}>Live estimate</span>
          <div className={styles.summaryRow}>
            <span>Base</span>
            <span>{formatPrice(breakdown.base, currency)}</span>
          </div>
          {breakdown.addOns > 0 && (
            <div className={styles.summaryRow}>
              <span>{breakdown.addOnLabel}</span>
              <span>+ {formatPrice(breakdown.addOns, currency)}</span>
            </div>
          )}
          {offering.pricingKey === 'static_tiers' && (
            <div className={styles.summaryRow}>
              <span>Tier</span>
              <span>{breakdown.addOnLabel}</span>
            </div>
          )}
          <div className={styles.summaryDivider} />
          <div className={styles.summaryTotal}>
            <span>Estimated total</span>
            <motion.span
              key={breakdown.total}
              initial={{ opacity: 0.5, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={styles.summaryTotalValue}
            >
              {formatPrice(breakdown.total, currency)}
            </motion.span>
          </div>
          <p className={styles.summaryNote}>
            Tentative — locked in writing after a 15-min scoping call.
          </p>
        </aside>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.stepHead}>
            <span className={styles.stepNum}>3</span>
            <h2 className={styles.stepTitle}>Send the quote request</h2>
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label htmlFor="q-name" className={styles.fieldLabel}>Name</label>
              <input
                id="q-name"
                className={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoComplete="name"
                placeholder="Jane Doe"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="q-email" className={styles.fieldLabel}>Email</label>
              <input
                id="q-email"
                type="email"
                className={styles.input}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
                placeholder="jane@company.com"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="q-msg" className={styles.fieldLabel}>
              Anything specific?{' '}
              <span className={styles.fieldHint}>(timeline, integrations, custom requirements)</span>
            </label>
            <textarea
              id="q-msg"
              className={styles.textarea}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              placeholder="e.g. Need to launch by end of Q1, must integrate with HubSpot, Spanish + English…"
            />
          </div>

          {status === 'error' && (
            <div className={styles.alertError}>
              {errorMsg || 'Something went wrong. Email sadik5780@gmail.com directly.'}
            </div>
          )}

          <div className={styles.ctaRow}>
            {checkoutRequest && (
              <button
                type="button"
                className={styles.payBtn}
                onClick={() => setPayOpen(true)}
                disabled={status === 'submitting'}
              >
                Pay {formatPrice(breakdown.total, currency)} now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </button>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? (
                <>
                  <span className={styles.spinner} />
                  Sending…
                </>
              ) : (
                <>
                  {checkoutRequest ? 'Or request a quote' : `Request fixed quote — ${formatPrice(breakdown.total, currency)}`}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </>
              )}
            </button>
          </div>

          <p className={styles.fineprint}>
            Pay securely via Razorpay to lock in your slot, or request a quote and I&apos;ll reply within 24 hours.
          </p>
        </form>
      </div>

      <PaymentSummary
        open={payOpen}
        onClose={() => setPayOpen(false)}
        request={payOpen ? checkoutRequest : null}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────
// Reusable feature-checkbox grid for app + mobile
// ─────────────────────────────────────────────────
function FeaturePicker({
  features,
  selected,
  onToggle,
  featurePrice,
  currency,
  onReset,
}: {
  features: Array<{ id: string; name: string; description: string }>;
  selected: Set<string>;
  onToggle: (id: string) => void;
  featurePrice: number;
  currency: Currency;
  onReset: () => void;
}) {
  return (
    <div className={styles.picker}>
      <div className={styles.pickerHead}>
        <span className={styles.pickerLabel}>
          Pick optional features ({features.length} available)
        </span>
        {selected.size > 0 && (
          <button
            type="button"
            className={styles.pickerReset}
            onClick={onReset}
          >
            Reset ({selected.size})
          </button>
        )}
      </div>

      <div className={styles.pickerGrid}>
        {features.map((f) => {
          const active = selected.has(f.id);
          return (
            <label
              key={f.id}
              className={`${styles.feature} ${active ? styles.featureActive : ''}`}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={active}
                onChange={() => onToggle(f.id)}
              />
              <span className={styles.featureCheck} aria-hidden>
                {active && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span className={styles.featureBody}>
                <span className={styles.featureName}>{f.name}</span>
                <span className={styles.featureDesc}>{f.description}</span>
              </span>
              <span className={styles.featurePrice}>
                +{formatPrice(featurePrice, currency)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
