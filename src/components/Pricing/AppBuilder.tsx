'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateAppPrice,
  formatPrice,
  type Currency,
} from '@/data/pricing';
import type { PricingContent } from '@/lib/content/types';
import CheckoutButton from '@/components/Payments/CheckoutButton';
import styles from './AppBuilder.module.scss';

interface AppBuilderProps {
  pricing: PricingContent['app'];
  currency: Currency;
  selectedFeatures: string[];
  onToggle: (featureId: string) => void;
  onReset: () => void;
  onUseQuote: () => void;
}

export default function AppBuilder({
  pricing,
  currency,
  selectedFeatures,
  onToggle,
  onReset,
  onUseQuote,
}: AppBuilderProps) {
  const { base, features, total } = calculateAppPrice({
    base: pricing.base[currency],
    featurePrice: pricing.feature_price[currency],
    selectedCount: selectedFeatures.length,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.intro}>
        <span className={styles.label}>Build Your Quote</span>
        <h3 className={styles.title}>Custom Web App Builder</h3>
        <p className={styles.copy}>
          Select the features you need. Your quote updates in real time. Base price
          includes architecture, core UI, database setup, authentication scaffolding,
          deployment, and 30 days of post-launch support.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.featuresSection}>
          <div className={styles.featuresHead}>
            <h4 className={styles.subhead}>Features ({pricing.features.length})</h4>
            {selectedFeatures.length > 0 && (
              <button className={styles.resetBtn} onClick={onReset} type="button">
                Reset ({selectedFeatures.length})
              </button>
            )}
          </div>

          <div className={styles.featureGrid}>
            {pricing.features.map((feature, i) => {
              const isSelected = selectedFeatures.includes(feature.id);
              return (
                <motion.label
                  key={feature.id}
                  className={`${styles.feature} ${isSelected ? styles.featureSelected : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  whileHover={{ y: -2 }}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSelected}
                    onChange={() => onToggle(feature.id)}
                  />
                  <div className={styles.checkboxVisual} aria-hidden>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="3"
                          strokeLinecap="round" strokeLinejoin="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          exit={{ pathLength: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className={styles.featureText}>
                    <span className={styles.featureName}>{feature.name}</span>
                    <span className={styles.featureDesc}>{feature.description}</span>
                  </div>
                  <span className={styles.featurePrice}>
                    +{formatPrice(pricing.feature_price[currency], currency)}
                  </span>
                </motion.label>
              );
            })}
          </div>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summary}>
            <span className={styles.summaryLabel}>Live Quote</span>

            <div className={styles.summaryRow}>
              <span>Base price</span>
              <span className={styles.summaryValue}>
                {formatPrice(base, currency)}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span>Features ({selectedFeatures.length})</span>
              <motion.span
                key={selectedFeatures.length}
                className={styles.summaryValue}
                initial={{ opacity: 0.4, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {features > 0 ? '+ ' : ''}
                {formatPrice(features, currency)}
              </motion.span>
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <motion.span
                key={total}
                className={styles.totalValue}
                initial={{ opacity: 0.5, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {formatPrice(total, currency)}
              </motion.span>
            </div>

            <p className={styles.summaryNote}>
              Fixed quote. Payment split 30% to start, 40% at midpoint, 30% on delivery.
            </p>

            {/* Primary action: pay now via Razorpay */}
            <CheckoutButton
              className={styles.useQuoteBtn}
              request={{
                service: 'custom-app',
                serviceLabel:
                  selectedFeatures.length > 0
                    ? `Custom Web App (${selectedFeatures.length} feature${selectedFeatures.length === 1 ? '' : 's'})`
                    : 'Custom Web App (base)',
                currency,
                features: selectedFeatures,
                breakdown: { base, features, total },
              }}
            >
              Pay {formatPrice(total, currency)} now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </CheckoutButton>

            {/* Secondary action: send to contact form for custom discussion */}
            <button
              className={styles.quoteLinkBtn}
              type="button"
              onClick={onUseQuote}
            >
              Or discuss this quote by email →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
