import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guard';
import { listClients, createClient, type ClientInput } from '@/lib/content/clients';

export const runtime = 'nodejs';

export async function GET() {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  try {
    const clients = await listClients();
    return NextResponse.json({ clients });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  const body = await request.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: 'Client name required' }, { status: 422 });
  try {
    const client = await createClient(body as ClientInput);
    return NextResponse.json({ client });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
