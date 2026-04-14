'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Project, ProjectCategory } from '@/lib/content/types';
import ImageUpload from './ImageUpload';
import ImageListUpload from './ImageListUpload';
import styles from './admin-shared.module.scss';

const CATEGORIES: ProjectCategory[] = ['SaaS', 'Shopify', 'Web Apps'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ProjectFormProps {
  mode: 'create' | 'edit';
  project?: Project;
}

interface FormState {
  slug: string;
  slugDirty: boolean;
  title: string;
  category: ProjectCategory;
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  image: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  year: string;
  client: string;
  sortOrder: number;
  tags: string[];
  features: string[];
  screenshots: string[];
}

function initialState(project?: Project): FormState {
  return {
    slug: project?.slug ?? '',
    slugDirty: Boolean(project?.slug),
    title: project?.title ?? '',
    category: project?.category ?? 'SaaS',
    description: project?.description ?? '',
    longDescription: project?.longDescription ?? '',
    problem: project?.problem ?? '',
    solution: project?.solution ?? '',
    image: project?.image ?? '',
    liveUrl: project?.liveUrl ?? '',
    githubUrl: project?.githubUrl ?? '',
    featured: project?.featured ?? false,
    year: project?.year ?? new Date().getFullYear().toString(),
    client: project?.client ?? '',
    sortOrder: project?.sortOrder ?? 0,
    tags: project?.tags ?? [],
    features: project?.features ?? [],
    screenshots: project?.screenshots ?? [],
  };
}

export default function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(() => initialState(project));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const handleTitleChange = (title: string) => {
    setState((s) => ({
      ...s,
      title,
      slug: s.slugDirty ? s.slug : slugify(title),
    }));
  };

  const handleSlugChange = (slug: string) =>
    setState((s) => ({ ...s, slug, slugDirty: true }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        slug: state.slug.trim() || slugify(state.title),
        title: state.title.trim(),
        category: state.category,
        description: state.description.trim(),
        longDescription: state.longDescription.trim(),
        problem: state.problem.trim(),
        solution: state.solution.trim(),
        image: state.image.trim(),
        liveUrl: state.liveUrl.trim() || undefined,
        githubUrl: state.githubUrl.trim() || undefined,
        featured: state.featured,
        year: state.year.trim(),
        client: state.client.trim(),
        sortOrder: Number.isFinite(state.sortOrder) ? state.sortOrder : 0,
        tags: state.tags.map((t) => t.trim()).filter(Boolean),
        features: state.features.map((f) => f.trim()).filter(Boolean),
        screenshots: state.screenshots.map((s) => s.trim()).filter(Boolean),
      };

      const url =
        mode === 'create'
          ? '/api/admin/projects'
          : `/api/admin/projects/${project!.id}`;
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

      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Basic info ───────────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Basic information</h3>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Title *</label>
            <input
              className={styles.input}
              value={state.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Aurora SaaS Platform"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Slug <span className={styles.hint}>(auto from title)</span>
            </label>
            <input
              className={styles.input}
              value={state.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="aurora-saas"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Category *</label>
            <select
              className={styles.select}
              value={state.category}
              onChange={(e) => update('category', e.target.value as ProjectCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Year</label>
            <input
              className={styles.input}
              value={state.year}
              onChange={(e) => update('year', e.target.value)}
              placeholder="2024"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Client</label>
            <input
              className={styles.input}
              value={state.client}
              onChange={(e) => update('client', e.target.value)}
              placeholder="Aurora Labs Inc."
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Sort order <span className={styles.hint}>(lower = first)</span>
            </label>
            <input
              type="number"
              className={styles.input}
              value={state.sortOrder}
              onChange={(e) => update('sortOrder', Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={state.featured}
              onChange={(e) => update('featured', e.target.checked)}
            />
            Feature on homepage
          </label>
        </div>
      </div>

      {/* ── Descriptions ─────────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Content</h3>

        <div className={styles.field}>
          <label className={styles.label}>
            Short description * <span className={styles.hint}>(used on cards)</span>
          </label>
          <textarea
            className={styles.textarea}
            value={state.description}
            onChange={(e) => update('description', e.target.value)}
            required
            rows={2}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Long description <span className={styles.hint}>(case-study hero)</span>
          </label>
          <textarea
            className={styles.textarea}
            value={state.longDescription}
            onChange={(e) => update('longDescription', e.target.value)}
            rows={4}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Problem</label>
          <textarea
            className={styles.textarea}
            value={state.problem}
            onChange={(e) => update('problem', e.target.value)}
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Solution</label>
          <textarea
            className={styles.textarea}
            value={state.solution}
            onChange={(e) => update('solution', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* ── Lists: tags, features, screenshots ───── */}
      <ListField
        label="Tech stack (tags)"
        hint="Displayed as chips on the card."
        items={state.tags}
        onChange={(v) => update('tags', v)}
        placeholder="e.g. Next.js"
      />

      <ListField
        label="Features"
        hint="Bullet points on the case-study page."
        items={state.features}
        onChange={(v) => update('features', v)}
        placeholder="e.g. Multi-tenant architecture"
      />

      <div className={styles.section}>
        <div>
          <h3 className={styles.sectionTitle}>Screenshots</h3>
          <div className={styles.sectionDesc}>
            Displayed in the case-study gallery. Drag to reorder is not supported; use
            the arrow buttons on each thumbnail.
          </div>
        </div>
        <ImageListUpload
          values={state.screenshots}
          onChange={(v) => update('screenshots', v)}
        />
      </div>

      {/* ── Media + links ────────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Media &amp; links</h3>

        <ImageUpload
          label="Cover image"
          hint="Shown on the project card and case-study page. Recommended 1600×1000 or similar 16:10 ratio."
          value={state.image}
          onChange={(v) => update('image', v)}
          aspectRatio="16 / 10"
        />

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Live URL</label>
            <input
              type="url"
              className={styles.input}
              value={state.liveUrl}
              onChange={(e) => update('liveUrl', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>GitHub URL</label>
            <input
              type="url"
              className={styles.input}
              value={state.githubUrl}
              onChange={(e) => update('githubUrl', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      </div>

      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>
      )}

      {/* ── Save bar ─────────────────────────────── */}
      <div className={styles.saveBar}>
        <Link href="/admin/projects" className={styles.btn}>
          Cancel
        </Link>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={submitting}
        >
          {submitting
            ? 'Saving…'
            : mode === 'create'
              ? 'Create project'
              : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

/** Inline-editable string list (tags / features / screenshots). */
function ListField({
  label,
  hint,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const updateAt = (i: number, value: string) => {
    const next = [...items];
    next[i] = value;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, '']);

  return (
    <div className={styles.section}>
      <div>
        <h3 className={styles.sectionTitle}>{label}</h3>
        {hint && <div className={styles.sectionDesc}>{hint}</div>}
      </div>

      <div className={styles.arrayField}>
        {items.map((item, i) => (
          <div className={styles.arrayItem} key={i}>
            <div className={styles.arrayItemBody}>
              <input
                className={styles.input}
                value={item}
                onChange={(e) => updateAt(i, e.target.value)}
                placeholder={placeholder}
              />
            </div>
            <button
              type="button"
              className={styles.arrayRemove}
              onClick={() => remove(i)}
              aria-label="Remove"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
        <button type="button" className={styles.arrayAdd} onClick={add}>
          + Add item
        </button>
      </div>
    </div>
  );
}
