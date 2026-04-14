import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import {
  deleteProject,
  getAdminProject,
  updateProject,
} from '@/lib/content/admin-projects';
import type { ProjectCategory } from '@/lib/content/types';
import { validateProjectBody } from '@/lib/content/project-validation';

export const runtime = 'nodejs';

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const project = await getAdminProject(params.id);
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  const validated = validateProjectBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 422 });
  }

  try {
    const project = await updateProject(params.id, {
      slug: validated.data.slug,
      title: validated.data.title,
      category: validated.data.category as ProjectCategory,
      description: validated.data.description,
      longDescription: validated.data.longDescription,
      problem: validated.data.problem,
      solution: validated.data.solution,
      features: validated.data.features,
      screenshots: validated.data.screenshots,
      tags: validated.data.tags,
      image: validated.data.image,
      liveUrl: validated.data.liveUrl,
      githubUrl: validated.data.githubUrl,
      featured: validated.data.featured,
      year: validated.data.year,
      client: validated.data.client,
      sortOrder: validated.data.sortOrder,
    });

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath(`/projects/${project.slug}`);

    return NextResponse.json({ project });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update' },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    // Capture slug first so we can revalidate its public page
    const project = await getAdminProject(params.id);
    await deleteProject(params.id);

    revalidatePath('/');
    revalidatePath('/projects');
    if (project) revalidatePath(`/projects/${project.slug}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete' },
      { status: 500 },
    );
  }
}
