import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { Building2, MapPin, Briefcase, Users, PlusCircle } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function DepartmentManagement() {
  const { departments, locations, jobRoles, addAuditLog } = usePlatform();
  const [activeTab, setActiveTab] = useState<'departments' | 'locations' | 'roles'>('departments');
  const [newName, setNewName] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addAuditLog(`Added new ${activeTab.slice(0, -1)} definition`, newName);
    alert(`Successfully registered new ${activeTab.slice(0, -1)}: "${newName}" into organization schema.`);
    setNewName('');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building2 size={26} color="#6366f1" /> Organization Structure & Topology
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
          Manage departments, global facility locations, and sanctioned job-role specifications.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('departments')}
          style={{ background: activeTab === 'departments' ? '#6366f1' : 'transparent', color: activeTab === 'departments' ? 'white' : 'var(--text-primary)', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Building2 size={18} /> Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          style={{ background: activeTab === 'locations' ? '#6366f1' : 'transparent', color: activeTab === 'locations' ? 'white' : 'var(--text-primary)', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <MapPin size={18} /> Global Locations ({locations.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          style={{ background: activeTab === 'roles' ? '#6366f1' : 'transparent', color: activeTab === 'roles' ? 'white' : 'var(--text-primary)', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Briefcase size={18} /> Job Roles ({jobRoles.length})
        </button>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAddItem} style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Add New {activeTab === 'departments' ? 'Department' : activeTab === 'locations' ? 'Location' : 'Job Role'}:</span>
        <input
          type="text"
          placeholder={`Enter new ${activeTab.slice(0, -1)} name...`}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          style={{ flex: 1, minWidth: '220px', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        />
        <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PlusCircle size={18} /> Add to Schema
        </button>
      </form>

      {/* Content area */}
      {activeTab === 'departments' && (
        <div className={dashStyles.tableWrapper}>
          <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '12px 16px' }}>Department Name</th>
                <th style={{ padding: '12px 16px' }}>Head of Dept (Manager)</th>
                <th style={{ padding: '12px 16px' }}>Primary Hub</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Active Headcount</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Annual Budget</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Open Requisitions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(d => (
                <tr key={d.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '1.05rem' }}>{d.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-primary)' }}>{d.manager}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '90px', 
                      height: '26px', 
                      background: 'rgba(99, 102, 241, 0.12)', 
                      color: '#6366f1', 
                      borderRadius: '14px', 
                      fontWeight: 600, 
                      fontSize: '0.8rem',
                      flexShrink: 0 
                    }}>
                      {d.location}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600 }}>{d.headCount.toLocaleString()} staff</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#10b981' }}>${(d.budget / 1000000).toFixed(2)}M</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '110px', 
                      height: '26px', 
                      background: 'rgba(245, 158, 11, 0.15)', 
                      color: '#f59e0b', 
                      borderRadius: '14px', 
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      flexShrink: 0 
                    }}>
                      {d.openPositions} open jobs
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'locations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {locations.map(loc => (
            <div key={loc} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '10px', borderRadius: '10px' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{loc}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Regional Engineering & Operations Hub</div>
                </div>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Facility Status:</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Active & Fully Operational</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {jobRoles.map(role => (
            <div key={role} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '10px', borderRadius: '10px' }}>
                  <Briefcase size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{role}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Standardized Compensation Tier</div>
                </div>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Band Level:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>L3 - L7 Sanctioned</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
