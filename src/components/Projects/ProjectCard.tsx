'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/content/types';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: Project;
  index: number;
  /** If provided, opens project in modal. If omitted, card links to /projects/[slug]. */
  onOpen?: (project: Project) => void;
}

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const inner = (
    <>
      {/* Image area */}
      <div className={styles.imageWrapper}>
        <div className={styles.imagePlaceholder}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <div className={styles.categoryBadge}>{project.category}</div>
        <div className={styles.imageOverlay}>
          <span className={styles.viewLabel}>
            View Project
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.body}>
        <div className={styles.tags}>
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
          {project.tags.length > 3 && (
            <span className={styles.tag}>+{project.tags.length - 3}</span>
          )}
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
      </div>
    </>
  );

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
      layout
    >
      {onOpen ? (
        <button
          className={styles.cardButton}
          onClick={() => onOpen(project)}
          aria-label={`View details for ${project.title}`}
        >
          {inner}
        </button>
      ) : (
        <Link
          href={`/projects/${project.slug}`}
          className={styles.cardButton}
          aria-label={`View case study for ${project.title}`}
        >
          {inner}
        </Link>
      )}
    </motion.article>
  );
}
