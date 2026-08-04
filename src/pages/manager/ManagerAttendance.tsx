import { usePlatform } from '../../contexts/PlatformContext';
import { Clock, CheckCircle2, Download } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function ManagerAttendance() {
  const { attendance, exportToCSV } = usePlatform();
  const MY_DEPT = 'Engineering';
  const myAttendance = attendance.filter(a => a.department === MY_DEPT);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={26} color="#3b82f6" /> {MY_DEPT} Department Daily Attendance Log
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Track daily team check-ins, remote hours, and punctuality across engineering hubs.
          </p>
        </div>
        <button
          onClick={() => exportToCSV(myAttendance, `engineering_team_attendance_${new Date().toISOString().slice(0, 10)}`)}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={18} /> Export Team Log
        </button>
      </div>

      <div className={dashStyles.tableWrapper}>
        <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Team Member</th>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Check-in Timestamp</th>
              <th style={{ padding: '12px 16px' }}>Check-out Timestamp</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Daily Status</th>
            </tr>
          </thead>
          <tbody>
            {myAttendance.map(rec => (
              <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{rec.employeeName}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{rec.date}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600 }}>{rec.checkIn || '—'}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600 }}>{rec.checkOut || '—'}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 700,
                    background: rec.status === 'Present' ? 'rgba(16,185,129,0.15)' : rec.status === 'Late' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    color: rec.status === 'Present' ? '#10b981' : rec.status === 'Late' ? '#f59e0b' : '#ef4444'
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
