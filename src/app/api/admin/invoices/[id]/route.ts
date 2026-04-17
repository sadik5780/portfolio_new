import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guard';
import { getInvoice, updateInvoice, deleteInvoice, type InvoiceInput } from '@/lib/content/invoices';

export const runtime = 'nodejs';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  const invoice = await getInvoice(params.id);
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ invoice });
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  try {
    const invoice = await updateInvoice(params.id, body as Partial<InvoiceInput>);
    return NextResponse.json({ invoice });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  try {
    await deleteInvoice(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
