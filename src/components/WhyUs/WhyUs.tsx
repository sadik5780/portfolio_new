'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './WhyUs.module.scss';

interface Pillar {
  title: string;
  body: string;
  proof: string;
  icon: 'comms' | 'speed' | 'cost';
}

const PILLARS: Pillar[] = [
  {
    title: 'Direct developer communication',
    body: 'You talk to the engineer writing your code. Every PR, every decision, every standup — direct with Sadik. No account managers, no offshore handoffs, no Chinese-whispers requirements.',
    proof: 'Slack + WhatsApp + weekly call',
    icon: 'comms',
  },
  {
    title: 'Faster than agencies',
    body: 'Marketing sites ship in 2–3 weeks. Shopify builds in 3–4 weeks. SaaS MVPs in 8–12 weeks. One engineer means zero hand-off latency between design, frontend, backend, and ops.',
    proof: 'Deploy previews on every PR',
    icon: 'speed',
  },
  {
    title: 'Cost-efficient vs agencies',
    body: '40–60% less than a US, UK, or AU senior in-house hire and a fraction of agency rates — without the agency overhead. Fixed scope and fixed price, no scope-creep surprises mid-build.',
    proof: 'Public pricing + instant quote builder',
    icon: 'cost',
  },
];

function PillarIcon({ name }: { name: Pillar['icon'] }) {
  switch (name) {
    case 'comms':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'speed':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'cost':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
  }
}

export default function WhyUs() {
  return (
    <section className={styles.section} id="why-us" aria-labelledby="why-us-heading">
      <div className={styles.container}>
        <SectionHeading
          label="Why Sadik Studio"
          title="Why founders choose us over agencies"
          description="Three reasons our clients stay past the first engagement — and refer the next one."
        />

        <div className={styles.grid}>
          {PILLARS.map((p, i) => (
            <motion.article
              key={p.title}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <span className={styles.iconWrap} aria-hidden>
                <PillarIcon name={p.icon} />
              </span>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardBody}>{p.body}</p>
              <span className={styles.proof}>{p.proof}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
