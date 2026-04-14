import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import BlogContent from '@/components/BlogPost/BlogContent';
import {
  getBlogPost,
  getAllBlogSlugs,
  getRelatedPosts,
} from '@/lib/content/blog';
import { buildMetadata, siteConfig } from '@/lib/seo';
import styles from './page.module.scss';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) {
    return buildMetadata({
      title: 'Not found',
      path: `/blog/${params.slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug, 3);

  // ── JSON-LD: BlogPosting + Breadcrumb ─────────
  const postJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
    keywords: post.keywords.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.slug}`,
    },
    url: `${siteConfig.url}/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${siteConfig.url}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />
      <main className={styles.page}>
        <article className={styles.article}>
          <div className={styles.articleHead}>
            <div className={styles.container}>
              <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href="/blog">Blog</Link>
                <span>/</span>
                <span className={styles.breadcrumbActive}>{post.category}</span>
              </nav>

              <div className={styles.meta}>
                <span className={styles.categoryBadge}>{post.category}</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span className={styles.dot}>·</span>
                <span>{post.readTime} min read</span>
              </div>

              <h1 className={styles.title}>{post.title}</h1>
              <p className={styles.description}>{post.description}</p>

              <div className={styles.author}>
                <div className={styles.authorAvatar}>{post.author.charAt(0)}</div>
                <div className={styles.authorMeta}>
                  <span className={styles.authorName}>{post.author}</span>
                  <span className={styles.authorRole}>Senior full-stack developer</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.container}>
            <BlogContent blocks={post.content} />

            <footer className={styles.articleFooter}>
              <div className={styles.tagList}>
                {post.tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    #{t}
                  </span>
                ))}
              </div>

              <div className={styles.shareCta}>
                <Link href="/contact" className={styles.btnPrimary}>
                  Start a project
                </Link>
                <Link href="/services" className={styles.btnSecondary}>
                  See services
                </Link>
              </div>
            </footer>
          </div>
        </article>

        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.container}>
              <h2 className={styles.relatedTitle}>Related articles</h2>
              <div className={styles.relatedGrid}>
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className={styles.relatedCard}
                  >
                    <span className={styles.categoryBadge}>{r.category}</span>
                    <h3 className={styles.relatedCardTitle}>{r.title}</h3>
                    <p className={styles.relatedCardDesc}>{r.description}</p>
                    <span className={styles.relatedReadMore}>
                      Read →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
