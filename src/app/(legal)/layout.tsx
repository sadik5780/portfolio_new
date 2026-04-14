import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './layout.module.scss';

/**
 * Shared shell for legal pages (/privacy, /terms). Provides the standard
 * Navbar + Footer plus typography-optimized styling for long-form text.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.bg} />
        <article className={styles.article}>{children}</article>
      </main>
      <Footer />
    </>
  );
}
