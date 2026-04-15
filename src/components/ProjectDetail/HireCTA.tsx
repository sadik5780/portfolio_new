'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ProjectCategory } from '@/lib/content/types';
import styles from './HireCTA.module.scss';

interface HireCTAProps {
  category?: ProjectCategory;
}

const SERVICE_HREF: Record<ProjectCategory, { href: string; label: string }> = {
  SaaS:       { href: '/services/saas-developer/usa',     label: 'Hire SaaS Developer' },
  Shopify:    { href: '/services/shopify-developer/usa',  label: 'Hire Shopify Developer' },
  'Web Apps': { href: '/services/react-developer/usa',    label: 'Hire React Developer' },
};

export default function HireCTA({ category }: HireCTAProps) {
  const target = category ? SERVICE_HREF[category] : { href: '/quote', label: 'Start Your Project' };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.cardBg} />

          <motion.span
            className={styles.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Have a similar project?
          </motion.span>

          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Let&apos;s build something
            <br />
            <span className={styles.gradient}>remarkable together.</span>
          </motion.h2>

          <motion.p
            className={styles.copy}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Sadik Studio takes on a limited number of projects each quarter — direct with the engineer
            building your product. Send a brief and we&apos;ll reply within 24 hours with a scope,
            timeline, and fixed quote.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href={target.href} className={styles.btnPrimary}>
              {target.label}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/quote" className={styles.btnSecondary}>
              Get an instant quote
            </Link>
            <Link href="/projects" className={styles.btnSecondary}>
              View more work
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
