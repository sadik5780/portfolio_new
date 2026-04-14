'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AdminBlogPost } from '@/lib/content/admin-blog';
import type { BlogBlock, BlogPost } from '@/data/blog-posts';
import ImageUpload from './ImageUpload';
import styles from './admin-shared.module.scss';
import blockStyles from './BlogPostForm.module.scss';

const CATEGORIES: BlogPost['category'][] = [
  'Pricing',
  'Hiring',
  'Engineering',
  'E-commerce',
  'SaaS',
];

const BLOCK_TYPES: { value: BlogBlock['type']; label: string }[] = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h2', label: 'Heading (H2)' },
  { value: 'h3', label: 'Sub-heading (H3)' },
  { value: 'ul', label: 'Bulleted list' },
  { value: 'ol', label: 'Numbered list' },
  { value: 'quote', label: 'Quote' },
  { value: 'cta', label: 'Call-to-action' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function newBlock(type: BlogBlock['type']): BlogBlock {
  switch (type) {
    case 'p': return { type: 'p', text: '' };
    case 'h2': return { type: 'h2', text: '' };
    case 'h3': return { type: 'h3', text: '' };
    case 'ul': return { type: 'ul', items: [''] };
    case 'ol': return { type: 'ol', items: [''] };
    case 'quote': return { type: 'quote', text: '' };
    case 'cta': return { type: 'cta', title: '', text: '', href: '/contact', label: 'Start a project' };
  }
}

interface BlogPostFormProps {
  mode: 'create' | 'edit';
  post?: AdminBlogPost;
}

interface FormState {
  slug: string;
  slugDirty: boolean;
  title: string;
  description: string;
  category: BlogPost['category'];
  author: string;
  readTime: number;
  keywords: string;  // comma-separated in UI
  tags: string;      // comma-separated in UI
  content: BlogBlock[];
  image: string;
  published: boolean;
  publishedAt: string;  // YYYY-MM-DD
}

function toDateInputValue(iso: string): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return iso.slice(0, 10);
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
      content: [{ type: 'p', text: '' }],
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
    content: post.content.length ? post.content : [{ type: 'p', text: '' }],
    image: '',
    published: post.published,
    publishedAt: toDateInputValue(post.publishedAt),
  };
}

export default function BlogPostForm({ mode, post }: BlogPostFormProps) {
  const router = useRouter();
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

  const updateBlock = (i: number, patch: Partial<BlogBlock>) => {
    setState((s) => {
      const next = [...s.content];
      next[i] = { ...next[i], ...patch } as BlogBlock;
      return { ...s, content: next };
    });
  };

  const moveBlock = (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= state.content.length) return;
    setState((s) => {
      const next = [...s.content];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...s, content: next };
    });
  };

  const removeBlock = (i: number) =>
    setState((s) => ({
      ...s,
      content: s.content.filter((_, idx) => idx !== i),
    }));

  const addBlock = (type: BlogBlock['type']) =>
    setState((s) => ({ ...s, content: [...s.content, newBlock(type)] }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        slug: state.slug.trim() || slugify(state.title),
        title: state.title.trim(),
        description: state.description.trim(),
        category: state.category,
        author: state.author.trim() || 'Sadik Shaikh',
        readTime: Number.isFinite(state.readTime) ? Math.max(1, state.readTime) : 5,
        keywords: state.keywords.split(',').map((s) => s.trim()).filter(Boolean),
        tags: state.tags.split(',').map((s) => s.trim()).filter(Boolean),
        content: state.content,
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

      {/* ── Block editor ──────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Content</h3>
        <div className={styles.sectionDesc}>
          Build the post by adding blocks. Each block renders as its own element
          on the public page (paragraph, heading, list, quote, or CTA).
        </div>

        <div className={blockStyles.blocks}>
          {state.content.map((block, i) => (
            <BlockEditor
              key={i}
              index={i}
              block={block}
              totalBlocks={state.content.length}
              onUpdate={(patch) => updateBlock(i, patch)}
              onRemove={() => removeBlock(i)}
              onMove={(delta) => moveBlock(i, delta)}
            />
          ))}
        </div>

        <AddBlockMenu onAdd={addBlock} />
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

// ─────────────────────────────────────────────────
// Single block editor — renders fields per block type
// ─────────────────────────────────────────────────
function BlockEditor({
  block,
  index,
  totalBlocks,
  onUpdate,
  onRemove,
  onMove,
}: {
  block: BlogBlock;
  index: number;
  totalBlocks: number;
  onUpdate: (patch: Partial<BlogBlock>) => void;
  onRemove: () => void;
  onMove: (delta: number) => void;
}) {
  const typeLabel = BLOCK_TYPES.find((t) => t.value === block.type)?.label ?? block.type;

  return (
    <div className={blockStyles.block}>
      <div className={blockStyles.blockHeader}>
        <span className={blockStyles.blockType}>
          <span className={blockStyles.blockIndex}>{index + 1}</span>
          {typeLabel}
        </span>
        <div className={blockStyles.blockActions}>
          <button
            type="button"
            className={blockStyles.blockBtn}
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Move up"
            title="Move up"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
          <button
            type="button"
            className={blockStyles.blockBtn}
            onClick={() => onMove(1)}
            disabled={index === totalBlocks - 1}
            aria-label="Move down"
            title="Move down"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button
            type="button"
            className={`${blockStyles.blockBtn} ${blockStyles.blockBtnDanger}`}
            onClick={onRemove}
            aria-label="Remove block"
            title="Remove block"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className={blockStyles.blockBody}>
        <BlockFields block={block} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

function BlockFields({
  block,
  onUpdate,
}: {
  block: BlogBlock;
  onUpdate: (patch: Partial<BlogBlock>) => void;
}) {
  switch (block.type) {
    case 'p':
      return (
        <textarea
          className={styles.textarea}
          value={block.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={3}
          placeholder="Paragraph text…"
        />
      );
    case 'h2':
    case 'h3':
      return (
        <input
          className={styles.input}
          value={block.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder={block.type === 'h2' ? 'Heading text' : 'Sub-heading text'}
        />
      );
    case 'ul':
    case 'ol': {
      const updateItem = (i: number, v: string) => {
        const items = [...block.items];
        items[i] = v;
        onUpdate({ items });
      };
      const removeItem = (i: number) =>
        onUpdate({ items: block.items.filter((_, idx) => idx !== i) });
      const addItem = () => onUpdate({ items: [...block.items, ''] });
      return (
        <div className={blockStyles.listEditor}>
          {block.items.map((item, i) => (
            <div key={i} className={blockStyles.listItem}>
              <span className={blockStyles.listBullet}>
                {block.type === 'ol' ? `${i + 1}.` : '•'}
              </span>
              <input
                className={styles.input}
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                placeholder={`List item ${i + 1}`}
              />
              <button
                type="button"
                className={blockStyles.listRemove}
                onClick={() => removeItem(i)}
                aria-label="Remove item"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            className={blockStyles.listAdd}
            onClick={addItem}
          >
            + Add item
          </button>
        </div>
      );
    }
    case 'quote':
      return (
        <>
          <textarea
            className={styles.textarea}
            value={block.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={2}
            placeholder="Quote text…"
          />
          <input
            className={styles.input}
            value={block.cite ?? ''}
            onChange={(e) => onUpdate({ cite: e.target.value || undefined })}
            placeholder="Attribution (optional)"
            style={{ marginTop: '8px' }}
          />
        </>
      );
    case 'cta':
      return (
        <div className={blockStyles.ctaEditor}>
          <input
            className={styles.input}
            value={block.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="CTA title"
          />
          <input
            className={styles.input}
            value={block.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="CTA description text"
          />
          <div className={styles.formRow}>
            <input
              className={styles.input}
              value={block.href}
              onChange={(e) => onUpdate({ href: e.target.value })}
              placeholder="/contact or https://..."
            />
            <input
              className={styles.input}
              value={block.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Button label"
            />
          </div>
        </div>
      );
  }
}

// ─────────────────────────────────────────────────
// + Add block menu
// ─────────────────────────────────────────────────
function AddBlockMenu({ onAdd }: { onAdd: (t: BlogBlock['type']) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={blockStyles.addWrap}>
      <button
        type="button"
        className={blockStyles.addBtn}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add block
      </button>

      {open && (
        <div className={blockStyles.addMenu} role="menu">
          {BLOCK_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={blockStyles.addMenuItem}
              role="menuitem"
              onClick={() => {
                onAdd(t.value);
                setOpen(false);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
