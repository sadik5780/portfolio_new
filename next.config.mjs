/**
 * Security headers are applied here (not in middleware) so they cover every
 * response, including static assets and Next.js internals.
 *
 * CSP allows: self, Razorpay checkout + API, Supabase storage + REST.
 * If you add external scripts (analytics, Intercom, etc.) add them to the
 * script-src / connect-src lists below explicitly.
 *
 * Content-Security-Policy-Report-Only is commented out — uncomment when you
 * want to test a tighter policy without breaking the site.
 */

const ContentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' is required because Next.js App Router inlines hydration
  // scripts. Tighten with nonces later if you can tolerate the complexity.
  "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://analytics.ahrefs.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://*.razorpay.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://analytics.ahrefs.com",
  "frame-src https://api.razorpay.com https://checkout.razorpay.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
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
  // Legacy, harmless, keeps some security scanners happy
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
      // Supabase Storage public URLs
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
      // Belt-and-braces: admin paths emit X-Robots-Tag in addition to
      // robots.txt disallowing them.
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
