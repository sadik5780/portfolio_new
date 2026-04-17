'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pdfShell, openPdfWindow, formatDate, formatAmount, getTaxNote } from '@/lib/pdf-letterhead';
import styles from './admin-shared.module.scss';
import quoteStyles from './QuoteGenerator.module.scss';

interface QuoteItem { description: string; amount: number }
type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined';

interface QuoteData {
  clientName: string; clientEmail: string; clientCompany: string;
  projectType: string; quoteNumber: string; issueDate: string;
  validUntil: string; currency: 'USD' | 'INR' | 'GBP';
  items: QuoteItem[]; notes: string; includesMaintenance: boolean;
  deliveryDays: number; status: QuoteStatus;
}

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', INR: '₹', GBP: '£' };
const STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' }, { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' }, { value: 'declined', label: 'Declined' },
];

function genNum() {
  const d = new Date();
  return `SS-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
function todayISO() { return new Date().toISOString().slice(0, 10); }
function addDays(iso: string, days: number) { const d = new Date(iso); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }

interface QuoteGeneratorProps {
  prefill?: { clientName?: string; clientEmail?: string; projectType?: string; budget?: string };
  existingQuote?: {
    id: string; quoteNumber: string; status: QuoteStatus; clientName: string;
    clientEmail: string; clientCompany: string; projectType: string; currency: string;
    items: QuoteItem[]; notes: string; deliveryDays: number;
    includesMaintenance: boolean; issueDate: string; validUntil: string;
  };
}

export default function QuoteGenerator({ prefill, existingQuote }: QuoteGeneratorProps) {
  const router = useRouter();
  const isEdit = Boolean(existingQuote);

  const [quote, setQuote] = useState<QuoteData>({
    clientName: existingQuote?.clientName ?? prefill?.clientName ?? '',
    clientEmail: existingQuote?.clientEmail ?? prefill?.clientEmail ?? '',
    clientCompany: existingQuote?.clientCompany ?? '',
    projectType: existingQuote?.projectType ?? prefill?.projectType ?? '',
    quoteNumber: existingQuote?.quoteNumber ?? genNum(),
    issueDate: existingQuote?.issueDate ?? todayISO(),
    validUntil: existingQuote?.validUntil ?? addDays(todayISO(), 14),
    currency: (existingQuote?.currency as QuoteData['currency']) ?? 'USD',
    items: existingQuote?.items?.length ? existingQuote.items : [{ description: '', amount: 0 }],
    notes: existingQuote?.notes ?? 'Payment: 50% upfront, 50% on delivery.\n12 months of maintenance included at no extra cost.\nFull source code and repository ownership transferred on completion.',
    includesMaintenance: existingQuote?.includesMaintenance ?? true,
    deliveryDays: existingQuote?.deliveryDays ?? 30,
    status: existingQuote?.status ?? 'draft',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof QuoteData>(k: K, v: QuoteData[K]) => setQuote((s) => ({ ...s, [k]: v }));
  const updateItem = (i: number, field: keyof QuoteItem, value: string | number) => {
    const items = [...quote.items]; items[i] = { ...items[i], [field]: value }; update('items', items);
  };
  const addItem = () => update('items', [...quote.items, { description: '', amount: 0 }]);
  const removeItem = (i: number) => update('items', quote.items.filter((_, idx) => idx !== i));

  const subtotal = quote.items.reduce((s, item) => s + (item.amount || 0), 0);
  const sym = CURRENCY_SYMBOLS[quote.currency] ?? '$';

  const handleSave = async () => {
    if (!quote.clientName.trim()) { setError('Client name required'); return; }
    setSaving(true); setError(null); setSaved(false);
    try {
      const payload = {
        quoteNumber: quote.quoteNumber, status: quote.status,
        clientName: quote.clientName.trim(), clientEmail: quote.clientEmail.trim(),
        clientCompany: quote.clientCompany.trim(), projectType: quote.projectType.trim(),
        currency: quote.currency, items: quote.items.filter((i) => i.description.trim()),
        subtotal, notes: quote.notes, deliveryDays: quote.deliveryDays,
        includesMaintenance: quote.includesMaintenance, issueDate: quote.issueDate, validUntil: quote.validUntil,
      };
      const url = isEdit ? `/api/admin/quotes/${existingQuote!.id}` : '/api/admin/quotes';
      const res = await fetch(url, { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const b = (await res.json().catch(() => ({}))) as { error?: string }; throw new Error(b.error ?? 'Save failed'); }
      setSaved(true);
      if (!isEdit) { router.push('/admin/quotes'); router.refresh(); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); } finally { setSaving(false); }
  };

  const handleExportPDF = () => {
    const body = `
    <div class="doc-header">
      <div class="doc-type">Quote</div>
      <div class="doc-number-row">
        <div class="doc-number">${quote.quoteNumber}</div>
        <div class="doc-date">${formatDate(quote.issueDate)}</div>
      </div>
    </div>
    <div class="info-grid">
      <div class="info-block"><h4>Bill To</h4><p><strong>${quote.clientName || '—'}</strong>${quote.clientEmail ? '<br/>' + quote.clientEmail : ''}${quote.clientCompany ? '<br/>' + quote.clientCompany : ''}</p></div>
      <div class="info-block"><h4>Quote Details</h4><p><strong>Valid Until:</strong> ${formatDate(quote.validUntil)}<br/><strong>Project:</strong> ${quote.projectType || '—'}<br/><strong>Currency:</strong> ${quote.currency}</p></div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Description</th><th>Amount</th></tr></thead>
      <tbody>${quote.items.filter((i) => i.description.trim()).map((item, idx) => `<tr><td>${idx + 1}</td><td>${item.description}</td><td>${formatAmount(item.amount, quote.currency)}</td></tr>`).join('')}</tbody>
    </table>
    <div class="totals"><div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span>${formatAmount(subtotal, quote.currency)}</span></div>
      <div class="totals-row"><span>Tax</span><span>${quote.currency === 'INR' ? 'N/A (below GST threshold)' : 'N/A (export of services)'}</span></div>
      <div class="totals-row total"><span>Total</span><span>${formatAmount(subtotal, quote.currency)}</span></div>
    </div></div>
    <div class="tags">
      ${quote.includesMaintenance ? '<span class="tag">12 months maintenance</span>' : ''}
      <span class="tag">~${quote.deliveryDays} day delivery</span>
      <span class="tag">Full code ownership</span>
      <span class="tag">Source code transfer</span>
    </div>
    <div class="terms"><h4>Terms & Conditions</h4><p>${quote.notes}</p>
      <div class="tax-note"><p>${getTaxNote(quote.currency)}</p></div>
    </div>
    <div class="payment-box"><h4>Accepted Payment Methods</h4>
      <p>Stripe · Wise · Bank Transfer (SWIFT/NEFT)${quote.currency === 'INR' ? ' · UPI · IMPS' : ''}</p>
    </div>
    <div class="sig-grid">
      <div class="sig-block" style="margin-top:36px"><div class="sig-name">Sadik Shaikh</div><div class="sig-role">Sadik Studio</div><div class="sig-date">Date: ${formatDate(quote.issueDate)}</div></div>
      <div class="sig-block" style="margin-top:36px"><div class="sig-name">${quote.clientName || '_______________'}</div><div class="sig-role">${quote.clientCompany || 'Client'}</div><div class="sig-date">Date: _______________</div></div>
    </div>`;
    openPdfWindow(pdfShell(`Quote ${quote.quoteNumber}`, quote.quoteNumber, body), `Quote ${quote.quoteNumber}`);
  };

  return (
    <div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Client Details</h3>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Client Name *</label><input className={styles.input} value={quote.clientName} onChange={(e) => update('clientName', e.target.value)} placeholder="Jane Doe" /></div>
          <div className={styles.field}><label className={styles.label}>Email</label><input className={styles.input} value={quote.clientEmail} onChange={(e) => update('clientEmail', e.target.value)} placeholder="jane@company.com" /></div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Company</label><input className={styles.input} value={quote.clientCompany} onChange={(e) => update('clientCompany', e.target.value)} placeholder="Acme Inc." /></div>
          <div className={styles.field}><label className={styles.label}>Project Type</label><input className={styles.input} value={quote.projectType} onChange={(e) => update('projectType', e.target.value)} placeholder="SaaS MVP" /></div>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Quote Details</h3>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Quote Number</label><input className={styles.input} value={quote.quoteNumber} onChange={(e) => update('quoteNumber', e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Status</label><select className={styles.select} value={quote.status} onChange={(e) => update('status', e.target.value as QuoteStatus)}>{STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Currency</label><select className={styles.select} value={quote.currency} onChange={(e) => update('currency', e.target.value as QuoteData['currency'])}><option value="USD">USD ($)</option><option value="INR">INR (₹)</option><option value="GBP">GBP (£)</option></select></div>
          <div className={styles.field}><label className={styles.label}>Delivery (days)</label><input type="number" className={styles.input} value={quote.deliveryDays} min={1} onChange={(e) => update('deliveryDays', Number(e.target.value))} /></div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Issue Date</label><input type="date" className={styles.input} value={quote.issueDate} onChange={(e) => update('issueDate', e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Valid Until</label><input type="date" className={styles.input} value={quote.validUntil} onChange={(e) => update('validUntil', e.target.value)} /></div>
        </div>
        <label className={styles.checkbox}><input type="checkbox" checked={quote.includesMaintenance} onChange={(e) => update('includesMaintenance', e.target.checked)} />Include 12 months maintenance</label>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Line Items</h3>
        <div className={quoteStyles.items}>
          {quote.items.map((item, i) => (
            <div key={i} className={quoteStyles.itemRow}>
              <input className={styles.input} value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="e.g. SaaS MVP — auth, dashboard, Stripe" style={{ flex: 3 }} />
              <div className={quoteStyles.amountField}><span className={quoteStyles.currencyLabel}>{sym}</span><input type="number" className={styles.input} value={item.amount || ''} onChange={(e) => updateItem(i, 'amount', Number(e.target.value))} placeholder="0" min={0} /></div>
              {quote.items.length > 1 && (<button type="button" className={quoteStyles.removeBtn} onClick={() => removeItem(i)} aria-label="Remove"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>)}
            </div>
          ))}
        </div>
        <button type="button" className={quoteStyles.addItemBtn} onClick={addItem}>+ Add line item</button>
        <div className={quoteStyles.totalBar}><span className={quoteStyles.totalLabel}>Total</span><span className={quoteStyles.totalAmount}>{formatAmount(subtotal, quote.currency)}</span></div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Notes & Terms</h3>
        <textarea className={styles.textarea} value={quote.notes} onChange={(e) => update('notes', e.target.value)} rows={4} />
      </div>
      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
      {saved && <div className={`${styles.alert} ${styles.alertSuccess}`}>Quote saved.</div>}
      <div className={styles.saveBar}>
        <button type="button" className={styles.btn} onClick={handleExportPDF}>Export A4 PDF</button>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Update Quote' : 'Save Quote'}</button>
      </div>
    </div>
  );
}
