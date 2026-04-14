import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { adminGuard } from '@/lib/auth/guard';
import { getSupabaseAdmin, hasServiceRoleEnv } from '@/lib/supabase/server';
import { rateLimit, rateLimitHeaders } from '@/lib/security/rate-limit';
import { isAllowedOrigin } from '@/lib/security/origin';
import { getClientIp } from '@/lib/security/ip';
import { logSecurityEvent } from '@/lib/security/log';

export const runtime = 'nodejs';

const BUCKET = 'project-media';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
// SVG removed: it is a text format that can carry inline <script> and CSS
// payloads which execute when the file is fetched directly by a browser.
// If you genuinely need SVG uploads, sanitize server-side with DOMPurify.
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

/**
 * Verify the file's first bytes match its declared MIME. Stops a client from
 * uploading e.g. an HTML/JS file with a fake `image/png` Content-Type.
 */
function detectImageMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61
  ) {
    return 'image/gif';
  }
  // RIFF....WEBP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  // ftypavif at offset 4
  if (
    bytes.length >= 12 &&
    bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70 &&
    bytes[8] === 0x61 && bytes[9] === 0x76 && bytes[10] === 0x69 && bytes[11] === 0x66
  ) {
    return 'image/avif';
  }
  return null;
}

let bucketReady: Promise<void> | null = null;

/**
 * Ensure the `project-media` storage bucket exists and is public-readable.
 * Idempotent — called lazily and memoized.
 */
async function ensureBucket(): Promise<void> {
  if (bucketReady) return bucketReady;
  const supabase = getSupabaseAdmin();
  bucketReady = (async () => {
    const { data, error } = await supabase.storage.getBucket(BUCKET);
    if (data) return;
    // Any error other than "not found" should propagate.
    if (error && !/not found|does not exist/i.test(error.message)) {
      throw new Error(`Could not query storage bucket: ${error.message}`);
    }
    const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: Array.from(ALLOWED_MIME),
    });
    if (createErr) {
      throw new Error(`Could not create storage bucket: ${createErr.message}`);
    }
  })();
  return bucketReady;
}

// Always derive the extension from the verified MIME — never trust the
// uploaded filename, which could contain `.html`, `.svg`, `..`, etc.
function extensionForMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    case 'image/gif': return 'gif';
    case 'image/avif': return 'avif';
    default: return 'bin';
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // Origin check (defense-in-depth even though admin auth gates this).
  if (!isAllowedOrigin(request)) {
    logSecurityEvent('admin.unauthorized', {
      ip,
      reason: 'bad_origin',
      path: '/api/admin/uploads',
    });
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  // Per-IP upload throttle: 30 uploads / 10 min.
  const limit = rateLimit({
    key: `upload:ip:${ip}`,
    limit: 30,
    windowSeconds: 60 * 10,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many uploads. Please slow down.' },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  if (!hasServiceRoleEnv()) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Expected multipart/form-data.' },
      { status: 400 },
    );
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'No file uploaded (field name must be "file").' },
      { status: 422 },
    );
  }
  if (!ALLOWED_MIME.has(file.type)) {
    logSecurityEvent('upload.rejected_type', { ip, mime: file.type });
    return NextResponse.json(
      {
        error: `Unsupported type: ${file.type || 'unknown'}. Use JPG, PNG, WebP, GIF, or AVIF. (SVG is no longer accepted — it can carry inline scripts.)`,
      },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    logSecurityEvent('upload.rejected_size', { ip, size: file.size });
    return NextResponse.json(
      { error: `File too large. Max ${(MAX_BYTES / 1024 / 1024).toFixed(0)} MB.` },
      { status: 413 },
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'File is empty.' }, { status: 422 });
  }

  try {
    await ensureBucket();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Storage setup failed.' },
      { status: 500 },
    );
  }

  // Read into memory ONCE so we can sniff the magic bytes AND upload.
  const bytes = new Uint8Array(await file.arrayBuffer());

  // ── Magic-byte verification ──────────────────────
  // Reject any file whose actual contents don't match its declared MIME.
  // This is what stops a renamed-`evil.html` upload from sneaking through.
  const detectedMime = detectImageMime(bytes);
  if (!detectedMime || detectedMime !== file.type) {
    logSecurityEvent('upload.rejected_magic_bytes', {
      ip,
      claimed: file.type,
      detected: detectedMime,
      filename: file.name,
    });
    return NextResponse.json(
      {
        error:
          'File contents do not match the declared image type. Re-export from your image editor and try again.',
      },
      { status: 415 },
    );
  }

  // Use the verified MIME for everything from here on, NOT the user-supplied one.
  const verifiedMime = detectedMime;
  const ext = extensionForMime(verifiedMime);
  const today = new Date().toISOString().slice(0, 10);
  const path = `projects/${today}/${randomUUID()}.${ext}`;

  const supabase = getSupabaseAdmin();
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: verifiedMime,
      upsert: false,
      cacheControl: '31536000', // 1 year — filename is unique so this is safe
    });

  if (uploadErr) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadErr.message}` },
      { status: 500 },
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({
    url: publicUrl,
    path,
    size: file.size,
    type: verifiedMime,
  });
}
