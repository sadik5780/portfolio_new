'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import styles from './HowWeWork.module.scss';

interface Step {
  number: string;
  title: string;
  body: string;
  duration: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Discovery call',
    body: 'A 30-minute call to understand goals, constraints, and your deadline. You leave with a fixed scope, a fixed quote, and a proposed start date — no obligation.',
    duration: '30 minutes · free',
  },
  {
    number: '02',
    title: 'Kickoff & sprint plan',
    body: 'Signed SOW, Slack and Linear/Notion access, week-1 milestone agreed. We map every screen, API, and integration into a one-page sprint plan you sign off on.',
    duration: 'Day 1–3',
  },
  {
    number: '03',
    title: 'Weekly shippable demos',
    body: 'Deploy previews on every PR. You see real progress in your browser, not in a Friday status update. Async feedback over Slack; live demo + planning each week.',
    duration: 'Weekly',
  },
  {
    number: '04',
    title: 'Launch & handover',
    body: 'Production deploy, written docs, Loom walkthrough, and 12 months of maintenance included — bug fixes, dependency updates, and minor tweaks at no extra cost.',
    duration: 'Launch + 12 months',
  },
];

export default function HowWeWork() {
  return (
    <section className={styles.section} id="how-we-work" aria-labelledby="how-we-work-heading">
      <div className={styles.container}>
        <SectionHeading
          label="Process"
          title="How we work — built for speed"
          description="A four-step process that gets you from idea to a live, production product without the agency drag."
        />

        <div className={styles.grid}>
          {STEPS.map((s, i) => (
            <motion.article
              key={s.number}
              className={styles.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className={styles.number}>{s.number}</span>
              <div className={styles.body}>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepCopy}>{s.body}</p>
                <span className={styles.duration}>{s.duration}</span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/quote" className={styles.btnPrimary}>
            Start Your Project
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link href="/contact" className={styles.btnSecondary}>
            Book a discovery call
          </Link>
        </div>
      </div>
    </section>
  );
}
