import Dashboard from '../Dashboard';
import { usePlatform } from '../../contexts/PlatformContext';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, UserCheck, UserPlus, CalendarCheck, Award, ShieldCheck } from 'lucide-react';

export default function HRDashboard() {
  const { employees, leaveRequests, jobPostings } = usePlatform();
  const { user } = useAuth();
  
  // If an Admin user visits /hr/dashboard, seamlessly redirect to /admin/dashboard so URL matches Admin Portal
  if (user?.role === 'Admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const activeCount = employees.filter(e => e.status === 'active').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const openJobs = jobPostings.filter(j => j.status === 'Open').reduce((acc, j) => acc + j.positions, 0);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12))', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#10b981', color: 'white', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <Users size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>HR Workforce Operations & Talent Dashboard</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Workforce census analytics, talent acquisition pipelines, and retention metrics.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' }}>
            <UserCheck size={22} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Retention Rate</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>96.4%</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' }}>
            <UserPlus size={22} color="#3b82f6" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Open Vacancies</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{openJobs} roles</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' }}>
            <CalendarCheck size={22} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending Leaves</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{pendingLeaves} reqs</div>
            </div>
          </div>
        </div>
      </div>

      <Dashboard />
    </div>
  );
}
