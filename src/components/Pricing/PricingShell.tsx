'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ServicesPricing from './ServicesPricing';
import AppBuilder from './AppBuilder';
import ContactForm, {
  type ContactFormPreset,
} from '@/components/ContactForm/ContactForm';
import { calculateAppPrice, type Currency } from '@/data/pricing';
import type { PricingContent } from '@/lib/content/types';
import styles from './PricingShell.module.scss';

interface PricingShellProps {
  pricing: PricingContent;
}

/**
 * Detect whether the visitor is in India — from browser timezone first,
 * locale as a backup. Runs purely client-side so the server render stays
 * fully static (cached at the CDN edge).
 */
function isIndianVisitor(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return true;
  } catch {
    // Safari/old browsers — ignore
  }
  try {
    const locale = navigator.language || '';
    if (locale.toLowerCase().endsWith('-in')) return true;
  } catch {
    // ignore
  }
  return false;
}

export default function PricingShell({ pricing }: PricingShellProps) {
  // Server always renders INR to avoid hydration mismatch. Client effect flips
  // to USD for non-Indian visitors after hydration (typically within ~10ms).
  const [currency, setCurrency] = useState<Currency>('inr');

  useEffect(() => {
    if (!isIndianVisitor()) setCurrency('usd');
  }, []);

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [preset, setPreset] = useState<ContactFormPreset | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleQuickSelect = useCallback(
    (projectType: string, amount: number) => {
      setPreset({ projectType, budgetAmount: amount });
      setTimeout(scrollToForm, 150);
    },
    [],
  );

  const handleToggleFeature = useCallback((featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId],
    );
  }, []);

  const handleReset = useCallback(() => setSelectedFeatures([]), []);

  const handleUseQuote = useCallback(() => {
    const { total } = calculateAppPrice({
      base: pricing.app.base[currency],
      featurePrice: pricing.app.feature_price[currency],
      selectedCount: selectedFeatures.length,
    });
    setPreset({ projectType: 'Custom Web App', budgetAmount: total });
    setTimeout(scrollToForm, 150);
  }, [selectedFeatures, currency, pricing]);

  return (
    <>
      <section className={styles.block}>
        <div className={styles.container}>
          <motion.div
            className={styles.blockHead}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
          >
            <span className={styles.label}>Services &amp; Pricing</span>
            <h2 className={styles.title}>Clear, fixed pricing</h2>
            <p className={styles.copy}>
              Fixed quotes. Every scope is agreed in writing before
              work starts — no surprise bills.
            </p>
          </motion.div>

          <ServicesPricing
            pricing={pricing}
            currency={currency}
            onQuickSelect={handleQuickSelect}
          />
        </div>
      </section>

      <section className={`${styles.block} ${styles.blockBuilder}`}>
        <div className={styles.container}>
          <AppBuilder
            pricing={pricing.app}
            currency={currency}
            selectedFeatures={selectedFeatures}
            onToggle={handleToggleFeature}
            onReset={handleReset}
            onUseQuote={handleUseQuote}
          />
        </div>
      </section>

      <section className={styles.block} id="contact-form">
        <div className={styles.container}>
          <ContactForm currency={currency} preset={preset} ref={formRef} />
        </div>
      </section>
    </>
  );
}
