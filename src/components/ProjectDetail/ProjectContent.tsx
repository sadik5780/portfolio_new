'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './ProjectContent.module.scss';

interface ProjectContentProps {
  project: Project;
}

export default function ProjectContent({ project }: ProjectContentProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <ScrollReveal>
            <div className={styles.block}>
              <span className={styles.blockLabel}>The Problem</span>
              <h2 className={styles.blockTitle}>What wasn&apos;t working</h2>
              <p className={styles.blockBody}>{project.problem}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className={styles.block}>
              <span className={styles.blockLabel}>The Solution</span>
              <h2 className={styles.blockTitle}>What I built</h2>
              <p className={styles.blockBody}>{project.solution}</p>
            </div>
          </ScrollReveal>
        </div>

        {/* Features */}
        <ScrollReveal delay={0.1}>
          <div className={styles.featuresBlock}>
            <span className={styles.blockLabel}>Key Features</span>
            <h2 className={styles.blockTitle}>What it does</h2>

            <ul className={styles.featureList}>
              {project.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  className={styles.featureItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <span className={styles.featureIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Tech stack */}
        <ScrollReveal delay={0.1}>
          <div className={styles.techBlock}>
            <span className={styles.blockLabel}>Tech Stack</span>
            <h2 className={styles.blockTitle}>Built with</h2>
            <div className={styles.techList}>
              {project.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className={styles.tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.04 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
