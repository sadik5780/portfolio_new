'use client';

import { useState } from 'react';
import { pdfShell, openPdfWindow, formatDate } from '@/lib/pdf-letterhead';
import styles from './admin-shared.module.scss';

type DocType = 'sow' | 'nda' | 'agreement';

interface ClientInfo {
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientAddress: string;
  projectName: string;
  projectScope: string;
  startDate: string;
  endDate: string;
  totalCost: string;
  currency: 'USD' | 'INR' | 'GBP';
  milestones: string;
}

const DOC_TYPES: { value: DocType; label: string; desc: string }[] = [
  { value: 'sow', label: 'Statement of Work', desc: 'Project scope, deliverables, milestones, timeline, payment schedule' },
  { value: 'nda', label: 'Non-Disclosure Agreement', desc: 'Mutual confidentiality agreement protecting both parties' },
  { value: 'agreement', label: 'Service Agreement', desc: 'Full terms — IP ownership, liability, warranty, termination, dispute resolution' },
];

function todayISO() { return new Date().toISOString().slice(0, 10); }
function addDays(iso: string, days: number) { const d = new Date(iso); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); }

function buildSOW(c: ClientInfo) {
  const docNum = `SOW-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  return pdfShell(`SOW — ${c.projectName}`, docNum, `
    <div class="title-row"><h1>Statement of Work</h1><div class="doc-meta"><div class="num">${docNum}</div><div class="date">${formatDate(todayISO())}</div></div></div>
    <div class="info-grid">
      <div class="info-block"><h4>Service Provider</h4><p><strong>Sadik Shaikh</strong><br/>Sadik Studio<br/>Aurangabad, Maharashtra, India<br/>sadik5780@gmail.com</p></div>
      <div class="info-block"><h4>Client</h4><p><strong>${c.clientName}</strong><br/>${c.clientCompany || ''}${c.clientEmail ? '<br/>' + c.clientEmail : ''}${c.clientAddress ? '<br/>' + c.clientAddress : ''}</p></div>
    </div>

    <div class="clause"><h5>1. Project Overview</h5><p><strong>Project Name:</strong> ${c.projectName}<br/><br/>${c.projectScope || 'To be defined during the discovery phase.'}</p></div>

    <div class="clause"><h5>2. Scope of Work</h5><p>The Service Provider agrees to deliver the following:</p>
      <ul><li>Discovery and requirements gathering</li><li>UI/UX design (Figma mockups for approval)</li><li>Frontend and backend development</li><li>Testing, QA, and bug fixes</li><li>Production deployment and documentation</li><li>Source code and repository transfer</li><li>12 months of post-launch maintenance (bug fixes, dependency updates, minor changes)</li></ul>
    </div>

    <div class="clause"><h5>3. Timeline</h5><p><strong>Start Date:</strong> ${formatDate(c.startDate)}<br/><strong>Estimated Completion:</strong> ${formatDate(c.endDate)}<br/><br/>Weekly progress demos will be provided. Final delivery date may shift if scope changes are mutually agreed upon.</p></div>

    <div class="clause"><h5>4. Milestones & Deliverables</h5><p>${c.milestones || '1. Discovery & scoping (Week 1)\n2. Design approval (Week 2)\n3. Core development (Weeks 2-3)\n4. Testing & refinement (Week 4)\n5. Production deploy & handover (Week 4-5)'}</p></div>

    <div class="clause"><h5>5. Compensation</h5><p><strong>Total Project Cost:</strong> ${c.totalCost} ${c.currency}<br/><br/><strong>Payment Schedule:</strong></p>
      <ul><li>50% upon signing this SOW (non-refundable deposit)</li><li>50% upon final delivery and client approval</li></ul>
      <p>Payments via Stripe, Wise, or bank transfer. Late payments (beyond 14 days) subject to 1.5% monthly interest.</p>
    </div>

    <div class="clause"><h5>6. Change Requests</h5><p>Changes to the agreed scope will be documented in writing. Minor adjustments (under 2 hours of work) are included. Larger changes will be quoted separately and require written approval before work begins.</p></div>

    <div class="clause"><h5>7. Intellectual Property</h5><p>Upon full payment, all intellectual property rights, source code, design files, and documentation are transferred to the Client. The Service Provider retains the right to display the project in portfolio materials unless otherwise agreed in writing.</p></div>

    <div class="clause"><h5>8. Acceptance</h5><p>By signing below, both parties agree to the terms outlined in this Statement of Work.</p></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;">
      <div><div style="border-top:1px solid #ccc;padding-top:8px;margin-top:48px;font-size:10px;color:#888;">Sadik Shaikh — Sadik Studio<br/>Date: _______________</div></div>
      <div><div style="border-top:1px solid #ccc;padding-top:8px;margin-top:48px;font-size:10px;color:#888;">${c.clientName}${c.clientCompany ? ' — ' + c.clientCompany : ''}<br/>Date: _______________</div></div>
    </div>
  `);
}

function buildNDA(c: ClientInfo) {
  const docNum = `NDA-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  return pdfShell(`NDA — ${c.clientName}`, docNum, `
    <div class="title-row"><h1>Non-Disclosure Agreement</h1><div class="doc-meta"><div class="num">${docNum}</div><div class="date">${formatDate(todayISO())}</div></div></div>

    <p style="font-size:11px;color:#444;line-height:1.8;margin-bottom:20px;">This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of <strong>${formatDate(todayISO())}</strong> by and between:</p>

    <div class="info-grid">
      <div class="info-block"><h4>Party A (Service Provider)</h4><p><strong>Sadik Shaikh</strong><br/>Sadik Studio<br/>Aurangabad, Maharashtra, India</p></div>
      <div class="info-block"><h4>Party B (Client)</h4><p><strong>${c.clientName}</strong><br/>${c.clientCompany || ''}${c.clientAddress ? '<br/>' + c.clientAddress : ''}</p></div>
    </div>

    <div class="clause"><h5>1. Definition of Confidential Information</h5><p>"Confidential Information" means any non-public information disclosed by either party to the other, whether orally, in writing, or electronically, including but not limited to: business plans, product designs, source code, technical specifications, customer data, financial information, trade secrets, and proprietary methodologies.</p></div>

    <div class="clause"><h5>2. Obligations of Receiving Party</h5><p>The receiving party agrees to:</p>
      <ul><li>Hold all Confidential Information in strict confidence</li><li>Not disclose Confidential Information to any third party without prior written consent</li><li>Use Confidential Information solely for the purpose of evaluating or performing work under the business relationship</li><li>Take reasonable precautions to protect the confidentiality of the information (at minimum, the same care used for its own confidential information)</li></ul>
    </div>

    <div class="clause"><h5>3. Exclusions</h5><p>This Agreement does not apply to information that:</p>
      <ul><li>Is or becomes publicly available through no fault of the receiving party</li><li>Was already known to the receiving party prior to disclosure</li><li>Is independently developed by the receiving party without use of the Confidential Information</li><li>Is disclosed with the prior written approval of the disclosing party</li><li>Is required to be disclosed by law, regulation, or court order (with prompt notice to the disclosing party)</li></ul>
    </div>

    <div class="clause"><h5>4. Term</h5><p>This Agreement shall remain in effect for a period of <strong>2 (two) years</strong> from the date of execution. The obligations of confidentiality shall survive the termination of this Agreement for a period of 2 years.</p></div>

    <div class="clause"><h5>5. Return of Materials</h5><p>Upon termination of this Agreement or upon request by the disclosing party, the receiving party shall promptly return or destroy all copies of Confidential Information in its possession and certify such destruction in writing upon request.</p></div>

    <div class="clause"><h5>6. No License</h5><p>Nothing in this Agreement grants any license or right to use the Confidential Information except as expressly stated herein. No intellectual property rights are transferred by this Agreement.</p></div>

    <div class="clause"><h5>7. Governing Law</h5><p>This Agreement shall be governed by the laws of India. Any disputes arising under this Agreement shall be resolved through arbitration in Aurangabad, Maharashtra, India, unless both parties agree to an alternative jurisdiction in writing.</p></div>

    <div class="clause"><h5>8. Entire Agreement</h5><p>This Agreement constitutes the entire understanding between the parties regarding confidentiality and supersedes all prior discussions, agreements, or understandings of any kind.</p></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:36px;">
      <div><div style="border-top:1px solid #ccc;padding-top:8px;margin-top:48px;font-size:10px;color:#888;">Sadik Shaikh — Sadik Studio<br/>Date: _______________</div></div>
      <div><div style="border-top:1px solid #ccc;padding-top:8px;margin-top:48px;font-size:10px;color:#888;">${c.clientName}${c.clientCompany ? ' — ' + c.clientCompany : ''}<br/>Date: _______________</div></div>
    </div>
  `);
}

function buildAgreement(c: ClientInfo) {
  const docNum = `SA-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  return pdfShell(`Service Agreement — ${c.clientName}`, docNum, `
    <div class="title-row"><h1>Service Agreement</h1><div class="doc-meta"><div class="num">${docNum}</div><div class="date">${formatDate(todayISO())}</div></div></div>

    <p style="font-size:11px;color:#444;line-height:1.8;margin-bottom:20px;">This Service Agreement ("Agreement") is entered into as of <strong>${formatDate(todayISO())}</strong> between the following parties:</p>

    <div class="info-grid">
      <div class="info-block"><h4>Service Provider</h4><p><strong>Sadik Shaikh</strong><br/>d/b/a Sadik Studio<br/>Aurangabad, Maharashtra, India<br/>sadik5780@gmail.com</p></div>
      <div class="info-block"><h4>Client</h4><p><strong>${c.clientName}</strong><br/>${c.clientCompany || ''}${c.clientEmail ? '<br/>' + c.clientEmail : ''}${c.clientAddress ? '<br/>' + c.clientAddress : ''}</p></div>
    </div>

    <div class="clause"><h5>1. Services</h5><p>The Service Provider agrees to perform web development, software engineering, and related digital services as described in the accompanying Statement of Work (SOW). The specific deliverables, timeline, and scope are defined in the SOW, which is incorporated by reference into this Agreement.</p></div>

    <div class="clause"><h5>2. Compensation & Payment</h5>
      <ul><li>Total fees as specified in the SOW or Quote</li><li>50% deposit due upon signing; remaining 50% upon delivery</li><li>Payments via Stripe, Wise, or bank transfer</li><li>Late payments (beyond 14 days past due) incur 1.5% monthly interest</li><li>Work may be paused if invoices remain unpaid for more than 30 days</li></ul>
    </div>

    <div class="clause"><h5>3. Intellectual Property</h5><p>Upon receipt of full payment:</p>
      <ul><li>All source code, designs, and documentation become the exclusive property of the Client</li><li>The Service Provider retains no rights to the delivered work except portfolio display rights</li><li>Third-party libraries and open-source components retain their original licenses</li><li>The Service Provider retains the right to use general knowledge, skills, and techniques acquired during the engagement</li></ul>
    </div>

    <div class="clause"><h5>4. Warranty & Maintenance</h5>
      <ul><li>12 months of post-launch maintenance included at no additional cost</li><li>Maintenance covers: bug fixes, security patches, dependency updates, and minor UI adjustments</li><li>Maintenance does NOT cover: new features, major redesigns, or third-party API changes beyond the Service Provider's control</li><li>After the 12-month period, maintenance is available at the Service Provider's then-current hourly rate</li></ul>
    </div>

    <div class="clause"><h5>5. Limitation of Liability</h5><p>The Service Provider's total liability under this Agreement shall not exceed the total fees paid by the Client. In no event shall either party be liable for indirect, incidental, consequential, or punitive damages, including lost profits or data, even if advised of the possibility of such damages.</p></div>

    <div class="clause"><h5>6. Confidentiality</h5><p>Both parties agree to maintain confidentiality of proprietary information shared during the engagement. A separate NDA may be executed if required. The obligations outlined in any signed NDA are incorporated by reference.</p></div>

    <div class="clause"><h5>7. Termination</h5>
      <ul><li>Either party may terminate this Agreement with 14 days written notice</li><li>Upon termination, the Client pays for all work completed up to the termination date</li><li>The initial 50% deposit is non-refundable once work has commenced</li><li>All completed deliverables and source code will be transferred to the Client upon payment</li></ul>
    </div>

    <div class="clause"><h5>8. Independent Contractor</h5><p>The Service Provider is an independent contractor, not an employee, partner, or agent of the Client. The Service Provider is responsible for their own taxes, insurance, and statutory obligations. No employment relationship is created by this Agreement.</p></div>

    <div class="clause"><h5>9. Force Majeure</h5><p>Neither party shall be liable for delays or failures in performance resulting from circumstances beyond their reasonable control, including but not limited to natural disasters, government actions, internet outages, or pandemic-related disruptions.</p></div>

    <div class="clause"><h5>10. Governing Law & Disputes</h5><p>This Agreement is governed by the laws of India. Disputes shall first be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to binding arbitration in Aurangabad, Maharashtra, India, under the Arbitration and Conciliation Act, 1996. For international clients, the parties may mutually agree to an alternative arbitration venue.</p></div>

    <div class="clause"><h5>11. Entire Agreement</h5><p>This Agreement, together with any referenced SOW, NDA, and Quote, constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements. Amendments must be in writing and signed by both parties.</p></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:32px;">
      <div><div style="border-top:1px solid #ccc;padding-top:8px;margin-top:48px;font-size:10px;color:#888;">Sadik Shaikh — Sadik Studio<br/>Date: _______________</div></div>
      <div><div style="border-top:1px solid #ccc;padding-top:8px;margin-top:48px;font-size:10px;color:#888;">${c.clientName}${c.clientCompany ? ' — ' + c.clientCompany : ''}<br/>Date: _______________</div></div>
    </div>
  `);
}

export default function DocumentGenerator() {
  const [docType, setDocType] = useState<DocType>('sow');
  const [client, setClient] = useState<ClientInfo>({
    clientName: '', clientEmail: '', clientCompany: '', clientAddress: '',
    projectName: '', projectScope: '', startDate: todayISO(),
    endDate: addDays(todayISO(), 30), totalCost: '', currency: 'USD',
    milestones: '',
  });

  const update = <K extends keyof ClientInfo>(k: K, v: ClientInfo[K]) => setClient((s) => ({ ...s, [k]: v }));

  const handleExport = () => {
    let html = '';
    if (docType === 'sow') html = buildSOW(client);
    else if (docType === 'nda') html = buildNDA(client);
    else html = buildAgreement(client);
    openPdfWindow(html, `${docType.toUpperCase()} — ${client.clientName || 'Client'}`);
  };

  return (
    <div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Document Type</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DOC_TYPES.map((d) => (
            <button
              key={d.value}
              type="button"
              className={styles.btn}
              style={docType === d.value ? { background: 'rgba(41,151,255,0.15)', borderColor: 'rgba(41,151,255,0.4)', color: '#2997ff' } : {}}
              onClick={() => setDocType(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className={styles.muted} style={{ marginTop: '8px', fontSize: '13px' }}>
          {DOC_TYPES.find((d) => d.value === docType)?.desc}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Client Details</h3>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Client Name *</label><input className={styles.input} value={client.clientName} onChange={(e) => update('clientName', e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Email</label><input className={styles.input} value={client.clientEmail} onChange={(e) => update('clientEmail', e.target.value)} /></div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.field}><label className={styles.label}>Company</label><input className={styles.input} value={client.clientCompany} onChange={(e) => update('clientCompany', e.target.value)} /></div>
          <div className={styles.field}><label className={styles.label}>Address</label><input className={styles.input} value={client.clientAddress} onChange={(e) => update('clientAddress', e.target.value)} placeholder="City, Country" /></div>
        </div>
      </div>

      {docType === 'sow' && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Project Details</h3>
          <div className={styles.formRow}>
            <div className={styles.field}><label className={styles.label}>Project Name</label><input className={styles.input} value={client.projectName} onChange={(e) => update('projectName', e.target.value)} placeholder="E-commerce SaaS MVP" /></div>
            <div className={styles.field}><label className={styles.label}>Currency</label>
              <select className={styles.select} value={client.currency} onChange={(e) => update('currency', e.target.value as ClientInfo['currency'])}>
                <option value="USD">USD ($)</option><option value="INR">INR (₹)</option><option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
          <div className={styles.field}><label className={styles.label}>Project Scope</label>
            <textarea className={styles.textarea} value={client.projectScope} onChange={(e) => update('projectScope', e.target.value)} rows={4} placeholder="Describe the project scope, features, and deliverables..." />
          </div>
          <div className={styles.formRow}>
            <div className={styles.field}><label className={styles.label}>Start Date</label><input type="date" className={styles.input} value={client.startDate} onChange={(e) => update('startDate', e.target.value)} /></div>
            <div className={styles.field}><label className={styles.label}>End Date</label><input type="date" className={styles.input} value={client.endDate} onChange={(e) => update('endDate', e.target.value)} /></div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.field}><label className={styles.label}>Total Cost</label><input className={styles.input} value={client.totalCost} onChange={(e) => update('totalCost', e.target.value)} placeholder="10,000" /></div>
            <div className={styles.field} />
          </div>
          <div className={styles.field}><label className={styles.label}>Milestones (optional)</label>
            <textarea className={styles.textarea} value={client.milestones} onChange={(e) => update('milestones', e.target.value)} rows={4} placeholder="1. Discovery & scoping (Week 1)&#10;2. Design approval (Week 2)&#10;3. Core development (Weeks 2-3)&#10;4. Launch (Week 4)" />
          </div>
        </div>
      )}

      <div className={styles.saveBar}>
        <div />
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleExport} disabled={!client.clientName.trim()}>
          Export A4 PDF
        </button>
      </div>
    </div>
  );
}
