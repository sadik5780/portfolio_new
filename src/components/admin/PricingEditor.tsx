'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PricingContent } from '@/lib/content/types';
import styles from './admin-shared.module.scss';

interface PricingEditorProps {
  initial: PricingContent;
}

export default function PricingEditor({ initial }: PricingEditorProps) {
  const router = useRouter();
  const [value, setValue] = useState<PricingContent>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'pricing', value }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Save failed');
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Shopify handlers ───────────────────────────────
  const setShopify = (currency: 'inr' | 'usd', amount: number) =>
    setValue({ ...value, shopify: { ...value.shopify, [currency]: amount } });

  // ── Static tiers handlers ──────────────────────────
  const updateTier = <K extends keyof PricingContent['static_tiers'][number]>(
    i: number,
    key: K,
    v: PricingContent['static_tiers'][number][K],
  ) => {
    const tiers = [...value.static_tiers];
    tiers[i] = { ...tiers[i], [key]: v };
    setValue({ ...value, static_tiers: tiers });
  };
  const updateTierIncludes = (i: number, text: string) => {
    const tiers = [...value.static_tiers];
    tiers[i] = {
      ...tiers[i],
      includes: text.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    setValue({ ...value, static_tiers: tiers });
  };
  const addTier = () =>
    setValue({
      ...value,
      static_tiers: [
        ...value.static_tiers,
        {
          id: `tier-${Date.now()}`,
          name: '',
          description: '',
          inr: 0,
          usd: 0,
          includes: [],
        },
      ],
    });
  const removeTier = (i: number) =>
    setValue({
      ...value,
      static_tiers: value.static_tiers.filter((_, idx) => idx !== i),
    });

  // ── App builder handlers ───────────────────────────
  const setAppBase = (currency: 'inr' | 'usd', amount: number) =>
    setValue({
      ...value,
      app: { ...value.app, base: { ...value.app.base, [currency]: amount } },
    });
  const setAppFeaturePrice = (currency: 'inr' | 'usd', amount: number) =>
    setValue({
      ...value,
      app: {
        ...value.app,
        feature_price: { ...value.app.feature_price, [currency]: amount },
      },
    });
  const updateFeature = (
    i: number,
    field: 'id' | 'name' | 'description',
    v: string,
  ) => {
    const features = [...value.app.features];
    features[i] = { ...features[i], [field]: v };
    setValue({ ...value, app: { ...value.app, features } });
  };
  const addFeature = () =>
    setValue({
      ...value,
      app: {
        ...value.app,
        features: [
          ...value.app.features,
          { id: `feat-${Date.now()}`, name: '', description: '' },
        ],
      },
    });
  const removeFeature = (i: number) =>
    setValue({
      ...value,
      app: {
        ...value.app,
        features: value.app.features.filter((_, idx) => idx !== i),
      },
    });

  return (
    <>
      {/* ── Shopify ──────────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Shopify store development</h3>
        <div className={styles.sectionDesc}>Base price for a custom Shopify build.</div>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>India (INR)</label>
            <input
              type="number"
              className={styles.input}
              value={value.shopify.inr}
              onChange={(e) => setShopify('inr', Number(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>International (USD)</label>
            <input
              type="number"
              className={styles.input}
              value={value.shopify.usd}
              onChange={(e) => setShopify('usd', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* ── Static tiers ─────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Static website tiers</h3>
        <div className={styles.arrayField}>
          {value.static_tiers.map((tier, i) => (
            <div key={tier.id} className={styles.arrayItem}>
              <div className={styles.arrayItemBody}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Tier ID</label>
                    <input
                      className={styles.input}
                      value={tier.id}
                      onChange={(e) => updateTier(i, 'id', e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Tier name</label>
                    <input
                      className={styles.input}
                      value={tier.name}
                      onChange={(e) => updateTier(i, 'name', e.target.value)}
                      placeholder="Starter"
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <input
                    className={styles.input}
                    value={tier.description}
                    onChange={(e) => updateTier(i, 'description', e.target.value)}
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Price (INR)</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={tier.inr}
                      onChange={(e) => updateTier(i, 'inr', Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Price (USD)</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={tier.usd}
                      onChange={(e) => updateTier(i, 'usd', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Includes <span className={styles.hint}>(one per line)</span>
                  </label>
                  <textarea
                    className={styles.textarea}
                    value={tier.includes.join('\n')}
                    onChange={(e) => updateTierIncludes(i, e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
              <button
                type="button"
                className={styles.arrayRemove}
                onClick={() => removeTier(i)}
                aria-label="Remove tier"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          <button type="button" className={styles.arrayAdd} onClick={addTier}>
            + Add tier
          </button>
        </div>
      </div>

      {/* ── App builder ──────────────────────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Custom web app</h3>
        <div className={styles.sectionDesc}>
          Base price plus per-feature price drives the interactive quote
          calculator on the contact page.
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Base price (INR)</label>
            <input
              type="number"
              className={styles.input}
              value={value.app.base.inr}
              onChange={(e) => setAppBase('inr', Number(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Base price (USD)</label>
            <input
              type="number"
              className={styles.input}
              value={value.app.base.usd}
              onChange={(e) => setAppBase('usd', Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Per-feature (INR)</label>
            <input
              type="number"
              className={styles.input}
              value={value.app.feature_price.inr}
              onChange={(e) => setAppFeaturePrice('inr', Number(e.target.value))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Per-feature (USD)</label>
            <input
              type="number"
              className={styles.input}
              value={value.app.feature_price.usd}
              onChange={(e) => setAppFeaturePrice('usd', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>App features ({value.app.features.length})</h3>
        <div className={styles.sectionDesc}>
          Each feature adds the per-feature price above to the customer&apos;s quote.
        </div>

        <div className={styles.arrayField}>
          {value.app.features.map((feat, i) => (
            <div key={`${feat.id}-${i}`} className={styles.arrayItem}>
              <div className={styles.arrayItemBody}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>ID</label>
                    <input
                      className={styles.input}
                      value={feat.id}
                      onChange={(e) => updateFeature(i, 'id', e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Name</label>
                    <input
                      className={styles.input}
                      value={feat.name}
                      onChange={(e) => updateFeature(i, 'name', e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <input
                    className={styles.input}
                    value={feat.description}
                    onChange={(e) => updateFeature(i, 'description', e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className={styles.arrayRemove}
                onClick={() => removeFeature(i)}
                aria-label="Remove feature"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          <button type="button" className={styles.arrayAdd} onClick={addFeature}>
            + Add feature
          </button>
        </div>
      </div>

      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
      {saved && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          Saved. Public pages have been refreshed.
        </div>
      )}

      <div className={styles.saveBar}>
        <span className={styles.muted} style={{ fontSize: '13px' }}>
          The live quote calculator on /contact updates on next page load.
        </span>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={save}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save pricing'}
        </button>
      </div>
    </>
  );
}
