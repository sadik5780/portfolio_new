import Link from 'next/link';
import { Fragment } from 'react';
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
            return <p key={i} className={styles.p}>{renderInline(block.text)}</p>;
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
                {block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className={styles.ol}>
                {block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
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
                  <p className={styles.ctaText}>{renderInline(block.text)}</p>
                </div>
                <Link href={block.href} className={styles.ctaBtn}>
                  {block.label}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </aside>
            );
          case 'table':
            return (
              <figure key={i} className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {block.headers.map((h, j) => (
                        <th key={j}>{renderInline(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>{renderInline(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {block.caption && (
                  <figcaption className={styles.tableCaption}>{block.caption}</figcaption>
                )}
              </figure>
            );
          case 'callout': {
            const variant = block.variant ?? 'tip';
            return (
              <aside key={i} className={`${styles.callout} ${styles[`callout_${variant}`]}`}>
                {block.title && <p className={styles.calloutTitle}>{block.title}</p>}
                <p className={styles.calloutText}>{renderInline(block.text)}</p>
              </aside>
            );
          }
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

/**
 * Tiny markdown-link parser for paragraph + list text.
 * Lets blog content authors write `[label](href)` and have it render as a real
 * <Link> to internal routes (or <a> to external URLs). Markdown bold `**x**`
 * also renders as <strong>. Everything else is plain text.
 */
/**
 * Whitelist of href schemes the inline markdown is allowed to render. This
 * blocks the classic stored-XSS vector where a blog author (or anyone with
 * write access to the blog data layer) inserts `[click](javascript:…)` or a
 * `data:text/html,…` payload that would execute when the admin (or any user)
 * clicks it.
 */
function safeHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;
  // Internal — relative paths and in-page anchors are always safe.
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed;
  // Common harmless schemes
  if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
  // Absolute URLs — only allow http(s)
  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch {
    /* invalid URL */
  }
  return null;
}

function renderInline(text: string): React.ReactNode {
  if (!/[\[*`]/.test(text)) return text;

  const tokens: React.ReactNode[] = [];
  // Match (in priority order): link [label](href), bold **text**, code `text`
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      tokens.push(<Fragment key={key++}>{text.slice(lastIndex, m.index)}</Fragment>);
    }
    if (m[1] && m[2]) {
      const label = m[1];
      const safe = safeHref(m[2]);
      if (!safe) {
        // Unsafe scheme — drop the link entirely; render the label as plain text.
        tokens.push(<Fragment key={key++}>{label}</Fragment>);
      } else {
        const isExternal = /^https?:\/\//.test(safe);
        tokens.push(
          isExternal ? (
            <a
              key={key++}
              href={safe}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
            >
              {label}
            </a>
          ) : (
            <Link key={key++} href={safe}>
              {label}
            </Link>
          ),
        );
      }
    } else if (m[3]) {
      tokens.push(<strong key={key++}>{m[3]}</strong>);
    } else if (m[4]) {
      tokens.push(<code key={key++}>{m[4]}</code>);
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }
  return tokens;
}
