import { usePlatform } from '../../contexts/PlatformContext';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, UserCheck, CalendarCheck, Award, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import dashStyles from '../../styles/dashboard.module.css';

export default function ManagerDashboard() {
  const { employees, leaveRequests, attendance, departments } = usePlatform();
  const { user } = useAuth();

  // If an Admin user visits /manager/dashboard, seamlessly redirect to /admin/dashboard so URL matches Admin Portal
  if (user?.role === 'Admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Manager is scoped strictly to Engineering department
  const MY_DEPT = 'Engineering';
  const myTeam = employees.filter(e => e.department === MY_DEPT);
  const myLeaves = leaveRequests.filter(l => l.department === MY_DEPT && l.status === 'Pending');
  const myDeptInfo = departments.find(d => d.name === MY_DEPT) || { budget: 2000000, headCount: myTeam.length, openPositions: 3 };
  const avgPerformance = Math.round(myTeam.reduce((acc, e) => acc + e.performanceScore, 0) / (myTeam.length || 1));

  const roleDistribution = myTeam.reduce((acc: any, e) => {
    acc[e.role] = (acc[e.role] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(roleDistribution).map(([role, count]) => ({
    role,
    Staff: count
  }));

  const perfTrend = [
    { month: 'Q1', score: 76 },
    { month: 'Q2', score: 79 },
    { month: 'Q3', score: 82 },
    { month: 'Q4', score: avgPerformance },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.12))', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#3b82f6', color: 'white', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <Users size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{MY_DEPT} Department Manager Portal</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Scoped views for team headcounts, active leave requests, and direct report evaluation metrics.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' }}>
            <Users size={22} color="#3b82f6" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Team Roster Size</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{myTeam.length} staff</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' }}>
            <CalendarCheck size={22} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending Leave Reqs</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{myLeaves.length} action req.</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' }}>
            <Award size={22} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg Dept KPI Score</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{avgPerformance} / 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700 }}>Team Roster Allocation by Job Title</h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="roleBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.85}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="role" stroke="var(--text-secondary)" fontSize={11} interval={0} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.12)', radius: 6 }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #38bdf8', 
                    borderRadius: '12px',
                    color: '#ffffff',
                    padding: '12px 16px',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
                    opacity: 1
                  }}
                  labelStyle={{ fontWeight: 800, color: '#38bdf8', marginBottom: '6px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 800, fontSize: '1rem', opacity: 1 }}
                />
                <Bar dataKey="Staff" fill="url(#roleBarGradient)" radius={[8, 8, 0, 0]} maxBarSize={45} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700 }}>Quarterly Department Performance Trajectory</h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perfTrend} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.15)', 
                    borderRadius: '10px',
                    color: '#ffffff',
                    padding: '10px 14px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.45)'
                  }}
                  labelStyle={{ fontWeight: 700, color: '#34d399', marginBottom: '4px', fontSize: '0.85rem' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 700 }}
                />
                <Line type="monotone" dataKey="score" name="Perf Score" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 8 }} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Team Overview Table */}
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 700 }}>Direct Report Roster Summary (Top Performers)</h3>
        <div className={dashStyles.tableWrapper}>
          <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '12px 14px' }}>Employee Name</th>
                <th style={{ padding: '12px 14px' }}>Job Role</th>
                <th style={{ padding: '12px 14px' }}>Work Location</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Performance Score</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myTeam.slice(0, 10).map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{emp.name}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{emp.role}</td>
                  <td style={{ padding: '12px 14px' }}>{emp.location}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: '#10b981' }}>{emp.performanceScore} / 100</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
