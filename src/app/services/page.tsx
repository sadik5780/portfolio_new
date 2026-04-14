import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { offerings } from '@/data/offerings';
import { buildMetadata, siteConfig } from '@/lib/seo';
import styles from './page.module.scss';

export const metadata: Metadata = buildMetadata({
  title: 'Services — Static Sites, Shopify, SaaS, Web & Mobile Apps',
  description:
    'Sadik Studio builds static websites, custom Shopify stores, B2B SaaS platforms, bespoke web apps, and React Native mobile apps for founders in India, USA, and Australia.',
  path: '/services',
  keywords: [
    'static website development',
    'shopify developer india',
    'saas developer india',
    'custom web app development',
    'react native developer india',
    'mobile app development',
    'ecommerce store development',
    'hire developer india usa australia',
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
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
