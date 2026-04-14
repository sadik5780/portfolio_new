import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { buildMetadata, siteConfig } from '@/lib/seo';
import './globals.scss';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
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

<<<<<<< HEAD
// ─── Schema.org JSON-LD on every page ────────────
// Person — identifies the human behind the brand
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteConfig.url}/#person`,
=======
// Organization / Person JSON-LD for homepage
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
>>>>>>> fc616681f6243c7bc016172f2407bc8c1b30af36
  name: siteConfig.fullName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  jobTitle: 'Full-Stack Developer',
  description: siteConfig.description,
  sameAs: [
    'https://github.com/sadik',
    'https://linkedin.com/in/sadik',
    'https://twitter.com/sadikdev',
  ],
  knowsAbout: [
    'React',
    'Next.js',
    'TypeScript',
    'Shopify',
<<<<<<< HEAD
    'Hydrogen',
    'Node.js',
    'PostgreSQL',
    'Stripe',
    'Razorpay',
    'SaaS Development',
    'E-commerce',
=======
    'Node.js',
    'SaaS Development',
>>>>>>> fc616681f6243c7bc016172f2407bc8c1b30af36
  ],
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Australia' },
  ],
};

<<<<<<< HEAD
// Organization — gives Google a business entity to link reviews, offers,
// and contact info to (distinct from the individual Person).
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  legalName: siteConfig.fullName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/og-image.jpg`,
  founder: { '@id': `${siteConfig.url}/#person` },
  email: 'hello@sadik.dev',
  sameAs: [
    'https://github.com/sadik',
    'https://linkedin.com/in/sadik',
    'https://twitter.com/sadikdev',
  ],
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Australia' },
  ],
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

=======
>>>>>>> fc616681f6243c7bc016172f2407bc8c1b30af36
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
<<<<<<< HEAD
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
=======
>>>>>>> fc616681f6243c7bc016172f2407bc8c1b30af36
      </head>
      <body>{children}</body>
    </html>
  );
}
