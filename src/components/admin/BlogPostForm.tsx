'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AdminBlogPost } from '@/lib/content/admin-blog';
import type { BlogPost } from '@/data/blog-posts';
import { markdownToBlocks, blocksToMarkdown } from '@/lib/markdown-blocks';
import ImageUpload from './ImageUpload';
import styles from './admin-shared.module.scss';
import editorStyles from './BlogPostForm.module.scss';

const CATEGORIES: BlogPost['category'][] = [
  'Pricing',
  'Hiring',
  'Engineering',
  'E-commerce',
  'SaaS',
  'AI',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toDateInputValue(iso: string): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return iso.slice(0, 10);
}

interface FormState {
  slug: string;
  slugDirty: boolean;
  title: string;
  description: string;
  category: BlogPost['category'];
  author: string;
  readTime: number;
  keywords: string;
  tags: string;
  markdown: string;
  image: string;
  published: boolean;
  publishedAt: string;
}

function initial(post?: AdminBlogPost): FormState {
  if (!post) {
    return {
      slug: '',
      slugDirty: false,
      title: '',
      description: '',
      category: 'Engineering',
      author: 'Sadik Shaikh',
      readTime: 5,
      keywords: '',
      tags: '',
      markdown: '',
      image: '',
      published: true,
      publishedAt: toDateInputValue(''),
    };
  }
  return {
    slug: post.slug,
    slugDirty: true,
    title: post.title,
    description: post.description,
    category: post.category,
    author: post.author,
    readTime: post.readTime,
    keywords: post.keywords.join(', '),
    tags: post.tags.join(', '),
    markdown: post.content.length ? blocksToMarkdown(post.content) : '',
    image: '',
    published: post.published,
    publishedAt: toDateInputValue(post.publishedAt),
  };
}

interface ToolbarAction {
  label: string;
  icon: string;
  prefix: string;
  suffix?: string;
  block?: boolean;
}

const TOOLBAR: ToolbarAction[] = [
  { label: 'H2', icon: 'H2', prefix: '## ', block: true },
  { label: 'H3', icon: 'H3', prefix: '### ', block: true },
  { label: 'Bold', icon: 'B', prefix: '**', suffix: '**' },
  { label: 'Italic', icon: 'I', prefix: '*', suffix: '*' },
  { label: 'Bullet list', icon: '•', prefix: '- ', block: true },
  { label: 'Numbered list', icon: '1.', prefix: '1. ', block: true },
  { label: 'Quote', icon: '"', prefix: '> ', block: true },
  { label: 'Link', icon: '🔗', prefix: '[', suffix: '](url)' },
  { label: 'Divider', icon: '—', prefix: '\n---\n', block: true },
];

interface BlogPostFormProps {
  mode: 'create' | 'edit';
  post?: AdminBlogPost;
}

export default function BlogPostForm({ mode, post }: BlogPostFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState<FormState>(() => initial(post));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const handleTitleChange = (title: string) =>
    setState((s) => ({
      ...s,
      title,
      slug: s.slugDirty ? s.slug : slugify(title),
    }));

  const insertAtCursor = useCallback((action: ToolbarAction) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    const selected = text.slice(start, end);

    let insert: string;
    if (action.block) {
      const needsNewline = start > 0 && text[start - 1] !== '\n' ? '\n' : '';
      insert = `${needsNewline}${action.prefix}${selected}`;
    } else {
      insert = `${action.prefix}${selected || action.label}${action.suffix ?? ''}`;
    }

    const newText = text.slice(0, start) + insert + text.slice(end);
    update('markdown', newText);

    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + insert.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const content = markdownToBlocks(state.markdown);

      const payload = {
        slug: state.slug.trim() || slugify(state.title),
        title: state.title.trim(),
        description: state.description.trim(),
        category: state.category,
        author: state.author.trim() || 'Sadik Shaikh',
        readTime: Number.isFinite(state.readTime) ? Math.max(1, state.readTime) : 5,
        keywords: state.keywords.split(',').map((s) => s.trim()).filter(Boolean),
        tags: state.tags.split(',').map((s) => s.trim()).filter(Boolean),
        content,
        image: state.image.trim() || undefined,
        published: state.published,
        publishedAt: state.publishedAt
          ? new Date(`${state.publishedAt}T00:00:00Z`).toISOString()
          : undefined,
      };

      const url =
        mode === 'create' ? '/api/admin/blog' : `/api/admin/blog/${post!.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Save failed');
      }
      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Metadata ───────────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Post metadata</h3>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Title *</label>
            <input
              className={styles.input}
              value={state.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Slug <span className={styles.hint}>(URL segment)</span>
            </label>
            <input
              className={styles.input}
              value={state.slug}
              onChange={(e) =>
                setState((s) => ({ ...s, slug: e.target.value, slugDirty: true }))
              }
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Description * <span className={styles.hint}>(meta description, 150-160 chars)</span>
          </label>
          <textarea
            className={styles.textarea}
            value={state.description}
            onChange={(e) => update('description', e.target.value)}
            rows={2}
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Category *</label>
            <select
              className={styles.select}
              value={state.category}
              onChange={(e) => update('category', e.target.value as BlogPost['category'])}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Published date</label>
            <input
              type="date"
              className={styles.input}
              value={state.publishedAt}
              onChange={(e) => update('publishedAt', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Read time (minutes)</label>
            <input
              type="number"
              className={styles.input}
              value={state.readTime}
              min={1}
              onChange={(e) => update('readTime', Number(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Author</label>
            <input
              className={styles.input}
              value={state.author}
              onChange={(e) => update('author', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>
              Keywords <span className={styles.hint}>(comma-separated)</span>
            </label>
            <input
              className={styles.input}
              value={state.keywords}
              onChange={(e) => update('keywords', e.target.value)}
              placeholder="hire react developer india, freelance developer 2026"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Tags <span className={styles.hint}>(comma-separated)</span>
            </label>
            <input
              className={styles.input}
              value={state.tags}
              onChange={(e) => update('tags', e.target.value)}
              placeholder="React, Hiring, 2026"
            />
          </div>
        </div>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={state.published}
            onChange={(e) => update('published', e.target.checked)}
          />
          Published (visible on public /blog)
        </label>
      </div>

      {/* ── Cover image ────────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Cover image</h3>
        <ImageUpload
          label=""
          hint="Optional. Used in OG/Twitter preview and blog list thumbnails."
          value={state.image}
          onChange={(v) => update('image', v)}
        />
      </div>

      {/* ── Markdown editor ────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Content</h3>
        <div className={styles.sectionDesc}>
          Write in markdown. Use the toolbar or type directly — ## for H2, ### for H3, - for bullets, {'>'} for quotes.
        </div>

        <div className={editorStyles.editor}>
          <div className={editorStyles.toolbar}>
            {TOOLBAR.map((action) => (
              <button
                key={action.label}
                type="button"
                className={editorStyles.toolbarBtn}
                onClick={() => insertAtCursor(action)}
                title={action.label}
              >
                {action.icon}
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className={editorStyles.textarea}
            value={state.markdown}
            onChange={(e) => update('markdown', e.target.value)}
            placeholder={`## Your heading\n\nStart writing your blog post here...\n\n- Bullet point one\n- Bullet point two\n\n> A quote from someone`}
            rows={24}
            spellCheck
          />
          <div className={editorStyles.statusBar}>
            <span>{state.markdown.split(/\s+/).filter(Boolean).length} words</span>
            <span>{markdownToBlocks(state.markdown).length} blocks</span>
          </div>
        </div>
      </div>

      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>
      )}

      <div className={styles.saveBar}>
        <Link href="/admin/blog" className={styles.btn}>Cancel</Link>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={submitting}
        >
          {submitting
            ? 'Saving…'
            : mode === 'create'
              ? 'Create post'
              : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
