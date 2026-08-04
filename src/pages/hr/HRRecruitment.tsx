import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { Department, Location } from '../../types';
import { UserPlus, Plus, Briefcase, MapPin, Users, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HRRecruitment() {
  const { jobPostings, addJobPosting, updateJobStatus, departments, locations } = usePlatform();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering' as Department,
    location: 'Remote' as Location,
    type: 'Full-Time' as 'Full-Time' | 'Part-Time' | 'Contract',
    positions: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addJobPosting({
      title: formData.title,
      department: formData.department,
      location: formData.location,
      type: formData.type,
      positions: Number(formData.positions),
      status: 'Open',
      applicantsCount: 1,
      createdDate: new Date().toISOString().slice(0, 10),
    });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={26} color="#3b82f6" /> Talent Acquisition & Recruitment Hub
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            Publish open job requisitions, manage candidate pipelines, and close filled headcount positions.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Post Job Requisition
        </button>
      </div>

      {/* Job Postings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {jobPostings.map(job => (
          <div key={job.id} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{job.department}</span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 700 }}>{job.title}</h3>
                </div>
                <span style={{ 
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                  background: job.status === 'Open' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.2)',
                  color: job.status === 'Open' ? '#10b981' : '#64748b' 
                }}>
                  {job.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={15} /> {job.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={15} /> {job.type}</span>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Open Vacancies</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>{job.positions}</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Applicants</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{job.applicantsCount}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Posted on {job.createdDate}</span>
              {job.status === 'Open' ? (
                <button
                  onClick={() => updateJobStatus(job.id, 'Closed')}
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close Requisition
                </button>
              ) : (
                <button
                  onClick={() => updateJobStatus(job.id, 'Open')}
                  style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Re-open Requisition
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Requisition Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '460px' }}>
            <h2 style={{ margin: '0 0 1.2rem', fontSize: '1.3rem' }}>Create Job Requisition</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Position Title</label>
                <input required type="text" placeholder="e.g. Staff Machine Learning Engineer" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Department</label>
                  <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Location Hub</label>
                  <select value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employment Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-Time">Part-Time</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Headcount Spots</label>
                  <input type="number" min={1} value={formData.positions} onChange={e => setFormData({ ...formData, positions: Number(e.target.value) })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Publish Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
