/**
 * Security headers are applied here (not in middleware) so they cover every
 * response, including static assets and Next.js internals.
 *
 * CSP is split into dev and prod flavours:
 *   - Dev needs 'unsafe-eval' for React Fast Refresh + ws: for webpack HMR.
 *   - Prod is tight — self + Razorpay + Supabase + analytics only.
 *
 * If you add external scripts later (chat widget, GTM, etc.) add them to the
 * script-src / connect-src lists explicitly.
 */

const isProd = process.env.NODE_ENV === 'production';

// Base policy shared between dev and prod.
const baseCsp = {
  'default-src': ["'self'"],
  // 'unsafe-inline' is required because Next.js App Router inlines hydration
  // scripts. Tighten with nonces later if you can tolerate the complexity.
  // 'unsafe-eval' is added in dev only — React Fast Refresh hot-reload uses
  // eval'd module updates.
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    ...(isProd ? [] : ["'unsafe-eval'"]),
    'https://checkout.razorpay.com',
    'https://analytics.ahrefs.com',
    'https://www.googletagmanager.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.supabase.co',
    'https://*.razorpay.com',
    'https://*.google-analytics.com',
    'https://*.googletagmanager.com',
  ],
  'font-src': ["'self'", 'data:'],
  // ws:/wss: for webpack HMR and live-reload in dev.
  'connect-src': [
    "'self'",
    ...(isProd ? [] : ['ws:', 'wss:']),
    'https://*.supabase.co',
    'https://api.razorpay.com',
    'https://lumberjack.razorpay.com',
    'https://analytics.ahrefs.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://*.googletagmanager.com',
  ],
  'frame-src': ['https://api.razorpay.com', 'https://checkout.razorpay.com'],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
};

function buildCsp() {
  const parts = Object.entries(baseCsp).map(
    ([directive, sources]) => `${directive} ${sources.join(' ')}`,
  );
  if (isProd) parts.push('upgrade-insecure-requests');
  return parts.join('; ');
}

const securityHeaders = [
  { key: 'Content-Security-Policy', value: buildCsp() },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '0' },
];

const adminNoIndexHeaders = [
  { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  poweredByHeader: false,
  // Literal high-intent SEO slugs 301 to canonical service×location pages.
  // Avoids duplicate content while preserving link-equity from external citations.
  async redirects() {
    return [
      // React
      { source: '/hire-react-developer-india',     destination: '/services/react-developer/india',     permanent: true },
      { source: '/hire-react-developer-usa',       destination: '/services/react-developer/usa',       permanent: true },
      { source: '/hire-react-developer-uk',        destination: '/services/react-developer/uk',        permanent: true },
      { source: '/hire-react-developer-australia', destination: '/services/react-developer/australia', permanent: true },
      // Next.js
      { source: '/hire-nextjs-developer-india',     destination: '/services/nextjs-developer/india',     permanent: true },
      { source: '/hire-nextjs-developer-usa',       destination: '/services/nextjs-developer/usa',       permanent: true },
      { source: '/hire-nextjs-developer-uk',        destination: '/services/nextjs-developer/uk',        permanent: true },
      { source: '/hire-nextjs-developer-australia', destination: '/services/nextjs-developer/australia', permanent: true },
      // Shopify
      { source: '/shopify-developer-india',     destination: '/services/shopify-developer/india',     permanent: true },
      { source: '/shopify-developer-usa',       destination: '/services/shopify-developer/usa',       permanent: true },
      { source: '/shopify-developer-uk',        destination: '/services/shopify-developer/uk',        permanent: true },
      { source: '/shopify-developer-australia', destination: '/services/shopify-developer/australia', permanent: true },
      // SaaS
      { source: '/saas-development-india',     destination: '/services/saas-developer/india',     permanent: true },
      { source: '/saas-development-usa',       destination: '/services/saas-developer/usa',       permanent: true },
      { source: '/saas-development-uk',        destination: '/services/saas-developer/uk',        permanent: true },
      { source: '/saas-development-australia', destination: '/services/saas-developer/australia', permanent: true },
      // AI integration
      { source: '/ai-web-app-development',         destination: '/services/ai-integration/usa',       permanent: true },
      { source: '/ai-integration-services',        destination: '/services/ai-integration/usa',       permanent: true },
      { source: '/hire-ai-developer-india',        destination: '/services/ai-integration/india',     permanent: true },
      { source: '/hire-ai-developer-usa',          destination: '/services/ai-integration/usa',       permanent: true },
      { source: '/hire-ai-developer-uk',           destination: '/services/ai-integration/uk',        permanent: true },
      { source: '/hire-ai-developer-australia',    destination: '/services/ai-integration/australia', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/admin/:path*',
        headers: adminNoIndexHeaders,
      },
      {
        source: '/login',
        headers: adminNoIndexHeaders,
      },
      {
        source: '/api/:path*',
        headers: adminNoIndexHeaders,
      },
    ];
  },
};

export default nextConfig;
