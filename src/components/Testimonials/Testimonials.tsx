'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { testimonials as STATIC_FALLBACK } from '@/data/testimonials';
import type { Testimonial } from '@/lib/content/types';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './Testimonials.module.scss';

interface TestimonialsProps {
  items?: Testimonial[];
}

export default function Testimonials({ items }: TestimonialsProps = {}) {
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

  const visible = testimonials.slice(0, 3);

  const rating = useMemo(() => {
    if (testimonials.length === 0) return { value: 0, count: 0 };
    const total = testimonials.reduce((s, t) => s + t.rating, 0);
    return {
      value: Number((total / testimonials.length).toFixed(1)),
      count: testimonials.length,
    };
  }, [testimonials]);

  if (visible.length === 0) return null;

  return (
    <section className={styles.section} id="testimonials" aria-labelledby="testimonials-heading">
      <div className={styles.container}>
        <SectionHeading
          label="Testimonials"
          title="Trusted by founders in India, USA & Australia"
          description={`Average rating ${rating.value}/5 from ${rating.count} clients shipping SaaS, Shopify, and custom web app builds.`}
        />

        <div className={styles.grid}>
          {visible.map((t, i) => (
            <motion.figure
              key={t.id}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={styles.rating} aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <svg
                    key={idx}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={idx < t.rating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.5"
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
              </figcaption>

              <span className={styles.badge}>{t.projectType}</span>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
