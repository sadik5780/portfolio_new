import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';

/**
 * Tables that get included in every backup. If you add a new table, add it
 * here. `leads` and `payments` can contain personally-identifiable data,
 * which is why backups are admin-only and stored in a non-public bucket.
 */
const TABLES = [
  'settings',
  'projects',
  'testimonials',
  'blog_posts',
  'offerings',
  'payments',
  'leads',
] as const;

const BUCKET = 'backups';

export interface BackupResult {
  path: string;            // storage path within bucket
  url: string | null;      // signed URL valid for 7 days
  sizeBytes: number;
  tableCounts: Record<string, number>;
  generatedAt: string;
}

export interface BackupListing {
  name: string;
  sizeBytes: number;
  createdAt: string;
}

/**
 * Ensure the `backups` bucket exists and is private. Idempotent.
 */
async function ensureBucket(): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`Could not list buckets: ${error.message}`);

  const exists = data?.some((b) => b.name === BUCKET);
  if (exists) return;

  const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
    public: false, // private — signed URLs only
  });
  if (createErr) throw new Error(`Could not create bucket: ${createErr.message}`);
}

/**
 * Export every tracked table to JSON, bundle into one file, upload to
 * Supabase Storage under `backups/YYYY-MM-DD-HHmmss.json`, and return a
 * 7-day signed URL.
 *
 * Warning: this loads every row into memory. Fine for the current scale
 * (payments/leads count in the dozens). If you ever hit 10K+ rows in a
 * single table, switch to a streaming approach or offload to pg_dump via
 * Supabase's `Backups` addon (Pro tier only).
 */
export async function runBackup(): Promise<BackupResult> {
  await ensureBucket();
  const supabase = getSupabaseAdmin();

  const snapshot: Record<string, unknown[]> = {};
  const counts: Record<string, number> = {};

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      // Skip tables that don't exist yet (e.g. before 004_offerings migration
      // has been run). A partial backup is better than no backup.
      if (/does not exist|schema cache/i.test(error.message)) {
        snapshot[table] = [];
        counts[table] = 0;
        continue;
      }
      throw new Error(`Failed to export ${table}: ${error.message}`);
    }
    snapshot[table] = data ?? [];
    counts[table] = (data ?? []).length;
  }

  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[:]/g, '-')
    .replace(/\..+/, '')
    .replace('T', '-');
  const fileName = `${stamp}.json`;

  const body = JSON.stringify(
    {
      generatedAt: now.toISOString(),
      tables: snapshot,
      counts,
    },
    null,
    2,
  );

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, body, {
      contentType: 'application/json',
      upsert: false,
    });

  if (uploadErr) {
    throw new Error(`Upload failed: ${uploadErr.message}`);
  }

  // 7-day signed URL so admins can download the export from the UI.
  const { data: signed } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(fileName, 60 * 60 * 24 * 7);

  return {
    path: fileName,
    url: signed?.signedUrl ?? null,
    sizeBytes: Buffer.byteLength(body, 'utf8'),
    tableCounts: counts,
    generatedAt: now.toISOString(),
  };
}

/**
 * List the most recent backup files. Returns up to 50 entries sorted
 * newest-first so the admin UI can show a rolling history.
 */
export async function listBackups(): Promise<BackupListing[]> {
  await ensureBucket();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.storage.from(BUCKET).list('', {
    limit: 50,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) throw new Error(`Could not list backups: ${error.message}`);

  return (data ?? [])
    .filter((f) => f.name.endsWith('.json'))
    .map((f) => ({
      name: f.name,
      sizeBytes: f.metadata?.size ?? 0,
      createdAt: f.created_at ?? '',
    }));
}

export async function getBackupDownloadUrl(name: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(name, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}
