import { getClient, getClientRelated } from '@/lib/content/clients';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from '@/components/admin/admin-shared.module.scss';

interface Params { params: { id: string } }

const STATUS_COLORS: Record<string, string> = {
  lead: '#f59e0b', active: '#34d399', completed: '#2997ff', inactive: '#6e6e73',
  draft: '#6e6e73', sent: '#2997ff', accepted: '#34d399', declined: '#ef4444',
  unpaid: '#f59e0b', paid: '#34d399', overdue: '#ef4444', cancelled: '#6e6e73',
};

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', INR: '₹', GBP: '£' };
function fmtAmt(a: number, c: string) { return `${CURRENCY_SYMBOLS[c] ?? '$'}${a.toLocaleString('en-US', { minimumFractionDigits: 2 })}`; }

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? '#666';
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '980px', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize', background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {status}
    </span>
  );
}

export default async function ClientDetailPage({ params }: Params) {
  const client = await getClient(params.id);
  if (!client) redirect('/admin/clients');

  const related = await getClientRelated(client.id);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{client.name}</h1>
          <p className={styles.pageSub}>
            {client.company && `${client.company} · `}
            {client.country || 'No location'} · <StatusBadge status={client.status} />
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href={`/admin/quotes?name=${encodeURIComponent(client.name)}&email=${encodeURIComponent(client.email)}`} className={`${styles.btn} ${styles.btnPrimary}`}>
            + Quote
          </Link>
          <Link href="/admin/clients" className={styles.btn}>Back</Link>
        </div>
      </div>

      {/* Client info card */}
      <div className={styles.card} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <div className={styles.muted} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email</div>
            <div>{client.email ? <a href={`mailto:${client.email}`} style={{ color: '#2997ff', textDecoration: 'none' }}>{client.email}</a> : '—'}</div>
          </div>
          <div>
            <div className={styles.muted} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Phone</div>
            <div>{client.phone || '—'}</div>
          </div>
          <div>
            <div className={styles.muted} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Currency</div>
            <div>{client.currency}</div>
          </div>
          <div>
            <div className={styles.muted} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Source</div>
            <div>{client.source || '—'}</div>
          </div>
          <div>
            <div className={styles.muted} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Address</div>
            <div>{client.address || '—'}</div>
          </div>
          <div>
            <div className={styles.muted} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Client Since</div>
            <div>{new Date(client.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        {client.notes && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className={styles.muted} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Notes</div>
            <div style={{ fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{client.notes}</div>
          </div>
        )}
      </div>

      {/* Quotes */}
      <div style={{ marginBottom: '24px' }}>
        <h3 className={styles.sectionTitle} style={{ fontSize: '16px', marginBottom: '12px' }}>
          Quotes ({related.quotes.length})
        </h3>
        {related.quotes.length === 0 ? (
          <div className={styles.muted} style={{ fontSize: '13px' }}>No quotes yet</div>
        ) : (
          <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
            <table className={styles.table}>
              <thead><tr><th>Quote #</th><th>Amount</th><th>Status</th><th>Date</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {related.quotes.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{q.quoteNumber}</td>
                    <td style={{ fontWeight: 600 }}>{fmtAmt(q.subtotal, q.currency)}</td>
                    <td><StatusBadge status={q.status} /></td>
                    <td className={styles.muted} style={{ fontSize: '12px' }}>{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}><Link href={`/admin/quotes/${q.id}`} className={styles.iconBtn} title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoices */}
      <div style={{ marginBottom: '24px' }}>
        <h3 className={styles.sectionTitle} style={{ fontSize: '16px', marginBottom: '12px' }}>
          Invoices ({related.invoices.length})
        </h3>
        {related.invoices.length === 0 ? (
          <div className={styles.muted} style={{ fontSize: '13px' }}>No invoices yet</div>
        ) : (
          <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
            <table className={styles.table}>
              <thead><tr><th>Invoice #</th><th>Amount</th><th>Status</th><th>Date</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {related.invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{inv.invoiceNumber}</td>
                    <td style={{ fontWeight: 600 }}>{fmtAmt(inv.total, inv.currency)}</td>
                    <td><StatusBadge status={inv.status} /></td>
                    <td className={styles.muted} style={{ fontSize: '12px' }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}><Link href={`/admin/invoices/${inv.id}`} className={styles.iconBtn} title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Leads / Chat history */}
      <div style={{ marginBottom: '24px' }}>
        <h3 className={styles.sectionTitle} style={{ fontSize: '16px', marginBottom: '12px' }}>
          Leads & Chat History ({related.leads.length})
        </h3>
        {related.leads.length === 0 ? (
          <div className={styles.muted} style={{ fontSize: '13px' }}>No lead submissions linked to this client</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {related.leads.map((lead) => (
              <div key={lead.id} className={styles.card} style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{lead.projectType || 'General inquiry'}</span>
                  <span className={styles.muted} style={{ fontSize: '11px' }}>{new Date(lead.createdAt).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#86868b', whiteSpace: 'pre-wrap' }}>{lead.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
