const INDEXNOW_KEY = '2aaa69e8be6e8a89dd3426121dd01aa0';
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.sadikstudio.in';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

/**
 * Submit URLs to IndexNow (Bing, Yandex, Naver, Seznam, etc.).
 *
 * Fire-and-forget — never blocks or throws. Only fires in production
 * so local dev / preview deploys don't pollute the index.
 */
export function submitToIndexNow(paths: string[]): void {
  if (!paths.length) return;
  if (process.env.NODE_ENV !== 'production') return;

  const host = new URL(SITE_URL).host;
  const urlList = paths.map((p) =>
    p.startsWith('http') ? p : `${SITE_URL}${p}`,
  );

  fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: INDEXNOW_KEY, urlList }),
  }).catch(() => {});
}
