export type UserRole = "Admin" | "HR" | "Manager";

export type Department = 'Engineering' | 'Sales' | 'Marketing' | 'HR' | 'Finance' | 'Operations';
export type RoleName = 'Manager' | 'Developer' | 'Designer' | 'Analyst' | 'Recruiter' | 'Executive';
export type Location = 'New York' | 'London' | 'Remote' | 'Bengaluru' | 'Berlin';
export type EmployeeStatus = 'active' | 'on-leave' | 'terminated';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: Department;
  role: RoleName;
  location: Location;
  status: EmployeeStatus;
  riskLevel: RiskLevel;
  hireDate: string; // ISO date
  terminationDate: string | null;
  performanceScore: number; // 0-100
  trainingCompletion: number; // 0-100
  salary: number;
  managerId: string | null;
  skills?: string[];
  experienceYears?: number;
  onboardingStatus?: 'Completed' | 'In Progress' | 'Pending';
  offboardingStatus?: 'None' | 'Initiated' | 'Completed';
  managerComments?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  department?: Department; // assigned department for managers
  lastLogin?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave';
  checkIn?: string;
  checkOut?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  type: 'Annual' | 'Sick' | 'Parental' | 'Unpaid' | 'Casual';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  appliedOn: string;
  managerComment?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: Department;
  location: Location;
  type: 'Full-Time' | 'Part-Time' | 'Contract';
  positions: number;
  status: 'Open' | 'Closed' | 'Draft';
  applicantsCount: number;
  createdDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole | 'System';
  action: string;
  target: string;
  status: 'Success' | 'Warning' | 'Failure';
}

export interface DashboardFilters {
  department: string[];
  role: string[];
  location: string[];
  status: string[];
  risk: string[];
  date: string;
  dateStart?: string;
  dateEnd?: string;
  search: string;
  sortBy: string;
  sortDir: string;
  skills: string[];
  experience: string[];
  [key: string]: any;
}

export interface KpiDefinition {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  trend: number;
  trendLabel: string;
  badgeText: string;
  targetText: string;
  progressValue: number;
  themeColor: string;
  icon: string;
  drillDown: DrillDownRow[];
}

export interface DrillDownRow {
  label: string;
  value: string | number;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'empty' | 'error';
