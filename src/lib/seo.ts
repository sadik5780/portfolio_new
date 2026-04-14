import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Sadik',
  fullName: 'Sadik Shaikh',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sadik.dev',
  title:
    'Sadik — React Developer India | Shopify Developer USA | SaaS Developer Australia',
  description:
    'Hire Sadik — a senior React, Next.js, Shopify, and SaaS developer. Full-stack freelance services for teams in India, USA, and Australia. Shopify stores from ₹50,000 / $2,000. Custom web apps from ₹1,00,000 / $10,000.',
  keywords: [
    'react developer india',
    'shopify developer india',
    'next.js developer india',
    'freelance developer usa',
    'hire react developer usa',
    'hire react developer australia',
    'saas developer australia',
    'shopify developer usa',
    'full stack developer india',
    'custom web app development',
    'hire nextjs developer',
    'frontend developer for hire',
    'typescript developer',
  ],
  locale: 'en_US',
  twitterHandle: '@sadikdev',
  author: 'Sadik Shaikh',
} as const;

interface BuildMetadataParams {
  title?: string;
  description?: string;
  path?: string;
  keywords?: readonly string[] | string[];
  images?: string[];
  noIndex?: boolean;
}

/**
 * Build a Next.js Metadata object with consistent defaults.
 * Title is composed as "{title} | Sadik" unless it already contains the brand.
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  keywords,
  images,
  noIndex = false,
}: BuildMetadataParams = {}): Metadata {
  const composedTitle = title
    ? title.includes(siteConfig.name)
      ? title
      : `${title} | ${siteConfig.name}`
    : siteConfig.title;

  const composedDescription = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;
  const ogImages = images && images.length ? images : [`${siteConfig.url}/og-image.jpg`];

  return {
    title: composedTitle,
    description: composedDescription,
    keywords: (keywords ?? siteConfig.keywords) as string[],
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    verification: {
      other: {
        // Bing Webmaster Tools site verification
        'msvalidate.01': '895133D1B0D1CB306691473722082FDA',
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: composedTitle,
      description: composedDescription,
      images: ogImages.map((img) => ({ url: img, width: 1200, height: 630 })),
    },
    twitter: {
      card: 'summary_large_image',
      title: composedTitle,
      description: composedDescription,
      creator: siteConfig.twitterHandle,
      images: ogImages,
    },
  };
}
