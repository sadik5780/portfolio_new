'use client';

import { motion, type Variants } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './TechArsenal.module.scss';

interface ArsenalCard {
  title: string;
  description: string;
  accent: 'primary' | 'secondary';
  icon: 'frontend' | 'backend' | 'tools' | 'saas';
}

const CARDS: ArsenalCard[] = [
  {
    title: 'Frontend',
    description: 'React, Next.js 14 App Router, TypeScript, Tailwind, Framer Motion',
    accent: 'primary',
    icon: 'frontend',
  },
  {
    title: 'Backend',
    description: 'Node.js, tRPC, PostgreSQL, Prisma, Supabase, Redis',
    accent: 'secondary',
    icon: 'backend',
  },
  {
    title: 'Tools',
    description: 'Git, Docker, Vercel, Fly.io, GitHub Actions, Figma',
    accent: 'primary',
    icon: 'tools',
  },
  {
    title: 'SaaS & AI',
    description: 'Stripe, Clerk, Resend, Claude API, OpenAI, RAG, prompt caching',
    accent: 'secondary',
    icon: 'saas',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0, 0.2, 1] as const },
  },
};

function Icon({ name }: { name: ArsenalCard['icon'] }) {
  switch (name) {
    case 'frontend':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'backend':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case 'tools':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'saas':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <polyline points="7 14 11 10 14 13 21 6" />
          <polyline points="15 6 21 6 21 12" />
        </svg>
      );
  }
}

export default function TechArsenal() {
  return (
    <section className={styles.section} id="tech-arsenal" aria-labelledby="tech-arsenal-heading">
      <div className={styles.container}>
        <SectionHeading
          label="Tech Arsenal"
          title="The stack I ship with"
          description="The tools I reach for to build production-grade SaaS, headless commerce, and AI-native web apps."
        />

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {CARDS.map((card) => (
            <motion.article
              key={card.title}
              variants={itemVariants}
              className={`${styles.card} ${styles[`card_${card.accent}`]}`}
            >
              <span className={styles.iconWrap} aria-hidden>
                <Icon name={card.icon} />
              </span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.description}</p>
              <span className={styles.glow} aria-hidden />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
