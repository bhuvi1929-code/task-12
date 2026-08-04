import { describe, it, expect } from 'vitest';
import { applyFilters } from './filterEmployees';
import type { Employee, DashboardFilters } from '../types';

describe('Filter Logic', () => {
  const mockEmps: Employee[] = [
    { id: '1', name: 'Alice', email: '', department: 'Engineering', role: 'Developer', location: 'Remote', status: 'active', riskLevel: 'low', hireDate: '2026-01-15T00:00:00Z', terminationDate: null, performanceScore: 90, trainingCompletion: 100, salary: 100000, managerId: null, skills: ['React', 'Node.js'], experienceYears: 5 },
    { id: '2', name: 'Bob', email: '', department: 'Sales', role: 'Manager', location: 'New York', status: 'active', riskLevel: 'medium', hireDate: '2025-06-10T00:00:00Z', terminationDate: null, performanceScore: 80, trainingCompletion: 80, salary: 90000, managerId: null, skills: ['Salesforce'], experienceYears: 10 },
    { id: '3', name: 'Charlie', email: '', department: 'Engineering', role: 'Designer', location: 'London', status: 'on-leave', riskLevel: 'high', hireDate: '2026-04-05T00:00:00Z', terminationDate: null, performanceScore: 70, trainingCompletion: 50, salary: 80000, managerId: null, skills: ['Figma'], experienceYears: 3 },
  ];

  const defaultFilters: DashboardFilters = {
    department: [], role: [], location: [], status: [], risk: [], skills: [], experience: [],
    date: 'all', search: '', sortBy: 'name', sortDir: 'asc'
  };

  it('1. returns all employees when no filters are applied', () => {
    expect(applyFilters(mockEmps, defaultFilters).length).toBe(3);
  });

  it('2. filters by single department', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, department: ['Engineering'] });
    expect(res.length).toBe(2);
    expect(res[0].name).toBe('Alice');
  });

  it('3. filters by multiple departments (OR logic within same category)', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, department: ['Engineering', 'Sales'] });
    expect(res.length).toBe(3);
  });

  it('4. filters by single role', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, role: ['Developer'] });
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Alice');
  });

  it('5. applies AND logic across different categories', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, department: ['Engineering'], role: ['Manager'] });
    expect(res.length).toBe(0);
  });

  it('6. filters by location correctly', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, location: ['New York'] });
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Bob');
  });

  it('7. filters by status', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, status: ['on-leave'] });
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Charlie');
  });

  it('8. filters by risk level', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, risk: ['low', 'medium'] });
    expect(res.length).toBe(2);
  });

  it('9. filters by skills (ANY match)', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, skills: ['Figma'] });
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Charlie');
  });

  it('10. filters by search query matching name', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, search: 'ali' });
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Alice');
  });

  it('11. filters by search query matching skill', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, search: 'salesforce' });
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Bob');
  });

  it('12. filters by YTD date range', () => {
    // NOW is hardcoded to 2026-07-24T00:00:00Z in filterEmployees.ts
    // Alice hired 2026-01-15 (YTD)
    // Charlie hired 2026-04-05 (YTD)
    // Bob hired 2025-06-10 (not YTD)
    const res = applyFilters(mockEmps, { ...defaultFilters, date: 'ytd' });
    expect(res.length).toBe(2);
  });

  it('13. filters by Q1 2026 date range', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, date: 'q1' });
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Alice'); // Jan 15
  });

  it('14. filters by Q2 2026 date range', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, date: 'q2' });
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Charlie'); // Apr 5
  });

  it('15. handles empty string search safely without failing', () => {
    const res = applyFilters(mockEmps, { ...defaultFilters, search: '   ' });
    expect(res.length).toBe(3);
  });
});
