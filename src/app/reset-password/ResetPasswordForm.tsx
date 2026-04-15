'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSupabaseAuthBrowser } from '@/lib/supabase/browser';
import styles from '../login/page.module.scss';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState<boolean | null>(null);

  // Verify that a recovery session exists (set by /auth/callback after the
  // email link). If the user landed here directly, send them back to request
  // a fresh link.
  useEffect(() => {
    const supabase = getSupabaseAuthBrowser();
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(Boolean(data.session));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const supabase = getSupabaseAuthBrowser();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || 'Could not update password.');
      setSubmitting(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  if (sessionReady === false) {
    return (
      <div className={styles.error} role="alert">
        This reset link has expired or is invalid.{' '}
        <a href="/forgot-password" className={styles.footerLink}>
          Request a new link
        </a>
        .
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
        <label htmlFor="password" className={styles.label}>
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={styles.input}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="confirm" className={styles.label}>
          Confirm new password
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={styles.input}
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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

      <button
        type="submit"
        className={styles.submit}
        disabled={submitting || sessionReady !== true}
      >
        {submitting ? (
          <>
            <span className={styles.spinner} />
            Updating…
          </>
        ) : (
          'Update password'
        )}
      </button>
    </motion.form>
  );
}
