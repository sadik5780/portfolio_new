import type { Metadata } from 'next';
import Logo from '@/components/Logo/Logo';
import ResetPasswordForm from './ResetPasswordForm';
import styles from '../login/page.module.scss';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Set New Password | Sadik Studio',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <main className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.noise} />

      <div className={styles.card}>
        <div className={styles.cardHead}>
          <div className={styles.logoWrap}>
            <Logo variant="icon" size="lg" href={false} />
          </div>
          <h1 className={styles.title}>Set a new password</h1>
          <p className={styles.subtitle}>
            Choose a password you haven&apos;t used before. Minimum 8 characters.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </main>
  );
}
