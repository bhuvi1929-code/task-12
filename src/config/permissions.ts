import { UserRole } from '../types';

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  Admin: '/admin/dashboard',
  HR: '/hr/dashboard',
  Manager: '/manager/dashboard',
};

// Centralized Route Access Controls
// Maps route prefix to array of roles permitted to access it
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/admin': ['Admin'],
  '/hr': ['Admin', 'HR'], // Admin has access to all application routes per requirements
  '/manager': ['Admin', 'Manager'],
};

export function checkRoutePermission(pathname: string, userRole?: UserRole | null): boolean {
  if (!userRole) return false;
  
  // Find matching prefix in ROUTE_PERMISSIONS
  for (const [prefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(prefix)) {
      return allowedRoles.includes(userRole);
    }
  }
  
  // Unrestricted routes (like /unauthorized, /session-expired, /login, /404, or home root) are allowed
  return true;
}

export interface NavItemConfig {
  name: string;
  path: string;
  icon: string; // Lucide icon component name as string or identifier
  allowedRoles: UserRole[];
  section: 'Admin' | 'HR' | 'Manager';
}

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  // Admin Routes
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard', allowedRoles: ['Admin'], section: 'Admin' },
  { name: 'Users', path: '/admin/users', icon: 'UserCheck', allowedRoles: ['Admin'], section: 'Admin' },
  { name: 'Roles & Perms', path: '/admin/roles', icon: 'ShieldCheck', allowedRoles: ['Admin'], section: 'Admin' },
  { name: 'Departments', path: '/admin/departments', icon: 'Building2', allowedRoles: ['Admin'], section: 'Admin' },
  { name: 'Reports', path: '/admin/reports', icon: 'FileSpreadsheet', allowedRoles: ['Admin'], section: 'Admin' },
  { name: 'Audit Logs', path: '/admin/audit-logs', icon: 'FileText', allowedRoles: ['Admin'], section: 'Admin' },
  { name: 'Settings', path: '/admin/settings', icon: 'Settings', allowedRoles: ['Admin'], section: 'Admin' },

  // HR Routes
  { name: 'HR Dashboard', path: '/hr/dashboard', icon: 'LayoutDashboard', allowedRoles: ['Admin', 'HR'], section: 'HR' },
  { name: 'Employees', path: '/hr/employees', icon: 'Users', allowedRoles: ['Admin', 'HR'], section: 'HR' },
  { name: 'Recruitment', path: '/hr/recruitment', icon: 'UserPlus', allowedRoles: ['Admin', 'HR'], section: 'HR' },
  { name: 'Attendance', path: '/hr/attendance', icon: 'Clock', allowedRoles: ['Admin', 'HR'], section: 'HR' },
  { name: 'Leave Mgmt', path: '/hr/leave', icon: 'CalendarDays', allowedRoles: ['Admin', 'HR'], section: 'HR' },
  { name: 'Performance', path: '/hr/performance', icon: 'TrendingUp', allowedRoles: ['Admin', 'HR'], section: 'HR' },
  { name: 'Analytics', path: '/hr/analytics', icon: 'PieChart', allowedRoles: ['Admin', 'HR'], section: 'HR' },
  { name: 'HR Reports', path: '/hr/reports', icon: 'FileSpreadsheet', allowedRoles: ['Admin', 'HR'], section: 'HR' },

  // Manager Routes
  { name: 'Dept Dashboard', path: '/manager/dashboard', icon: 'LayoutDashboard', allowedRoles: ['Admin', 'Manager'], section: 'Manager' },
  { name: 'My Team', path: '/manager/team', icon: 'Users', allowedRoles: ['Admin', 'Manager'], section: 'Manager' },
  { name: 'Team Attendance', path: '/manager/attendance', icon: 'Clock', allowedRoles: ['Admin', 'Manager'], section: 'Manager' },
  { name: 'Leave Requests', path: '/manager/leave-requests', icon: 'CalendarCheck', allowedRoles: ['Admin', 'Manager'], section: 'Manager' },
  { name: 'Team Performance', path: '/manager/performance', icon: 'BarChart3', allowedRoles: ['Admin', 'Manager'], section: 'Manager' },
  { name: 'Team Analytics', path: '/manager/analytics', icon: 'PieChart', allowedRoles: ['Admin', 'Manager'], section: 'Manager' },
];
