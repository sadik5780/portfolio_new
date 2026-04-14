'use client';

import { motion } from 'framer-motion';
import { formatPrice, type Currency } from '@/data/pricing';
import type { PricingContent } from '@/lib/content/types';
import CheckoutButton from '@/components/Payments/CheckoutButton';
import styles from './ServicesPricing.module.scss';

interface ServicesPricingProps {
  pricing: PricingContent;
  currency: Currency;
  onQuickSelect: (projectType: string, amount: number) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export default function ServicesPricing({
  pricing,
  currency,
  onQuickSelect,
}: ServicesPricingProps) {
  const shopifyAmount = pricing.shopify[currency];

  return (
    <div className={styles.wrapper}>

      {/* ── Shopify card ────────────────────── */}
      <motion.div
        className={`${styles.card} ${styles.shopifyCard}`}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        custom={0}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardLeft}>
            <span className={styles.cardLabel}>Shopify Store Development</span>
            <h3 className={styles.cardTitle}>Custom Shopify Theme</h3>
            <p className={styles.cardCopy}>
              End-to-end Shopify store build. Custom theme, speed-optimized,
              SEO-ready, with subscription &amp; checkout customization available.
            </p>
            <ul className={styles.cardList}>
              <li>Custom Shopify 2.0 theme</li>
              <li>Product + collection page customization</li>
              <li>Speed &amp; Core Web Vitals optimization</li>
              <li>Basic on-page SEO + schema</li>
              <li>Third-party app integration (Klaviyo, Judge.me, etc.)</li>
            </ul>
          </div>
          <div className={styles.cardRight}>
            <div className={styles.priceBlock}>
              <span className={styles.priceLabel}>Starting at</span>
              <div className={styles.priceValue}>
                {formatPrice(shopifyAmount, currency)}
              </div>
            </div>

            <CheckoutButton
              className={styles.cardCta}
              request={{
                service: 'shopify',
                serviceLabel: 'Shopify Store Development',
                currency,
                features: [],
                breakdown: {
                  base: shopifyAmount,
                  features: 0,
                  total: shopifyAmount,
                },
              }}
            >
              Pay now
            </CheckoutButton>

            <button
              type="button"
              className={styles.cardQuoteBtn}
              onClick={() =>
                onQuickSelect('Shopify Store', shopifyAmount)
              }
            >
              Request a quote instead
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Static tiers ──────────────────────── */}
      <div className={styles.staticHeader}>
        <h3 className={styles.staticTitle}>Static Website Packages</h3>
        <p className={styles.staticCopy}>
          Marketing sites, portfolios, and multi-page brochure websites — built
          fast, animated, and fully responsive.
        </p>
      </div>

      <div className={styles.tiersGrid}>
        {pricing.static_tiers.map((tier, i) => {
          const amount = tier[currency];
          return (
            <motion.div
              key={tier.id}
              className={`${styles.tier} ${tier.id === 'standard' ? styles.tierHighlight : ''}`}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i + 1}
            >
              {tier.id === 'standard' && (
                <span className={styles.tierBadge}>Most Popular</span>
              )}
              <div className={styles.tierHead}>
                <h4 className={styles.tierName}>{tier.name}</h4>
                <p className={styles.tierDesc}>{tier.description}</p>
              </div>

              <div className={styles.tierPrice}>
                {formatPrice(amount, currency)}
                <span className={styles.tierPriceLabel}>one-time</span>
              </div>

              <ul className={styles.tierList}>
                {tier.includes.map((item) => (
                  <li key={item}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <CheckoutButton
                className={styles.tierCta}
                request={{
                  service: `static:${tier.id}`,
                  serviceLabel: `Static Website — ${tier.name}`,
                  currency,
                  features: [],
                  breakdown: { base: amount, features: 0, total: amount },
                }}
              >
                Pay {formatPrice(amount, currency)}
              </CheckoutButton>

              <button
                type="button"
                className={styles.tierQuoteBtn}
                onClick={() =>
                  onQuickSelect(`Static Website — ${tier.name}`, amount)
                }
              >
                Request a quote instead
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
