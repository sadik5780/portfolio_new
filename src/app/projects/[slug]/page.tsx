import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import DetailHero from '@/components/ProjectDetail/DetailHero';
import ProjectContent from '@/components/ProjectDetail/ProjectContent';
import ScreenshotsGallery from '@/components/ProjectDetail/ScreenshotsGallery';
import HireCTA from '@/components/ProjectDetail/HireCTA';
import {
  getAllProjectSlugs,
  getProjectBySlug,
} from '@/lib/content/projects';
import { buildMetadata, siteConfig } from '@/lib/seo';

interface PageProps {
  params: { slug: string };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return buildMetadata({
      title: 'Project Not Found',
      path: `/projects/${params.slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${project.title} — Case Study`,
    description: `${project.description} Built by Sadik Studio using ${project.tags
      .slice(0, 4)
      .join(', ')}.`,
    path: `/projects/${project.slug}`,
    keywords: [
      ...project.tags.map((t) => `${t.toLowerCase()} developer`),
      `${project.category.toLowerCase()} developer`,
      'case study',
      'portfolio',
      `hire ${project.category.toLowerCase()} developer`,
    ],
    // Images intentionally omitted — Next.js auto-wires the dynamic
    // opengraph-image.tsx at /opengraph-image as the fallback. Per-project
    // images can be added later via app/projects/[slug]/opengraph-image.tsx.
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.longDescription || project.description,
    author: { '@id': `${siteConfig.url}/#person` },
    publisher: { '@id': `${siteConfig.url}/#organization` },
    datePublished: project.year,
    keywords: project.tags.join(', '),
    image: `${siteConfig.url}/opengraph-image`,
    url: `${siteConfig.url}/projects/${project.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <Navbar />
      <main style={{ paddingTop: '72px' }}>
        <DetailHero project={project} />
        <ProjectContent project={project} />
        <ScreenshotsGallery
          screenshots={project.screenshots}
          title={project.title}
        />
        <HireCTA category={project.category} />
      </main>
      <Footer />
    </>
  );
}
