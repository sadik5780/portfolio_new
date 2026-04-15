import type { Metadata } from 'next';
import Logo from '@/components/Logo/Logo';
import ForgotPasswordForm from './ForgotPasswordForm';
import styles from '../login/page.module.scss';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Forgot Password | Sadik Studio',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <main className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.noise} />

      <div className={styles.card}>
        <div className={styles.cardHead}>
          <div className={styles.logoWrap}>
            <Logo variant="icon" size="lg" href={false} />
          </div>
          <h1 className={styles.title}>Reset your password</h1>
          <p className={styles.subtitle}>
            Enter your admin email and we&apos;ll send you a link to set a new password.
          </p>
        </div>

        <ForgotPasswordForm />

        <p className={styles.footer}>
          Remembered it?{' '}
          <a href="/login" className={styles.footerLink}>
            Back to sign in
          </a>
        </p>
      </div>
    </main>
  );
}
