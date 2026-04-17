'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import QuoteGenerator from '@/components/admin/QuoteGenerator';
import styles from '@/components/admin/admin-shared.module.scss';

interface QuoteItem {
  description: string;
  amount: number;
}

interface QuoteSummary {
  id: string;
  quoteNumber: string;
  status: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  currency: string;
  subtotal: number;
  createdAt: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', INR: '₹', GBP: '£' };

const STATUS_COLORS: Record<string, string> = {
  draft: '#6e6e73',
  sent: '#2997ff',
  accepted: '#34d399',
  declined: '#ef4444',
};

function formatAmount(amount: number, currency: string) {
  return `${CURRENCY_SYMBOLS[currency] ?? '$'}${amount.toLocaleString('en-US')}`;
}

function QuotesPageInner() {
  const params = useSearchParams();
  const hasNewParams = params.has('name') || params.has('email');

  const [view, setView] = useState<'list' | 'new'>(hasNewParams ? 'new' : 'list');
  const [quotes, setQuotes] = useState<QuoteSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const prefill = hasNewParams
    ? {
        clientName: params.get('name') ?? undefined,
        clientEmail: params.get('email') ?? undefined,
        projectType: params.get('project') ?? undefined,
        budget: params.get('budget') ?? undefined,
      }
    : undefined;

  const loadQuotes = () => {
    setLoading(true);
    fetch('/api/admin/quotes')
      .then((r) => r.json())
      .then((data: { quotes?: QuoteSummary[] }) => {
        setQuotes(data.quotes ?? []);
      })
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (view === 'list') loadQuotes();
  }, [view]);

  const handleDelete = async (id: string, number: string) => {
    if (!confirm(`Delete quote ${number}? This cannot be undone.`)) return;
    await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' });
    loadQuotes();
  };

  if (view === 'new') {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>New Quote</h1>
            <p className={styles.pageSub}>Create a professional quote and export as A4 PDF.</p>
          </div>
          <button className={styles.btn} onClick={() => setView('list')}>
            Back to quotes
          </button>
        </div>
        <QuoteGenerator prefill={prefill} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quotes</h1>
          <p className={styles.pageSub}>
            {quotes.length} quote{quotes.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => setView('new')}
        >
          + New Quote
        </button>
      </div>

      {loading ? (
        <div className={styles.muted} style={{ padding: '32px', textAlign: 'center' }}>
          Loading…
        </div>
      ) : quotes.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <div className={styles.emptyTitle}>No quotes yet</div>
          Create your first quote to get started.
        </div>
      ) : (
        <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Quote</th>
                <th>Client</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td className={styles.titleCell}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      {q.quoteNumber}
                    </span>
                  </td>
                  <td>
                    {q.clientName}
                    {q.clientEmail && (
                      <div className={styles.muted} style={{ fontSize: '11px', marginTop: '2px' }}>
                        {q.clientEmail}
                      </div>
                    )}
                  </td>
                  <td>
                    {q.projectType ? (
                      <span className={styles.badge}>{q.projectType}</span>
                    ) : (
                      <span className={styles.muted}>—</span>
                    )}
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                    {formatAmount(q.subtotal, q.currency)}
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '980px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        background: `${STATUS_COLORS[q.status] ?? '#666'}18`,
                        color: STATUS_COLORS[q.status] ?? '#666',
                        border: `1px solid ${STATUS_COLORS[q.status] ?? '#666'}30`,
                      }}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className={styles.muted} style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.rowActions}>
                      <Link
                        href={`/admin/quotes/${q.id}`}
                        className={styles.iconBtn}
                        title="Edit quote"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      <button
                        className={styles.iconBtn}
                        title="Delete"
                        onClick={() => handleDelete(q.id, q.quoteNumber)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
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

export default function AdminQuotesPage() {
  return (
    <Suspense>
      <QuotesPageInner />
    </Suspense>
  );
}
