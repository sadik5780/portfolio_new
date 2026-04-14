import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { adminGuard } from '@/lib/auth/guard';
import { getSupabaseAdmin, hasServiceRoleEnv } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const BUCKET = 'project-media';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);

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

function safeExtension(filename: string, mime: string): string {
  const byMime: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  };
  if (byMime[mime]) return byMime[mime];
  const m = filename.match(/\.([a-z0-9]{2,5})$/i);
  return m ? m[1].toLowerCase() : 'bin';
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

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
    return NextResponse.json(
      { error: `Unsupported type: ${file.type || 'unknown'}. Use JPG, PNG, WebP, GIF, SVG, or AVIF.` },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
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

  // ── Upload ─────────────────────────────────────────
  const ext = safeExtension(file.name, file.type);
  // `projects/<date>/<random>.<ext>` — keeps uploads organised in the bucket.
  const today = new Date().toISOString().slice(0, 10);
  const path = `projects/${today}/${randomUUID()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());

  const supabase = getSupabaseAdmin();
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
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
    type: file.type,
  });
}
