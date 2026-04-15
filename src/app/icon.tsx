import { ImageResponse } from 'next/og';

// Next.js Metadata Files convention: this file becomes /icon
// and is auto-wired as the favicon across every route.
// Reference: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 700,
          fontFamily: 'sans-serif',
          borderRadius: 6,
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
