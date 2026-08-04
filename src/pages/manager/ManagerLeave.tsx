import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { CalendarCheck, CheckCircle, XCircle, Clock, MessageSquare, AlertTriangle } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function ManagerLeave() {
  const { leaveRequests, updateLeaveStatus } = usePlatform();
  const MY_DEPT = 'Engineering';
  const deptLeaves = leaveRequests.filter(l => l.department === MY_DEPT);

  const [commentingReq, setCommentingReq] = useState<{ id: string; action: 'Approved' | 'Rejected' } | null>(null);
  const [managerNote, setManagerNote] = useState('');

  const handleConfirmAction = () => {
    if (!commentingReq) return;
    updateLeaveStatus(commentingReq.id, commentingReq.action, managerNote);
    setCommentingReq(null);
    setManagerNote('');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarCheck size={26} color="#3b82f6" /> Department Leave Requests Approval Portal
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
          Review absence applications, manage project scheduling coverage, and grant or decline time-off approvals.
        </p>
      </div>

      <div className={dashStyles.tableWrapper}>
        <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Team Member</th>
              <th style={{ padding: '12px 16px' }}>Leave Type</th>
              <th style={{ padding: '12px 16px' }}>Date Window</th>
              <th style={{ padding: '12px 16px' }}>Applicant Reason & Notes</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Current Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Managerial Action</th>
            </tr>
          </thead>
          <tbody>
            {deptLeaves.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700 }}>{req.employeeName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{req.employeeId}</div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{req.type} Leave</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {req.startDate} ➝ {req.endDate}
                </td>
                <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                  <div style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>"{req.reason}"</div>
                  {req.managerComment && (
                    <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '4px', fontWeight: 600 }}>
                      👉 Manager note: {req.managerComment}
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
                  {req.status === 'Pending' ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => setCommentingReq({ id: req.id, action: 'Approved' })}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => setCommentingReq({ id: req.id, action: 'Rejected' })}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Decided & Archived</span>
                  )}
                </td>
              </tr>
            ))}
            {deptLeaves.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No active or pending leave applications within the {MY_DEPT} department.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation & Note Modal */}
      {commentingReq && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', color: commentingReq.action === 'Approved' ? '#10b981' : '#ef4444' }}>
              Confirm Leave {commentingReq.action === 'Approved' ? 'Approval' : 'Rejection'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Add an optional notification comment or staffing explanation for the applicant:
            </p>
            <textarea
              rows={3}
              placeholder={commentingReq.action === 'Approved' ? "e.g., Have a wonderful trip! Project coverage is arranged with Alex." : "e.g., Unfortunately our QA release date overlaps with these exact dates; please re-apply for next week."}
              value={managerNote}
              onChange={e => setManagerNote(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1.2rem', outline: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setCommentingReq(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button
                onClick={handleConfirmAction}
                style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: commentingReq.action === 'Approved' ? '#10b981' : '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 700 }}
              >
                Confirm {commentingReq.action === 'Approved' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
