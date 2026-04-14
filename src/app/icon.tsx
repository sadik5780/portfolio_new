import { ImageResponse } from 'next/og';

// Node runtime — avoids edge bundler 500s in `next dev` and Netlify Functions.
// No `revalidate` export — Next.js' prerender + ImageResponse on nodejs
// rejects with `Invalid URL`. The route is dynamic, generated on first hit,
// then cached by the CDN via Next.js' default cache-control headers.
export const runtime = 'nodejs';
// Skip build-time prerender — ImageResponse on nodejs needs a real request
// context which build-time prerendering can't provide.
export const dynamic = 'force-dynamic';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/**
 * Browser-tab favicon — gradient rounded square with a bold "S".
 * Matches the Logo component's icon mark exactly so the brand stays
 * consistent from the URL bar to the page header.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.06em',
          borderRadius: 6,
          // No fontFamily — let Satori use its bundled default (Vera Sans).
          // Specifying system fonts here can cause render failures because
          // Satori needs the font binary, not just a CSS family name.
        }}
      >
        S
      </div>
    ),
    size,
  );
}
