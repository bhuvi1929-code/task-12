import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { Users, Search, MessageSquare, Award, CheckCircle } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function ManagerTeam() {
  const { employees, updateEmployee } = usePlatform();
  const MY_DEPT = 'Engineering';
  const myTeam = employees.filter(e => e.department === MY_DEPT);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const filteredTeam = myTeam.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveComment = (id: string) => {
    updateEmployee(id, {
      managerComments: commentText
    });
    setCommentingId(null);
    setCommentText('');
  };

  const handleOpenComment = (emp: any) => {
    setCommentingId(emp.id);
    setCommentText(emp.managerComments || '');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={26} color="#3b82f6" /> {MY_DEPT} Department Direct Team Roster
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
          Manage direct team member profiles, review competencies, and log structured managerial recommendations.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={20} color="var(--text-secondary)" />
        <input
          type="text"
          placeholder="Search team members by name, title, or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }}
        />
      </div>

      {/* Roster Table */}
      <div className={dashStyles.tableWrapper}>
        <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Team Member</th>
              <th style={{ padding: '12px 16px' }}>Role Specification</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px' }}>Performance Score</th>
              <th style={{ padding: '12px 16px' }}>Manager Recommendation / Note</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeam.map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700 }}>{emp.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{emp.role}</td>
                <td style={{ padding: '14px 16px' }}>{emp.location}</td>
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#3b82f6' }}>{emp.performanceScore}/100</td>
                <td style={{ padding: '14px 16px', fontStyle: emp.managerComments ? 'normal' : 'italic', color: emp.managerComments ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {emp.managerComments ? `📝 "${emp.managerComments}"` : 'No notes logged yet...'}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleOpenComment(emp)}
                    style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <MessageSquare size={14} /> {emp.managerComments ? 'Edit Note' : 'Add Recommendation'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note Modal */}
      {commentingId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Log Managerial Recommendation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Add performance appraisal notes or promotion suggestions visible during HR review cycles.
            </p>
            <textarea
              rows={4}
              placeholder="e.g., Exceptional technical leadership on recent cloud migration project; high priority candidate for Tech Lead promotion."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '1.2rem', outline: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setCommentingId(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleSaveComment(commentingId)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Save Recommendation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
