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
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View Source
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
