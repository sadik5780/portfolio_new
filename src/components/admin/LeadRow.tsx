'use client';

import { useState } from 'react';
import DeleteButton from './DeleteButton';
import type { Lead } from '@/lib/content/types';
import styles from './admin-shared.module.scss';

interface LeadRowProps {
  lead: Lead;
}

export default function LeadRow({ lead }: LeadRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr>
        <td className={styles.titleCell}>
          {lead.name}
          <div className={styles.muted} style={{ fontSize: '12px', marginTop: '2px' }}>
            <a href={`mailto:${lead.email}`} style={{ color: 'inherit' }}>
              {lead.email}
            </a>
          </div>
        </td>
        <td>
          {lead.project_type ? (
            <span className={styles.badge}>{lead.project_type}</span>
          ) : (
            <span className={styles.muted}>—</span>
          )}
        </td>
        <td className={styles.muted}>{lead.budget || '—'}</td>
        <td className={styles.muted} style={{ whiteSpace: 'nowrap' }}>
          {new Date(lead.created_at).toLocaleString()}
        </td>
        <td style={{ textAlign: 'right' }}>
          <div className={styles.rowActions}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={expanded ? 'Hide message' : 'View message'}
              title={expanded ? 'Hide message' : 'View message'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <a
              href={`mailto:${lead.email}?subject=Re: ${lead.project_type ?? 'your project'}`}
              className={styles.iconBtn}
              title="Reply"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 17 4 12 9 7" />
                <path d="M20 18v-2a4 4 0 00-4-4H4" />
              </svg>
            </a>
            <DeleteButton
              url={`/api/admin/leads/${lead.id}`}
              confirmText={`Delete lead from "${lead.name}"? This cannot be undone.`}
              icon
              label={`Delete lead from ${lead.name}`}
            />
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div
              style={{
                padding: '4px 0',
                whiteSpace: 'pre-wrap',
                color: '#fafafa',
                lineHeight: 1.65,
                fontSize: '14px',
              }}
            >
              {lead.message}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
