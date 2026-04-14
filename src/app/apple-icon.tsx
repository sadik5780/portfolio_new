import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * iOS / iPadOS home-screen icon. Larger radius matches Apple's preferred
 * proportions (~20% radius), gradient + 'S' stay identical to the favicon.
 */
export default function AppleIcon() {
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
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: '-0.06em',
          borderRadius: 36,
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
