/**
 * Extract the client IP from a request, honouring common proxy headers.
 * Falls back to "unknown" when nothing is available (e.g. local dev without
 * reverse proxy) — callers should treat "unknown" as a single bucket rather
 * than skipping rate limits.
 */
export function getClientIp(request: Request): string {
  // Vercel / Cloudflare / generic reverse proxy
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  // Nginx
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  // Vercel-specific header (most reliable on Vercel)
  const vercel = request.headers.get('x-vercel-forwarded-for');
  if (vercel) {
    const first = vercel.split(',')[0]?.trim();
    if (first) return first;
  }
  // Cloudflare
  const cf = request.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();

  return 'unknown';
}
