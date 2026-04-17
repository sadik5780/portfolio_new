'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/components/admin/admin-shared.module.scss';

interface ClientSummary {
  id: string; name: string; email: string; company: string;
  country: string; status: string; currency: string; createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  lead: '#f59e0b', active: '#34d399', completed: '#2997ff', inactive: '#6e6e73',
};
const STATUS_OPTIONS = ['lead', 'active', 'completed', 'inactive'];

export default function AdminClientsPage() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'new'>('list');
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // New client form
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', address: '', country: '', currency: 'USD', status: 'lead', source: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/clients').then((r) => r.json())
      .then((d: { clients?: ClientSummary[] }) => setClients(d.clients ?? []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (view === 'list') load(); }, [view]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete client "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
    load();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setView('list');
        setForm({ name: '', email: '', phone: '', company: '', address: '', country: '', currency: 'USD', status: 'lead', source: '', notes: '' });
      }
    } finally { setSaving(false); }
  };

  if (view === 'new') {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div><h1 className={styles.pageTitle}>New Client</h1></div>
          <button className={styles.btn} onClick={() => setView('list')}>Back</button>
        </div>
        <form onSubmit={handleCreate}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Client Information</h3>
            <div className={styles.formRow}>
              <div className={styles.field}><label className={styles.label}>Name *</label><input className={styles.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required /></div>
              <div className={styles.field}><label className={styles.label}>Email</label><input className={styles.input} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}><label className={styles.label}>Phone</label><input className={styles.input} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
              <div className={styles.field}><label className={styles.label}>Company</label><input className={styles.input} value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} /></div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}><label className={styles.label}>Address</label><input className={styles.input} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="City, State" /></div>
              <div className={styles.field}><label className={styles.label}>Country</label><input className={styles.input} value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="United States" /></div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}><label className={styles.label}>Currency</label>
                <select className={styles.select} value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}>
                  <option value="USD">USD ($)</option><option value="INR">INR (₹)</option><option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className={styles.field}><label className={styles.label}>Status</label>
                <select className={styles.select} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.field}><label className={styles.label}>Source</label><input className={styles.input} value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} placeholder="Referral, Website, LinkedIn..." /></div>
            <div className={styles.field}><label className={styles.label}>Notes</label><textarea className={styles.textarea} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} /></div>
          </div>
          <div className={styles.saveBar}>
            <div />
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>{saving ? 'Saving…' : 'Create Client'}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Clients</h1>
          <p className={styles.pageSub}>{clients.length} client{clients.length === 1 ? '' : 's'}</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setView('new')}>+ New Client</button>
      </div>

      {loading ? (
        <div className={styles.muted} style={{ padding: '32px', textAlign: 'center' }}>Loading…</div>
      ) : clients.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}><div className={styles.emptyTitle}>No clients yet</div>Add your first client to start tracking.</div>
      ) : (
        <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
          <table className={styles.table}>
            <thead><tr><th>Client</th><th>Company</th><th>Country</th><th>Status</th><th>Since</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/clients/${c.id}`)}>
                  <td className={styles.titleCell}>
                    {c.name}
                    {c.email && <div className={styles.muted} style={{ fontSize: '11px', marginTop: '2px' }}>{c.email}</div>}
                  </td>
                  <td>{c.company || <span className={styles.muted}>—</span>}</td>
                  <td className={styles.muted}>{c.country || '—'}</td>
                  <td>
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '980px', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize', background: `${STATUS_COLORS[c.status] ?? '#666'}18`, color: STATUS_COLORS[c.status] ?? '#666', border: `1px solid ${STATUS_COLORS[c.status] ?? '#666'}30` }}>
                      {c.status}
                    </span>
                  </td>
                  <td className={styles.muted} style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.rowActions}>
                      <Link href={`/admin/clients/${c.id}`} className={styles.iconBtn} title="View">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </Link>
                      <button className={styles.iconBtn} title="Delete" onClick={() => handleDelete(c.id, c.name)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
