import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/content/blog';
import { siteConfig } from '@/lib/seo';

export const runtime = 'nodejs';
// Regenerate the feed at most every 10 minutes; admin publishes can still call
// revalidatePath('/rss.xml') for instant updates.
export const revalidate = 600;

/** Escape characters that are illegal inside XML elements or CDATA. */
function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Strip CDATA terminators so untrusted content can't close the block early. */
function safeCdata(input: string): string {
  return input.replace(/]]>/g, ']]]]><![CDATA[>');
}

export async function GET() {
  const posts = await getBlogPosts();
  const base = siteConfig.url;
  const now = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      const categoryList = [post.category, ...post.tags]
        .map((c) => `      <category>${escapeXml(c)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@sadikstudio.in (${escapeXml(post.author)})</author>
      <description><![CDATA[${safeCdata(post.description)}]]></description>
${categoryList}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${base}/blog</link>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>Next.js</generator>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
    },
  });
}
