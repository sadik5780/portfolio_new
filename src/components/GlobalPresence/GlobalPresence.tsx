'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './GlobalPresence.module.scss';

interface Region {
  flag: string;
  country: string;
  overlap: string;
  billing: string;
  note: string;
  href: string;
}

const REGIONS: Region[] = [
  {
    flag: '🇺🇸',
    country: 'USA',
    overlap: 'Morning EST · Afternoon PST',
    billing: 'USD via Stripe / Wise / wire',
    note: 'NDAs and MSAs signed before kickoff. Standard 30/40/30 milestone billing.',
    href: '/services/react-developer/usa',
  },
  {
    flag: '🇬🇧',
    country: 'United Kingdom',
    overlap: 'Full GMT/BST afternoon overlap',
    billing: 'GBP via Wise · USD via Stripe',
    note: 'UK-jurisdiction NDAs/MSAs, VAT-aware invoicing, Klarna/Clearpay for Shopify.',
    href: '/services/react-developer/uk',
  },
  {
    flag: '🇦🇺',
    country: 'Australia',
    overlap: 'AEST/AEDT morning overlap',
    billing: 'USD via Stripe or Wise',
    note: 'Afterpay / Zip / Klarna wiring for Shopify. Fractional retainers for funded startups.',
    href: '/services/react-developer/australia',
  },
  {
    flag: '🇮🇳',
    country: 'India',
    overlap: 'Full IST overlap',
    billing: 'USD default · INR settlement via Razorpay',
    note: 'GST-compliant invoicing on request. Daily standups + WhatsApp for tight loops.',
    href: '/services/react-developer/india',
  },
];

export default function GlobalPresence() {
  return (
    <section className={styles.section} id="global-presence" aria-labelledby="global-presence-heading">
      <div className={styles.container}>
        <SectionHeading
          label="Global"
          title="Serving founders in USA, UK, Australia & India"
          description="Async-first by default, with daily timezone overlap for live standups, code reviews, and planning."
        />

        <div className={styles.grid}>
          {REGIONS.map((r, i) => (
            <motion.article
              key={r.country}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <span className={styles.flag} aria-hidden>{r.flag}</span>
              <h3 className={styles.country}>{r.country}</h3>

              <dl className={styles.meta}>
                <div>
                  <dt>Overlap</dt>
                  <dd>{r.overlap}</dd>
                </div>
                <div>
                  <dt>Billing</dt>
                  <dd>{r.billing}</dd>
                </div>
              </dl>

              <p className={styles.note}>{r.note}</p>

              <Link href={r.href} className={styles.cta}>
                See {r.country} services →
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
