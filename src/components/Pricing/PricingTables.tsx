'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice, type Currency } from '@/data/pricing';
import type { PricingContent } from '@/lib/content/types';
import type { Offering } from '@/data/offerings';
import styles from './PricingTables.module.scss';

interface PricingTablesProps {
  pricing: PricingContent;
  offerings: Offering[];
  /** Geo-detected currency. Defaults to 'usd' if not provided. */
  currency?: Currency;
}

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function PricingTables({
  pricing,
  offerings,
  currency = 'usd',
}: PricingTablesProps) {

  // Map offering slug → its display section. Filter out any section whose
  // underlying offering no longer exists in the DB (admin may have deleted
  // it), so the page still renders the remaining sections instead of 500-ing.
  const SECTION_MAP: Array<{ slug: string; render: 'static' | 'shopify' | 'app' | 'mobile' }> = [
    { slug: 'static-website', render: 'static' },
    { slug: 'shopify-store', render: 'shopify' },
    { slug: 'saas-platform', render: 'app' },
    { slug: 'custom-web-app', render: 'app' },
    { slug: 'mobile-app', render: 'mobile' },
  ];

  const sections = SECTION_MAP
    .map((s) => ({
      render: s.render,
      offering: offerings.find((o) => o.slug === s.slug),
    }))
    .filter(
      (s): s is { render: typeof s.render; offering: Offering } =>
        s.offering !== undefined,
    );

  if (sections.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {sections.map((s, sectionIndex) => (
          <div key={s.offering.slug} className={styles.block} id={s.offering.slug}>
            <div className={styles.blockHead}>
              <span className={styles.blockLabel}>{s.offering.category}</span>
              <h2 className={styles.blockTitle}>{s.offering.name}</h2>
              <p className={styles.blockSub}>{s.offering.tagline}</p>
            </div>

            {/* ── Static website tiers ────────────────── */}
            {s.render === 'static' && (
              <div className={styles.tiersGrid}>
                {pricing.static_tiers.map((tier, i) => (
                  <motion.div
                    key={tier.id}
                    className={`${styles.tier} ${tier.id === 'standard' ? styles.tierHighlight : ''}`}
                    variants={cardAnim}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    custom={i}
                  >
                    {tier.id === 'standard' && (
                      <span className={styles.tierBadge}>Most Popular</span>
                    )}
                    <h3 className={styles.tierName}>{tier.name}</h3>
                    <p className={styles.tierDesc}>{tier.description}</p>
                    <div className={styles.tierPrice}>
                      {formatPrice(tier[currency], currency)}
                    </div>
                    <ul className={styles.tierIncludes}>
                      {tier.includes.map((item) => (
                        <li key={item}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/quote?service=${s.offering.slug}&tier=${tier.id}`}
                      className={styles.tierCta}
                    >
                      Get a quote
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── Shopify single price ────────────────── */}
            {s.render === 'shopify' && (
              <motion.div
                className={styles.singlePriceCard}
                variants={cardAnim}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={0}
              >
                <div className={styles.singleLeft}>
                  <h3 className={styles.singleTitle}>Custom Shopify Build</h3>
                  <p className={styles.singleDesc}>
                    Custom 2.0 theme or headless Hydrogen storefront. Mobile
                    PageSpeed 90+, checkout customisation (Plus), subscriptions,
                    multi-currency. Quoted per scope.
                  </p>
                  <ul className={styles.singleList}>
                    {s.offering.features.slice(0, 6).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.singleRight}>
                  <span className={styles.singlePriceLabel}>Starting at</span>
                  <div className={styles.singlePrice}>
                    {formatPrice(pricing.shopify[currency], currency)}
                  </div>
                  <p className={styles.singlePriceNote}>
                    Headless Hydrogen builds quoted separately based on scope.
                  </p>
                  <Link
                    href={`/quote?service=${s.offering.slug}`}
                    className={styles.singleCta}
                  >
                    Get a quote
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── App / Mobile builder summary ────────── */}
            {(s.render === 'app' || s.render === 'mobile') && (
              <motion.div
                className={styles.builderCard}
                variants={cardAnim}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={sectionIndex}
              >
                <div className={styles.builderLeft}>
                  <h3 className={styles.builderTitle}>How {s.offering.name} pricing works</h3>
                  <p className={styles.builderDesc}>
                    Base price covers the core build. Add features from the
                    quote estimator — each one adds a fixed amount, so the
                    total is always known up-front.
                  </p>

                  <ul className={styles.builderRows}>
                    <li>
                      <span>Base price</span>
                      <strong>
                        {formatPrice(
                          (s.render === 'app' ? pricing.app : pricing.mobile).base[currency],
                          currency,
                        )}
                      </strong>
                    </li>
                    <li>
                      <span>Per feature</span>
                      <strong>
                        +{formatPrice(
                          (s.render === 'app' ? pricing.app : pricing.mobile).feature_price[currency],
                          currency,
                        )}
                      </strong>
                    </li>
                    <li>
                      <span>Available features</span>
                      <strong>
                        {(s.render === 'app' ? pricing.app : pricing.mobile).features.length} options
                      </strong>
                    </li>
                  </ul>
                </div>

                <div className={styles.builderRight}>
                  <span className={styles.builderLabel}>Available add-ons</span>
                  <div className={styles.builderFeatures}>
                    {(s.render === 'app' ? pricing.app : pricing.mobile).features
                      .slice(0, 9)
                      .map((f) => (
                        <span key={f.id} className={styles.builderFeature}>
                          {f.name}
                        </span>
                      ))}
                    {(s.render === 'app' ? pricing.app : pricing.mobile).features.length > 9 && (
                      <span className={styles.builderFeatureMore}>
                        + {(s.render === 'app' ? pricing.app : pricing.mobile).features.length - 9}{' '}
                        more
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/quote?service=${s.offering.slug}`}
                    className={styles.builderCta}
                  >
                    Build your quote
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
