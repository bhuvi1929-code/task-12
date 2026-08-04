import { useState } from 'react';
import { ShieldCheck, Lock, Check, X, AlertCircle } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';
import { usePlatform } from '../../contexts/PlatformContext';

export default function RolePermissions() {
  const { addAuditLog } = usePlatform();
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<'Admin' | 'HR' | 'Manager', boolean>>>({
    'Global Dashboard Access': { Admin: true, HR: false, Manager: false },
    'User Account Management': { Admin: true, HR: false, Manager: false },
    'Role & Permission Editor': { Admin: true, HR: false, Manager: false },
    'Department & Budget Configuration': { Admin: true, HR: false, Manager: false },
    'Organization Audit Logs': { Admin: true, HR: false, Manager: false },
    'Workforce Employee Profiles': { Admin: true, HR: true, Manager: false },
    'Recruitment & Job Requisitions': { Admin: true, HR: true, Manager: false },
    'Onboarding & Offboarding Workflows': { Admin: true, HR: true, Manager: false },
    'Attendance & Time Records (Global)': { Admin: true, HR: true, Manager: false },
    'Department Team Roster': { Admin: true, HR: true, Manager: true },
    'Leave Request Approval / Rejection': { Admin: true, HR: true, Manager: true },
    'Employee Performance Evaluation': { Admin: true, HR: true, Manager: true },
    'Data Dataset Export (CSV)': { Admin: true, HR: true, Manager: true },
  });

  const [savedMessage, setSavedMessage] = useState('');

  const togglePermission = (feature: string, role: 'Admin' | 'HR' | 'Manager') => {
    if (role === 'Admin') return; // Admin permissions cannot be locked out
    setPermissionMatrix(prev => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        [role]: !prev[feature][role],
      },
    }));
  };

  const handleSave = () => {
    addAuditLog('Modified RBAC feature capabilities', 'Role Permissions Matrix');
    setSavedMessage('Permissions matrix updated successfully!');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={26} color="#6366f1" /> Role & Permission Management
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Configure explicit capability matrices and access boundaries across Admin, HR, and Manager tiers.
          </p>
        </div>
        <button
          onClick={handleSave}
          style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ShieldCheck size={18} /> Save Matrix Changes
        </button>
      </div>

      {savedMessage && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '12px 16px', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600 }}>
          ✓ {savedMessage}
        </div>
      )}

      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Note on Role Hierarchy:</strong> Administrators inherit universal super-admin capabilities and cannot be downgraded. Changing toggle switches below controls dynamic layout visibility and API endpoint enforcement for HR Specialists and Managers.
          </div>
        </div>

        <div className={dashStyles.tableWrapper}>
          <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '14px 16px', width: '50%' }}>Feature / Architectural Domain</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', color: '#ef4444' }}>Administrator</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', color: '#10b981' }}>HR Specialist</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', color: '#3b82f6' }}>Dept Manager</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissionMatrix).map(([feature, roles]) => (
                <tr key={feature} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{feature}</td>
                  {(['Admin', 'HR', 'Manager'] as const).map(role => (
                    <td key={role} style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => togglePermission(feature, role)}
                        disabled={role === 'Admin'}
                        style={{
                          background: roles[role] ? (role === 'Admin' ? 'rgba(239,68,68,0.2)' : role === 'HR' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)') : 'rgba(0,0,0,0.1)',
                          color: roles[role] ? (role === 'Admin' ? '#ef4444' : role === 'HR' ? '#10b981' : '#3b82f6') : '#94a3b8',
                          border: '1px solid var(--border-color)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          cursor: role === 'Admin' ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: role === 'Admin' ? 0.85 : 1
                        }}
                      >
                        {roles[role] ? <Check size={16} /> : <X size={16} />}
                        {roles[role] ? 'Permitted' : 'Restricted'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
