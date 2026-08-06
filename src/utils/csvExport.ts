import type { Employee } from '../types';

export function employeesToCsv(employees: Employee[]): string {
  if (employees.length === 0) {
    return 'Employee ID,Name,Email,Department,Role,Location,Status,Risk Level,Hire Date,Performance Score,Salary,Skills,Experience (Years)';
  }

  const headers = [
    'Employee ID',
    'Name',
    'Email',
    'Department',
    'Role',
    'Location',
    'Status',
    'Risk Level',
    'Hire Date',
    'Performance Score',
    'Salary',
    'Skills',
    'Experience (Years)',
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
    `"${(emp.skills ?? []).join(', ')}"`,
    emp.experienceYears,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function exportToCsv(
  employees: Employee[],
  filename: string = 'employees_export.csv'
): void {
  if (!employees.length) return;

  const csvContent = employeesToCsv(employees);

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export const exportEmployeesToCsv = exportToCsv;