'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './Contact.module.scss';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const contactLinks = [
  {
    label: 'Email',
    value: 'sadik5780@gmail.com',
    href: 'mailto:sadik5780@gmail.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/sadik-shaikh',
    href: 'https://www.linkedin.com/in/sadik-shaikh',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    value: '@sadik5780',
    href: 'https://x.com/sadik5780',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          projectType: 'Other',
          message: data.get('message'),
        }),
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

  return (
    <section className={styles.section} id="contact">
      <div className={styles.container}>
        <SectionHeading
          label="Contact"
          title="Let's work together"
          description="Share your brief and I'll reply within 24 hours with a fixed quote, scope, and proposed timeline."
        />

        <div className={styles.grid}>
          <ScrollReveal delay={0.1}>
            <div className={styles.linksCard}>
              {contactLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className={styles.contactLink}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <span className={styles.linkIcon}>{link.icon}</span>
                  <div className={styles.linkInfo}>
                    <span className={styles.linkLabel}>{link.label}</span>
                    <span className={styles.linkValue}>{link.value}</span>
                  </div>
                  <svg className={styles.linkArrow} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.a>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label htmlFor="contact-name" className={styles.label}>Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="contact-email" className={styles.label}>Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className={styles.input}
                    placeholder="jane@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-message" className={styles.label}>Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  className={styles.textarea}
                  placeholder="Tell me about your project, timeline, and budget…"
                  rows={5}
                />
              </div>

              <div className={styles.actions}>
                <motion.button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status === 'submitting'}
                  whileHover={status !== 'submitting' ? { scale: 1.02 } : undefined}
                  whileTap={status !== 'submitting' ? { scale: 0.98 } : undefined}
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
                </motion.button>
                <span className={styles.replyNote}>Reply within 24h</span>
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
                  {errorMsg || 'Something went wrong. Please email sadik5780@gmail.com directly.'}
                </motion.div>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
