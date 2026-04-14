import 'server-only';
import bcrypt from 'bcryptjs';

/**
 * Verifies a provided admin password.
 *
 * Preferred: `ADMIN_PASSWORD_HASH` — a bcrypt hash (cost ≥ 10).
 * Generate with:
 *   node -e "require('bcryptjs').hash(process.argv[1], 12).then(console.log)" 'your-password'
 *
 * Fallback (legacy, dev only): `ADMIN_PASSWORD` plaintext — logs a warning.
 * Never rely on the fallback in production.
 */
export async function verifyAdminPassword(provided: string): Promise<boolean> {
  if (!provided) return false;

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash && hash.length > 0) {
    try {
      return await bcrypt.compare(provided, hash);
    } catch {
      return false;
    }
  }

  const plain = process.env.ADMIN_PASSWORD;
  if (plain && plain.length > 0) {
    if (!warnedFallback) {
      console.warn(
        '[security] ADMIN_PASSWORD_HASH is not set — falling back to plaintext ADMIN_PASSWORD. ' +
          'Generate a bcrypt hash and set ADMIN_PASSWORD_HASH in your env.',
      );
      warnedFallback = true;
    }
    return timingSafeEqStr(provided, plain);
  }

  return false;
}

export function verifyAdminUsername(provided: string): boolean {
  const expected = process.env.ADMIN_USER;
  if (!expected) return false;
  return timingSafeEqStr(provided, expected);
}

let warnedFallback = false;

function timingSafeEqStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
