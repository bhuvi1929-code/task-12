import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { 
  Employee, SystemUser, AttendanceRecord, LeaveRequest, 
  JobPosting, AuditLog, UserRole, Department, Location, RoleName 
} from '../types';
import { mockEmployees as defaultEmployees } from '../data/mockEmployees';

interface DepartmentInfo {
  name: Department;
  headCount: number;
  manager: string;
  location: Location;
  budget: number;
  openPositions: number;
}

interface PlatformContextType {
  employees: Employee[];
  systemUsers: SystemUser[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  jobPostings: JobPosting[];
  auditLogs: AuditLog[];
  departments: DepartmentInfo[];
  locations: Location[];
  jobRoles: RoleName[];
  
  // Actions
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  addSystemUser: (user: Omit<SystemUser, 'id'>) => void;
  updateSystemUser: (id: string, data: Partial<SystemUser>) => void;
  deleteSystemUser: (id: string) => void;
  toggleUserActive: (id: string) => void;

  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected', comment?: string) => void;
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  
  addJobPosting: (job: Omit<JobPosting, 'id'>) => void;
  updateJobStatus: (id: string, status: 'Open' | 'Closed' | 'Draft') => void;

  addAuditLog: (action: string, target: string, status?: 'Success' | 'Warning' | 'Failure', actor?: string, role?: UserRole | 'System') => void;

  exportToCSV: (data: any[], filename: string) => void;
  resetToDefaults: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const INITIAL_USERS: SystemUser[] = [
  { id: 'usr-1', name: 'Eleanor Vance', email: 'admin@enterprise.com', role: 'Admin', active: true, lastLogin: '2026-08-04 10:15 AM' },
  { id: 'usr-2', name: 'Marcus Brody', email: 'marcus.hr@enterprise.com', role: 'HR', active: true, lastLogin: '2026-08-04 09:30 AM' },
  { id: 'usr-3', name: 'David Kim', email: 'david.kim@enterprise.com', role: 'Manager', active: true, department: 'Engineering', lastLogin: '2026-08-04 11:00 AM' },
  { id: 'usr-4', name: 'Sarah Connor', email: 'sarah.c@enterprise.com', role: 'Manager', active: true, department: 'Sales', lastLogin: '2026-08-03 04:45 PM' },
  { id: 'usr-5', name: 'James Wilson', email: 'j.wilson@enterprise.com', role: 'HR', active: false, lastLogin: '2026-07-28 01:20 PM' },
];

const INITIAL_DEPARTMENTS: DepartmentInfo[] = [
  { name: 'Engineering', headCount: 3400, manager: 'David Kim', location: 'Bengaluru', budget: 14500000, openPositions: 18 },
  { name: 'Sales', headCount: 2200, manager: 'Sarah Connor', location: 'New York', budget: 9800000, openPositions: 12 },
  { name: 'Marketing', headCount: 1300, manager: 'Liam Patel', location: 'London', budget: 6200000, openPositions: 5 },
  { name: 'HR', headCount: 800, manager: 'Marcus Brody', location: 'Remote', budget: 3100000, openPositions: 3 },
  { name: 'Finance', headCount: 1100, manager: 'Chloe Davis', location: 'Berlin', budget: 4800000, openPositions: 4 },
  { name: 'Operations', headCount: 1200, manager: 'Arjun Nair', location: 'Bengaluru', budget: 5200000, openPositions: 7 },
];

const INITIAL_LEAVES: LeaveRequest[] = [
  { id: 'LR-001', employeeId: 'EMP-00001', employeeName: 'Aarav Sharma', department: 'Engineering', type: 'Annual', startDate: '2026-08-10', endDate: '2026-08-14', status: 'Pending', reason: 'Family vacation to mountains', appliedOn: '2026-08-02' },
  { id: 'LR-002', employeeId: 'EMP-00005', employeeName: 'Liam Williams', department: 'Engineering', type: 'Sick', startDate: '2026-08-03', endDate: '2026-08-05', status: 'Pending', reason: 'Viral fever and rest', appliedOn: '2026-08-03' },
  { id: 'LR-003', employeeId: 'EMP-00012', employeeName: 'Mia Wilson', department: 'Engineering', type: 'Parental', startDate: '2026-08-15', endDate: '2026-10-15', status: 'Approved', reason: 'Newborn child leave', appliedOn: '2026-07-20', managerComment: 'Congratulations Mia! Approved.' },
  { id: 'LR-004', employeeId: 'EMP-00020', employeeName: 'Chloe Taylor', department: 'Sales', type: 'Annual', startDate: '2026-08-12', endDate: '2026-08-16', status: 'Pending', reason: 'Personal trip', appliedOn: '2026-08-01' },
  { id: 'LR-005', employeeId: 'EMP-00033', employeeName: 'Noah Smith', department: 'Marketing', type: 'Casual', startDate: '2026-08-08', endDate: '2026-08-08', status: 'Rejected', reason: 'Personal errands during critical campaign launch', appliedOn: '2026-08-02', managerComment: 'Please reschedule after Tuesday campaign launch.' },
];

const INITIAL_JOB_POSTINGS: JobPosting[] = [
  { id: 'JOB-101', title: 'Senior React Developer', department: 'Engineering', location: 'Remote', type: 'Full-Time', positions: 5, status: 'Open', applicantsCount: 42, createdDate: '2026-07-15' },
  { id: 'JOB-102', title: 'Enterprise Sales Director', department: 'Sales', location: 'New York', type: 'Full-Time', positions: 2, status: 'Open', applicantsCount: 18, createdDate: '2026-07-18' },
  { id: 'JOB-103', title: 'Talent Acquisition Lead', department: 'HR', location: 'London', type: 'Full-Time', positions: 1, status: 'Open', applicantsCount: 29, createdDate: '2026-07-22' },
  { id: 'JOB-104', title: 'DevOps Security Architect', department: 'Engineering', location: 'Bengaluru', type: 'Full-Time', positions: 3, status: 'Open', applicantsCount: 51, createdDate: '2026-07-10' },
  { id: 'JOB-105', title: 'Financial Auditor', department: 'Finance', location: 'Berlin', type: 'Contract', positions: 2, status: 'Closed', applicantsCount: 15, createdDate: '2026-06-01' },
];

const INITIAL_AUDITS: AuditLog[] = [
  { id: 'AUD-991', timestamp: '2026-08-04 11:45 AM', actor: 'Eleanor Vance', actorRole: 'Admin', action: 'Updated organization permissions', target: 'Security Center', status: 'Success' },
  { id: 'AUD-992', timestamp: '2026-08-04 11:15 AM', actor: 'David Kim', actorRole: 'Manager', action: 'Approved leave request LR-003', target: 'Mia Wilson', status: 'Success' },
  { id: 'AUD-993', timestamp: '2026-08-04 10:30 AM', actor: 'Marcus Brody', actorRole: 'HR', action: 'Created new job posting JOB-104', target: 'Recruitment Module', status: 'Success' },
  { id: 'AUD-994', timestamp: '2026-08-04 09:12 AM', actor: 'System', actorRole: 'System', action: 'Daily attendance synchronization', target: 'Workforce DB', status: 'Success' },
  { id: 'AUD-995', timestamp: '2026-08-03 05:20 PM', actor: 'Eleanor Vance', actorRole: 'Admin', action: 'Deactivated user account', target: 'James Wilson (HR)', status: 'Warning' },
];

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('plat_emp_overrides');
    if (saved) {
      try {
        const overrides = JSON.parse(saved) as Record<string, Partial<Employee>>;
        return defaultEmployees.map(emp => overrides[emp.id] ? { ...emp, ...overrides[emp.id] } : emp);
      } catch { /* ignore */ }
    }
    // Set default onboarding/offboarding on initial load for demo feel
    return defaultEmployees.map((e, idx) => ({
      ...e,
      onboardingStatus: idx < 10 ? 'In Progress' : 'Completed',
      offboardingStatus: e.status === 'terminated' ? 'Completed' : idx === 15 ? 'Initiated' : 'None',
    }));
  });

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('plat_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('plat_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [jobPostings, setJobPostings] = useState<JobPosting[]>(() => {
    const saved = localStorage.getItem('plat_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOB_POSTINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('plat_audits');
    return saved ? JSON.parse(saved) : INITIAL_AUDITS;
  });

  // Generate deterministic attendance records from top 50 employees
  const [attendance] = useState<AttendanceRecord[]>(() => {
    const statuses: Array<'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave'> = 
      ['Present', 'Present', 'Present', 'Present', 'Late', 'Absent', 'On Leave'];
    return defaultEmployees.slice(0, 80).map((emp, i) => ({
      id: `ATT-${String(i+1).padStart(4, '0')}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      date: '2026-08-04',
      status: emp.status === 'on-leave' ? 'On Leave' : statuses[i % statuses.length],
      checkIn: statuses[i % statuses.length] === 'Absent' || emp.status === 'on-leave' ? undefined : `08:${25 + (i % 30)} AM`,
      checkOut: statuses[i % statuses.length] === 'Absent' || emp.status === 'on-leave' ? undefined : `05:${10 + (i % 45)} PM`,
    }));
  });

  const departments = INITIAL_DEPARTMENTS;
  const locations: Location[] = ['New York', 'London', 'Remote', 'Bengaluru', 'Berlin'];
  const jobRoles: RoleName[] = ['Manager', 'Developer', 'Designer', 'Analyst', 'Recruiter', 'Executive'];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('plat_users', JSON.stringify(systemUsers));
  }, [systemUsers]);

  useEffect(() => {
    localStorage.setItem('plat_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('plat_jobs', JSON.stringify(jobPostings));
  }, [jobPostings]);

  useEffect(() => {
    localStorage.setItem('plat_audits', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action: string, target: string, status: 'Success' | 'Warning' | 'Failure' = 'Success', actor = 'Active User', role: UserRole | 'System' = 'Admin') => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      actor,
      actorRole: role,
      action,
      target,
      status,
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...emp,
      id: `EMP-${String(employees.length + 1).padStart(5, '0')}`,
    };
    setEmployees(prev => [newEmp, ...prev]);
    addAuditLog('Created new employee profile', newEmp.name);
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    const emp = employees.find(e => e.id === id);
    addAuditLog('Updated employee details', emp?.name ?? id);
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    addAuditLog('Deleted employee record', emp?.name ?? id, 'Warning');
  };

  const addSystemUser = (user: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = {
      ...user,
      id: `usr-${Date.now()}`,
      lastLogin: 'Never',
    };
    setSystemUsers(prev => [newUser, ...prev]);
    addAuditLog('Created platform user account', newUser.name);
  };

  const updateSystemUser = (id: string, data: Partial<SystemUser>) => {
    setSystemUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    addAuditLog('Modified user role/permissions', id);
  };

  const deleteSystemUser = (id: string) => {
    const u = systemUsers.find(user => user.id === id);
    setSystemUsers(prev => prev.filter(user => user.id !== id));
    addAuditLog('Removed platform system user', u?.name ?? id, 'Warning');
  };

  const toggleUserActive = (id: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextState = !u.active;
        addAuditLog(nextState ? 'Activated user account' : 'Deactivated user account', u.name, nextState ? 'Success' : 'Warning');
        return { ...u, active: nextState };
      }
      return u;
    }));
  };

  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected', comment?: string) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === id) {
        addAuditLog(`${status} leave request`, `${req.employeeName} (${req.type})`);
        return { ...req, status, managerComment: comment || req.managerComment };
      }
      return req;
    }));
  };

  const addLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `LR-${String(Date.now()).slice(-3)}`,
      status: 'Pending',
      appliedOn: new Date().toISOString().slice(0, 10),
    };
    setLeaveRequests(prev => [newReq, ...prev]);
    addAuditLog('Submitted leave application', req.employeeName);
  };

  const addJobPosting = (job: Omit<JobPosting, 'id'>) => {
    const newJob: JobPosting = {
      ...job,
      id: `JOB-${String(Date.now()).slice(-3)}`,
    };
    setJobPostings(prev => [newJob, ...prev]);
    addAuditLog('Created job requisition', job.title);
  };

  const updateJobStatus = (id: string, status: 'Open' | 'Closed' | 'Draft') => {
    setJobPostings(prev => prev.map(j => {
      if (j.id === id) {
        addAuditLog(`Changed requisition status to ${status}`, j.title);
        return { ...j, status };
      }
      return j;
    }));
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName] ?? '')).join(','))
    ].join('\r\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addAuditLog('Exported dataset to CSV', filename);
  };

  const resetToDefaults = () => {
    localStorage.removeItem('plat_users');
    localStorage.removeItem('plat_leaves');
    localStorage.removeItem('plat_jobs');
    localStorage.removeItem('plat_audits');
    localStorage.removeItem('plat_emp_overrides');
    window.location.reload();
  };

  return (
    <PlatformContext.Provider value={{
      employees, systemUsers, attendance, leaveRequests, jobPostings, auditLogs,
      departments, locations, jobRoles,
      addEmployee, updateEmployee, deleteEmployee,
      addSystemUser, updateSystemUser, deleteSystemUser, toggleUserActive,
      updateLeaveStatus, addLeaveRequest,
      addJobPosting, updateJobStatus,
      addAuditLog, exportToCSV, resetToDefaults
    }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
