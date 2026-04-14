import { ImageResponse } from 'next/og';

export const runtime = 'edge';
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
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", "Helvetica Neue", sans-serif',
        }}
      >
        S
      </div>
    ),
    size,
  );
}
