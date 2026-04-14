'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Project } from '@/data/projects';
import styles from './DetailHero.module.scss';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

interface DetailHeroProps {
  project: Project;
}

export default function DetailHero({ project }: DetailHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.bg} />
      <div className={styles.container}>
        <motion.div
          className={styles.breadcrumbs}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/projects">Projects</Link>
          <span>/</span>
          <span className={styles.breadcrumbActive}>{project.title}</span>
        </motion.div>

        <motion.div
          className={styles.meta}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <span className={styles.metaBadge}>{project.category}</span>
          <span className={styles.metaDot} />
          <span className={styles.metaItem}>{project.year}</span>
          <span className={styles.metaDot} />
          <span className={styles.metaItem}>{project.client}</span>
        </motion.div>

        <motion.h1
          className={styles.title}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          {project.title}
        </motion.h1>

        <motion.p
          className={styles.description}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          {project.longDescription}
        </motion.p>

        <motion.div
          className={styles.actions}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Visit Live Site
            </a>
          )}
        </motion.div>

        <motion.div
          className={styles.imageCard}
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <div className={styles.imagePlaceholder}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className={styles.imageLabel}>{project.title}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
