import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { services } from '@/data/services';
import { locations } from '@/data/locations';
import { buildMetadata, siteConfig } from '@/lib/seo';
import styles from './page.module.scss';

export const metadata: Metadata = buildMetadata({
  title: 'Services — Hire a React, Next.js, Shopify & SaaS Developer',
  description:
    'Hire Sadik for React, Next.js, Shopify, SaaS, full-stack, and frontend development. Serving founders in India, USA, and Australia with fixed pricing.',
  path: '/services',
  keywords: [
    'hire react developer',
    'hire nextjs developer',
    'hire shopify developer',
    'hire saas developer',
    'hire frontend developer',
    'hire full stack developer',
    'freelance developer india usa australia',
  ],
});

export default function ServicesIndexPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.container}>
            <SectionHeading
              label="Services"
              title="Hire specialist developers in India, USA & Australia"
              description="Six focused engagements — React, Next.js, Shopify, SaaS, full-stack, and frontend. Each quoted in your local currency with a 24-hour reply."
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.grid}>
              {services.map((service) => (
                <article key={service.slug} className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardLabel}>{service.shortName}</span>
                    <h2 className={styles.cardTitle}>{service.name}</h2>
                    <p className={styles.cardTagline}>{service.tagline}</p>
                  </div>

                  <p className={styles.cardDesc}>{service.description}</p>

                  <div className={styles.cardTech}>
                    {service.tech.slice(0, 4).map((tech) => (
                      <span key={tech} className={styles.cardTechItem}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.cardPriceLabel}>Starting at</span>
                    <div className={styles.cardPrices}>
                      <span>₹{service.startingInr.toLocaleString('en-IN')}</span>
                      <span className={styles.cardPricesSep}>·</span>
                      <span>${service.startingUsd.toLocaleString('en-US')}</span>
                    </div>
                  </div>

                  <div className={styles.cardLinks}>
                    {locations.map((loc) => (
                      <Link
                        key={loc.slug}
                        href={`/services/${service.slug}/${loc.slug}`}
                        className={styles.cardLink}
                      >
                        {loc.name} {loc.slug === 'india' ? '🇮🇳' : loc.slug === 'usa' ? '🇺🇸' : '🇦🇺'}
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Not sure which service fits?</h2>
              <p className={styles.ctaCopy}>
                Share your brief and I&apos;ll reply in 24 hours with a fixed
                quote and the engagement model that makes sense.
              </p>
              <Link href="/contact" className={styles.ctaBtn}>
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Development services by Sadik',
            url: `${siteConfig.url}/services`,
            itemListElement: services.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: s.name,
              url: `${siteConfig.url}/services/${s.slug}/india`,
            })),
          }),
        }}
      />
    </>
  );
}
