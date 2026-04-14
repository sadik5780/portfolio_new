'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './ScreenshotsGallery.module.scss';

interface ScreenshotsGalleryProps {
  screenshots: string[];
  title: string;
}

export default function ScreenshotsGallery({
  screenshots,
  title,
}: ScreenshotsGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((i) => (i === null ? 0 : (i + 1) % screenshots.length));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((i) =>
          i === null ? 0 : (i - 1 + screenshots.length) % screenshots.length,
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, screenshots.length]);

  if (!screenshots.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <div className={styles.header}>
            <span className={styles.label}>Screenshots</span>
            <h2 className={styles.title}>A closer look</h2>
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {screenshots.map((src, i) => (
            <motion.button
              key={src}
              className={styles.item}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveIndex(i)}
              aria-label={`Open screenshot ${i + 1}`}
            >
              <div className={styles.itemImage}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>Screenshot {i + 1}</span>
              </div>
              <div className={styles.itemOverlay}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              className={styles.lightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveIndex(null)}
            >
              <motion.div
                className={styles.lightboxContent}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closeBtn}
                  onClick={() => setActiveIndex(null)}
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <button
                  className={styles.navPrev}
                  onClick={() =>
                    setActiveIndex(
                      (activeIndex - 1 + screenshots.length) % screenshots.length,
                    )
                  }
                  aria-label="Previous screenshot"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className={styles.lightboxImage}>
                  <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.6">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>{title} — Screenshot {activeIndex + 1}</span>
                </div>

                <button
                  className={styles.navNext}
                  onClick={() => setActiveIndex((activeIndex + 1) % screenshots.length)}
                  aria-label="Next screenshot"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                <div className={styles.counter}>
                  {activeIndex + 1} / {screenshots.length}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
