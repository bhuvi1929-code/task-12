import Dashboard from '../Dashboard';
import { usePlatform } from '../../contexts/PlatformContext';
import { ShieldCheck, Users, Building2, Activity, Terminal } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function AdminDashboard() {
  const { systemUsers, departments, auditLogs } = usePlatform();
  const activeUsersCount = systemUsers.filter(u => u.active).length;
  const totalBudgets = departments.reduce((acc, d) => acc + d.budget, 0);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12))', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#6366f1', color: 'white', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Admin Portal Home Dashboard</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Organization-wide workforce telemetry, access management, and infrastructure KPIs.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '150px' }}>
            <Users size={22} color="#3b82f6" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Admins/Users</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{activeUsersCount} / {systemUsers.length}</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '150px' }}>
            <Building2 size={22} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Global Budget</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>${(totalBudgets / 1000000).toFixed(1)}M</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '150px' }}>
            <Activity size={22} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Audit Events</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{auditLogs.length} logged</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Organization Workforce Analytics Dashboard */}
      <Dashboard />
    </div>
  );
}
