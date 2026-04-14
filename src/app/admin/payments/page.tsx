import { listPayments } from '@/lib/payments/store';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import { hasRazorpayEnv } from '@/lib/payments/razorpay';
import PaymentDetailRow from '@/components/admin/PaymentDetailRow';
import styles from '@/components/admin/admin-shared.module.scss';

export default async function AdminPaymentsPage() {
  if (!hasServiceRoleEnv()) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Payments</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          Service role key not configured. Add{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> to view payments.
        </div>
      </div>
    );
  }

  const payments = await listPayments();

  const totals = payments.reduce(
    (acc, p) => {
      if (p.status === 'paid') {
        if (p.currency === 'INR') acc.inrPaid += Number(p.amount);
        if (p.currency === 'USD') acc.usdPaid += Number(p.amount);
        acc.paidCount += 1;
      }
      if (p.status === 'pending') acc.pendingCount += 1;
      if (p.status === 'failed') acc.failedCount += 1;
      return acc;
    },
    { inrPaid: 0, usdPaid: 0, paidCount: 0, pendingCount: 0, failedCount: 0 },
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Payments</h1>
          <p className={styles.pageSub}>
            {payments.length} total record{payments.length === 1 ? '' : 's'}{' '}
            {hasRazorpayEnv() ? '· Razorpay connected' : '· Razorpay not configured'}
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Received (INR)</span>
          <span className={styles.statValue}>
            ₹{totals.inrPaid.toLocaleString('en-IN')}
          </span>
          <span className={styles.statTrend}>{totals.paidCount} paid</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Received (USD)</span>
          <span className={styles.statValue}>
            ${totals.usdPaid.toLocaleString('en-US')}
          </span>
          <span className={styles.statTrend}>Across all USD payments</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pending</span>
          <span className={styles.statValue}>{totals.pendingCount}</span>
          <span className={styles.statTrend}>Orders started, not completed</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Failed</span>
          <span className={styles.statValue}>{totals.failedCount}</span>
          <span className={styles.statTrend}>Declined or signature invalid</span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <div className={styles.emptyTitle}>No payments yet</div>
          Successful and attempted payments will show up here with their signature verification status.
        </div>
      ) : (
        <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <PaymentDetailRow key={p.id} payment={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
