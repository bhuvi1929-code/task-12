import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { FileText, Search, Download, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function AuditLogs() {
  const { auditLogs, exportToCSV } = usePlatform();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredLogs = auditLogs.filter(log => {
    if (roleFilter !== 'All' && log.actorRole !== roleFilter) return false;
    const matchSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.target.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={26} color="#6366f1" /> Security Audit Logs & Event Tracker
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Real-time chronological record of authentication attempts, administrative mutations, and HR policy actions.
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filteredLogs, `security_audit_logs_${new Date().toISOString().slice(0, 10)}`)}
          style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={18} /> Export Log Archive (CSV)
        </button>
      </div>

      {/* Filter inputs */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={20} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search audit actions, user actors, or target records..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Role:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}
          >
            <option value="All">All Roles / System</option>
            <option value="Admin">Administrator</option>
            <option value="HR">HR Specialist</option>
            <option value="Manager">Dept Manager</option>
            <option value="System">Automated System</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className={dashStyles.tableWrapper}>
        <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '14px 16px' }}>Timestamp</th>
              <th style={{ padding: '14px 16px' }}>Event Actor</th>
              <th style={{ padding: '14px 16px' }}>Actor Role</th>
              <th style={{ padding: '14px 16px' }}>Performed Action / Mutation</th>
              <th style={{ padding: '14px 16px' }}>Target Resource</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Execution Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{log.actor}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '68px',
                    height: '24px',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: log.actorRole === 'Admin' ? 'rgba(239,68,68,0.15)' : log.actorRole === 'HR' ? 'rgba(16,185,129,0.15)' : log.actorRole === 'Manager' ? 'rgba(59,130,246,0.15)' : 'rgba(148,163,184,0.2)',
                    color: log.actorRole === 'Admin' ? '#ef4444' : log.actorRole === 'HR' ? '#10b981' : log.actorRole === 'Manager' ? '#3b82f6' : '#64748b' 
                  }}>
                    {log.actorRole}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#6366f1', fontWeight: 600 }}>{log.target}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700,
                    color: log.status === 'Success' ? '#10b981' : log.status === 'Warning' ? '#f59e0b' : '#ef4444' 
                  }}>
                    {log.status === 'Success' ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
