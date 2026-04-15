'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getSupabaseAuthBrowser } from '@/lib/supabase/browser';
import styles from '../login/page.module.scss';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = getSupabaseAuthBrowser();
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo },
    );

    if (resetError) {
      setError(resetError.message || 'Could not send reset email.');
      setSubmitting(false);
      return;
    }

    setSent(true);
    setSubmitting(false);
  };

  if (sent) {
    return (
      <div className={styles.success} role="status">
        Check your inbox — we sent a password-reset link to <strong>{email}</strong>.
        The link expires in 1 hour.
      </div>
    );
  }

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          className={styles.input}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && (
        <motion.div
          className={styles.error}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          {error}
        </motion.div>
      )}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? (
          <>
            <span className={styles.spinner} />
            Sending…
          </>
        ) : (
          'Send reset link'
        )}
      </button>
    </motion.form>
  );
}
