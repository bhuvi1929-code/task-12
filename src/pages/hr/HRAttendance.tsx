import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { Clock, CheckCircle2, XCircle, AlertCircle, Download, Calendar } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function HRAttendance() {
  const { attendance, departments, exportToCSV } = usePlatform();
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredAttendance = attendance.filter(record => {
    if (selectedDept !== 'All' && record.department !== selectedDept) return false;
    if (selectedStatus !== 'All' && record.status !== selectedStatus) return false;
    return true;
  });

  const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={26} color="#10b981" /> Daily Attendance & Time Tracking
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Monitor check-ins, punctuality, and daily presence across all department hubs.
          </p>
        </div>
        <button
          onClick={() => exportToCSV(filteredAttendance, `daily_attendance_log_${new Date().toISOString().slice(0, 10)}`)}
          style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={18} /> Export Attendance Sheet
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={28} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Today's Present Rate</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{Math.round((presentCount / attendance.length) * 100)}%</div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={28} color="#f59e0b" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Late Check-Ins</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{attendance.filter(a => a.status === 'Late').length} staff</div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <XCircle size={28} color="#ef4444" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Unexplained Absence</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{attendance.filter(a => a.status === 'Absent').length} staff</div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Filter Attendance Records:</span>
        <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}>
          <option value="All">All Departments</option>
          {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
        </select>
        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}>
          <option value="All">All Statuses</option>
          <option value="Present">On Time (Present)</option>
          <option value="Late">Delayed (Late)</option>
          <option value="Absent">Unexcused (Absent)</option>
          <option value="On Leave">Sanctioned (On Leave)</option>
        </select>
      </div>

      {/* Attendance Table Container */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Employee Name</th>
              <th style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>Department</th>
              <th style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Date</th>
              <th style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Check-in Time</th>
              <th style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Check-out Time</th>
              <th style={{ padding: '12px 14px', whiteSpace: 'nowrap', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700 }}>Daily Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.slice(0, 30).map(rec => (
              <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{rec.employeeName}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '94px',
                    height: '24px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    {rec.department}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '0.84rem', whiteSpace: 'nowrap' }}>{rec.date}</td>
                <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{rec.checkIn || '—'}</td>
                <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{rec.checkOut || '—'}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '88px',
                    height: '24px',
                    borderRadius: '14px', 
                    fontSize: '0.78rem', 
                    fontWeight: 700,
                    flexShrink: 0,
                    background: rec.status === 'Present' ? 'rgba(16,185,129,0.15)' : rec.status === 'Late' ? 'rgba(245,158,11,0.15)' : rec.status === 'On Leave' ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.15)',
                    color: rec.status === 'Present' ? '#10b981' : rec.status === 'Late' ? '#f59e0b' : rec.status === 'On Leave' ? '#3b82f6' : '#ef4444'
                  }}>
                    {rec.status}
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
