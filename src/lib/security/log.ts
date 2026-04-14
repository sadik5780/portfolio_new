/**
 * Structured security-event logger. All security-relevant events (failed
 * logins, rate-limit trips, signature failures, origin rejections) are
 * emitted through this single channel so they can be piped to Axiom / Datadog
 * / Better Stack / etc. in production.
 */

export type SecurityEvent =
  | 'auth.login.failed'
  | 'auth.login.rate_limited'
  | 'auth.login.origin_rejected'
  | 'auth.login.ok'
  | 'auth.login.misconfigured'
  | 'contact.rate_limited'
  | 'contact.origin_rejected'
  | 'payment.origin_rejected'
  | 'payment.rate_limited'
  | 'payment.signature_invalid'
  | 'upload.rejected_type'
  | 'upload.rejected_size'
  | 'upload.rejected_magic_bytes'
  | 'admin.unauthorized';

interface EventData {
  ip?: string;
  user?: string;
  reason?: string;
  path?: string;
  [k: string]: unknown;
}

export function logSecurityEvent(event: SecurityEvent, data: EventData = {}): void {
  const ts = new Date().toISOString();
  // Single line JSON — easy to pipe into any log aggregator.
  console.warn(
    JSON.stringify({
      ts,
      level: 'security',
      event,
      ...data,
    }),
  );
}
