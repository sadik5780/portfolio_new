'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pdfShell, openPdfWindow, formatDate, formatAmount, getTaxNote } from '@/lib/pdf-letterhead';
import styles from './admin-shared.module.scss';
import quoteStyles from './QuoteGenerator.module.scss';

type InvoiceStatus = 'draft' | 'unpaid' | 'paid' | 'overdue' | 'cancelled';

interface LineItem { description: string; amount: number }

interface InvoiceData {
  invoiceNumber: string;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientAddress: string;
  projectType: string;
  currency: 'USD' | 'INR' | 'GBP';
  items: LineItem[];
  notes: string;
  issueDate: string;
  dueDate: string;
  paymentMethod: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', INR: '₹', GBP: '£' };

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
];

function genInvoiceNumber() {
  const d = new Date();
  return `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function todayISO() { return new Date().toISOString().slice(0, 10); }
function addDays(iso: string, days: number) { const d = new Date(iso); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }

interface InvoiceGeneratorProps {
  existingInvoice?: {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    clientName: string;
    clientEmail: string;
    clientCompany: string;
    clientAddress: string;
    projectType: string;
    currency: string;
    items: LineItem[];
    notes: string;
    issueDate: string;
    dueDate: string;
    paymentMethod: string;
  };
}

export default function InvoiceGenerator({ existingInvoice }: InvoiceGeneratorProps) {
  const router = useRouter();
  const isEdit = Boolean(existingInvoice);

  const [inv, setInv] = useState<InvoiceData>({
    invoiceNumber: existingInvoice?.invoiceNumber ?? genInvoiceNumber(),
    status: existingInvoice?.status ?? 'unpaid',
    clientName: existingInvoice?.clientName ?? '',
    clientEmail: existingInvoice?.clientEmail ?? '',
    clientCompany: existingInvoice?.clientCompany ?? '',
    clientAddress: existingInvoice?.clientAddress ?? '',
    projectType: existingInvoice?.projectType ?? '',
    currency: (existingInvoice?.currency as InvoiceData['currency']) ?? 'USD',
    items: existingInvoice?.items?.length ? existingInvoice.items : [{ description: '', amount: 0 }],
    notes: existingInvoice?.notes ?? 'Payment due within 14 days of invoice date.\nLate payments may be subject to a 1.5% monthly interest charge.',
    issueDate: existingInvoice?.issueDate ?? todayISO(),
    dueDate: existingInvoice?.dueDate ?? addDays(todayISO(), 14),
    paymentMethod: existingInvoice?.paymentMethod ?? 'Stripe / Wise / Bank Transfer',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof InvoiceData>(k: K, v: InvoiceData[K]) => setInv((s) => ({ ...s, [k]: v }));

  const updateItem = (i: number, field: keyof LineItem, value: string | number) => {
    const items = [...inv.items];
    items[i] = { ...items[i], [field]: value };
    update('items', items);
  };

  const addItem = () => update('items', [...inv.items, { description: '', amount: 0 }]);
  const removeItem = (i: number) => update('items', inv.items.filter((_, idx) => idx !== i));

  const subtotal = inv.items.reduce((s, item) => s + (item.amount || 0), 0);
  const sym = CURRENCY_SYMBOLS[inv.currency] ?? '$';

  const handleSave = async () => {
    if (!inv.clientName.trim()) { setError('Client name required'); return; }
    setSaving(true); setError(null); setSaved(false);
    try {
      const payload = {
        invoiceNumber: inv.invoiceNumber, status: inv.status,
        clientName: inv.clientName.trim(), clientEmail: inv.clientEmail.trim(),
        clientCompany: inv.clientCompany.trim(), clientAddress: inv.clientAddress.trim(),
        projectType: inv.projectType.trim(), currency: inv.currency,
        items: inv.items.filter((i) => i.description.trim()),
        subtotal, taxAmount: 0, total: subtotal,
        notes: inv.notes, paymentMethod: inv.paymentMethod,
        issueDate: inv.issueDate, dueDate: inv.dueDate,
      };
      const url = isEdit ? `/api/admin/invoices/${existingInvoice!.id}` : '/api/admin/invoices';
      const res = await fetch(url, { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const b = (await res.json().catch(() => ({}))) as { error?: string }; throw new Error(b.error ?? 'Save failed'); }
      setSaved(true);
      if (!isEdit) { router.push('/admin/invoices'); router.refresh(); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); } finally { setSaving(false); }
  };

  const handleExportPDF = () => {
    const body = `
    <div class="title-row">
      <h1>Invoice</h1>
      <div class="doc-meta">
        <div class="num">${inv.invoiceNumber}</div>
        <div class="date">${formatDate(inv.issueDate)}</div>
      </div>
    </div>
    <div class="info-grid">
      <div class="info-block">
        <h4>Bill To</h4>
        <p><strong>${inv.clientName || '—'}</strong><br/>${inv.clientEmail || ''}${inv.clientCompany ? '<br/>' + inv.clientCompany : ''}${inv.clientAddress ? '<br/>' + inv.clientAddress : ''}</p>
      </div>
      <div class="info-block">
        <h4>Invoice Details</h4>
        <p><strong>Due Date:</strong> ${formatDate(inv.dueDate)}<br/><strong>Project:</strong> ${inv.projectType || '—'}<br/><strong>Currency:</strong> ${inv.currency}<br/><strong>Payment:</strong> ${inv.paymentMethod}</p>
      </div>
    </div>
    <table>
      <thead><tr><th style="width:10%">#</th><th style="width:60%">Description</th><th>Amount</th></tr></thead>
      <tbody>${inv.items.filter((i) => i.description.trim()).map((item, idx) => `<tr><td>${idx + 1}</td><td>${item.description}</td><td>${formatAmount(item.amount, inv.currency)}</td></tr>`).join('')}</tbody>
    </table>
    <div class="totals">
      <div class="totals-box">
        <div class="totals-row"><span>Subtotal</span><span>${formatAmount(subtotal, inv.currency)}</span></div>
        <div class="totals-row"><span>Tax</span><span>${inv.currency === 'INR' ? 'N/A (below GST threshold)' : 'N/A (export of services)'}</span></div>
        <div class="totals-row total"><span>Total Due</span><span>${formatAmount(subtotal, inv.currency)}</span></div>
      </div>
    </div>
    <div class="terms">
      <h4>Payment Terms</h4>
      <p>${inv.notes}</p>
      <div class="tax-note"><p>${getTaxNote(inv.currency)}</p></div>
    </div>`;

    openPdfWindow(pdfShell(`Invoice ${inv.invoiceNumber}`, inv.invoiceNumber, body), `Invoice ${inv.invoiceNumber}`);
  };

  return (
    <div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Client Details</h3>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Client Name *</label><input className={styles.input} value={inv.clientName} onChange={(e) => update('clientName', e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Email</label><input className={styles.input} value={inv.clientEmail} onChange={(e) => update('clientEmail', e.target.value)} /></div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Company</label><input className={styles.input} value={inv.clientCompany} onChange={(e) => update('clientCompany', e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Address</label><input className={styles.input} value={inv.clientAddress} onChange={(e) => update('clientAddress', e.target.value)} placeholder="City, Country" /></div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Invoice Details</h3>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Invoice Number</label><input className={styles.input} value={inv.invoiceNumber} onChange={(e) => update('invoiceNumber', e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Status</label>
            <select className={styles.select} value={inv.status} onChange={(e) => update('status', e.target.value as InvoiceStatus)}>
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Currency</label>
            <select className={styles.select} value={inv.currency} onChange={(e) => update('currency', e.target.value as InvoiceData['currency'])}>
              <option value="USD">USD ($)</option><option value="INR">INR (₹)</option><option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className={styles.field}><label className={styles.label}>Project Type</label><input className={styles.input} value={inv.projectType} onChange={(e) => update('projectType', e.target.value)} /></div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Issue Date</label><input type="date" className={styles.input} value={inv.issueDate} onChange={(e) => update('issueDate', e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Due Date</label><input type="date" className={styles.input} value={inv.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></div>
        </div>
        <div className={styles.field}><label className={styles.label}>Payment Method</label><input className={styles.input} value={inv.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)} /></div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Line Items</h3>
        <div className={quoteStyles.items}>
          {inv.items.map((item, i) => (
            <div key={i} className={quoteStyles.itemRow}>
              <input className={styles.input} value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="e.g. SaaS MVP development" style={{ flex: 3 }} />
              <div className={quoteStyles.amountField}>
                <span className={quoteStyles.currencyLabel}>{sym}</span>
                <input type="number" className={styles.input} value={item.amount || ''} onChange={(e) => updateItem(i, 'amount', Number(e.target.value))} placeholder="0" min={0} />
              </div>
              {inv.items.length > 1 && (
                <button type="button" className={quoteStyles.removeBtn} onClick={() => removeItem(i)} aria-label="Remove">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" className={quoteStyles.addItemBtn} onClick={addItem}>+ Add line item</button>
        <div className={quoteStyles.totalBar}>
          <span className={quoteStyles.totalLabel}>Total</span>
          <span className={quoteStyles.totalAmount}>{formatAmount(subtotal, inv.currency)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Payment Terms</h3>
        <textarea className={styles.textarea} value={inv.notes} onChange={(e) => update('notes', e.target.value)} rows={3} />
      </div>

      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
      {saved && <div className={`${styles.alert} ${styles.alertSuccess}`}>Invoice saved.</div>}

      <div className={styles.saveBar}>
        <button type="button" className={styles.btn} onClick={handleExportPDF}>Export A4 PDF</button>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update Invoice' : 'Save Invoice'}
        </button>
      </div>
    </div>
  );
}
