import Link from 'next/link';
import type { BlogBlock } from '@/data/blog-posts';
import styles from './BlogContent.module.scss';

interface BlogContentProps {
  blocks: BlogBlock[];
}

/**
 * Renders a blog post's content blocks. Server component — no JS shipped.
 */
export default function BlogContent({ blocks }: BlogContentProps) {
  return (
    <div className={styles.body}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return <p key={i} className={styles.p}>{block.text}</p>;
          case 'h2':
            return (
              <h2 key={i} className={styles.h2} id={block.id ?? slugifyHeading(block.text)}>
                {block.text}
              </h2>
            );
          case 'h3':
            return <h3 key={i} className={styles.h3}>{block.text}</h3>;
          case 'ul':
            return (
              <ul key={i} className={styles.ul}>
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className={styles.ol}>
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ol>
            );
          case 'quote':
            return (
              <blockquote key={i} className={styles.quote}>
                {block.text}
                {block.cite && <cite>— {block.cite}</cite>}
              </blockquote>
            );
          case 'cta':
            return (
              <aside key={i} className={styles.cta}>
                <div>
                  <h3 className={styles.ctaTitle}>{block.title}</h3>
                  <p className={styles.ctaText}>{block.text}</p>
                </div>
                <Link href={block.href} className={styles.ctaBtn}>
                  {block.label}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function slugifyHeading(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
