import type { Employee } from '../types';

export function employeesToCsv(employees: Employee[]): string {
  if (employees.length === 0) return 'Employee ID,Name,Email,Department,Role,Location,Status,Risk Level,Hire Date,Performance Score,Salary,Skills,Experience (Years)';

  const headers = [
    'Employee ID', 'Name', 'Email', 'Department', 'Role', 'Location', 'Status', 'Risk Level', 
    'Hire Date', 'Performance Score', 'Salary', 'Skills', 'Experience (Years)'
  ];

  const rows = employees.map(emp => [
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
    `"${(emp.skills || []).join(', ')}"`,
    emp.experienceYears
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportToCsv(employees: Employee[], filename = 'employees_export.csv') {
  if (employees.length === 0) return;
  const csvContent = employeesToCsv(employees);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const exportEmployeesToCsv = exportToCsv;
