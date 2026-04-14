import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Testimonials from '@/components/Testimonials/Testimonials';
import { services, getService } from '@/data/services';
import { locations, getLocation } from '@/data/locations';
import { faqs as globalFaqs } from '@/data/faqs';
import { buildMetadata, siteConfig } from '@/lib/seo';
import styles from './page.module.scss';

interface PageProps {
  params: { service: string; location: string };
}

// Generate all 6 services × 3 locations = 18 programmatic pages at build.
export function generateStaticParams() {
  return services.flatMap((s) =>
    locations.map((l) => ({ service: s.slug, location: l.slug })),
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  const service = getService(params.service);
  const location = getLocation(params.location);
  if (!service || !location) {
    return buildMetadata({
      title: 'Not found',
      path: `/services/${params.service}/${params.location}`,
      noIndex: true,
    });
  }

  const priceFromLabel =
    location.currency === 'inr'
      ? `₹${service.startingInr.toLocaleString('en-IN')}`
      : `$${service.startingUsd.toLocaleString('en-US')}`;

  const title = `Hire ${service.name} in ${location.country} | From ${priceFromLabel}`;
  const description = `${service.description} Fixed ${location.currency.toUpperCase()} pricing, ${location.timezoneOffsetLabel} overlap, 24-hour reply.`;

  return buildMetadata({
    title,
    description,
    path: `/services/${service.slug}/${location.slug}`,
    keywords: [
      `hire ${service.shortName.toLowerCase()} developer ${location.name.toLowerCase()}`,
      `${service.shortName.toLowerCase()} developer ${location.country.toLowerCase()}`,
      `${service.shortName.toLowerCase()} freelancer ${location.name.toLowerCase()}`,
      `freelance ${service.shortName.toLowerCase()} developer`,
      `${service.shortName.toLowerCase()} expert ${location.country.toLowerCase()}`,
    ],
  });
}

export default function ServiceLocationPage({ params }: PageProps) {
  const service = getService(params.service);
  const location = getLocation(params.location);
  if (!service || !location) notFound();

  const startingPrice =
    location.currency === 'inr'
      ? `₹${service.startingInr.toLocaleString('en-IN')}`
      : `$${service.startingUsd.toLocaleString('en-US')}`;

  // Per-page FAQ: pick a few global + location-specific
  const pageFaqs = [
    ...location.faqs,
    globalFaqs[0], // "Do you work with clients in India, USA, Australia?"
    globalFaqs[3], // SaaS cost
  ];

  const related = services
    .filter((s) => service.relatedSlugs.includes(s.slug))
    .slice(0, 3);

  const otherLocations = locations.filter((l) => l.slug !== location.slug);

  // ── JSON-LD: Service + Breadcrumb + FAQ ──────────
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} for ${location.country}`,
    description: service.description,
    provider: {
      '@type': 'Person',
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
    areaServed: {
      '@type': 'Country',
      name: location.country,
    },
    url: `${siteConfig.url}/services/${service.slug}/${location.slug}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: location.currency === 'inr' ? 'INR' : 'USD',
      price: String(location.currency === 'inr' ? service.startingInr : service.startingUsd),
      availability: 'https://schema.org/InStock',
    },
    serviceType: service.name,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteConfig.url}/services` },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.name,
        item: `${siteConfig.url}/services/${service.slug}/${location.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pageFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />
      <main className={styles.page}>
        {/* ── Hero ─────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.container}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/services">Services</Link>
              <span>/</span>
              <span className={styles.breadcrumbActive}>
                {service.shortName} in {location.name}
              </span>
            </nav>

            <span className={styles.heroLabel}>
              {service.name} · {location.country}
            </span>
            <h1 className={styles.heroTitle}>
              Hire a <span className={styles.gradient}>{service.name}</span> in {location.country}
            </h1>
            <p className={styles.heroSub}>{service.intro}</p>

            <div className={styles.heroMeta}>
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Starts at</span>
                <span className={styles.heroMetaValue}>{startingPrice}</span>
              </div>
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Timezone</span>
                <span className={styles.heroMetaValue}>{location.timezoneOffsetLabel}</span>
              </div>
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Reply</span>
                <span className={styles.heroMetaValue}>Within 24h</span>
              </div>
            </div>

            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.btnPrimary}>
                Hire {service.shortName} Developer Now
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/projects" className={styles.btnSecondary}>
                View past work
              </Link>
            </div>
          </div>
        </section>

        {/* ── Benefits + deliverables ──────────────── */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.twoCol}>
              <div>
                <span className={styles.label}>Benefits</span>
                <h2 className={styles.h2}>
                  Why founders in {location.country} hire me for {service.name.toLowerCase()} work
                </h2>
                <ul className={styles.checkList}>
                  {service.benefits.map((b) => (
                    <li key={b}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className={styles.label}>Deliverables</span>
                <h2 className={styles.h2}>What you get</h2>
                <ul className={styles.deliverableList}>
                  {service.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>

                <span className={styles.label} style={{ marginTop: '2rem', display: 'block' }}>
                  Tech stack
                </span>
                <div className={styles.techStack}>
                  {service.tech.map((t) => (
                    <span key={t} className={styles.techItem}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing + how we work ─────────────────── */}
        <section className={styles.pricingSection}>
          <div className={styles.container}>
            <span className={styles.label}>Pricing for {location.country}</span>
            <h2 className={styles.h2}>Transparent {location.currency.toUpperCase()} pricing</h2>
            <p className={styles.sectionCopy}>{location.marketNote}</p>

            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <span className={styles.pricingLabel}>Starting price</span>
                <div className={styles.pricingValue}>{startingPrice}</div>
                <p className={styles.pricingNote}>{service.pricingNote}</p>
              </div>
              <div className={styles.pricingCard}>
                <span className={styles.pricingLabel}>How I work with {location.country} clients</span>
                <p className={styles.pricingNote}>{location.workingNote}</p>
              </div>
            </div>

            <div className={styles.useCases}>
              <h3 className={styles.h3}>Typical projects</h3>
              <ul className={styles.bulletList}>
                {service.useCases.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────── */}
        <Testimonials />

        {/* ── FAQ ──────────────────────────────────── */}
        <section className={styles.faqSection}>
          <div className={styles.container}>
            <span className={styles.label}>FAQ</span>
            <h2 className={styles.h2}>
              Frequently asked questions — {service.shortName} in {location.name}
            </h2>
            <div className={styles.faqList}>
              {pageFaqs.map((f, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related services + other locations ──── */}
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <div className={styles.relatedGrid}>
              <div>
                <span className={styles.label}>Related services</span>
                <h3 className={styles.h3}>Other services in {location.name}</h3>
                <ul className={styles.relatedLinks}>
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/services/${r.slug}/${location.slug}`}>
                        Hire {r.name} in {location.name} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className={styles.label}>Other locations</span>
                <h3 className={styles.h3}>Same service, other regions</h3>
                <ul className={styles.relatedLinks}>
                  {otherLocations.map((l) => (
                    <li key={l.slug}>
                      <Link href={`/services/${service.slug}/${l.slug}`}>
                        Hire {service.name} in {l.country} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────── */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>
                Ready to hire a {service.name} in {location.country}?
              </h2>
              <p className={styles.ctaCopy}>
                Send a short brief. I reply within 24 hours with a scope, fixed {location.currency.toUpperCase()} quote, and a proposed start date.
              </p>
              <div className={styles.ctaActions}>
                <Link href="/contact" className={styles.btnPrimary}>
                  Hire {service.shortName} Developer Now
                </Link>
                <Link href="/projects" className={styles.btnSecondary}>
                  See past {service.shortName} work
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
