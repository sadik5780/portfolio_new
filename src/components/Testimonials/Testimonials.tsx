'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { testimonials as STATIC_FALLBACK } from '@/data/testimonials';
import type { Testimonial } from '@/lib/content/types';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './Testimonials.module.scss';

const AUTO_ADVANCE_MS = 8000;

interface TestimonialsProps {
  items?: Testimonial[];
}

export default function Testimonials({ items }: TestimonialsProps = {}) {
  // Prefer the server-fed items; fall back to the static data file if a caller
  // renders this component without wiring up the fetch (keeps dev-time DX easy).
  const testimonials = useMemo<Testimonial[]>(() => {
    if (items && items.length > 0) return items;
    return STATIC_FALLBACK.map((t, i) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      country: t.country,
      countryFlag: t.countryFlag,
      quote: t.quote,
      rating: t.rating,
      projectType: t.projectType,
      featured: true,
      sortOrder: (i + 1) * 10,
    }));
  }, [items]);

  const rating = useMemo(() => {
    if (testimonials.length === 0) return { value: 0, count: 0 };
    const total = testimonials.reduce((s, t) => s + t.rating, 0);
    return {
      value: Number((total / testimonials.length).toFixed(2)),
      count: testimonials.length,
    };
  }, [testimonials]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Dependencies include testimonials.length so callbacks stay correct when
  // the live DB list is updated via revalidation.
  const next = useCallback(() => {
    setIndex((i) => (testimonials.length === 0 ? 0 : (i + 1) % testimonials.length));
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setIndex((i) =>
      testimonials.length === 0
        ? 0
        : (i - 1 + testimonials.length) % testimonials.length,
    );
  }, [testimonials.length]);

  const goTo = useCallback((i: number) => {
    setIndex(i);
  }, []);

  // Clamp the index if the list got shorter (admin deleted a testimonial).
  useEffect(() => {
    if (index >= testimonials.length && testimonials.length > 0) {
      setIndex(0);
    }
  }, [testimonials.length, index]);

  // Auto-advance when not paused. Resets on manual navigation via `index` dep.
  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const id = window.setTimeout(next, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, next, testimonials.length]);

  if (testimonials.length === 0) return null;

  const t = testimonials[Math.min(index, testimonials.length - 1)];

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
            {/*
              Key-based remount (no AnimatePresence). When `index` changes,
              React unmounts the old figure and mounts a new one, triggering
              the initial → animate transition. This avoids the
              "removeChild on null" race that AnimatePresence + rapid nav
              clicks can produce.
            */}
              <motion.figure
                key={t.id}
                className={styles.figure}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.2, 0, 0.2, 1] as const }}
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
          </div>

          <div
            className={styles.controls}
            role="tablist"
            aria-label="Testimonial navigation"
          >
            <button
              type="button"
              className={styles.arrow}
              onClick={prev}
              aria-label="Previous testimonial"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.dots}>
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

            <button
              type="button"
              className={styles.arrow}
              onClick={next}
              aria-label="Next testimonial"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
