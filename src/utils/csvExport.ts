import type { Employee, UserRole, Department } from "../types";

/* ============================================
   RBAC Filter
============================================ */

export function filterEmployeesForExport(
  employees: Employee[],
  role: UserRole,
  department?: Department
): Employee[] {
  switch (role) {
    case "Admin":
      return employees;

    case "HR":
      return employees;

    case "Manager":
      return employees.filter(
        (emp) => emp.department === department
      );

    default:
      return [];
  }
}

/* ============================================
   Convert Employees to CSV
============================================ */

export function employeesToCsv(
  employees: Employee[]
): string {

  if (employees.length === 0) {
    return "Employee ID,Name,Email,Department,Role,Location,Status,Risk Level,Hire Date,Performance Score,Salary,Skills,Experience (Years)";
  }

  const headers = [
    "Employee ID",
    "Name",
    "Email",
    "Department",
    "Role",
    "Location",
    "Status",
    "Risk Level",
    "Hire Date",
    "Performance Score",
    "Salary",
    "Skills",
    "Experience (Years)",
  ];

  const rows = employees.map((emp) => [
    emp.id,
    `"${emp.name}"`,
    emp.email,
    emp.department,
    emp.role,
    emp.location,
    emp.status,
    emp.riskLevel,
    new Date(emp.hireDate).toLocaleDateString(),
    emp.performanceScore,
    emp.salary,
    `"${(emp.skills || []).join(", ")}"`,
    emp.experienceYears,
  ]);

  return [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");
}

/* ============================================
   Export CSV
============================================ */

export function exportToCsv(
  employees: Employee[],
  role: UserRole,
  department?: Department,
  filename = "employees_export.csv"
) {
  const filteredEmployees = filterEmployeesForExport(
    employees,
    role,
    department
  );

  if (filteredEmployees.length === 0) {
    alert("No employee data available to export.");
    return;
  }

  const csvContent = employeesToCsv(filteredEmployees);

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export const exportEmployeesToCsv = exportToCsv;