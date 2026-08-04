import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { Employee, Department, RoleName, Location, EmployeeStatus } from '../../types';
import { Users, UserPlus, Search, Edit, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function HREmployees() {
  const { employees, addEmployee, updateEmployee, departments, locations, jobRoles } = usePlatform();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering' as Department,
    role: 'Developer' as RoleName,
    location: 'Remote' as Location,
    salary: 85000,
    status: 'active' as EmployeeStatus,
    onboardingStatus: 'In Progress' as 'Completed' | 'In Progress' | 'Pending',
    offboardingStatus: 'None' as 'None' | 'Initiated' | 'Completed',
  });

  const filteredEmployees = employees.filter(emp => {
    if (selectedDept !== 'All' && emp.department !== selectedDept) return false;
    if (selectedStatus !== 'All' && emp.status !== selectedStatus) return false;
    return emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           emp.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '', email: '', department: 'Engineering', role: 'Developer', location: 'Remote',
      salary: 85000, status: 'active', onboardingStatus: 'In Progress', offboardingStatus: 'None'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      role: emp.role,
      location: emp.location,
      salary: emp.salary,
      status: emp.status,
      onboardingStatus: emp.onboardingStatus || 'Completed',
      offboardingStatus: emp.offboardingStatus || 'None',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      updateEmployee(editingId, {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        role: formData.role,
        location: formData.location,
        salary: Number(formData.salary),
        status: formData.status,
        onboardingStatus: formData.onboardingStatus,
        offboardingStatus: formData.offboardingStatus,
      });
    } else {
      addEmployee({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        role: formData.role,
        location: formData.location,
        salary: Number(formData.salary),
        status: formData.status,
        riskLevel: 'low',
        hireDate: new Date().toISOString(),
        terminationDate: null,
        performanceScore: 80,
        trainingCompletion: 60,
        managerId: 'EMP-00001',
        onboardingStatus: formData.onboardingStatus,
        offboardingStatus: formData.offboardingStatus,
      });
    }
    setIsModalOpen(false);
  };

  const handleQuickOnboarding = (emp: Employee, target: 'Completed' | 'In Progress') => {
    updateEmployee(emp.id, { onboardingStatus: target });
  };

  const handleQuickOffboarding = (emp: Employee, target: 'Initiated' | 'Completed' | 'None') => {
    updateEmployee(emp.id, { 
      offboardingStatus: target,
      status: target === 'Completed' ? 'terminated' : emp.status,
      terminationDate: target === 'Completed' ? new Date().toISOString() : emp.terminationDate
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={26} color="#10b981" /> Employee Profiles & Onboarding Portal
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Manage staff credentials, department transfers, compensation, and onboarding/offboarding workflows.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={18} /> Register New Employee
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
          <Search size={20} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search employees by name, ID, or corporate email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}
          >
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Staff</option>
            <option value="on-leave">On Leave</option>
            <option value="terminated">Terminated / Offboarded</option>
          </select>
        </div>
      </div>

      {/* Employees Table Container */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Employee</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Dept & Role</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Location</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Onboarding</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}>Offboarding Workflow</th>
              <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.slice(0, 25).map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{emp.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.id} • {emp.email}</div>
                </td>
                <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{emp.role}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.department}</div>
                </td>
                <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '88px',
                    height: '24px',
                    borderRadius: '14px',
                    background: 'rgba(99, 102, 241, 0.12)',
                    color: '#6366f1',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {emp.location}
                  </span>
                </td>
                
                {/* Onboarding */}
                <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      width: '108px', height: '24px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
                      background: (emp.onboardingStatus || 'Completed') === 'Completed' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                      color: (emp.onboardingStatus || 'Completed') === 'Completed' ? '#10b981' : '#3b82f6'
                    }}>
                      {(emp.onboardingStatus || 'Completed') === 'Completed' ? <CheckCircle size={13} /> : <Clock size={13} />}
                      {emp.onboardingStatus || 'Completed'}
                    </span>
                    {(emp.onboardingStatus === 'In Progress' || emp.onboardingStatus === 'Pending') && (
                      <button 
                        onClick={() => handleQuickOnboarding(emp, 'Completed')} 
                        style={{ border: 'none', background: 'transparent', color: '#10b981', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                      >
                        Mark Onboarded
                      </button>
                    )}
                  </div>
                </td>

                {/* Offboarding Workflow */}
                <td style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '88px', height: '24px', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
                      background: (emp.offboardingStatus || 'None') === 'None' ? 'rgba(0,0,0,0.06)' : (emp.offboardingStatus || 'None') === 'Initiated' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                      color: (emp.offboardingStatus || 'None') === 'None' ? 'var(--text-secondary)' : (emp.offboardingStatus || 'None') === 'Initiated' ? '#f59e0b' : '#ef4444'
                    }}>
                      {emp.offboardingStatus || 'None'}
                    </span>
                    {(emp.offboardingStatus || 'None') === 'None' && emp.status === 'active' && (
                      <button 
                        onClick={() => handleQuickOffboarding(emp, 'Initiated')} 
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                      >
                        + Initiate Offboarding
                      </button>
                    )}
                    {emp.offboardingStatus === 'Initiated' && (
                      <button 
                        onClick={() => handleQuickOffboarding(emp, 'Completed')} 
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                      >
                        Complete & Terminate
                      </button>
                    )}
                  </div>
                </td>

                <td style={{ padding: '12px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button onClick={() => handleOpenEdit(emp)} style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Edit size={14} /> Edit Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        Showing top 25 employees out of {filteredEmployees.length} matching criteria.
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 1.2rem', fontSize: '1.25rem' }}>
              {editingId ? 'Edit Employee Profile' : 'Register New Employee'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Corporate Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Department</label>
                  <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value as Department })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Job Role</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as RoleName })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {jobRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Location Hub</label>
                  <select value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value as Location })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Annual Salary ($)</label>
                  <input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Onboarding Status</label>
                  <select value={formData.onboardingStatus} onChange={e => setFormData({ ...formData, onboardingStatus: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Offboarding Status</label>
                  <select value={formData.offboardingStatus} onChange={e => setFormData({ ...formData, offboardingStatus: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    <option value="None">None (Retained)</option>
                    <option value="Initiated">Initiated (Exit Process)</option>
                    <option value="Completed">Completed (Separated)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Save Employee Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
