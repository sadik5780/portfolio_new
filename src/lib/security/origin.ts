/**
 * Same-origin enforcement for state-changing requests.
 *
 * Defense-in-depth against CSRF alongside cookie SameSite=Lax. Rejects POST /
 * PUT / PATCH / DELETE whose Origin header doesn't match an allowed origin.
 * Falls back to Referer when Origin is absent (older browsers, some proxies).
 */

function getAllowedOrigins(): string[] {
  const list = new Set<string>();

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    try {
      list.add(new URL(site).origin);
    } catch {
      /* ignore malformed */
    }
  }

  const extra = process.env.ALLOWED_ORIGINS;
  if (extra) {
    for (const raw of extra.split(',')) {
      const v = raw.trim();
      if (!v) continue;
      try {
        list.add(new URL(v).origin);
      } catch {
        /* ignore malformed */
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    list.add('http://localhost:3000');
    list.add('http://127.0.0.1:3000');
  }

  return Array.from(list);
}

/**
 * Returns true when the request is safe-method OR its Origin/Referer matches
 * one of the allowed origins. Reject with 403 otherwise.
 */
export function isAllowedOrigin(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return true;

  const allowed = getAllowedOrigins();
  if (allowed.length === 0) {
    // Misconfiguration — fail closed in production, open in dev for DX.
    return process.env.NODE_ENV !== 'production';
  }

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      return allowed.includes(new URL(origin).origin);
    } catch {
      return false;
    }
  }

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      return allowed.includes(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  // No Origin AND no Referer on a state-changing request: reject.
  return false;
}
