import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from './LoginForm';
import styles from './page.module.scss';

// Static generation tries to prerender useSearchParams; this page is always dynamic.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.noise} />

      <div className={styles.card}>
        <div className={styles.cardHead}>
          <div className={styles.logo}>S</div>
          <h1 className={styles.title}>Admin Sign In</h1>
          <p className={styles.subtitle}>
            Restricted access. Credentials are required to continue.
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className={styles.footer}>
          Public site —{' '}
          <a href="/" className={styles.footerLink}>
            sadik.dev
          </a>
        </p>
      </div>
    </main>
  );
}
