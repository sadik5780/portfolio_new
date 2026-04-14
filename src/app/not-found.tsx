import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.content}>
          <span className={styles.code}>404</span>
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.copy}>
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.btnPrimary}>
              Back home
            </Link>
            <Link href="/projects" className={styles.btnSecondary}>
              View projects
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
