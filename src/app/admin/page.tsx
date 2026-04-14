import Link from 'next/link';
import { getSupabaseAdmin, hasServiceRoleEnv } from '@/lib/supabase/server';
import styles from '@/components/admin/admin-shared.module.scss';

interface AdminStats {
  projects: number;
  featured: number;
  leads: number;
  leadsWeek: number;
}

async function getStats(): Promise<AdminStats & { missingTables: boolean }> {
  if (!hasServiceRoleEnv()) {
    return { projects: 0, featured: 0, leads: 0, leadsWeek: 0, missingTables: false };
  }

  const supabase = getSupabaseAdmin();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [projectCount, featuredCount, leadCount, leadsWeekCount] =
    await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo),
    ]);

  const missingTables = [
    projectCount.error,
    featuredCount.error,
    leadCount.error,
    leadsWeekCount.error,
  ].some((e) => e && /schema cache|does not exist/i.test(e.message));

  return {
    projects: projectCount.count ?? 0,
    featured: featuredCount.count ?? 0,
    leads: leadCount.count ?? 0,
    leadsWeek: leadsWeekCount.count ?? 0,
    missingTables,
  };
}

async function getRecentLeads() {
  if (!hasServiceRoleEnv()) return [];
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('leads')
    .select('id,name,email,project_type,created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  return data ?? [];
}

export default async function AdminDashboard() {
  const [stats, recentLeads] = await Promise.all([getStats(), getRecentLeads()]);
  const configured = hasServiceRoleEnv();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSub}>Overview of your portfolio.</p>
        </div>
      </div>

      {!configured && (
        <div
          className={`${styles.alert} ${styles.alertInfo}`}
          style={{ marginBottom: '1.5rem' }}
        >
          <strong>Service role key not configured.</strong> Add{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code>{' '}
          (Supabase Dashboard → Project Settings → API → service_role), then
          restart the dev server. Without it, admin writes and the Leads
          section will not work.
        </div>
      )}

      {configured && stats.missingTables && (
        <div
          className={`${styles.alert} ${styles.alertInfo}`}
          style={{ marginBottom: '1.5rem' }}
        >
          <strong>Database tables not created yet.</strong> Open your Supabase
          dashboard → <em>SQL Editor</em> → paste the contents of{' '}
          <code>supabase/schema.sql</code> and click <em>Run</em>. Then paste{' '}
          <code>supabase/migrations/001_payments.sql</code> and run it too.
          Refresh this page after both complete.
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total projects</span>
          <span className={styles.statValue}>{stats.projects}</span>
          <span className={styles.statTrend}>
            {stats.featured} featured on homepage
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total leads</span>
          <span className={styles.statValue}>{stats.leads}</span>
          <span className={styles.statTrend}>
            {stats.leadsWeek} new in the last 7 days
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Conversion path</span>
          <span className={styles.statValue}>
            {stats.leads > 0
              ? Math.round((stats.leadsWeek / stats.leads) * 100)
              : 0}
            %
          </span>
          <span className={styles.statTrend}>Recent share of total leads</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Status</span>
          <span className={styles.statValue} style={{ fontSize: '1.25rem' }}>
            {configured ? 'Connected' : 'Not configured'}
          </span>
          <span className={styles.statTrend}>
            {configured ? 'Supabase reachable' : 'Add service-role key'}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.pageHeader} style={{ margin: 0 }}>
          <h2 className={styles.sectionTitle}>Recent leads</h2>
          <Link href="/admin/leads" className={styles.btn}>
            View all
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className={`${styles.card} ${styles.empty}`}>
            <div className={styles.emptyTitle}>No leads yet</div>
            Contact form submissions will appear here.
          </div>
        ) : (
          <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Project type</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className={styles.titleCell}>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.project_type || '—'}</td>
                    <td className={styles.muted}>
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick actions</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin/projects/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            + New project
          </Link>
          <Link href="/admin/content" className={styles.btn}>
            Edit site content
          </Link>
          <Link href="/admin/pricing" className={styles.btn}>
            Update pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
