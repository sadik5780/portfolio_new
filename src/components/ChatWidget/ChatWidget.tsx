'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ChatWidget.module.scss';

type Step = 'welcome' | 'service' | 'timeline' | 'budget' | 'contact' | 'done';

interface LeadData {
  service: string;
  timeline: string;
  budget: string;
  name: string;
  contact: string;
}

const SERVICES = [
  { label: 'Website', value: 'Website' },
  { label: 'SaaS MVP', value: 'SaaS MVP' },
  { label: 'Shopify Store', value: 'Shopify Store' },
  { label: 'AI Automation', value: 'AI Automation' },
  { label: 'AI Features', value: 'AI Features' },
  { label: 'Something Else', value: 'Other' },
];

const TIMELINES = [
  { label: 'ASAP (< 2 weeks)', value: 'ASAP' },
  { label: '1-2 months', value: '1-2 months' },
  { label: '3+ months', value: '3+ months' },
  { label: 'Just exploring', value: 'Exploring' },
];

const BUDGETS = [
  { label: 'Under $3K', value: 'Under $3K' },
  { label: '$3K – $8K', value: '$3K-$8K' },
  { label: '$8K – $15K', value: '$8K-$15K' },
  { label: '$15K+', value: '$15K+' },
  { label: 'Not sure yet', value: 'Not sure' },
];

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('welcome');
  const [lead, setLead] = useState<LeadData>({
    service: '',
    timeline: '',
    budget: '',
    name: '',
    contact: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname?.startsWith('/payment/')
  ) {
    return null;
  }

  const reset = () => {
    setStep('welcome');
    setLead({ service: '', timeline: '', budget: '', name: '', contact: '' });
  };

  const handleOpen = () => {
    setOpen(true);
    if (step === 'done') reset();
  };

  const selectOption = (field: keyof LeadData, value: string, nextStep: Step) => {
    setLead((prev) => ({ ...prev, [field]: value }));
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    if (!lead.name.trim() || !lead.contact.trim()) return;
    setSubmitting(true);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      setStep('done');
    } catch {
      setStep('done');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.widget}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <div className={styles.avatar}>S</div>
                <div>
                  <div className={styles.headerName}>Sadik Studio</div>
                  <div className={styles.headerStatus}>
                    <span className={styles.statusDot} />
                    Typically replies instantly
                  </div>
                </div>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <CloseIcon />
              </button>
            </div>

            <div className={styles.body}>
              {step === 'welcome' && (
                <ChatStep>
                  <BotMessage text="Hey! What are you looking to build?" />
                  <div className={styles.options}>
                    {SERVICES.map((s) => (
                      <button
                        key={s.value}
                        className={styles.option}
                        onClick={() => selectOption('service', s.value, 'timeline')}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </ChatStep>
              )}

              {step === 'timeline' && (
                <ChatStep>
                  <UserMessage text={lead.service} />
                  <BotMessage text="Great choice! What's your timeline?" />
                  <div className={styles.options}>
                    {TIMELINES.map((t) => (
                      <button
                        key={t.value}
                        className={styles.option}
                        onClick={() => selectOption('timeline', t.value, 'budget')}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </ChatStep>
              )}

              {step === 'budget' && (
                <ChatStep>
                  <UserMessage text={lead.timeline} />
                  <BotMessage text="And what's your approximate budget?" />
                  <div className={styles.options}>
                    {BUDGETS.map((b) => (
                      <button
                        key={b.value}
                        className={styles.option}
                        onClick={() => selectOption('budget', b.value, 'contact')}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </ChatStep>
              )}

              {step === 'contact' && (
                <ChatStep>
                  <UserMessage text={lead.budget} />
                  <BotMessage text="Almost done! Drop your name and email so I can get back to you with a quote." />
                  <div className={styles.form}>
                    <input
                      className={styles.input}
                      placeholder="Your name"
                      value={lead.name}
                      onChange={(e) =>
                        setLead((prev) => ({ ...prev, name: e.target.value }))
                      }
                      autoFocus
                    />
                    <input
                      className={styles.input}
                      placeholder="Email or WhatsApp number"
                      value={lead.contact}
                      onChange={(e) =>
                        setLead((prev) => ({ ...prev, contact: e.target.value }))
                      }
                    />
                    <button
                      className={styles.submitBtn}
                      onClick={handleSubmit}
                      disabled={submitting || !lead.name.trim() || !lead.contact.trim()}
                    >
                      {submitting ? 'Sending...' : 'Get My Quote'}
                    </button>
                  </div>
                </ChatStep>
              )}

              {step === 'done' && (
                <ChatStep>
                  <div className={styles.doneWrap}>
                    <div className={styles.doneIcon}>
                      <CheckIcon />
                    </div>
                    <p className={styles.doneTitle}>Got it!</p>
                    <p className={styles.doneText}>
                      I&apos;ll review your request and get back within a few hours with a fixed quote.
                    </p>
                  </div>
                </ChatStep>
              )}
            </div>

            <div className={styles.footer}>
              <span>Sadik Studio</span>
              <span className={styles.footerDot} />
              <span>sadikstudio.in</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className={`${styles.trigger} ${open ? styles.triggerHidden : ''}`}
        onClick={handleOpen}
        aria-label="Open chat"
      >
        <ChatIcon />
      </button>
    </>
  );
}

function ChatStep({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className={styles.step}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function BotMessage({ text }: { text: string }) {
  return (
    <div className={styles.botMsg}>
      <div className={styles.botAvatar}>S</div>
      <div className={styles.msgBubble}>{text}</div>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className={styles.userMsg}>
      <div className={styles.userBubble}>{text}</div>
    </div>
  );
}
