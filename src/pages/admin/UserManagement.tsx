import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { SystemUser, UserRole, Department } from '../../types';
import { UserPlus, Edit, Shield, CheckCircle2, XCircle, Trash2, Search, X } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function UserManagement() {
  const { systemUsers, departments, addSystemUser, updateSystemUser, deleteSystemUser, toggleUserActive } = usePlatform();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{ name: string; email: string; role: UserRole; department?: Department }>({
    name: '',
    email: '',
    role: 'Manager',
    department: 'Engineering',
  });

  const filteredUsers = systemUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'Manager', department: 'Engineering' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: SystemUser) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'Engineering',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      updateSystemUser(editingId, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.role === 'Manager' ? formData.department : undefined,
      });
    } else {
      addSystemUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        active: true,
        department: formData.role === 'Manager' ? formData.department : undefined,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={26} color="#6366f1" /> Platform User Management
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Create, edit, activate, and deactivate user credentials across Admin, HR, and Manager tiers.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={20} color="var(--text-secondary)" />
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }}
        />
      </div>

      {/* Users Table Container */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>User Name</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Email Address</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, width: '80px' }}>Role</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Assigned Dept</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Last Login</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 10px', fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{user.name}</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{user.email}</td>
                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '66px',
                    height: '24px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    background: user.role === 'Admin' ? 'rgba(239, 68, 68, 0.15)' : user.role === 'HR' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: user.role === 'Admin' ? '#ef4444' : user.role === 'HR' ? '#10b981' : '#3b82f6' 
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 10px', whiteSpace: 'nowrap', color: 'var(--text-primary)', fontSize: '0.83rem' }}>{user.department || '— (Global)'}</td>
                <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() => toggleUserActive(user.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', fontWeight: 600, color: user.active ? '#10b981' : '#ef4444' }}
                    title={user.active ? "Click to deactivate" : "Click to activate"}
                  >
                    {user.active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {user.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ padding: '12px 10px', color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{user.lastLogin || 'Never'}</td>
                <td style={{ padding: '12px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    <button onClick={() => handleOpenEdit(user)} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                      <Edit size={13} /> Edit
                    </button>
                    <button onClick={() => deleteSystemUser(user.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit User */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(8px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{ 
            background: 'var(--bg-card)', 
            padding: '24px 28px', 
            borderRadius: '20px', 
            border: '1px solid var(--border-color)', 
            width: '100%', 
            maxWidth: '480px', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            boxSizing: 'border-box'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {editingId ? 'Edit Platform User' : 'Create New System User'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {editingId ? 'Update credentials and access tier for this user.' : 'Grant platform access to a new team member.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Elena Vance"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. elena@enterprise.com"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  User Role (RBAC Tier)
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="Admin">Administrator (All Features & Setup)</option>
                  <option value="HR">HR Specialist (Workforce & Talent)</option>
                  <option value="Manager">Department Manager (Team Specific)</option>
                </select>
              </div>

              {formData.role === 'Manager' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Assigned Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
                  >
                    {departments.map(d => (
                      <option key={d.name} value={d.name}>{d.name} Department</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', border: 'none', color: '#ffffff', padding: '10px 22px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)' }}
                >
                  {editingId ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
