'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { testimonials, aggregateRating } from '@/data/testimonials';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './Testimonials.module.scss';

const AUTO_ADVANCE_MS = 7000;

export default function Testimonials() {
  const rating = aggregateRating();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, []);

  const goTo = useCallback((i: number) => {
    setIndex(i);
  }, []);

  // Auto-advance when not paused. Resets on manual navigation via `index` dep.
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(next, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, next]);

  const t = testimonials[index];

  return (
    <section
      className={styles.section}
      id="testimonials"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.container}>
        <SectionHeading
          label="Testimonials"
          title="Trusted by founders in India, USA & Australia"
          description={`Average rating ${rating.value}/5 from ${rating.count} clients shipping SaaS, Shopify, and custom web app builds.`}
        />

        <div className={styles.stage} aria-live="polite">
          <span className={styles.quoteMark} aria-hidden>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2H4v2h1a4 4 0 0 0 4-4V7zm12 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4V7z" />
            </svg>
          </span>

          <div className={styles.stageInner}>
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.id}
                className={styles.figure}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.55, ease: [0.2, 0, 0.2, 1] as const }}
              >
                <div className={styles.rating} aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={idx < t.rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                <blockquote className={styles.quote}>&ldquo;{t.quote}&rdquo;</blockquote>

                <figcaption className={styles.caption}>
                  <div className={styles.avatar} aria-hidden>
                    {t.name.charAt(0)}
                  </div>
                  <div className={styles.person}>
                    <span className={styles.name}>
                      {t.name} <span aria-hidden>{t.countryFlag}</span>
                    </span>
                    <span className={styles.role}>
                      {t.role} · {t.company}
                    </span>
                  </div>
                  <span className={styles.badge}>{t.projectType}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div
            className={styles.dots}
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {testimonials.map((entry, i) => {
              const active = i === index;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Show testimonial from ${entry.name}`}
                  className={`${styles.dot} ${active ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
