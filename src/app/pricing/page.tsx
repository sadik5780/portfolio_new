import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import FAQ from '@/components/FAQ/FAQ';
import PricingTables from '@/components/Pricing/PricingTables';
import { buildMetadata, siteConfig } from '@/lib/seo';
import { getPricing } from '@/lib/content/settings';
import { getOfferings } from '@/lib/content/offerings';
import { faqs } from '@/data/faqs';
import styles from './page.module.scss';

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: 'Pricing — Static Sites, Shopify, SaaS, Web & Mobile Apps',
  description:
    'Transparent USD pricing for every Sadik Studio service. Static sites from $200, Shopify stores from $2,000, SaaS and custom web apps from $10,000, mobile apps from $12,000.',
  path: '/pricing',
  keywords: [
    'static website cost india',
    'shopify development pricing india',
    'saas development cost india',
    'custom web app pricing',
    'mobile app development cost india',
    'react native app cost',
    'freelance developer pricing',
  ],
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

export default async function PricingPage() {
  const [pricing, offerings] = await Promise.all([
    getPricing(),
    getOfferings(),
  ]);

  // Service catalog JSON-LD so each price shows up as a structured offer
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${siteConfig.fullName} — Sadik Studio`,
    url: `${siteConfig.url}/pricing`,
    description: 'Transparent pricing for static sites, Shopify, SaaS, web apps, and mobile.',
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Australia' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Development services',
      itemListElement: [
        ...pricing.static_tiers.map((tier) => ({
          '@type': 'Offer',
          name: `Static Website — ${tier.name}`,
          priceCurrency: 'INR',
          price: String(tier.inr),
        })),
        {
          '@type': 'Offer',
          name: 'Shopify Store Development',
          priceCurrency: 'INR',
          price: String(pricing.shopify.inr),
        },
        {
          '@type': 'Offer',
          name: 'Custom Web App / SaaS',
          priceCurrency: 'INR',
          price: String(pricing.app.base.inr),
        },
        {
          '@type': 'Offer',
          name: 'Mobile App (React Native)',
          priceCurrency: 'INR',
          price: String(pricing.mobile.base.inr),
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.container}>
            <SectionHeading
              label="Pricing"
              title="Transparent pricing across every service"
              description="All quotes in USD, fixed before work starts — no surprise bills. Indian clients can settle in INR via Razorpay on request at invoice time."
            />
            <div className={styles.heroActions}>
              <Link href="/quote" className={styles.btnPrimary}>
                Build a custom quote
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/services" className={styles.btnSecondary}>
                Compare services
              </Link>
            </div>
          </div>
        </section>

        {/* Each service category, prices straight from Supabase settings */}
        <PricingTables pricing={pricing} offerings={offerings} />

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
