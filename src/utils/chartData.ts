import type { Employee } from '../types';

export interface CategoryPoint {
  label: string;
  value: number;
}

export interface TrendPoint {
  label: string;
  hires: number;
  exits: number;
  net: number;
}

export function departmentChartData(employees: Employee[]): CategoryPoint[] {
  const counts = new Map<string, number>();
  employees.forEach((e) => counts.set(e.department, (counts.get(e.department) ?? 0) + 1));
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function locationChartData(employees: Employee[]): CategoryPoint[] {
  const counts = new Map<string, number>();
  employees.forEach((e) => counts.set(e.location, (counts.get(e.location) ?? 0) + 1));
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Builds a 12-month hires-vs-exits trend ending at the fixed "now" reference date. */
export function workforceTrendData(employees: Employee[]): TrendPoint[] {
  const NOW = new Date('2026-07-24T00:00:00Z');
  const buckets: TrendPoint[] = [];

  for (let i = 11; i >= 0; i--) {
    const bucketDate = new Date(NOW.getFullYear(), NOW.getMonth() - i, 1);
    const label = MONTH_LABELS[bucketDate.getMonth()];

    const hires = employees.filter((e) => {
      const d = new Date(e.hireDate);
      return d.getFullYear() === bucketDate.getFullYear() && d.getMonth() === bucketDate.getMonth();
    }).length;

    const exits = employees.filter((e) => {
      if (!e.terminationDate) return false;
      const d = new Date(e.terminationDate);
      return d.getFullYear() === bucketDate.getFullYear() && d.getMonth() === bucketDate.getMonth();
    }).length;

    buckets.push({ label, hires, exits, net: hires - exits });
  }

  return buckets;
}
