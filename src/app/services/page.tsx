import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { offerings } from '@/data/offerings';
import { services } from '@/data/services';
import { locations } from '@/data/locations';
import { buildMetadata, siteConfig } from '@/lib/seo';
import styles from './page.module.scss';

export const metadata: Metadata = buildMetadata({
  title: 'Development Services — React, SaaS, Shopify, AI for Global Startups',
  description:
    'Sadik Studio builds custom React & Next.js apps, Shopify stores, multi-tenant SaaS platforms, and AI-powered product features for startup founders in the USA, UK, Australia, and India.',
  path: '/services',
  keywords: [
    'custom web development services',
    'react development services',
    'next.js development services',
    'shopify development services',
    'saas development services',
    'ai web app development services',
    'hire react developer usa uk australia',
    'founder-led development studio',
  ],
});

export default function ServicesIndexPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sadik Studio — services',
    url: `${siteConfig.url}/services`,
    itemListElement: offerings.map((o, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: o.name,
      description: o.description,
    })),
  };

  // OfferCatalog JSON-LD covering the 7 hire-by-stack services
  const offerCatalogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Sadik Studio — engineering services',
    url: `${siteConfig.url}/services`,
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.name,
        description: s.description,
        url: `${siteConfig.url}/services/${s.slug}/usa`,
      },
      priceCurrency: 'USD',
      price: String(s.startingUsd),
      availability: 'https://schema.org/InStock',
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogJsonLd) }}
      />

      <Navbar />
      <main className={styles.page}>
        {/* ── Hero ───────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.container}>
            <SectionHeading
              label="What we build"
              title="Static sites, Shopify stores, SaaS, web apps & mobile"
              description="Five focused offerings — each with a fixed scope, fixed timeline, and fixed price. Use the quote builder for an instant estimate or get in touch for something custom."
            />

            <div className={styles.heroActions}>
              <Link href="/quote" className={styles.btnPrimary}>
                Get an instant quote
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/pricing" className={styles.btnSecondary}>
                See full pricing
              </Link>
            </div>
          </div>
        </section>

        {/* ── Offering cards ─────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.grid}>
              {offerings.map((o) => (
                <article key={o.slug} className={styles.card}>
                  <div className={styles.cardHead}>
                    <div className={styles.iconBadge} aria-hidden>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d={o.icon} />
                      </svg>
                    </div>
                    <div className={styles.cardHeadText}>
                      <span className={styles.categoryLabel}>{o.category}</span>
                      <h2 className={styles.cardTitle}>{o.name}</h2>
                    </div>
                  </div>

                  <p className={styles.cardTagline}>{o.tagline}</p>
                  <p className={styles.cardDesc}>{o.description}</p>

                  <div className={styles.cardSection}>
                    <span className={styles.cardSectionLabel}>What&apos;s included</span>
                    <ul className={styles.cardList}>
                      {o.features.slice(0, 5).map((f) => (
                        <li key={f}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {f}
                        </li>
                      ))}
                      {o.features.length > 5 && (
                        <li className={styles.cardListMore}>
                          + {o.features.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className={styles.cardSection}>
                    <span className={styles.cardSectionLabel}>Tech stack</span>
                    <div className={styles.cardTech}>
                      {o.techStack.map((t) => (
                        <span key={t} className={styles.cardTechItem}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.cardSection}>
                    <span className={styles.cardSectionLabel}>Best for</span>
                    <ul className={styles.cardAudience}>
                      {o.audience.slice(0, 3).map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardMetaLabel}>Starts at</span>
                      <div className={styles.cardPrices}>
                        <span>${o.startingUsd.toLocaleString('en-US')}</span>
                      </div>
                      <span className={styles.cardTimeline}>{o.timeline}</span>
                    </div>

                    <div className={styles.cardActions}>
                      <Link
                        href={`/quote?service=${o.slug}`}
                        className={styles.cardCta}
                      >
                        Get a quote
                      </Link>
                      <Link
                        href="/pricing"
                        className={styles.cardCtaGhost}
                      >
                        See pricing
                      </Link>
                    </div>
                  </div>

                  {/* SEO keyword block — visually hidden, indexed by Google */}
                  <p className={styles.seoKeywords}>
                    Keywords: {o.seoKeywords.join(', ')}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Hire by stack × location matrix ───────── */}
        <section className={styles.matrixSection} id="hire-by-stack">
          <div className={styles.container}>
            <SectionHeading
              label="Hire by stack + location"
              title="Dedicated engineering by technology and region"
              description="Every service is available worldwide with local market context — pricing, timezone overlap, and region-specific FAQs. Pick a stack and choose your region."
            />

            <div className={styles.matrixGrid}>
              {services.map((service) => (
                <div key={service.slug} className={styles.matrixCard}>
                  <div className={styles.matrixCardHead}>
                    <h3 className={styles.matrixCardTitle}>{service.name}</h3>
                    <p className={styles.matrixCardTagline}>{service.tagline}</p>
                  </div>
                  <div className={styles.matrixLinks}>
                    {locations.map((loc) => (
                      <Link
                        key={loc.slug}
                        href={`/services/${service.slug}/${loc.slug}`}
                        className={styles.matrixLink}
                      >
                        <span className={styles.matrixLinkLabel}>
                          Hire in {loc.name}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────── */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Not sure which fits?</h2>
              <p className={styles.ctaCopy}>
                Build your project in the quote estimator and see a live price
                update as you pick features. Submit and you get a real fixed
                quote within 24 hours — no obligation.
              </p>
              <div className={styles.ctaActions}>
                <Link href="/quote" className={styles.btnPrimary}>
                  Open the quote estimator
                </Link>
                <Link href="/contact" className={styles.btnSecondary}>
                  Just say hi
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
