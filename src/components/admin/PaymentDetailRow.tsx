'use client';

import { useState } from 'react';
import { formatPrice } from '@/data/pricing';
import type { PaymentRow } from '@/lib/payments/types';
import styles from './admin-shared.module.scss';

interface PaymentDetailRowProps {
  payment: PaymentRow;
}

const STATUS_LABELS: Record<PaymentRow['status'], { label: string; tone: string }> = {
  paid: { label: 'Paid', tone: 'badgeYes' },
  pending: { label: 'Pending', tone: 'badge' },
  failed: { label: 'Failed', tone: 'badgeNo' },
  cancelled: { label: 'Cancelled', tone: 'badgeNo' },
};

export default function PaymentDetailRow({ payment }: PaymentDetailRowProps) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_LABELS[payment.status];
  const currency = payment.currency === 'INR' ? 'inr' : 'usd';

  return (
    <>
      <tr>
        <td className={styles.titleCell}>
          {payment.name}
          <div className={styles.muted} style={{ fontSize: '12px', marginTop: '2px' }}>
            <a href={`mailto:${payment.email}`} style={{ color: 'inherit' }}>
              {payment.email}
            </a>
            {payment.phone ? ` · ${payment.phone}` : ''}
          </div>
        </td>
        <td>
          <span className={styles.badge}>{payment.service_label}</span>
        </td>
        <td className={styles.titleCell} style={{ whiteSpace: 'nowrap' }}>
          {formatPrice(Number(payment.amount), currency)}
          <div className={styles.muted} style={{ fontSize: '11px', marginTop: '2px' }}>
            {payment.currency}
          </div>
        </td>
        <td>
          <span
            className={`${styles.badge} ${
              status.tone === 'badgeYes'
                ? styles.badgeYes
                : status.tone === 'badgeNo'
                  ? styles.badgeNo
                  : styles.badge
            }`}
          >
            {status.label}
          </span>
        </td>
        <td className={styles.muted} style={{ whiteSpace: 'nowrap' }}>
          {new Date(payment.created_at).toLocaleString()}
        </td>
        <td style={{ textAlign: 'right' }}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse details' : 'View details'}
            title={expanded ? 'Collapse' : 'View details'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {expanded ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </svg>
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px 24px' }}>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <span className={styles.label} style={{ fontSize: '11px' }}>
                  Razorpay Order ID
                </span>
                <code
                  className={styles.muted}
                  style={{ fontSize: '12px', wordBreak: 'break-all' }}
                >
                  {payment.razorpay_order_id}
                </code>
              </div>
              <div className={styles.field}>
                <span className={styles.label} style={{ fontSize: '11px' }}>
                  Razorpay Payment ID
                </span>
                <code
                  className={styles.muted}
                  style={{ fontSize: '12px', wordBreak: 'break-all' }}
                >
                  {payment.razorpay_payment_id ?? '—'}
                </code>
              </div>
            </div>

            {payment.features && payment.features.length > 0 && (
              <div className={styles.field} style={{ marginTop: 12 }}>
                <span className={styles.label} style={{ fontSize: '11px' }}>
                  Selected features ({payment.features.length})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 6 }}>
                  {payment.features.map((f) => (
                    <span key={f} className={styles.badge}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {payment.failure_reason && (
              <div
                className={`${styles.alert} ${styles.alertError}`}
                style={{ marginTop: 12 }}
              >
                <strong>Failure reason:</strong> {payment.failure_reason}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
