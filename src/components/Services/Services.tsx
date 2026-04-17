'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ServicesContent } from '@/lib/content/types';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import StaggerGrid, { staggerItem } from '@/components/StaggerGrid/StaggerGrid';
import styles from './Services.module.scss';

interface ServicesProps {
  content: ServicesContent;
}

function titleToServiceParam(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('shopify')) return 'shopify';
  if (lower.includes('saas')) return 'saas';
  if (lower.includes('ai')) return 'ai';
  if (lower.includes('react') || lower.includes('next')) return 'react';
  return '';
}

export default function Services({ content }: ServicesProps) {
  if (!content.items.length) return null;

  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        <SectionHeading label={content.label} title={content.title} />

        <StaggerGrid className={styles.grid}>
          {content.items.map((item) => {
            const param = titleToServiceParam(item.title);
            const quoteHref = param ? `/quote?service=${param}` : '/quote';

            return (
              <motion.article
                key={item.title}
                className={styles.card}
                variants={staggerItem}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
              >
                <div className={styles.iconWrap}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.desc}>{item.description}</p>
                <Link href={quoteHref} className={styles.cardCta}>
                  Get a quote
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </motion.article>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
