/**
 * In-memory sliding-window rate limiter.
 *
 * Works per Node.js process. On serverless (Vercel/Netlify) or multi-instance
 * deployments, swap the `Map` for Upstash Redis — keep the same API.
 * See REDIS_SETUP in docs/security.md for the drop-in replacement.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowSeconds: number;
}

function evictExpired(now: number): void {
  if (buckets.size < MAX_BUCKETS) return;
  // forEach avoids the downlevel-iteration TS issue with Map iterators.
  const target = Math.floor(MAX_BUCKETS * 0.9);
  buckets.forEach((v, k) => {
    if (buckets.size <= target) return;
    if (v.resetAt <= now) buckets.delete(k);
  });
}

export function rateLimit(opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const ttlMs = opts.windowSeconds * 1000;
  evictExpired(now);

  const existing = buckets.get(opts.key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(opts.key, { count: 1, resetAt: now + ttlMs });
    return {
      ok: true,
      remaining: opts.limit - 1,
      resetAt: now + ttlMs,
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= opts.limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: opts.limit - existing.count,
    resetAt: existing.resetAt,
    retryAfterSeconds: 0,
  };
}

/**
 * Attach standard rate-limit headers to a Response/NextResponse-like object
 * for observability.
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const h: Record<string, string> = {
    'X-RateLimit-Remaining': String(Math.max(0, result.remaining)),
    'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000)),
  };
  if (!result.ok) h['Retry-After'] = String(result.retryAfterSeconds);
  return h;
}
