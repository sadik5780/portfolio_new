'use client';

import { motion } from 'framer-motion';
import type { ServicesContent } from '@/lib/content/types';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './Services.module.scss';

interface ServicesProps {
  content: ServicesContent;
}

export default function Services({ content }: ServicesProps) {
  if (!content.items.length) return null;

  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        <SectionHeading label={content.label} title={content.title} />

        <div className={styles.grid}>
          {content.items.map((item, i) => (
            <motion.article
              key={item.title}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className={styles.iconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
