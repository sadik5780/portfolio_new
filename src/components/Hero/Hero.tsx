'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import type { HeroContent, StatsContent } from '@/lib/content/types';
import { useMagnetic } from '@/lib/hooks/useMagnetic';
import styles from './Hero.module.scss';

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

interface HeroProps {
  content: HeroContent;
  stats: StatsContent;
}

export default function Hero({ content, stats }: HeroProps) {
  // LUMINAL-style magnetic hover on the hero CTAs.
  const primaryRef = useMagnetic<HTMLAnchorElement>(0.2);
  const secondaryRef = useMagnetic<HTMLAnchorElement>(0.15);
  const tertiaryRef = useMagnetic<HTMLAnchorElement>(0.15);

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.gradientBg}>
        <div className={styles.gradient1} />
        <div className={styles.gradient2} />
        <div className={styles.gradient3} />
      </div>
      <div className={styles.gridOverlay} />
      <div className={styles.noise} />

      <motion.div
        className={styles.content}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.badge} variants={fadeUp}>
          <span className={styles.badgeDot} />
          {content.badge}
        </motion.div>

        <h1 className={styles.title}>
          {content.heading_line1}
          <br />
          <span className={styles.gradient}>{content.heading_highlight}</span>
          {' '}
          {content.heading_line2}
        </h1>

        <motion.p className={styles.subtitle} variants={fadeUp}>
          {content.subtitle}
        </motion.p>

        <motion.div className={styles.actions} variants={fadeUp}>
          <Link ref={primaryRef} href="/quote" className={styles.btnPrimary}>
            Start Your Project
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link ref={secondaryRef} href="/projects" className={styles.btnSecondary}>
            See Case Studies
          </Link>
          <Link ref={tertiaryRef} href="/contact" className={styles.btnGhost}>
            Talk to Sadik →
          </Link>
        </motion.div>

        {stats.items.length > 0 && (
          <motion.div className={styles.stats} variants={fadeUp}>
            {stats.items.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <div className={styles.scrollIndicator} aria-hidden>
        <span className={styles.scrollDot} />
      </div>
    </section>
  );
}
