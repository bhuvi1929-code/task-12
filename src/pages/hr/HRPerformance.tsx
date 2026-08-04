import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { TrendingUp, AlertTriangle, Award, GraduationCap, Download, Filter } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function HRPerformance() {
  const { employees, exportToCSV, departments } = usePlatform();
  const [selectedDept, setSelectedDept] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  const filteredEmployees = employees.filter(emp => {
    if (selectedDept !== 'All' && emp.department !== selectedDept) return false;
    if (riskFilter !== 'All' && emp.riskLevel !== riskFilter) return false;
    return true;
  });

  const highRiskCount = filteredEmployees.filter(e => e.riskLevel === 'high').length;
  const avgPerf = Math.round(filteredEmployees.reduce((acc, e) => acc + e.performanceScore, 0) / (filteredEmployees.length || 1));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={26} color="#10b981" /> Workforce Performance & Attrition Risk Monitor
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Identify top organizational contributors, monitor training completion, and intercept voluntary attrition risks.
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filteredEmployees.slice(0, 500), `attrition_risk_performance_${new Date().toISOString().slice(0, 10)}`)}
          style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={18} /> Export Performance Report
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Award size={32} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Average Performance Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{avgPerf} / 100</div>
          </div>
        </div>
        
        <div style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={32} color="#ef4444" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>High Attrition Risk Staff</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{highRiskCount} flagged</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GraduationCap size={32} color="#3b82f6" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Training Completion</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>78.4%</div>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Filter size={18} color="var(--text-secondary)" />
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Slice Evaluation Data:</span>
        <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}>
          <option value="All">All Departments</option>
          {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
        </select>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}>
          <option value="All">All Risk Tiers</option>
          <option value="low">Low Attrition Risk</option>
          <option value="medium">Medium Attrition Risk</option>
          <option value="high">High Attrition Risk</option>
        </select>
      </div>

      {/* Table */}
      <div className={dashStyles.tableWrapper}>
        <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Employee</th>
              <th style={{ padding: '12px 16px' }}>Department</th>
              <th style={{ padding: '12px 16px' }}>Performance Rating</th>
              <th style={{ padding: '12px 16px' }}>Training Completion</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Attrition Risk Tier</th>
              <th style={{ padding: '12px 16px' }}>Recommended HR Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.slice(0, 25).map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{emp.name}</td>
                <td style={{ padding: '14px 16px' }}>{emp.department}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '4px', maxWidth: '80px', overflow: 'hidden' }}>
                      <div style={{ width: `${emp.performanceScore}%`, height: '100%', background: emp.performanceScore > 75 ? '#10b981' : '#f59e0b' }}></div>
                    </div>
                    <span style={{ fontWeight: 700 }}>{emp.performanceScore}/100</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{emp.trainingCompletion}% completed</td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase',
                    background: emp.riskLevel === 'high' ? 'rgba(239,68,68,0.15)' : emp.riskLevel === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                    color: emp.riskLevel === 'high' ? '#ef4444' : emp.riskLevel === 'medium' ? '#f59e0b' : '#10b981' 
                  }}>
                    {emp.riskLevel} Risk
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: emp.riskLevel === 'high' ? '#ef4444' : 'var(--text-secondary)', fontWeight: emp.riskLevel === 'high' ? 700 : 500, fontSize: '0.85rem' }}>
                  {emp.riskLevel === 'high' ? '⚠️ Schedule retention engagement meeting immediately' : 'Standard bi-annual check-in appropriate'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
