'use client';

import { motion } from 'framer-motion';
import { testimonials, aggregateRating } from '@/data/testimonials';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './Testimonials.module.scss';

export default function Testimonials() {
  const rating = aggregateRating();

  return (
    <section className={styles.section} id="testimonials" aria-labelledby="testimonials-heading">
      <div className={styles.container}>
        <SectionHeading
          label="Testimonials"
          title="Trusted by founders in India, USA & Australia"
          description={`Average rating ${rating.value}/5 from ${rating.count} clients shipping SaaS, Shopify, and custom web app builds.`}
        />

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className={styles.rating} aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill={idx < t.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <blockquote className={styles.quote}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className={styles.caption}>
                <div className={styles.person}>
                  <div className={styles.avatar}>{t.name.charAt(0)}</div>
                  <div className={styles.meta}>
                    <span className={styles.name}>
                      {t.name} <span aria-hidden>{t.countryFlag}</span>
                    </span>
                    <span className={styles.role}>
                      {t.role} · {t.company}
                    </span>
                  </div>
                </div>
                <span className={styles.badge}>{t.projectType}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
