'use client';

import { motion, type Variants } from 'framer-motion';
import type { HeroContent, StatsContent } from '@/lib/content/types';
import styles from './Hero.module.scss';

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

interface HeroProps {
  content: HeroContent;
  stats: StatsContent;
}

export default function Hero({ content, stats }: HeroProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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

        <motion.h1 className={styles.title} variants={fadeUp}>
          {content.heading_line1}
          <br />
          <span className={styles.gradient}>{content.heading_highlight}</span>
          {' '}
          {content.heading_line2}
        </motion.h1>

        <motion.p className={styles.subtitle} variants={fadeUp}>
          {content.subtitle}
        </motion.p>

        <motion.div className={styles.actions} variants={fadeUp}>
          <a
            href="#projects"
            className={styles.btnPrimary}
            onClick={(e) => handleScroll(e, '#projects')}
          >
            View My Work
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="/contact" className={styles.btnSecondary}>
            Get in Touch
          </a>
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

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className={styles.scrollDot}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
