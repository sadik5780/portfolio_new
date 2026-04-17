'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import InvoiceGenerator from '@/components/admin/InvoiceGenerator';
import styles from '@/components/admin/admin-shared.module.scss';

interface InvoiceSummary {
  id: string; invoiceNumber: string; status: string; clientName: string;
  clientEmail: string; projectType: string; currency: string;
  total: number; dueDate: string; createdAt: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', INR: '₹', GBP: '£' };
const STATUS_COLORS: Record<string, string> = { draft: '#6e6e73', unpaid: '#f59e0b', paid: '#34d399', overdue: '#ef4444', cancelled: '#6e6e73' };

function formatAmount(a: number, c: string) { return `${CURRENCY_SYMBOLS[c] ?? '$'}${a.toLocaleString('en-US')}`; }

export default function AdminInvoicesPage() {
  const [view, setView] = useState<'list' | 'new'>('list');
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/invoices').then((r) => r.json())
      .then((d: { invoices?: InvoiceSummary[] }) => setInvoices(d.invoices ?? []))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (view === 'list') load(); }, [view]);

  const handleDelete = async (id: string, num: string) => {
    if (!confirm(`Delete invoice ${num}?`)) return;
    await fetch(`/api/admin/invoices/${id}`, { method: 'DELETE' });
    load();
  };

  if (view === 'new') {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div><h1 className={styles.pageTitle}>New Invoice</h1></div>
          <button className={styles.btn} onClick={() => setView('list')}>Back to invoices</button>
        </div>
        <InvoiceGenerator />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Invoices</h1>
          <p className={styles.pageSub}>{invoices.length} invoice{invoices.length === 1 ? '' : 's'}</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setView('new')}>+ New Invoice</button>
      </div>
      {loading ? (
        <div className={styles.muted} style={{ padding: '32px', textAlign: 'center' }}>Loading…</div>
      ) : invoices.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}><div className={styles.emptyTitle}>No invoices yet</div></div>
      ) : (
        <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
          <table className={styles.table}>
            <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th><th>Due</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className={styles.titleCell}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{inv.invoiceNumber}</span></td>
                  <td>{inv.clientName}{inv.clientEmail && <div className={styles.muted} style={{ fontSize: '11px', marginTop: '2px' }}>{inv.clientEmail}</div>}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{formatAmount(inv.total, inv.currency)}</td>
                  <td>
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '980px', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize', background: `${STATUS_COLORS[inv.status] ?? '#666'}18`, color: STATUS_COLORS[inv.status] ?? '#666', border: `1px solid ${STATUS_COLORS[inv.status] ?? '#666'}30` }}>
                      {inv.status}
                    </span>
                  </td>
                  <td className={styles.muted} style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>{new Date(inv.dueDate + 'T00:00:00').toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.rowActions}>
                      <Link href={`/admin/invoices/${inv.id}`} className={styles.iconBtn} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </Link>
                      <button className={styles.iconBtn} title="Delete" onClick={() => handleDelete(inv.id, inv.invoiceNumber)}>
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
