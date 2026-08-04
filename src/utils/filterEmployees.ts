import type { DashboardFilters, Employee } from '../types';

const NOW = new Date('2026-07-24T00:00:00Z');

function isWithinDateRange(hireDateIso: string, range: string): boolean {
  if (!range || range === 'all') return true;
  const hireDate = new Date(hireDateIso);

  if (range === 'ytd') {
    return hireDate.getUTCFullYear() === NOW.getUTCFullYear();
  }
  if (range === 'q1') {
    return hireDate.getUTCFullYear() === 2026 && hireDate.getUTCMonth() >= 0 && hireDate.getUTCMonth() <= 2;
  }
  if (range === 'q2') {
    return hireDate.getUTCFullYear() === 2026 && hireDate.getUTCMonth() >= 3 && hireDate.getUTCMonth() <= 5;
  }
  return true;
}

export function applyFilters(employees: Employee[], filters: DashboardFilters): Employee[] {
  const search = (filters.search || '').trim().toLowerCase();

  return employees.filter((emp) => {
    if (filters.department && filters.department.length > 0 && !filters.department.includes(emp.department)) return false;
    if (filters.role && filters.role.length > 0 && !filters.role.includes(emp.role)) return false;
    
    // Normalize location from API if necessary, but here we can just do direct matching if exact
    if (filters.location && filters.location.length > 0) {
      const matchLoc = filters.location.some(l => l.toLowerCase().replace(/\s+/g, '-') === emp.location.toLowerCase().replace(/\s+/g, '-'));
      if (!matchLoc) return false;
    }

    if (filters.status && filters.status.length > 0 && !filters.status.includes(emp.status)) return false;
    if (filters.risk && filters.risk.length > 0 && !filters.risk.includes(emp.riskLevel)) return false;
    
    // Skills: emp must have ALL selected skills (AND logic) or ANY? Let's use ANY for wider match or ALL for strict. Let's do ANY.
    if (filters.skills && filters.skills.length > 0) {
      const hasSkill = filters.skills.some(s => (emp.skills || []).includes(s));
      if (!hasSkill) return false;
    }

    if (!(() => {
      const h = new Date(emp.hireDate);
      if (filters.date && filters.date !== 'all' && filters.date !== 'custom') {
        return isWithinDateRange(emp.hireDate, filters.date);
      }
      if (filters.date === 'custom' && (filters.dateStart || filters.dateEnd)) {
        if (filters.dateStart && h < new Date(filters.dateStart)) return false;
        if (filters.dateEnd && h > new Date(filters.dateEnd)) return false;
        return true;
      }
      return true;
    })()) return false;
    
    if (search) {
      const haystack = `${emp.name} ${emp.email} ${emp.id} ${emp.department} ${emp.role} ${(emp.skills || []).join(' ')}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export function sortEmployees(employees: Employee[], sortBy: string, sortDir: string): Employee[] {
  const dir = sortDir === 'desc' ? -1 : 1;
  const sorted = [...employees];

  sorted.sort((a, b) => {
    let av: string | number = '';
    let bv: string | number = '';

    switch (sortBy) {
      case 'department':
        av = a.department; bv = b.department; break;
      case 'role':
        av = a.role; bv = b.role; break;
      case 'location':
        av = a.location; bv = b.location; break;
      case 'status':
        av = a.status; bv = b.status; break;
      case 'risk':
        av = a.riskLevel; bv = b.riskLevel; break;
      case 'hireDate':
        av = a.hireDate; bv = b.hireDate; break;
      case 'performance':
        av = a.performanceScore; bv = b.performanceScore; break;
      case 'experience':
        av = a.experienceYears ?? 0; bv = b.experienceYears ?? 0; break;
      case 'name':
      default:
        av = a.name; bv = b.name; break;
    }

    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  return sorted;
}
