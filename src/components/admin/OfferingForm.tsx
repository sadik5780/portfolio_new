'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminOffering } from '@/lib/content/admin-offerings';
import styles from './admin-shared.module.scss';

interface OfferingFormProps {
  mode: 'create' | 'edit';
  offering?: AdminOffering;
}

type Category = AdminOffering['category'];
type PricingKey = AdminOffering['pricingKey'];

interface FormState {
  slug: string;
  category: Category;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  audience: string;        // stored as newline-separated strings in the textarea
  features: string;
  techStack: string;
  seoKeywords: string;
  timeline: string;
  startingInr: number;
  startingUsd: number;
  pricingKey: PricingKey;
  icon: string;
  sortOrder: number;
}

const CATEGORIES: Array<{ value: Category; label: string }> = [
  { value: 'website', label: 'Website' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'webapp', label: 'Web App' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'other', label: 'Other' },
];

const PRICING_KEYS: Array<{ value: PricingKey; label: string; hint: string }> = [
  { value: 'static_tiers', label: 'Static tiers', hint: 'Pick one of the Static website tiers from /admin/pricing' },
  { value: 'shopify', label: 'Shopify (fixed)', hint: 'Uses the single Shopify base price' },
  { value: 'app', label: 'App builder (base + features)', hint: 'Web app: base price + per-feature add-ons' },
  { value: 'mobile', label: 'Mobile builder (base + features)', hint: 'Mobile: base price + per-feature add-ons' },
];

function joinList(list: string[] | undefined): string {
  return (list ?? []).join('\n');
}

function splitList(raw: string): string[] {
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export default function OfferingForm({ mode, offering }: OfferingFormProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    slug: offering?.slug ?? '',
    category: offering?.category ?? 'webapp',
    name: offering?.name ?? '',
    tagline: offering?.tagline ?? '',
    description: offering?.description ?? '',
    longDescription: offering?.longDescription ?? '',
    audience: joinList(offering?.audience),
    features: joinList(offering?.features),
    techStack: joinList(offering?.techStack),
    seoKeywords: joinList(offering?.seoKeywords),
    timeline: offering?.timeline ?? '',
    startingInr: offering?.startingInr ?? 0,
    startingUsd: offering?.startingUsd ?? 0,
    pricingKey: offering?.pricingKey ?? 'app',
    icon: offering?.icon ?? '',
    sortOrder: offering?.sortOrder ?? 0,
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // On create: auto-slugify from name as the user types, unless they've
  // manually edited the slug.
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const onNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const payload = {
      slug: form.slug.trim(),
      category: form.category,
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      audience: splitList(form.audience),
      features: splitList(form.features),
      techStack: splitList(form.techStack),
      seoKeywords: splitList(form.seoKeywords),
      timeline: form.timeline.trim(),
      startingInr: Number(form.startingInr) || 0,
      startingUsd: Number(form.startingUsd) || 0,
      pricingKey: form.pricingKey,
      icon: form.icon.trim(),
      sortOrder: Number(form.sortOrder) || 0,
    };

    const url =
      mode === 'create'
        ? '/api/admin/offerings'
        : `/api/admin/offerings/${offering?.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? 'Save failed');

      router.push('/admin/offerings');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setBusy(false);
    }
  };

  const currentPricingHint = PRICING_KEYS.find((p) => p.value === form.pricingKey)?.hint;

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

      {/* ── Basics ───────────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Basics</h3>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Name *</label>
            <input
              className={styles.input}
              type="text"
              required
              value={form.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="AI Chatbot Development"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Slug *</label>
            <input
              className={styles.input}
              type="text"
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update('slug', slugify(e.target.value));
              }}
              placeholder="ai-chatbot-development"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Category *</label>
            <select
              className={styles.input}
              value={form.category}
              onChange={(e) => update('category', e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Timeline</label>
            <input
              className={styles.input}
              type="text"
              value={form.timeline}
              onChange={(e) => update('timeline', e.target.value)}
              placeholder="2–4 weeks"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Tagline</label>
          <input
            className={styles.input}
            type="text"
            value={form.tagline}
            onChange={(e) => update('tagline', e.target.value)}
            placeholder="One-line pitch shown on the card"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description *</label>
          <textarea
            className={styles.input}
            required
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="2–3 sentence pitch with the primary keyword in the first sentence."
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Long description</label>
          <textarea
            className={styles.input}
            rows={4}
            value={form.longDescription}
            onChange={(e) => update('longDescription', e.target.value)}
            placeholder="Longer paragraph shown on detail pages."
          />
        </div>
      </div>

      {/* ── Pricing + display ─────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Pricing & display</h3>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Pricing key *</label>
            <select
              className={styles.input}
              value={form.pricingKey}
              onChange={(e) => update('pricingKey', e.target.value as PricingKey)}
            >
              {PRICING_KEYS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {currentPricingHint && (
              <p className={styles.helpText}>{currentPricingHint}</p>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Sort order</label>
            <input
              className={styles.input}
              type="number"
              value={form.sortOrder}
              onChange={(e) => update('sortOrder', Number(e.target.value))}
              placeholder="0"
            />
            <p className={styles.helpText}>Lower shows first.</p>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Starting price (USD)</label>
            <input
              className={styles.input}
              type="number"
              value={form.startingUsd}
              onChange={(e) => update('startingUsd', Number(e.target.value))}
            />
            <p className={styles.helpText}>
              Display only (the real quote is computed from the Pricing settings).
            </p>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Starting price (INR)</label>
            <input
              className={styles.input}
              type="number"
              value={form.startingInr}
              onChange={(e) => update('startingInr', Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Icon (SVG path d-attribute)</label>
          <input
            className={styles.input}
            type="text"
            value={form.icon}
            onChange={(e) => update('icon', e.target.value)}
            placeholder="M12 2a10 10 0 100 20..."
          />
          <p className={styles.helpText}>
            Paste just the <code>d=&quot;...&quot;</code> value from a 24×24 Lucide icon.
          </p>
        </div>
      </div>

      {/* ── Content lists ─────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Content</h3>
        <p className={styles.sectionDesc}>
          One item per line in each list below.
        </p>

        <div className={styles.field}>
          <label className={styles.label}>Audience (who it&apos;s for)</label>
          <textarea
            className={styles.input}
            rows={4}
            value={form.audience}
            onChange={(e) => update('audience', e.target.value)}
            placeholder={`SaaS founders launching a marketing site\nAgencies needing a fast brand refresh`}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Features (what&apos;s included)</label>
          <textarea
            className={styles.input}
            rows={6}
            value={form.features}
            onChange={(e) => update('features', e.target.value)}
            placeholder={`Next.js 14 + SCSS / Tailwind\nCore Web Vitals 95+\nContact form wired to email`}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Tech stack</label>
          <textarea
            className={styles.input}
            rows={3}
            value={form.techStack}
            onChange={(e) => update('techStack', e.target.value)}
            placeholder={`Next.js 14\nTypeScript\nSCSS`}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>SEO keywords</label>
          <textarea
            className={styles.input}
            rows={4}
            value={form.seoKeywords}
            onChange={(e) => update('seoKeywords', e.target.value)}
            placeholder={`static website development india\nmarketing website design`}
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => router.push('/admin/offerings')}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={busy}
        >
          {busy ? 'Saving…' : mode === 'create' ? 'Create offering' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
