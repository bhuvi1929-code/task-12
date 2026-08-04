import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { CalendarDays, CheckCircle, XCircle, Clock, MessageSquare, Plus } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function HRLeave() {
  const { leaveRequests, updateLeaveStatus, addLeaveRequest, departments } = usePlatform();
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeName: 'Priya Patel',
    employeeId: 'EMP-00088',
    department: 'Marketing' as any,
    type: 'Annual' as any,
    startDate: '2026-08-20',
    endDate: '2026-08-25',
    reason: 'Planned vacation trip',
  });

  const filteredLeaves = leaveRequests.filter(l => {
    if (filterStatus !== 'All' && l.status !== filterStatus) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLeaveRequest(formData);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarDays size={26} color="#10b981" /> Organization Leave Management & Policy Oversight
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Review staff absence requests, administer leave balances, and override manager approvals when required.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Record Leave Application
        </button>
      </div>

      {/* Filter tab buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{ 
              padding: '8px 18px', borderRadius: '20px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
              background: filterStatus === status ? '#10b981' : 'var(--bg-card)', 
              color: filterStatus === status ? 'white' : 'var(--text-primary)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {status} Requests ({status === 'All' ? leaveRequests.length : leaveRequests.filter(r => r.status === status).length})
          </button>
        ))}
      </div>

      {/* Leaves List Table */}
      <div className={dashStyles.tableWrapper}>
        <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Applicant</th>
              <th style={{ padding: '12px 16px' }}>Dept</th>
              <th style={{ padding: '12px 16px' }}>Leave Category</th>
              <th style={{ padding: '12px 16px' }}>Duration Range</th>
              <th style={{ padding: '12px 16px' }}>Reason & Comments</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Override Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700 }}>{req.employeeName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{req.employeeId}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>{req.department}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{req.type} Leave</td>
                <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {req.startDate} ➝ {req.endDate}
                </td>
                <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                  <div style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: req.managerComment ? '6px' : 0 }}>"{req.reason}"</div>
                  {req.managerComment && (
                    <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageSquare size={13} /> {req.managerComment}
                    </div>
                  )}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 700,
                    background: req.status === 'Approved' ? 'rgba(16,185,129,0.15)' : req.status === 'Rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: req.status === 'Approved' ? '#10b981' : req.status === 'Rejected' ? '#ef4444' : '#f59e0b' 
                  }}>
                    {req.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    {req.status !== 'Approved' && (
                      <button onClick={() => updateLeaveStatus(req.id, 'Approved', 'HR Override Approval')} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> Approve
                      </button>
                    )}
                    {req.status !== 'Rejected' && (
                      <button onClick={() => updateLeaveStatus(req.id, 'Rejected', 'HR Override Rejection')} style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={14} /> Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '460px' }}>
            <h2 style={{ margin: '0 0 1.2rem', fontSize: '1.25rem' }}>Submit Leave Application</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Name</label>
                <input required type="text" value={formData.employeeName} onChange={e => setFormData({ ...formData, employeeName: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Department</label>
                  <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Leave Category</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    <option value="Annual">Annual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Parental">Parental Leave</option>
                    <option value="Casual">Casual Leave</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>End Date</label>
                  <input required type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Reason / Notes</label>
                <textarea required rows={3} value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
