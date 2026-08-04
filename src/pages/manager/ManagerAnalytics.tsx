import { usePlatform } from '../../contexts/PlatformContext';
import { BarChart2, Download, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import dashStyles from '../../styles/dashboard.module.css';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

export default function ManagerAnalytics() {
  const { employees, exportToCSV } = usePlatform();
  const MY_DEPT = 'Engineering';
  const myTeam = employees.filter(e => e.department === MY_DEPT);

  const roleSalary = myTeam.reduce((acc: any, e) => {
    if (!acc[e.role]) acc[e.role] = { total: 0, count: 0 };
    acc[e.role].total += e.salary;
    acc[e.role].count += 1;
    return acc;
  }, {});

  const salaryChartData = Object.entries(roleSalary).map(([role, val]: [string, any]) => ({
    role,
    AvgSalary: Math.round(val.total / val.count)
  }));

  const locationDist = myTeam.reduce((acc: any, e) => {
    acc[e.location] = (acc[e.location] || 0) + 1;
    return acc;
  }, {});

  const locPieData = Object.entries(locationDist).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart2 size={26} color="#3b82f6" /> {MY_DEPT} Department Analytics & Reports Export
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Analyze departmental salary distributions, regional hub team density, and generate team CSV exports.
          </p>
        </div>
        <button
          onClick={() => exportToCSV(myTeam, `engineering_team_report_${new Date().toISOString().slice(0, 10)}`)}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={18} /> Export Department Dataset (CSV)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700 }}>Average Compensation by Job Title ($ USD)</h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryChartData} margin={{ top: 10, right: 10, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.85}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="role" stroke="var(--text-secondary)" fontSize={11} interval={0} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
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
                  labelStyle={{ fontWeight: 800, color: '#60a5fa', marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.9rem' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 800, fontSize: '1rem', opacity: 1 }}
                />
                <Bar dataKey="AvgSalary" name="Avg Salary ($)" fill="url(#salaryGrad)" radius={[8, 8, 0, 0]} maxBarSize={45} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700 }}>Team Roster Geographic Hub Density</h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={locPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={5} dataKey="value" label>
                  {locPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.15)', 
                    borderRadius: '10px',
                    color: '#ffffff',
                    padding: '10px 14px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.45)' 
                  }}
                  itemStyle={{ color: '#ffffff', fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 700 }}>Complete {MY_DEPT} Roster Dataset Report</h3>
        <div className={dashStyles.tableWrapper}>
          <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '12px 14px' }}>Emp ID</th>
                <th style={{ padding: '12px 14px' }}>Name</th>
                <th style={{ padding: '12px 14px' }}>Title</th>
                <th style={{ padding: '12px 14px' }}>Location</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Compensation</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Perf Rating</th>
              </tr>
            </thead>
            <tbody>
              {myTeam.slice(0, 15).map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{emp.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{emp.name}</td>
                  <td style={{ padding: '12px 14px' }}>{emp.role}</td>
                  <td style={{ padding: '12px 14px' }}>{emp.location}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>${emp.salary.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: '#3b82f6' }}>{emp.performanceScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
