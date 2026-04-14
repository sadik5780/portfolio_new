import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { getPaymentById } from '@/lib/payments/store';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import { formatPrice } from '@/data/pricing';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Payment Successful',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { id?: string };
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const id = searchParams.id;
  const payment =
    id && hasServiceRoleEnv() ? await getPaymentById(id) : null;

  // Only show confirmation details if the payment exists AND is paid — don't
  // leak order info for pending/failed records, and don't hint at whether the
  // id is valid if the caller isn't authorized.
  const verified = payment?.status === 'paid' ? payment : null;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.bg} />

        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className={styles.title}>Payment Successful</h1>
          <p className={styles.sub}>
            Thanks — your payment has been received. I&apos;ll email you within
            24 hours with next steps, your scope document, and a project
            kick-off calendar link.
          </p>

          {verified && (
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Service</span>
                <span>{verified.service_label}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Amount paid</span>
                <span className={styles.summaryAmount}>
                  {formatPrice(
                    verified.amount,
                    verified.currency === 'INR' ? 'inr' : 'usd',
                  )}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Reference</span>
                <span className={styles.reference}>
                  {verified.razorpay_payment_id ?? verified.razorpay_order_id}
                </span>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <Link href="/" className={styles.btnPrimary}>
              Back to home
            </Link>
            <Link href="/projects" className={styles.btnSecondary}>
              View my work
            </Link>
          </div>

          <p className={styles.legal}>
            Having trouble? Email{' '}
            <a href="mailto:sadik5780@gmail.com" className={styles.link}>
              sadik5780@gmail.com
            </a>{' '}
            with your reference number and I&apos;ll take care of it.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
