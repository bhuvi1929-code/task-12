import { useMemo } from 'react';
import { Building2, UserCheck, MapPin, Activity, AlertCircle, Calendar, GraduationCap, Clock, Filter, RotateCcw, Trash2 } from 'lucide-react';
import MultiSelect from './MultiSelect';
import styles from '../styles/filterpanel.module.css';
import type { DashboardFilters } from '../types';

interface FilterPanelProps {
  filters: DashboardFilters;
  setFilter: (key: keyof DashboardFilters, value: string | string[]) => void;
  clearFilters: () => void;
  undo: () => void;
  canUndo: boolean;
  isAdminFocus?: boolean;
}

const DEPARTMENTS = [
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'HR', value: 'HR' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Operations', value: 'Operations' },
];

const ALL_ROLES = [
  { label: 'Manager', value: 'Manager' },
  { label: 'Developer', value: 'Developer' },
  { label: 'Designer', value: 'Designer' },
  { label: 'Analyst', value: 'Analyst' },
  { label: 'Recruiter', value: 'Recruiter' },
  { label: 'Executive', value: 'Executive' },
];

const LOCATIONS = [
  { label: 'New York', value: 'New York' },
  { label: 'London', value: 'London' },
  { label: 'Remote', value: 'Remote' },
  { label: 'Bengaluru', value: 'Bengaluru' },
  { label: 'Berlin', value: 'Berlin' },
];

const STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'On Leave', value: 'on-leave' },
  { label: 'Terminated', value: 'terminated' },
];

const RISKS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

const ALL_SKILLS = [
  'React', 'Node.js', 'Python', 'TypeScript', 'Figma', 'AWS', 'Docker', 'Kubernetes',
  'SQL', 'MongoDB', 'GraphQL', 'Machine Learning', 'Data Analysis', 'Project Management',
  'Agile', 'Communication', 'Leadership', 'Salesforce', 'SEO', 'Content Creation'
].map(s => ({ label: s, value: s }));



export default function FilterPanel({ filters, setFilter, clearFilters, undo, canUndo, isAdminFocus = false }: FilterPanelProps) {
  
  // Dependent filters logic: Restrict roles if specific departments are selected
  const availableRoles = useMemo(() => {
    if (filters.department.length === 0) return ALL_ROLES;
    
    // Example rule: If only Engineering is selected, restrict to Developer, Manager, Designer
    if (filters.department.includes('Engineering') && filters.department.length === 1) {
      return ALL_ROLES.filter(r => ['Developer', 'Manager', 'Designer'].includes(r.value));
    }
    return ALL_ROLES;
  }, [filters.department]);

  const availableSkills = useMemo(() => {
    if (filters.department.length === 0) return ALL_SKILLS;
    
    // Example rule: If Engineering is selected, show technical skills
    if (filters.department.includes('Engineering') && filters.department.length === 1) {
      return ALL_SKILLS.filter(s => ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL'].includes(s.value));
    }
    return ALL_SKILLS;
  }, [filters.department]);

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterHeader}>
        <div className={styles.filterTitleGroup}>
          <Filter size={18} color="#4f46e5" />
          <h3>Filters</h3>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={undo} disabled={!canUndo} className={styles.undoBtn}>
            <RotateCcw size={14} /> Undo
          </button>
          <button type="button" onClick={clearFilters} className={styles.clearBtn}>
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>
      
      <div className={styles.filterGrid}>
        {!isAdminFocus && (
          <MultiSelect 
            label="Department"
            icon={<Building2 size={16} />}
            options={DEPARTMENTS}
            selectedValues={filters.department || []}
            onChange={(val) => setFilter('department', val)}
          />
        )}

        <MultiSelect 
          label="Role"
          icon={<UserCheck size={16} />}
          options={availableRoles}
          selectedValues={filters.role || []}
          onChange={(val) => setFilter('role', val)}
        />

        <MultiSelect 
          label="Location"
          icon={<MapPin size={16} />}
          options={LOCATIONS}
          selectedValues={filters.location || []}
          onChange={(val) => setFilter('location', val)}
        />

        <MultiSelect 
          label="Status"
          icon={<Activity size={16} />}
          options={STATUSES}
          selectedValues={filters.status || []}
          onChange={(val) => setFilter('status', val)}
        />

        <MultiSelect 
          label="Risk Level"
          icon={<AlertCircle size={16} />}
          options={RISKS}
          selectedValues={filters.risk || []}
          onChange={(val) => setFilter('risk', val)}
        />

        <MultiSelect 
          label="Skills"
          icon={<GraduationCap size={16} />}
          options={availableSkills}
          selectedValues={filters.skills || []}
          onChange={(val) => setFilter('skills', val)}
        />

        <MultiSelect 
          label="Experience"
          icon={<Clock size={16} />}
          options={[
            { label: '0-2 Years', value: '0-2' },
            { label: '3-5 Years', value: '3-5' },
            { label: '6-10 Years', value: '6-10' },
            { label: '10+ Years', value: '10+' },
          ]}
          selectedValues={filters.experience || []}
          onChange={(val) => setFilter('experience', val)}
        />

        <div className={styles.singleSelect}>
          <label>Date Range</label>
          <div className={styles.singleSelectWrapper}>
            <Calendar size={16} className={styles.singleIcon} />
            <select 
              value={filters.date as string || 'all'} 
              onChange={(e) => setFilter('date', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="ytd">Year to Date</option>
              <option value="q1">Q1 2026</option>
              <option value="q2">Q2 2026</option>
              <option value="q3">Q3 2026</option>
              <option value="q4">Q4 2026</option>
              <option value="custom">Custom Range...</option>
            </select>
          </div>
        </div>
        {filters.date === 'custom' && (
          <div className={styles.singleSelect} style={{ marginTop: '8px' }}>
            <label>Custom Date Range</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="date" value={filters.dateStart || ''} onChange={(e) => setFilter('dateStart', e.target.value)} style={{ flex: 1, padding: '4px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db' }} />
              <input type="date" value={filters.dateEnd || ''} onChange={(e) => setFilter('dateEnd', e.target.value)} style={{ flex: 1, padding: '4px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db' }} />
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Chips */}
      <div className={styles.activeChips}>
        {['department', 'role', 'location', 'status', 'risk', 'skills', 'experience'].map(key => {
          const vals = filters[key] as string[];
          if (!vals || vals.length === 0) return null;
          return vals.map(val => (
            <div key={`${key}-${val}`} className={styles.chip}>
              <span className={styles.chipText}>{val}</span>
              <button 
                type="button" 
                className={styles.chipClose} 
                onClick={() => setFilter(key, vals.filter(v => v !== val))}
              >&times;</button>
            </div>
          ));
        })}
      </div>
    </div>
  );
}
