import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';
import { getAllProjectSlugs } from '@/lib/content/projects';
<<<<<<< HEAD
import { services } from '@/data/services';
import { locations } from '@/data/locations';
import { getBlogPosts } from '@/lib/content/blog';
=======
>>>>>>> fc616681f6243c7bc016172f2407bc8c1b30af36

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

<<<<<<< HEAD
  // ── Static routes ────────────────────────────────
=======
>>>>>>> fc616681f6243c7bc016172f2407bc8c1b30af36
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
<<<<<<< HEAD
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // ── Project case-study URLs ──────────────────────
=======
  ];

>>>>>>> fc616681f6243c7bc016172f2407bc8c1b30af36
  const slugs = await getAllProjectSlugs();
  const projectRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

<<<<<<< HEAD
  // ── Programmatic service × location URLs ────────
  const serviceRoutes: MetadataRoute.Sitemap = services.flatMap((s) =>
    locations.map((l) => ({
      url: `${base}/services/${s.slug}/${l.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  );

  // ── Blog posts ──────────────────────────────────
  const posts = await getBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...serviceRoutes,
    ...blogRoutes,
  ];
=======
  return [...staticRoutes, ...projectRoutes];
>>>>>>> fc616681f6243c7bc016172f2407bc8c1b30af36
}
