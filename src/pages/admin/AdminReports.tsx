import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { FileSpreadsheet, Download, Filter, FileText, BarChart2 } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function AdminReports() {
  const { employees, departments, exportToCSV } = usePlatform();
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredEmployees = employees.filter(emp => {
    if (selectedDept !== 'All' && emp.department !== selectedDept) return false;
    if (selectedStatus !== 'All' && emp.status !== selectedStatus) return false;
    return true;
  });

  const handleExportEmployees = () => {
    exportToCSV(filteredEmployees.slice(0, 1000), `org_workforce_export_${selectedDept}_${new Date().toISOString().slice(0, 10)}`);
  };

  const handleExportDepartments = () => {
    exportToCSV(departments, `org_departments_budget_${new Date().toISOString().slice(0, 10)}`);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileSpreadsheet size={26} color="#6366f1" /> Organization-Wide Analytics & Reports Export
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
          Generate customized workforce census data, departmental budget summaries, and compliance exports.
        </p>
      </div>

      {/* Quick Export Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#6366f1', fontWeight: 700, fontSize: '1.1rem' }}>
              <FileText size={22} /> Total Employee Master Database
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Contains all 10,000+ organization employee profiles with compensation, risk tiers, and performance records.
            </p>
          </div>
          <button
            onClick={handleExportEmployees}
            style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Download size={18} /> Export Filtered Employees ({filteredEmployees.length})
          </button>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>
              <BarChart2 size={22} /> Department & Budget Ledger
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Summary tables of regional headcount allocations, open positions, and annualized operational expenses.
            </p>
          </div>
          <button
            onClick={handleExportDepartments}
            style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Download size={18} /> Export Department Ledger CSV
          </button>
        </div>
      </div>

      {/* Data preview and custom filtering */}
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Custom Data Slice Preview</h3>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}
            >
              <option value="All">All Statuses</option>
              <option value="active">Active Staff</option>
              <option value="on-leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        <div className={dashStyles.tableWrapper}>
          <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '12px 14px' }}>Emp ID</th>
                <th style={{ padding: '12px 14px' }}>Name</th>
                <th style={{ padding: '12px 14px' }}>Department</th>
                <th style={{ padding: '12px 14px' }}>Role</th>
                <th style={{ padding: '12px 14px' }}>Location</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Annual Salary</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.slice(0, 15).map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-secondary)' }}>{emp.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>{emp.name}</td>
                  <td style={{ padding: '12px 14px' }}>{emp.department}</td>
                  <td style={{ padding: '12px 14px' }}>{emp.role}</td>
                  <td style={{ padding: '12px 14px' }}>{emp.location}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>${emp.salary.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize',
                      background: emp.status === 'active' ? 'rgba(16,185,129,0.15)' : emp.status === 'on-leave' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                      color: emp.status === 'active' ? '#10b981' : emp.status === 'on-leave' ? '#f59e0b' : '#ef4444' 
                    }}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Showing top 15 records out of {filteredEmployees.length} matching rows. Click export above for complete dataset download.
        </div>
      </div>
    </div>
  );
}
