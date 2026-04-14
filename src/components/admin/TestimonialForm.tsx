'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Testimonial, TestimonialCountry } from '@/lib/content/types';
import styles from './admin-shared.module.scss';

interface TestimonialFormProps {
  mode: 'create' | 'edit';
  testimonial?: Testimonial;
}

interface FormState {
  name: string;
  role: string;
  company: string;
  country: TestimonialCountry;
  countryFlag: string;
  quote: string;
  rating: number;
  projectType: string;
  featured: boolean;
  sortOrder: number;
}

const COUNTRIES: Array<{ value: TestimonialCountry; flag: string; label: string }> = [
  { value: 'India', flag: '🇮🇳', label: 'India' },
  { value: 'USA', flag: '🇺🇸', label: 'United States' },
  { value: 'Australia', flag: '🇦🇺', label: 'Australia' },
  { value: 'UK', flag: '🇬🇧', label: 'United Kingdom' },
  { value: 'Singapore', flag: '🇸🇬', label: 'Singapore' },
  { value: 'Other', flag: '🌍', label: 'Other' },
];

function defaultFlagFor(country: TestimonialCountry): string {
  return COUNTRIES.find((c) => c.value === country)?.flag ?? '';
}

export default function TestimonialForm({ mode, testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: testimonial?.name ?? '',
    role: testimonial?.role ?? '',
    company: testimonial?.company ?? '',
    country: testimonial?.country ?? 'India',
    countryFlag: testimonial?.countryFlag || defaultFlagFor(testimonial?.country ?? 'India'),
    quote: testimonial?.quote ?? '',
    rating: testimonial?.rating ?? 5,
    projectType: testimonial?.projectType ?? '',
    featured: testimonial?.featured ?? true,
    sortOrder: testimonial?.sortOrder ?? 0,
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onCountryChange = (country: TestimonialCountry) => {
    setForm((prev) => ({
      ...prev,
      country,
      countryFlag:
        prev.countryFlag === defaultFlagFor(prev.country) || !prev.countryFlag
          ? defaultFlagFor(country)
          : prev.countryFlag,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      company: form.company.trim(),
      country: form.country,
      countryFlag: form.countryFlag.trim(),
      quote: form.quote.trim(),
      rating: form.rating,
      projectType: form.projectType.trim(),
      featured: form.featured,
      sortOrder: form.sortOrder,
    };

    const url =
      mode === 'create'
        ? '/api/admin/testimonials'
        : `/api/admin/testimonials/${testimonial?.id}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        throw new Error(body.error ?? 'Save failed');
      }

      router.push('/admin/testimonials');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Author</h3>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Name *</label>
            <input
              className={styles.input}
              type="text"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Aarav Sharma"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Role *</label>
            <input
              className={styles.input}
              type="text"
              required
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              placeholder="Founder"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Company *</label>
            <input
              className={styles.input}
              type="text"
              required
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              placeholder="BoltShip Logistics"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Project type <span className={styles.hint}>(shown as the badge)</span>
            </label>
            <input
              className={styles.input}
              type="text"
              value={form.projectType}
              onChange={(e) => update('projectType', e.target.value)}
              placeholder="SaaS Platform"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Country *</label>
            <select
              className={styles.select}
              value={form.country}
              onChange={(e) => onCountryChange(e.target.value as TestimonialCountry)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.flag} {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Country flag <span className={styles.hint}>(emoji)</span>
            </label>
            <input
              className={styles.input}
              type="text"
              value={form.countryFlag}
              onChange={(e) => update('countryFlag', e.target.value)}
              placeholder="🇮🇳"
              maxLength={4}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Quote</h3>

        <div className={styles.field}>
          <label className={styles.label}>
            Testimonial quote * <span className={styles.hint}>(min 20, max 2000 chars)</span>
          </label>
          <textarea
            className={styles.textarea}
            required
            rows={6}
            minLength={20}
            maxLength={2000}
            value={form.quote}
            onChange={(e) => update('quote', e.target.value)}
            placeholder="Sadik rebuilt our dispatch dashboard from a 6-second LCP to under 400ms…"
          />
          <span className={styles.hint}>{form.quote.length}/2000 characters</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Display</h3>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Rating (1-5)</label>
            <input
              className={styles.input}
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) => update('rating', Number(e.target.value))}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Sort order <span className={styles.hint}>(lower = first)</span>
            </label>
            <input
              className={styles.input}
              type="number"
              value={form.sortOrder}
              onChange={(e) => update('sortOrder', Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
            />
            <span>Featured (show in the homepage carousel)</span>
          </label>
        </div>
      </div>

      <div className={styles.formRow} style={{ marginTop: '24px' }}>
        <button
          type="button"
          className={`${styles.btn}`}
          onClick={() => router.push('/admin/testimonials')}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={busy}
        >
          {busy ? 'Saving…' : mode === 'create' ? 'Create testimonial' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
