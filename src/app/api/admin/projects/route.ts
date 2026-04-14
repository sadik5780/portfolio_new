import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import { createProject, listAdminProjects } from '@/lib/content/admin-projects';
import { validateProjectBody } from '@/lib/content/project-validation';
import type { ProjectCategory } from '@/lib/content/types';

export const runtime = 'nodejs';

export async function GET() {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const projects = await listAdminProjects();
    return NextResponse.json({ projects });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to list projects' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  const validated = validateProjectBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 422 });
  }

  try {
    const project = await createProject({
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
      { error: err instanceof Error ? err.message : 'Failed to create project' },
      { status: 500 },
    );
  }
}
