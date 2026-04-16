import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import { buildMetadata, siteConfig } from '@/lib/seo';
import './globals.scss';

// Body / UI text — neutral and exhaustively legible
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

// Display / brand — geometric, distinctive, premium SaaS character
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: '/',
});

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

// ─── Schema.org JSON-LD on every page ────────────
// Person — identifies the human behind the brand
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteConfig.url}/#person`,
  name: siteConfig.fullName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  jobTitle: 'Founder & Lead Engineer',
  worksFor: { '@id': `${siteConfig.url}/#organization` },
  description: `${siteConfig.fullName} is the founder and lead engineer of Sadik Studio, a boutique development practice shipping React, Next.js, Shopify, and SaaS products for startups in the USA, UK, Australia, and India.`,
  sameAs: [
    'https://www.linkedin.com/in/sadik-shaikh',
    'https://x.com/sadik5780',
  ],
  knowsAbout: [
    'React',
    'Next.js',
    'TypeScript',
    'Shopify',
    'Hydrogen',
    'Node.js',
    'PostgreSQL',
    'Stripe',
    'Razorpay',
    'SaaS Development',
    'E-commerce',
    'OpenAI',
    'Anthropic Claude',
    'RAG Pipelines',
    'AI Integration',
  ],
  areaServed: [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Australia' },
    { '@type': 'Country', name: 'India' },
  ],
};

// Organization — gives Google a business entity to link reviews, offers,
// and contact info to (distinct from the individual Person).
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  legalName: siteConfig.fullName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/opengraph-image`,
  image: `${siteConfig.url}/opengraph-image`,
  description: siteConfig.description,
  founder: { '@id': `${siteConfig.url}/#person` },
  email: 'sadik5780@gmail.com',
  priceRange: '$$',
  sameAs: [
    'https://www.linkedin.com/in/sadik-shaikh',
    'https://x.com/sadik5780',
  ],
  areaServed: [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Australia' },
    { '@type': 'Country', name: 'India' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Development Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'React & Next.js Development' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shopify & Headless Commerce' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom SaaS Platforms' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI-Powered Product Features' } },
    ],
  },
};

// WebSite — enables the Google sitelinks search box
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  publisher: { '@id': `${siteConfig.url}/#organization` },
  inLanguage: 'en',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Cut handshake latency to third-party origins loaded lazily below. */}
        <link rel="preconnect" href="https://analytics.ahrefs.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* RSS auto-discovery — feed readers and RSS-based automations find this. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.name} — Blog`}
          href="/rss.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Ahrefs Web Analytics — lazyOnload keeps TBT low and protects LCP */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          strategy="lazyOnload"
          data-key="ym2+dPel4hIM1OvhQkSobw"
        />
        {/* Google Analytics (gtag.js) — lazyOnload so it fires after main thread is idle */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EHEQ1207ME"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EHEQ1207ME');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
