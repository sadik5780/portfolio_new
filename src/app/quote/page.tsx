import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import QuoteBuilder from '@/components/Quote/QuoteBuilder';
import { buildMetadata } from '@/lib/seo';
import { getPricing } from '@/lib/content/settings';
import { getOfferings } from '@/lib/content/offerings';
import { detectCurrencyFromHeaders } from '@/lib/payments/locale';
import styles from './page.module.scss';

// Geo-aware pricing forces dynamic rendering; can't be statically cached.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Get an Instant Project Quote — Sadik Studio',
  description:
    'Build a tentative quote for your project in 60 seconds. Static sites, Shopify, SaaS, custom web apps, and mobile — pick features and see live pricing in INR or USD.',
  path: '/quote',
  keywords: [
    'project quote estimator',
    'web development cost estimator india',
    'shopify development quote',
    'saas mvp cost calculator',
    'mobile app cost estimator',
    'custom web app quote',
  ],
});

export default async function QuotePage() {
  const currency = detectCurrencyFromHeaders();
  const [pricing, offerings] = await Promise.all([
    getPricing(),
    getOfferings(),
  ]);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.container}>
            <SectionHeading
              label="Quote estimator"
              title="Build a tentative quote in 60 seconds"
              description="Pick a service, configure features, see your live estimate. Submit and you'll get a real fixed quote within 24 hours — no obligation."
            />
          </div>
        </section>

        <section className={styles.builderSection}>
          <div className={styles.container}>
            <Suspense fallback={null}>
              <QuoteBuilder pricing={pricing} offerings={offerings} currency={currency} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
