'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import StaggerGrid, { staggerItem } from '@/components/StaggerGrid/StaggerGrid';
import styles from './Projects.module.scss';

type FeaturedBuild = {
  name: string;
  tag: string;
  description: string;
  hero: { value: string; label: string };
  supporting: string[];
  tech: string[];
};

const builds: FeaturedBuild[] = [
  {
    name: 'Aurora',
    tag: 'B2B SaaS Analytics Platform',
    description: 'Built a full SaaS analytics platform replacing 3 internal tools.',
    hero: { value: '34 days', label: 'Delivery' },
    supporting: [
      '500+ users in first 60 days',
      'Cut reporting time from 14h → 2h/week',
      'Live 8 months — $0 maintenance billed',
    ],
    tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    name: 'Neural',
    tag: 'SaaS Design System',
    description: 'Built a scalable UI system with 50+ reusable components.',
    hero: { value: '22 days', label: 'Delivery' },
    supporting: [
      'Integrated with Figma + Storybook',
      'Used across multiple products',
    ],
    tech: ['React', 'Storybook', 'Figma API'],
  },
  {
    name: 'CryptoFlow',
    tag: 'Trading Dashboard',
    description: 'Built real-time trading dashboard with WebSocket data streaming.',
    hero: { value: '27 days', label: 'Delivery' },
    supporting: [
      'Live charts + trading engine',
      'High-performance real-time system',
    ],
    tech: ['React', 'Node.js', 'WebSocket'],
  },
];

const trustPoints = [
  'Every project shipped on time — or final milestone is free',
  '12 months maintenance included — no hidden fees',
  'Clients across US, UK, AU, India',
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Projects() {
  return (
    <section className={styles.section} id="projects">
      <div className={styles.ambient} aria-hidden />

      <div className={styles.container}>
        <div className={styles.header}>
          <ScrollReveal blur>
            <span className={styles.eyebrow}>
              <span className={styles.dot} />
              Recent builds
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className={styles.title}>
              SaaS &amp; Web Apps Delivered in{' '}
              <span className={styles.accent}>30 Days</span> — Without Maintenance Fees
            </h2>
          </ScrollReveal>
        </div>

        <StaggerGrid className={styles.grid}>
          {builds.map((b) => (
            <motion.article
              key={b.name}
              className={styles.card}
              variants={staggerItem}
            >
              <header className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{b.name}</h3>
                <p className={styles.cardTag}>{b.tag}</p>
              </header>

              <p className={styles.cardDesc}>{b.description}</p>

              <div className={styles.heroMetric}>
                <span className={styles.heroValue}>{b.hero.value}</span>
                <span className={styles.heroLabel}>{b.hero.label}</span>
              </div>

              <ul className={styles.supporting}>
                {b.supporting.map((s) => (
                  <li key={s} className={styles.supportItem}>
                    {s}
                  </li>
                ))}
              </ul>

              <div className={styles.techRow}>
                {b.tech.map((t) => (
                  <span key={t} className={styles.techPill}>
                    {t}
                  </span>
                ))}
              </div>

              <div className={styles.cardCta}>
                <Link href="/contact" className={styles.cardLink}>
                  Build something like this
                  <ArrowIcon />
                </Link>
              </div>
            </motion.article>
          ))}
        </StaggerGrid>

        <ScrollReveal blur>
          <div className={styles.trust}>
            <ul className={styles.trustList}>
              {trustPoints.map((tp) => (
                <li key={tp} className={styles.trustItem}>
                  <span className={styles.trustIcon}>
                    <CheckIcon />
                  </span>
                  <span>{tp}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} blur scale>
          <figure className={styles.testimonial}>
            <blockquote className={styles.quote}>
              &ldquo;Agency quoted us 4 months and $60K. Sadik shipped the whole platform
              in 34 days for less than half of that. Eight months later I still haven&rsquo;t
              paid a maintenance invoice. The product just works.&rdquo;
            </blockquote>
            <figcaption className={styles.author}>
              <span className={styles.avatar}>M</span>
              <span>
                <strong>Marcus T.</strong> · Founder (UK)
              </span>
            </figcaption>
          </figure>
        </ScrollReveal>

        <ScrollReveal delay={0.1} blur>
          <div className={styles.finalCta}>
            <p className={styles.uspBadge}>
              12 months of maintenance included — free
            </p>
            <Link href="/contact" className={styles.primaryBtn}>
              Start your build
              <ArrowIcon />
            </Link>
            <p className={styles.finalNote}>
              Fixed scope · 30-day timeline · One build at a time
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
