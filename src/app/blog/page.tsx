import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { getBlogPosts } from '@/lib/content/blog';
import { buildMetadata, siteConfig } from '@/lib/seo';
import styles from './page.module.scss';

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: 'Blog — React, Shopify, and SaaS development insights',
  description:
    'Practical guides on hiring developers, Shopify builds, Next.js, and SaaS pricing — for founders in India, USA, and Australia. Written by Sadik Shaikh.',
  path: '/blog',
  keywords: [
    'react developer blog',
    'shopify developer blog',
    'freelance developer india blog',
    'saas development guide',
    'hire developer guide 2026',
  ],
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogIndexPage() {
  const all = await getBlogPosts();
  const posts = [...all].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  if (posts.length === 0) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <section className={styles.hero}>
            <div className={styles.heroBg} />
            <div className={styles.container}>
              <SectionHeading
                label="Blog"
                title="Articles coming soon"
                description="New articles on hiring developers, Shopify, Next.js, and SaaS are being drafted."
              />
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const [featured, ...rest] = posts;

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.name} Blog`,
    url: `${siteConfig.url}/blog`,
    description: 'Practical guides on hiring developers, Shopify, Next.js, and SaaS.',
    author: {
      '@type': 'Person',
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${siteConfig.url}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      description: p.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Navbar />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.container}>
            <SectionHeading
              label="Blog"
              title="Guides for founders hiring developers in 2026"
              description="Practical, numbers-first writing on hiring, pricing, Shopify, Next.js, and SaaS builds. No fluff, no generic SEO content."
            />
          </div>
        </section>

        {/* Featured post */}
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <Link href={`/blog/${featured.slug}`} className={styles.featured}>
              <div className={styles.featuredMeta}>
                <span className={styles.categoryBadge}>{featured.category}</span>
                <time className={styles.date}>{formatDate(featured.publishedAt)}</time>
                <span className={styles.readTime}>{featured.readTime} min read</span>
              </div>
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              <p className={styles.featuredDesc}>{featured.description}</p>
              <span className={styles.readMore}>
                Read article
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </div>
        </section>

        {/* Rest of posts */}
        <section className={styles.gridSection}>
          <div className={styles.container}>
            <h2 className={styles.gridTitle}>All articles</h2>
            <div className={styles.grid}>
              {rest.map((post) => (
                <article key={post.slug} className={styles.card}>
                  <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                    <div className={styles.cardMeta}>
                      <span className={styles.categoryBadge}>{post.category}</span>
                      <time className={styles.date}>{formatDate(post.publishedAt)}</time>
                    </div>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    <p className={styles.cardDesc}>{post.description}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.readTime}>{post.readTime} min read</span>
                      <div className={styles.tags}>
                        {post.tags.slice(0, 2).map((t) => (
                          <span key={t} className={styles.tag}>
                            #{t.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
