import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Testimonials from '@/components/Testimonials/Testimonials';
import { services, getService } from '@/data/services';
import { locations, getLocation, type LocationMeta } from '@/data/locations';
import { faqs as globalFaqs } from '@/data/faqs';
import { getBlogPost } from '@/data/blog-posts';
import { getProjectBySlug } from '@/lib/content/projects';
import { buildMetadata, siteConfig } from '@/lib/seo';
import styles from './page.module.scss';

interface PageProps {
  params: { service: string; location: string };
}

// Generate all 7 services × 4 locations = 28 programmatic pages at build.
export function generateStaticParams() {
  return services.flatMap((s) =>
    locations.map((l) => ({ service: s.slug, location: l.slug })),
  );
}

// ─── Currency helpers ──────────────────────────────────
function startingPriceFor(
  service: ReturnType<typeof getService>,
  location: LocationMeta,
): string {
  if (!service) return '';
  switch (location.currency) {
    case 'inr': return `₹${service.startingInr.toLocaleString('en-IN')}`;
    case 'gbp': return `£${service.startingGbp.toLocaleString('en-GB')}`;
    case 'usd':
    default:    return `$${service.startingUsd.toLocaleString('en-US')}`;
  }
}

function priceCurrencyCode(currency: LocationMeta['currency']): string {
  return currency.toUpperCase();
}

function priceForJsonLd(
  service: ReturnType<typeof getService>,
  currency: LocationMeta['currency'],
): string {
  if (!service) return '0';
  switch (currency) {
    case 'inr': return String(service.startingInr);
    case 'gbp': return String(service.startingGbp);
    case 'usd':
    default:    return String(service.startingUsd);
  }
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

  const priceFromLabel = startingPriceFor(service, location);
  const title = `Hire a ${service.name} in ${location.country} | From ${priceFromLabel}`;
  const description = `Hire a senior ${service.shortName} developer for your ${location.country} startup or scale-up. ${location.timezoneOffsetLabel} overlap, fixed ${priceCurrencyCode(location.currency)} pricing from ${priceFromLabel}, 24-hour reply. Founder-led — direct with the engineer building your product.`;

  const sn = service.shortName.toLowerCase();
  const ln = location.name.toLowerCase();
  const cn = location.country.toLowerCase();

  return buildMetadata({
    title,
    description,
    path: `/services/${service.slug}/${location.slug}`,
    keywords: [
      `hire ${sn} developer ${ln}`,
      `hire ${sn} developer ${cn}`,
      `${sn} developer ${cn}`,
      `${sn} development services ${cn}`,
      `${sn} expert ${cn}`,
      `senior ${sn} developer for hire ${cn}`,
      `${sn} developer for startup ${cn}`,
      `founder-led ${sn} development studio`,
    ],
  });
}

export default async function ServiceLocationPage({ params }: PageProps) {
  const service = getService(params.service);
  const location = getLocation(params.location);
  if (!service || !location) notFound();

  const startingPrice = startingPriceFor(service, location);

  // Show all 3 currency reference points so visitors get instant transparency.
  const allCurrencies: Array<{ label: string; value: string; primary: boolean }> = [
    {
      label: 'USD',
      value: `$${service.startingUsd.toLocaleString('en-US')}`,
      primary: location.currency === 'usd',
    },
    {
      label: 'GBP',
      value: `£${service.startingGbp.toLocaleString('en-GB')}`,
      primary: location.currency === 'gbp',
    },
    {
      label: 'INR',
      value: `₹${service.startingInr.toLocaleString('en-IN')}`,
      primary: location.currency === 'inr',
    },
  ];

  // Per-page FAQ: pick a few global + location-specific
  const pageFaqs = [
    ...location.faqs,
    globalFaqs[0], // "Do you work with clients in India, USA, Australia?"
    globalFaqs[3], // SaaS cost
  ].filter(Boolean);

  const related = services
    .filter((s) => service.relatedSlugs.includes(s.slug))
    .slice(0, 3);

  const otherLocations = locations.filter((l) => l.slug !== location.slug);

  // Related blog posts — sync lookup over static array.
  const relatedBlogPosts = service.relatedBlogSlugs
    .map((slug) => getBlogPost(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  // Related case studies — async fetch from Supabase.
  const relatedProjects = (
    await Promise.all(service.relatedProjectSlugs.map((slug) => getProjectBySlug(slug)))
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  // ── JSON-LD: Service + Breadcrumb + FAQ ──────────
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} for ${location.country}`,
    description: service.description,
    provider: { '@id': `${siteConfig.url}/#organization` },
    areaServed: { '@type': 'Country', name: location.country },
    url: `${siteConfig.url}/services/${service.slug}/${location.slug}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: priceCurrencyCode(location.currency),
      price: priceForJsonLd(service, location.currency),
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
            <p className={styles.heroSub}>{location.marketNote}</p>

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
              <Link href="/quote" className={styles.btnPrimary}>
                Hire {service.shortName} Developer Now
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/projects" className={styles.btnSecondary}>
                View case studies
              </Link>
              <Link href="/contact" className={styles.btnSecondary}>
                Talk to Sadik
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
                  Why founders in {location.country} hire us for {service.name.toLowerCase()} work
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
            <h2 className={styles.h2}>
              Transparent {priceCurrencyCode(location.currency)} pricing — no scope-creep surprises
            </h2>
            <p className={styles.sectionCopy}>{location.marketNote}</p>

            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <span className={styles.pricingLabel}>Starts at</span>
                <div className={styles.pricingValue}>{startingPrice}</div>
                <ul className={styles.altPrices}>
                  {allCurrencies
                    .filter((c) => !c.primary)
                    .map((c) => (
                      <li key={c.label}>
                        <span className={styles.altPriceLabel}>{c.label}</span>
                        <span className={styles.altPriceValue}>{c.value}</span>
                      </li>
                    ))}
                </ul>
                <p className={styles.pricingNote}>{service.pricingNote}</p>
                <Link href="/quote" className={styles.pricingCta}>
                  Build your fixed quote →
                </Link>
              </div>
              <div className={styles.pricingCard}>
                <span className={styles.pricingLabel}>How we work with {location.country} clients</span>
                <p className={styles.pricingNote}>{location.workingNote}</p>
                <Link href="/contact" className={styles.pricingCta}>
                  Book a 30-min discovery call →
                </Link>
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

        {/* ── Case studies ─────────────────────────── */}
        {relatedProjects.length > 0 && (
          <section className={styles.section}>
            <div className={styles.container}>
              <span className={styles.label}>Case studies</span>
              <h2 className={styles.h2}>
                {service.shortName} work we have shipped
              </h2>
              <p className={styles.sectionCopy}>
                Real builds from the studio — problem, solution, and the production stack we used.
              </p>
              <ul className={styles.caseList}>
                {relatedProjects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className={styles.caseCard}>
                      <span className={styles.caseTag}>{p.category}</span>
                      <span className={styles.caseTitle}>{p.title}</span>
                      <span className={styles.caseDesc}>{p.description}</span>
                      <span className={styles.caseLink}>Read case study →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Related reading (blog) ───────────────── */}
        {relatedBlogPosts.length > 0 && (
          <section className={styles.section}>
            <div className={styles.container}>
              <span className={styles.label}>Reading</span>
              <h2 className={styles.h2}>
                Guides on hiring a {service.shortName} developer
              </h2>
              <ul className={styles.readingList}>
                {relatedBlogPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className={styles.readingCard}>
                      <span className={styles.readingTag}>{post.category}</span>
                      <span className={styles.readingTitle}>{post.title}</span>
                      <span className={styles.readingDesc}>{post.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

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
                Send a short brief. We reply within 24 hours with a scope, fixed {priceCurrencyCode(location.currency)} quote, and a proposed start date — no obligation.
              </p>
              <div className={styles.ctaActions}>
                <Link href="/quote" className={styles.btnPrimary}>
                  Hire {service.shortName} Developer Now
                </Link>
                <Link href="/contact" className={styles.btnSecondary}>
                  Book a discovery call
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
