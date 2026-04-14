'use client';

import styles from './SectionHeading.module.scss';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  label,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div className={`${styles.heading} ${styles[align]}`}>
      <ScrollReveal>
        <span className={styles.label}>{label}</span>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <h2 className={styles.title}>{title}</h2>
      </ScrollReveal>
      {description && (
        <ScrollReveal delay={0.2}>
          <p className={styles.description}>{description}</p>
        </ScrollReveal>
      )}
    </div>
  );
}
