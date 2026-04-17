import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guard';
import { getClient, updateClient, deleteClient, type ClientInput } from '@/lib/content/clients';

export const runtime = 'nodejs';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  const client = await getClient(params.id);
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ client });
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  try {
    const client = await updateClient(params.id, body as Partial<ClientInput>);
    return NextResponse.json({ client });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  try {
    await deleteClient(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
