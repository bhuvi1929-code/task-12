import { describe, it, expect } from 'vitest';
import { computeKpis, pctChange } from './kpiCalculations';
import type { Employee } from '../types';

function makeEmployee(overrides: Partial<Employee>): Employee {
  return {
    id: 'EMP-0001',
    name: 'Test Person',
    email: 'test@thestackly.com',
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

describe('pctChange', () => {
  it('returns 0 when both values are 0', () => {
    expect(pctChange(0, 0)).toBe(0);
  });

  it('returns 100 when previous is 0 and current is positive', () => {
    expect(pctChange(5, 0)).toBe(100);
  });

  it('computes a positive percentage change', () => {
    expect(pctChange(110, 100)).toBe(10);
  });

  it('computes a negative percentage change', () => {
    expect(pctChange(90, 100)).toBe(-10);
  });
});

describe('computeKpis', () => {
  it('returns exactly 8 KPI definitions', () => {
    const kpis = computeKpis([makeEmployee({})]);
    expect(kpis).toHaveLength(8);
  });

  it('handles an empty dataset without throwing and reports zero values', () => {
    const kpis = computeKpis([]);
    const total = kpis.find((k) => k.id === 'total-employees');
    expect(total?.value).toBe('0');
  });

  it('computes total employee count correctly', () => {
    const employees = [makeEmployee({ id: 'EMP-0001' }), makeEmployee({ id: 'EMP-0002' })];
    const kpis = computeKpis(employees);
    const total = kpis.find((k) => k.id === 'total-employees');
    expect(total?.rawValue).toBe(2);
  });

  it('computes attrition rate from terminated employees', () => {
    const employees = [
      makeEmployee({ id: 'EMP-0001', status: 'active' }),
      makeEmployee({ id: 'EMP-0002', status: 'terminated', terminationDate: '2026-05-01T00:00:00Z' }),
    ];
    const kpis = computeKpis(employees);
    const attrition = kpis.find((k) => k.id === 'attrition-rate');
    expect(attrition?.value).toBe('50.0%');
  });

  it('flags high-risk employees correctly', () => {
    const employees = [
      makeEmployee({ id: 'EMP-0001', riskLevel: 'high' }),
      makeEmployee({ id: 'EMP-0002', riskLevel: 'low' }),
    ];
    const kpis = computeKpis(employees);
    const highRisk = kpis.find((k) => k.id === 'high-risk');
    expect(highRisk?.rawValue).toBe(1);
  });

  it('includes a department drill-down breakdown for every KPI', () => {
    const employees = [makeEmployee({})];
    const kpis = computeKpis(employees);
    kpis.forEach((kpi) => {
      expect(Array.isArray(kpi.drillDown)).toBe(true);
    });
  });
});
