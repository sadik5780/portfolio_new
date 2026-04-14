import 'server-only';

/**
 * Race a Supabase (or any) promise against a timeout. If the promise
 * doesn't resolve in `ms`, the caller gets `fallback` instead of hanging.
 *
 * This prevents cold/paused Supabase projects from dragging TTFB to
 * double-digit seconds on SSG revalidation and dynamic renders.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
  tag?: string,
): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  const timer = new Promise<T>((resolve) => {
    timeout = setTimeout(() => {
      if (tag && process.env.NODE_ENV !== 'production') {
        console.warn(`[${tag}] timed out after ${ms}ms, using fallback`);
      }
      resolve(fallback);
    }, ms);
  });

  try {
    return await Promise.race([promise, timer]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

/** Default cutoff for Supabase reads — fail fast, fall back to defaults. */
export const SUPABASE_READ_TIMEOUT_MS = 3000;
