import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import {
  deleteOffering,
  getAdminOffering,
  updateOffering,
} from '@/lib/content/admin-offerings';
import { validateOfferingBody } from '@/lib/content/offering-validation';
import { isAllowedOrigin } from '@/lib/security/origin';

export const runtime = 'nodejs';

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const offering = await getAdminOffering(params.id);
    if (!offering) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ offering });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to load offering' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  const validated = validateOfferingBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 422 });
  }

  try {
    const offering = await updateOffering(params.id, validated.data);
    revalidatePath('/services');
    revalidatePath('/quote');
    revalidatePath('/pricing');
    return NextResponse.json({ offering });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update offering' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    await deleteOffering(params.id);
    revalidatePath('/services');
    revalidatePath('/quote');
    revalidatePath('/pricing');
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete offering' },
      { status: 500 },
    );
  }
}
