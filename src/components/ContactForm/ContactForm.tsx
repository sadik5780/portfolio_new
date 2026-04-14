'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice, type Currency } from '@/data/pricing';
import styles from './ContactForm.module.scss';

export interface ContactFormPreset {
  projectType: string;
  budgetAmount: number;
}

interface ContactFormProps {
  currency: Currency;
  preset: ContactFormPreset | null;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const PROJECT_TYPES = [
  'Shopify Store',
  'Static Website — Starter',
  'Static Website — Standard',
  'Static Website — Premium',
  'Custom Web App',
  'SaaS Platform',
  'Other',
];

const ContactForm = forwardRef<HTMLDivElement, ContactFormProps>(function ContactForm(
  { currency, preset },
  ref,
) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      projectType: data.get('projectType'),
      budget: data.get('budget'),
      message: data.get('message'),
      currency,
    };

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Something went wrong');
      }

      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const budgetDefault = preset
    ? `${formatPrice(preset.budgetAmount, currency)} — ${preset.projectType}`
    : '';

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.head}>
        <span className={styles.label}>Contact</span>
        <h3 className={styles.title}>Tell me about your project</h3>
        <p className={styles.copy}>
          Share your brief and I&apos;ll reply within 24 hours with a fixed quote,
          scope, and proposed timeline. All fields are required unless marked optional.
        </p>
      </div>

      <motion.form
        className={styles.form}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={styles.input}
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={styles.input}
              placeholder="jane@company.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="projectType">
              Project Type
            </label>
            <select
              id="projectType"
              name="projectType"
              className={styles.input}
              required
              defaultValue={preset?.projectType ?? ''}
              key={preset?.projectType ?? 'empty'}
            >
              <option value="" disabled>
                Select a project type
              </option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="budget">
              Budget{' '}
              <span className={styles.hint}>
                (auto-filled from selection)
              </span>
            </label>
            <input
              id="budget"
              name="budget"
              type="text"
              className={styles.input}
              placeholder={`${formatPrice(0, currency)}`}
              defaultValue={budgetDefault}
              key={`${preset?.budgetAmount ?? 0}-${currency}`}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className={styles.textarea}
            placeholder="Tell me about your goals, timeline, and any reference links…"
          />
        </div>

        <div className={styles.actionsRow}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <>
                <span className={styles.spinner} />
                Sending…
              </>
            ) : (
              <>
                Send Message
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>
          <span className={styles.replyNote}>Reply within 24h · No spam, ever</span>
        </div>

        {status === 'success' && (
          <motion.div
            className={`${styles.alert} ${styles.alertSuccess}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Thanks — your message is on its way. I&apos;ll reply within 24 hours.
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            className={`${styles.alert} ${styles.alertError}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errorMsg || 'Something went wrong. Please email hello@sadik.dev directly.'}
          </motion.div>
        )}
      </motion.form>
    </div>
  );
});

export default ContactForm;
