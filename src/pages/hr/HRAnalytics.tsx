import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, BarChart2, Filter } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function HRAnalytics() {
  const { employees, departments, exportToCSV } = usePlatform();
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredEmployees = selectedDept === 'All' 
    ? employees 
    : employees.filter(e => e.department === selectedDept);

  const deptHeadcountData = departments.map(d => ({
    name: d.name,
    Headcount: d.headCount,
    BudgetM: Number((d.budget / 1000000).toFixed(2))
  }));

  const riskPieData = [
    { name: 'Low Risk (Retained)', value: filteredEmployees.filter(e => e.riskLevel === 'low').length },
    { name: 'Medium Risk', value: filteredEmployees.filter(e => e.riskLevel === 'medium').length },
    { name: 'High Risk (Flagged)', value: filteredEmployees.filter(e => e.riskLevel === 'high').length },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart2 size={26} color="#10b981" /> HR Analytics, Insights & Workforce Reports
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Deep dive into compensation distribution, retention projections, and filtered employee datasets.
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filteredEmployees.slice(0, 1000), `hr_filtered_workforce_${selectedDept}_${new Date().toISOString().slice(0, 10)}`)}
          style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={18} /> Export Filtered Dataset (CSV)
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Filter size={20} color="var(--text-secondary)" />
        <span style={{ fontWeight: 600 }}>Filter Analytics Scope:</span>
        <select
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 700 }}
        >
          <option value="All">Organization Universal (All Departments)</option>
          {departments.map(d => <option key={d.name} value={d.name}>{d.name} Hub</option>)}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Active Dataset Rows: <strong>{filteredEmployees.length.toLocaleString()} staff records</strong>
        </span>
      </div>

      {/* Charts section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700 }}>Departmental Headcount Allocation</h3>
          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptHeadcountData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="Headcount" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700 }}>Retention Risk Segmentation</h3>
          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={5} dataKey="value" label>
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 700 }}>Filtered Employee Census Report Preview</h3>
        <div className={dashStyles.tableWrapper}>
          <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '12px 14px' }}>Employee ID</th>
                <th style={{ padding: '12px 14px' }}>Staff Name</th>
                <th style={{ padding: '12px 14px' }}>Department</th>
                <th style={{ padding: '12px 14px' }}>Role Title</th>
                <th style={{ padding: '12px 14px' }}>Facility Location</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Annual Compensation</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.slice(0, 20).map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{emp.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{emp.name}</td>
                  <td style={{ padding: '12px 14px' }}>{emp.department}</td>
                  <td style={{ padding: '12px 14px' }}>{emp.role}</td>
                  <td style={{ padding: '12px 14px' }}>{emp.location}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>${emp.salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Showing top 20 rows of {filteredEmployees.length} matching criteria. Click Export Filtered Dataset above to download full CSV.
        </div>
      </div>
    </div>
  );
}
