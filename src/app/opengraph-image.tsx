import { ImageResponse } from 'next/og';

// Next.js Metadata Files convention: this file becomes /opengraph-image
// and is auto-wired as the default OG image for every route.
// Reference: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

export const runtime = 'edge';
export const alt = 'Sadik Studio — Founder-led React, SaaS, Shopify & AI Development';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'radial-gradient(ellipse at 20% 10%, rgba(99,102,241,0.35), transparent 60%),' +
            ' radial-gradient(ellipse at 80% 90%, rgba(139,92,246,0.35), transparent 60%),' +
            ' #09090b',
          fontFamily: 'sans-serif',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Sadik Studio
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              maxWidth: 960,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            We build high-performance{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                backgroundClip: 'text',
                color: 'transparent',
                marginLeft: 12,
              }}
            >
              web apps, SaaS & Shopify
            </span>
            {' '}for global startups.
          </div>
          <div style={{ fontSize: 24, color: '#a1a1aa', maxWidth: 880 }}>
            Founder-led development studio · USA · UK · Australia · India
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 22,
            color: '#a1a1aa',
          }}
        >
          <div>sadikstudio.in</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <span>React</span>
            <span>·</span>
            <span>Next.js</span>
            <span>·</span>
            <span>Shopify</span>
            <span>·</span>
            <span>SaaS</span>
            <span>·</span>
            <span>AI</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
