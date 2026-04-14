/**
 * Same-origin enforcement for state-changing requests (CSRF defense).
 *
 * Policy:
 *   1. Safe methods (GET/HEAD/OPTIONS) are always allowed.
 *   2. If Origin is present AND matches the request's own Host OR a
 *      configured allowed origin → allowed.
 *   3. If Origin is present but does NOT match → rejected (this is the
 *      real browser-CSRF case — attacker.com posting to our site).
 *   4. If Origin is absent, fall back to Referer with the same rules.
 *   5. If neither Origin nor Referer is present → allowed, because a
 *      browser-initiated CSRF attempt always carries at least one of
 *      them. Missing both means curl, server-to-server, or a privacy
 *      extension — not a CSRF vector. Rate limits still apply.
 *
 * Tunables:
 *   - NEXT_PUBLIC_SITE_URL — primary production origin
 *   - ALLOWED_ORIGINS — comma-separated extra origins
 *   - SECURITY_LOG_ORIGIN=1 — log every allow/deny decision for debugging
 */

function getConfiguredOrigins(): Set<string> {
  const list = new Set<string>();

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    const o = normalizedOrigin(site);
    if (o) list.add(o);
  }

  const extra = process.env.ALLOWED_ORIGINS;
  if (extra) {
    for (const raw of extra.split(',')) {
      const v = raw.trim();
      if (!v) continue;
      const o = normalizedOrigin(v);
      if (o) list.add(o);
    }
  }

  return list;
}

function normalizedOrigin(urlLike: string): string | null {
  try {
    return new URL(urlLike).origin;
  } catch {
    return null;
  }
}

function getSameOrigin(request: Request): string | null {
  const host = request.headers.get('host');
  if (!host) return null;

  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim();
  let proto = forwardedProto;
  if (!proto) {
    try {
      proto = new URL(request.url).protocol.replace(':', '');
    } catch {
      proto = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    }
  }
  return `${proto}://${host}`;
}

function isLocalhost(origin: string): boolean {
  return (
    /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
    /^https?:\/\/\[::1\](:\d+)?$/.test(origin)
  );
}

function debugLog(msg: string, data: Record<string, unknown>) {
  if (process.env.SECURITY_LOG_ORIGIN === '1') {
    console.log('[origin-check]', msg, JSON.stringify(data));
  }
}

export function isAllowedOrigin(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return true;

  const configured = getConfiguredOrigins();
  const sameOrigin = getSameOrigin(request);
  const isDev = process.env.NODE_ENV !== 'production';

  const originHeader = request.headers.get('origin');
  const refererHeader = request.headers.get('referer');

  const candidate = originHeader && originHeader !== 'null' ? originHeader : refererHeader;

  // Rule 5: neither Origin nor Referer → not a browser CSRF, allow.
  if (!candidate) {
    debugLog('allow (no Origin, no Referer)', { sameOrigin, method });
    return true;
  }

  const candidateOrigin = normalizedOrigin(candidate);
  if (!candidateOrigin) {
    // Malformed header — conservatively reject, but log clearly.
    debugLog('reject (malformed candidate)', { candidate, sameOrigin });
    return false;
  }

  // Rule 2: same-origin match
  if (sameOrigin && candidateOrigin === sameOrigin) {
    debugLog('allow (same-origin)', { candidateOrigin, sameOrigin });
    return true;
  }

  // Rule 2: configured allowed origin
  if (configured.has(candidateOrigin)) {
    debugLog('allow (configured)', { candidateOrigin });
    return true;
  }

  // Dev wildcard: any localhost / 127.0.0.1 / [::1] port.
  if (isDev && isLocalhost(candidateOrigin)) {
    debugLog('allow (dev localhost)', { candidateOrigin });
    return true;
  }

  // Rule 3: Origin/Referer present but doesn't match → real CSRF case.
  debugLog('reject (cross-origin)', {
    candidateOrigin,
    sameOrigin,
    configured: Array.from(configured),
  });
  return false;
}
