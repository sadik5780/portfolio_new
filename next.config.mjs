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
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.supabase.co',
    'https://*.razorpay.com',
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
