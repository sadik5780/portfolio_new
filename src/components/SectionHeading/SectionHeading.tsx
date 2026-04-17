'use client';

import styles from './SectionHeading.module.scss';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import TextReveal from '@/components/TextReveal/TextReveal';

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
      <ScrollReveal blur delay={0}>
        <span className={styles.label}>{label}</span>
      </ScrollReveal>
      <TextReveal text={title} as="h2" className={styles.title} delay={0.1} />
      {description && (
        <ScrollReveal delay={0.3} blur>
          <p className={styles.description}>{description}</p>
        </ScrollReveal>
      )}
    </div>
  );
}
