export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatAmount(amount: number, currency: string) {
  const symbols: Record<string, string> = { USD: '$', INR: '₹', GBP: '£' };
  return `${symbols[currency] ?? '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getTaxNote(currency: string) {
  if (currency === 'INR') {
    return 'Sadik Studio operates as a freelance sole proprietorship. Annual turnover is below the GST registration threshold of ₹20 lakhs under the CGST Act, 2017. GST is not applicable and not charged. This is not a tax invoice.';
  }
  if (currency === 'GBP') {
    return 'Issued by Sadik Studio (India) for international services. As a non-UK entity, UK VAT is not applicable. Under the reverse charge mechanism, the client may be responsible for accounting for VAT in their jurisdiction.';
  }
  return 'Issued by Sadik Studio (India) for international services. No US sales tax or VAT is applicable on services exported from India. The client is responsible for any applicable local taxes in their jurisdiction.';
}

export const PDF_STYLES = `
  @page { size: A4; margin: 0; }
  @media print {
    html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #1a1a1a; background: #fff;
    width: 210mm; min-height: 297mm; position: relative;
    font-size: 11px; line-height: 1.5;
  }

  /* ── Letterhead ─────────────────────── */
  .letterhead {
    padding: 32px 48px;
    display: flex; justify-content: space-between; align-items: flex-start;
    border-bottom: 3px solid #111;
  }
  .lh-brand { font-size: 20px; font-weight: 700; color: #111; letter-spacing: -0.5px; }
  .lh-tagline { font-size: 9px; color: #999; margin-top: 3px; letter-spacing: 1px; text-transform: uppercase; }
  .lh-details { text-align: right; font-size: 9px; line-height: 1.8; color: #666; }

  /* ── Content ─────────────────────────── */
  .content { padding: 32px 48px 80px; }

  /* ── Doc header ──────────────────────── */
  .doc-header { margin-bottom: 32px; }
  .doc-type { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px; color: #999; }
  .doc-number-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px; }
  .doc-number { font-size: 24px; font-weight: 700; color: #111; letter-spacing: -0.5px; }
  .doc-date { font-size: 11px; color: #888; }

  /* ── Info grid ───────────────────────── */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
  .info-block {}
  .info-block h4 { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 8px; }
  .info-block p { font-size: 11px; line-height: 1.7; color: #333; }
  .info-block strong { color: #111; font-weight: 600; }

  /* ── Table ────────────────────────────── */
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead th {
    text-align: left; font-size: 8px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: #999; padding: 8px 0; border-bottom: 2px solid #111;
  }
  thead th:last-child { text-align: right; }
  thead th:first-child { width: 40px; }
  tbody td { padding: 12px 0; font-size: 11px; color: #333; border-bottom: 1px solid #eee; vertical-align: top; }
  tbody td:last-child { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; color: #111; }
  tbody td:first-child { color: #999; }

  /* ── Totals ──────────────────────────── */
  .totals { display: flex; justify-content: flex-end; margin-bottom: 28px; }
  .totals-box { width: 220px; }
  .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 11px; color: #666; }
  .totals-row span:last-child { font-variant-numeric: tabular-nums; }
  .totals-row.total {
    border-top: 2px solid #111; padding-top: 10px; margin-top: 6px;
    font-size: 15px; font-weight: 700; color: #111;
  }

  /* ── Tags ─────────────────────────────── */
  .tags { display: flex; gap: 6px; margin-bottom: 28px; flex-wrap: wrap; }
  .tag {
    padding: 4px 10px; font-size: 8px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.5px; border: 1px solid #ddd; border-radius: 3px; color: #555;
  }

  /* ── Terms ────────────────────────────── */
  .terms { margin-bottom: 20px; }
  .terms h4 {
    font-size: 8px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: #999; margin-bottom: 10px;
  }
  .terms p, .terms li { font-size: 9.5px; color: #555; line-height: 1.8; }
  .terms ul { padding-left: 16px; margin-top: 4px; }
  .tax-note {
    margin-top: 16px; padding: 10px 14px;
    background: #f9f9f9; border-left: 2px solid #ddd;
  }
  .tax-note p { font-size: 8.5px; color: #888; line-height: 1.7; margin: 0; }

  /* ── Contract clauses ────────────────── */
  .clause { margin-bottom: 16px; page-break-inside: avoid; }
  .clause h5 { font-size: 11px; font-weight: 600; color: #111; margin-bottom: 4px; }
  .clause p { font-size: 10px; color: #444; line-height: 1.8; }
  .clause ul { padding-left: 16px; margin-top: 4px; }
  .clause ul li { font-size: 10px; color: #444; line-height: 1.8; }

  /* ── Signature block ─────────────────── */
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 48px; }
  .sig-block { padding-top: 8px; border-top: 1px solid #ccc; }
  .sig-name { font-size: 10px; font-weight: 600; color: #333; }
  .sig-role { font-size: 9px; color: #888; margin-top: 2px; }
  .sig-date { font-size: 9px; color: #888; margin-top: 12px; }

  /* ── Footer ──────────────────────────── */
  .doc-footer {
    position: absolute; bottom: 24px; left: 48px; right: 48px;
    padding-top: 10px; border-top: 1px solid #eee;
    display: flex; justify-content: space-between;
    font-size: 8px; color: #bbb;
  }

  /* ── Payment info box ────────────────── */
  .payment-box {
    margin-top: 20px; padding: 14px 16px;
    background: #f9f9f9; border: 1px solid #eee; border-radius: 4px;
  }
  .payment-box h4 { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 8px; }
  .payment-box p { font-size: 9.5px; color: #555; line-height: 1.8; }
`;

export function pdfShell(title: string, docNumber: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>${PDF_STYLES}</style>
</head>
<body>
  <div class="letterhead">
    <div>
      <div class="lh-brand">Sadik Studio</div>
      <div class="lh-tagline">Software Development</div>
    </div>
    <div class="lh-details">
      www.sadikstudio.in<br/>
      sadik5780@gmail.com<br/>
      Aurangabad, Maharashtra, India
    </div>
  </div>
  <div class="content">${body}</div>
  <div class="doc-footer">
    <span>Sadik Studio · www.sadikstudio.in</span>
    <span>${docNumber}</span>
  </div>
</body>
</html>`;
}

export function openPdfWindow(html: string, title: string) {
  const w = window.open('', '_blank', 'width=800,height=1000');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.document.title = title;
  setTimeout(() => w.print(), 400);
}
