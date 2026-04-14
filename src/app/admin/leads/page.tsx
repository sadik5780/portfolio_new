import { listLeads } from '@/lib/content/leads';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import LeadRow from '@/components/admin/LeadRow';
import styles from '@/components/admin/admin-shared.module.scss';

export default async function AdminLeadsPage() {
  if (!hasServiceRoleEnv()) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Leads</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          Service role key not configured. Add{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> to view leads.
        </div>
      </div>
    );
  }

  const leads = await listLeads();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Leads</h1>
          <p className={styles.pageSub}>
            {leads.length} total submission{leads.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <div className={styles.emptyTitle}>No leads yet</div>
          Contact form submissions will show up here.
        </div>
      ) : (
        <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Project</th>
                <th>Budget</th>
                <th>Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
