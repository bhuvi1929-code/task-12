import type { UserRole, Department } from "../types";

/* ======================================================
   Default Dashboard Routes
====================================================== */

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  Admin: "/admin/dashboard",
  HR: "/hr/dashboard",
  Manager: "/manager/dashboard",
};

/* ======================================================
   Route Permissions
====================================================== */

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/admin": ["Admin"],

  "/hr": ["Admin", "HR"],

  "/manager": ["Admin", "Manager"],
};

/* ======================================================
   Department Restrictions
====================================================== */

export const DEPARTMENT_ACCESS: Record<
  UserRole,
  Department[] | "ALL"
> = {
  Admin: "ALL",

  HR: "ALL",

  Manager: ["Engineering"],
};

/* ======================================================
   Action Permissions
====================================================== */

export interface PermissionSet {
  view: boolean;

  create: boolean;

  edit: boolean;

  delete: boolean;

  export: boolean;

  audit: boolean;
}

export const ROLE_PERMISSIONS: Record<
  UserRole,
  PermissionSet
> = {
  Admin: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    export: true,
    audit: true,
  },

  HR: {
    view: true,
    create: true,
    edit: true,
    delete: false,
    export: true,
    audit: false,
  },

  Manager: {
    view: true,
    create: false,
    edit: true,
    delete: false,
    export: false,
    audit: false,
  },
};

/* ======================================================
   Route Checker
====================================================== */

export function checkRoutePermission(
  pathname: string,
  role?: UserRole | null
): boolean {
  if (!role) return false;

  for (const [route, roles] of Object.entries(
    ROUTE_PERMISSIONS
  )) {
    if (pathname.startsWith(route)) {
      return roles.includes(role);
    }
  }

  return true;
}

/* ======================================================
   Department Checker
====================================================== */

export function canAccessDepartment(
  role: UserRole,
  department: Department
): boolean {
  const allowed = DEPARTMENT_ACCESS[role];

  if (allowed === "ALL") {
    return true;
  }

  return allowed.includes(department);
}

/* ======================================================
   Action Checker
====================================================== */

export function hasPermission(
  role: UserRole,
  action: keyof PermissionSet
) {
  return ROLE_PERMISSIONS[role][action];
}

/* ======================================================
   Navigation Items
====================================================== */

export interface NavItemConfig {
  name: string;

  path: string;

  icon: string;

  allowedRoles: UserRole[];

  section: "Admin" | "HR" | "Manager";
}

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  // ================= ADMIN =================

  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: "LayoutDashboard",
    allowedRoles: ["Admin"],
    section: "Admin",
  },

  {
    name: "Users",
    path: "/admin/users",
    icon: "Users",
    allowedRoles: ["Admin"],
    section: "Admin",
  },

  {
    name: "Roles",
    path: "/admin/roles",
    icon: "Shield",
    allowedRoles: ["Admin"],
    section: "Admin",
  },

  {
    name: "Departments",
    path: "/admin/departments",
    icon: "Building2",
    allowedRoles: ["Admin"],
    section: "Admin",
  },

  {
    name: "Reports",
    path: "/admin/reports",
    icon: "FileSpreadsheet",
    allowedRoles: ["Admin"],
    section: "Admin",
  },

  {
    name: "Audit Logs",
    path: "/admin/audit-logs",
    icon: "ClipboardList",
    allowedRoles: ["Admin"],
    section: "Admin",
  },

  {
    name: "Settings",
    path: "/admin/settings",
    icon: "Settings",
    allowedRoles: ["Admin"],
    section: "Admin",
  },

  // ================= HR =================

  {
    name: "Dashboard",
    path: "/hr/dashboard",
    icon: "LayoutDashboard",
    allowedRoles: ["Admin", "HR"],
    section: "HR",
  },

  {
    name: "Employees",
    path: "/hr/employees",
    icon: "Users",
    allowedRoles: ["Admin", "HR"],
    section: "HR",
  },

  {
    name: "Recruitment",
    path: "/hr/recruitment",
    icon: "UserPlus",
    allowedRoles: ["Admin", "HR"],
    section: "HR",
  },

  {
    name: "Attendance",
    path: "/hr/attendance",
    icon: "Clock3",
    allowedRoles: ["Admin", "HR"],
    section: "HR",
  },

  {
    name: "Leave",
    path: "/hr/leave",
    icon: "CalendarDays",
    allowedRoles: ["Admin", "HR"],
    section: "HR",
  },

  {
    name: "Performance",
    path: "/hr/performance",
    icon: "TrendingUp",
    allowedRoles: ["Admin", "HR"],
    section: "HR",
  },

  {
    name: "Analytics",
    path: "/hr/analytics",
    icon: "PieChart",
    allowedRoles: ["Admin", "HR"],
    section: "HR",
  },

  // ================= MANAGER =================

  {
    name: "Dashboard",
    path: "/manager/dashboard",
    icon: "LayoutDashboard",
    allowedRoles: ["Admin", "Manager"],
    section: "Manager",
  },

  {
    name: "My Team",
    path: "/manager/team",
    icon: "Users",
    allowedRoles: ["Admin", "Manager"],
    section: "Manager",
  },

  {
    name: "Attendance",
    path: "/manager/attendance",
    icon: "Clock3",
    allowedRoles: ["Admin", "Manager"],
    section: "Manager",
  },

  {
    name: "Leave Requests",
    path: "/manager/leave",
    icon: "CalendarCheck",
    allowedRoles: ["Admin", "Manager"],
    section: "Manager",
  },

  {
    name: "Performance",
    path: "/manager/performance",
    icon: "BarChart3",
    allowedRoles: ["Admin", "Manager"],
    section: "Manager",
  },

  {
    name: "Analytics",
    path: "/manager/analytics",
    icon: "PieChart",
    allowedRoles: ["Admin", "Manager"],
    section: "Manager",
  },
];