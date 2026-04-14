import type { Metadata } from 'next';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import PricingShell from '@/components/Pricing/PricingShell';
import FAQ from '@/components/FAQ/FAQ';
import { buildMetadata, siteConfig } from '@/lib/seo';
import { faqs } from '@/data/faqs';
import { getPricing } from '@/lib/content/settings';
import { detectCurrencyFromHeaders } from '@/lib/payments/locale';
import styles from './page.module.scss';

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title:
    'Hire Sadik — Shopify, React & SaaS Developer | Pricing for India, USA, Australia',
  description:
    'Hire Sadik for React, Next.js, Shopify, and SaaS development. Shopify stores from ₹50,000 / $2,000. Static websites from ₹15,000 / $200. Custom web apps from ₹1,00,000 / $10,000. Interactive quote builder, 24-hour response.',
  path: '/contact',
  keywords: [
    'hire react developer india',
    'hire shopify developer usa',
    'hire saas developer australia',
    'freelance react developer pricing',
    'shopify store development india',
    'custom web app development pricing',
    'next.js developer for hire',
    'hire full stack developer',
    'shopify expert pricing usa',
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

export default async function ContactPage() {
  const pricing = await getPricing();
  const initialCurrency = detectCurrencyFromHeaders();

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${siteConfig.fullName} — Freelance Developer`,
    url: `${siteConfig.url}/contact`,
    description:
      'Full-stack freelance development: React, Next.js, Shopify, and custom SaaS builds. Serving India, USA, and Australia.',
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Australia' },
    ],
    provider: {
      '@type': 'Person',
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Shopify Store Development',
          priceCurrency: 'INR',
          price: String(pricing.shopify.inr),
        },
        {
          '@type': 'Offer',
          name: 'Shopify Store Development (International)',
          priceCurrency: 'USD',
          price: String(pricing.shopify.usd),
        },
        ...pricing.static_tiers.map((tier) => ({
          '@type': 'Offer',
          name: `Static Website — ${tier.name}`,
          priceCurrency: 'INR',
          price: String(tier.inr),
        })),
        {
          '@type': 'Offer',
          name: 'Custom Web App',
          priceCurrency: 'INR',
          price: String(pricing.app.base.inr),
          description: `Base price. Additional features from ₹${pricing.app.feature_price.inr} each.`,
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
              label="Let's work together"
              title="Hire a senior React, Shopify & SaaS developer"
              description="Fixed pricing. Clear scope before we start. Serving teams in India, the USA, and Australia."
            />
          </div>
        </section>

        <PricingShell pricing={pricing} initialCurrency={initialCurrency} />

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
