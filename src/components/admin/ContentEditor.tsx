'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  HeroContent,
  StatsContent,
  AboutContent,
  SkillsContent,
  ServicesContent,
} from '@/lib/content/types';
import styles from './admin-shared.module.scss';

interface ContentEditorProps {
  hero: HeroContent;
  stats: StatsContent;
  about: AboutContent;
  skills: SkillsContent;
  services: ServicesContent;
}

type Tab = 'hero' | 'stats' | 'about' | 'skills' | 'services';

const TABS: { id: Tab; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'stats', label: 'Stats' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'services', label: 'Services' },
];

export default function ContentEditor(props: ContentEditorProps) {
  const [tab, setTab] = useState<Tab>('hero');
  const [hero, setHero] = useState<HeroContent>(props.hero);
  const [stats, setStats] = useState<StatsContent>(props.stats);
  const [about, setAbout] = useState<AboutContent>(props.about);
  const [skills, setSkills] = useState<SkillsContent>(props.skills);
  const [services, setServices] = useState<ServicesContent>(props.services);

  return (
    <>
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hero' && (
        <EditorPanel settingKey="hero" value={hero} setValue={setHero}>
          <HeroFields hero={hero} setHero={setHero} />
        </EditorPanel>
      )}
      {tab === 'stats' && (
        <EditorPanel settingKey="stats" value={stats} setValue={setStats}>
          <StatsFields stats={stats} setStats={setStats} />
        </EditorPanel>
      )}
      {tab === 'about' && (
        <EditorPanel settingKey="about" value={about} setValue={setAbout}>
          <AboutFields about={about} setAbout={setAbout} />
        </EditorPanel>
      )}
      {tab === 'skills' && (
        <EditorPanel settingKey="skills" value={skills} setValue={setSkills}>
          <SkillsFields skills={skills} setSkills={setSkills} />
        </EditorPanel>
      )}
      {tab === 'services' && (
        <EditorPanel settingKey="services" value={services} setValue={setServices}>
          <ServicesFields services={services} setServices={setServices} />
        </EditorPanel>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════
// Panel wrapper — handles save button + network state
// ═══════════════════════════════════════════════════════
function EditorPanel<T>({
  settingKey,
  value,
  setValue,
  children,
}: {
  settingKey: string;
  value: T;
  setValue: (v: T) => void;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: settingKey, value }),
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

  // Silence unused-var warning from editor panels that only call setValue
  // via their child fields — setValue is passed for type-inference continuity.
  void setValue;

  return (
    <div>
      {children}
      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
      {saved && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          Saved. Public pages have been refreshed.
        </div>
      )}
      <div className={styles.saveBar}>
        <span className={styles.muted} style={{ fontSize: '13px' }}>
          Changes are saved to Supabase immediately and invalidate the public cache.
        </span>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Hero fields
// ═══════════════════════════════════════════════════════
function HeroFields({
  hero,
  setHero,
}: {
  hero: HeroContent;
  setHero: (v: HeroContent) => void;
}) {
  const up = <K extends keyof HeroContent>(k: K, v: HeroContent[K]) =>
    setHero({ ...hero, [k]: v });

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Hero section</h3>
      <div className={styles.sectionDesc}>
        Displayed above the fold on the home page.
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Badge text</label>
        <input
          className={styles.input}
          value={hero.badge}
          onChange={(e) => up('badge', e.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label className={styles.label}>Heading line 1</label>
          <input
            className={styles.input}
            value={hero.heading_line1}
            onChange={(e) => up('heading_line1', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            Highlighted word <span className={styles.hint}>(gradient)</span>
          </label>
          <input
            className={styles.input}
            value={hero.heading_highlight}
            onChange={(e) => up('heading_highlight', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Heading line 2</label>
        <input
          className={styles.input}
          value={hero.heading_line2}
          onChange={(e) => up('heading_line2', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Subtitle</label>
        <textarea
          className={styles.textarea}
          value={hero.subtitle}
          onChange={(e) => up('subtitle', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Stats fields
// ═══════════════════════════════════════════════════════
function StatsFields({
  stats,
  setStats,
}: {
  stats: StatsContent;
  setStats: (v: StatsContent) => void;
}) {
  const updateItem = (i: number, field: 'value' | 'label', val: string) => {
    const items = [...stats.items];
    items[i] = { ...items[i], [field]: val };
    setStats({ items });
  };
  const remove = (i: number) =>
    setStats({ items: stats.items.filter((_, idx) => idx !== i) });
  const add = () =>
    setStats({ items: [...stats.items, { value: '', label: '' }] });

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Hero stats</h3>
      <div className={styles.sectionDesc}>
        Displayed under the hero buttons. Keep these short (e.g. &quot;30+&quot;, &quot;Projects Delivered&quot;).
      </div>

      <div className={styles.arrayField}>
        {stats.items.map((item, i) => (
          <div key={i} className={styles.arrayItem}>
            <div className={styles.arrayItemBody}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Value</label>
                  <input
                    className={styles.input}
                    value={item.value}
                    onChange={(e) => updateItem(i, 'value', e.target.value)}
                    placeholder="30+"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Label</label>
                  <input
                    className={styles.input}
                    value={item.label}
                    onChange={(e) => updateItem(i, 'label', e.target.value)}
                    placeholder="Projects Delivered"
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              className={styles.arrayRemove}
              onClick={() => remove(i)}
              aria-label="Remove stat"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
        <button type="button" className={styles.arrayAdd} onClick={add}>
          + Add stat
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// About fields (title + description + experiences)
// ═══════════════════════════════════════════════════════
function AboutFields({
  about,
  setAbout,
}: {
  about: AboutContent;
  setAbout: (v: AboutContent) => void;
}) {
  const up = <K extends keyof AboutContent>(k: K, v: AboutContent[K]) =>
    setAbout({ ...about, [k]: v });

  const updateExp = (
    i: number,
    field: keyof AboutContent['experiences'][number],
    val: string,
  ) => {
    const experiences = [...about.experiences];
    experiences[i] = { ...experiences[i], [field]: val };
    up('experiences', experiences);
  };
  const removeExp = (i: number) =>
    up('experiences', about.experiences.filter((_, idx) => idx !== i));
  const addExp = () =>
    up('experiences', [
      ...about.experiences,
      { role: '', company: '', period: '', description: '' },
    ]);

  return (
    <>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>About section</h3>
        <div className={styles.sectionDesc}>Left card on the About section.</div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Label (small uppercase tag)</label>
            <input
              className={styles.input}
              value={about.label}
              onChange={(e) => up('label', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Section title</label>
            <input
              className={styles.input}
              value={about.title}
              onChange={(e) => up('title', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={about.description}
            onChange={(e) => up('description', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Experience timeline</h3>
        <div className={styles.arrayField}>
          {about.experiences.map((exp, i) => (
            <div key={i} className={styles.arrayItem}>
              <div className={styles.arrayItemBody}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Role</label>
                    <input
                      className={styles.input}
                      value={exp.role}
                      onChange={(e) => updateExp(i, 'role', e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Company</label>
                    <input
                      className={styles.input}
                      value={exp.company}
                      onChange={(e) => updateExp(i, 'company', e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Period</label>
                  <input
                    className={styles.input}
                    value={exp.period}
                    onChange={(e) => updateExp(i, 'period', e.target.value)}
                    placeholder="2022 — Present"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={exp.description}
                    onChange={(e) => updateExp(i, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
              <button
                type="button"
                className={styles.arrayRemove}
                onClick={() => removeExp(i)}
                aria-label="Remove experience"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          <button type="button" className={styles.arrayAdd} onClick={addExp}>
            + Add experience
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// Skills fields
// ═══════════════════════════════════════════════════════
function SkillsFields({
  skills,
  setSkills,
}: {
  skills: SkillsContent;
  setSkills: (v: SkillsContent) => void;
}) {
  const updateGroup = (i: number, field: 'category' | 'items', val: string) => {
    const groups = [...skills.groups];
    if (field === 'items') {
      groups[i] = {
        ...groups[i],
        items: val.split(',').map((s) => s.trim()).filter(Boolean),
      };
    } else {
      groups[i] = { ...groups[i], category: val };
    }
    setSkills({ groups });
  };
  const removeGroup = (i: number) =>
    setSkills({ groups: skills.groups.filter((_, idx) => idx !== i) });
  const addGroup = () =>
    setSkills({ groups: [...skills.groups, { category: '', items: [] }] });

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Skills</h3>
      <div className={styles.sectionDesc}>
        Grouped by category (Frontend, Backend, Tools, etc.).
      </div>

      <div className={styles.arrayField}>
        {skills.groups.map((group, i) => (
          <div key={i} className={styles.arrayItem}>
            <div className={styles.arrayItemBody}>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <input
                  className={styles.input}
                  value={group.category}
                  onChange={(e) => updateGroup(i, 'category', e.target.value)}
                  placeholder="Frontend"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  Skills <span className={styles.hint}>(comma-separated)</span>
                </label>
                <input
                  className={styles.input}
                  value={group.items.join(', ')}
                  onChange={(e) => updateGroup(i, 'items', e.target.value)}
                  placeholder="React, Next.js, TypeScript"
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.arrayRemove}
              onClick={() => removeGroup(i)}
              aria-label="Remove group"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
        <button type="button" className={styles.arrayAdd} onClick={addGroup}>
          + Add skill group
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Services fields
// ═══════════════════════════════════════════════════════
function ServicesFields({
  services,
  setServices,
}: {
  services: ServicesContent;
  setServices: (v: ServicesContent) => void;
}) {
  const up = <K extends keyof ServicesContent>(k: K, v: ServicesContent[K]) =>
    setServices({ ...services, [k]: v });

  const updateItem = (i: number, field: 'title' | 'description', val: string) => {
    const items = [...services.items];
    items[i] = { ...items[i], [field]: val };
    up('items', items);
  };
  const removeItem = (i: number) =>
    up('items', services.items.filter((_, idx) => idx !== i));
  const addItem = () =>
    up('items', [...services.items, { title: '', description: '' }]);

  return (
    <>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Services section</h3>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Label</label>
            <input
              className={styles.input}
              value={services.label}
              onChange={(e) => up('label', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              value={services.title}
              onChange={(e) => up('title', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Service items</h3>
        <div className={styles.arrayField}>
          {services.items.map((item, i) => (
            <div key={i} className={styles.arrayItem}>
              <div className={styles.arrayItemBody}>
                <div className={styles.field}>
                  <label className={styles.label}>Title</label>
                  <input
                    className={styles.input}
                    value={item.title}
                    onChange={(e) => updateItem(i, 'title', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={item.description}
                    onChange={(e) => updateItem(i, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
              <button
                type="button"
                className={styles.arrayRemove}
                onClick={() => removeItem(i)}
                aria-label="Remove service"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          <button type="button" className={styles.arrayAdd} onClick={addItem}>
            + Add service
          </button>
        </div>
      </div>
    </>
  );
}
