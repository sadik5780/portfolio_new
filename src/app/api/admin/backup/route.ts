import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guard';
import { listBackups, runBackup } from '@/lib/content/backup';
import { isAllowedOrigin } from '@/lib/security/origin';

export const runtime = 'nodejs';

export async function GET() {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const backups = await listBackups();
    return NextResponse.json({ backups });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to list backups' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const result = await runBackup();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Backup failed' },
      { status: 500 },
    );
  }
}
