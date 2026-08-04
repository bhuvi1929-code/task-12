import { describe, it, expect } from 'vitest';
import { employeesToCsv } from './csvExport';
import type { Employee } from '../types';

function makeEmployee(overrides: Partial<Employee>): Employee {
  return {
    id: 'EMP-0001',
    name: 'Alice Johnson',
    email: 'alice@thestackly.com',
    department: 'Engineering',
    role: 'Developer',
    location: 'Remote',
    status: 'active',
    riskLevel: 'low',
    hireDate: '2026-06-01T00:00:00Z',
    terminationDate: null,
    performanceScore: 80,
    trainingCompletion: 90,
    salary: 90000,
    managerId: null,
    ...overrides,
  };
}

describe('employeesToCsv', () => {
  it('includes a header row with expected columns', () => {
    const csv = employeesToCsv([makeEmployee({})]);
    const header = csv.split('\n')[0];
    expect(header).toContain('Employee ID');
    expect(header).toContain('Name');
    expect(header).toContain('Department');
  });

  it('produces one data row per employee', () => {
    const employees = [
      makeEmployee({ id: 'EMP-0001' }),
      makeEmployee({ id: 'EMP-0002' }),
    ];
    const csv = employeesToCsv(employees);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(3); // header + 2 rows
  });

  it('escapes values containing commas', () => {
    const csv = employeesToCsv([makeEmployee({ name: 'Smith, Alice' })]);
    expect(csv).toContain('"Smith, Alice"');
  });

  it('returns just the header for an empty employee list', () => {
    const csv = employeesToCsv([]);
    expect(csv.split('\n')).toHaveLength(1);
  });
});
