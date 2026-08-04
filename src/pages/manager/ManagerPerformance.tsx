import { useState } from 'react';
import { usePlatform } from '../../contexts/PlatformContext';
import { Award, TrendingUp, GraduationCap, Edit3 } from 'lucide-react';
import dashStyles from '../../styles/dashboard.module.css';

export default function ManagerPerformance() {
  const { employees, updateEmployee } = usePlatform();
  const MY_DEPT = 'Engineering';
  const myTeam = employees.filter(e => e.department === MY_DEPT);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newScore, setNewScore] = useState<number>(80);
  const [newTraining, setNewTraining] = useState<number>(100);

  const handleOpenEdit = (emp: any) => {
    setEditingId(emp.id);
    setNewScore(emp.performanceScore);
    setNewTraining(emp.trainingCompletion || 80);
  };

  const handleSave = (id: string) => {
    updateEmployee(id, {
      performanceScore: Number(newScore),
      trainingCompletion: Number(newTraining)
    });
    setEditingId(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award size={26} color="#3b82f6" /> {MY_DEPT} Team Performance Evaluations & Training
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
          Assess quarterly objective completion, adjust performance rating scores, and monitor mandatory training.
        </p>
      </div>

      <div className={dashStyles.tableWrapper}>
        <table className={dashStyles.dataTable} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Direct Report</th>
              <th style={{ padding: '12px 16px' }}>Role</th>
              <th style={{ padding: '12px 16px' }}>Performance Rating (0-100)</th>
              <th style={{ padding: '12px 16px' }}>Training Completion %</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Managerial Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {myTeam.map(emp => (
              <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{emp.name}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{emp.role}</td>
                
                <td style={{ padding: '14px 16px' }}>
                  {editingId === emp.id ? (
                    <input type="number" min={0} max={100} value={newScore} onChange={e => setNewScore(Number(e.target.value))} style={{ width: '80px', padding: '6px', borderRadius: '6px', border: '1px solid #3b82f6', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 700 }} />
                  ) : (
                    <span style={{ fontWeight: 800, color: emp.performanceScore >= 80 ? '#10b981' : '#f59e0b', fontSize: '1.05rem' }}>{emp.performanceScore} / 100</span>
                  )}
                </td>

                <td style={{ padding: '14px 16px' }}>
                  {editingId === emp.id ? (
                    <input type="number" min={0} max={100} value={newTraining} onChange={e => setNewTraining(Number(e.target.value))} style={{ width: '80px', padding: '6px', borderRadius: '6px', border: '1px solid #3b82f6', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 700 }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GraduationCap size={16} color="#3b82f6" />
                      <span style={{ fontWeight: 600 }}>{emp.trainingCompletion}% complete</span>
                    </div>
                  )}
                </td>

                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  {editingId === emp.id ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button onClick={() => handleSave(emp.id)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => handleOpenEdit(emp)} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Edit3 size={14} /> Update Evaluation
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
