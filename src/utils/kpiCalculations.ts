import type { Department, DrillDownRow, Employee, KpiDefinition } from '../types';

const NOW = new Date('2026-07-24T00:00:00Z');
const DAY_MS = 1000 * 60 * 60 * 24;

function daysAgo(iso: string): number {
  return (NOW.getTime() - new Date(iso).getTime()) / DAY_MS;
}

/** Splits a set into a "recent" window and the equal-length window before it,
 * so every KPI can report a genuine period-over-period trend from a single
 * dataset snapshot instead of a hard-coded number. */
function splitByRecency(employees: Employee[], windowDays: number) {
  const recent = employees.filter((e) => daysAgo(e.hireDate) <= windowDays);
  const prior = employees.filter((e) => daysAgo(e.hireDate) > windowDays && daysAgo(e.hireDate) <= windowDays * 2);
  return { recent, prior };
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function departmentBreakdown(employees: Employee[], predicate: (e: Employee) => boolean): DrillDownRow[] {
  const counts = new Map<Department, number>();
  employees.filter(predicate).forEach((e) => counts.set(e.department, (counts.get(e.department) ?? 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));
}

export function computeKpis(filtered: Employee[]): KpiDefinition[] {
  const total = filtered.length;
  const { recent, prior } = splitByRecency(filtered, 90);

  const active = filtered.filter((e) => e.status === 'active');
  const terminated = filtered.filter((e) => e.status === 'terminated');
  const highRisk = filtered.filter((e) => e.riskLevel === 'high');
  const newHires = filtered.filter((e) => daysAgo(e.hireDate) <= 90);
  const newHiresPrior = filtered.filter((e) => daysAgo(e.hireDate) > 90 && daysAgo(e.hireDate) <= 180);

  const avgPerformance = total ? filtered.reduce((s, e) => s + e.performanceScore, 0) / total : 0;
  const avgTraining = total ? filtered.reduce((s, e) => s + e.trainingCompletion, 0) / total : 0;
  const avgTenureYears = total ? filtered.reduce((s, e) => s + daysAgo(e.hireDate), 0) / total / 365 : 0;

  const recentAvgPerf = recent.length ? recent.reduce((s, e) => s + e.performanceScore, 0) / recent.length : 0;
  const priorAvgPerf = prior.length ? prior.reduce((s, e) => s + e.performanceScore, 0) / prior.length : 0;

  const recentAvgTraining = recent.length ? recent.reduce((s, e) => s + e.trainingCompletion, 0) / recent.length : 0;
  const priorAvgTraining = prior.length ? prior.reduce((s, e) => s + e.trainingCompletion, 0) / prior.length : 0;

  const attritionRate = total ? (terminated.length / total) * 100 : 0;
  const priorTerminatedRate = prior.length
    ? (prior.filter((e) => e.status === 'terminated').length / prior.length) * 100
    : 0;

  const activeRate = total ? (active.length / total) * 100 : 0;
  const priorActiveRate = prior.length ? (prior.filter((e) => e.status === 'active').length / prior.length) * 100 : 0;

  const highRiskRate = total ? (highRisk.length / total) * 100 : 0;
  const priorHighRiskRate = prior.length ? (prior.filter((e) => e.riskLevel === 'high').length / prior.length) * 100 : 0;

  const kpis: KpiDefinition[] = [
    {
      id: 'total-employees',
      title: 'Total Employees',
      value: total.toLocaleString(),
      rawValue: total,
      trend: pctChange(recent.length, prior.length),
      trendLabel: 'headcount growth (90d)',
      badgeText: `${new Set(filtered.map((e) => e.department)).size} departments`,
      targetText: 'Target 300',
      progressValue: Math.min(100, Math.round((total / 300) * 100)),
      themeColor: '#3b82f6',
      icon: 'Users',
      drillDown: departmentBreakdown(filtered, () => true),
    },
    {
      id: 'active-employees',
      title: 'Active Employees',
      value: active.length.toLocaleString(),
      rawValue: active.length,
      trend: pctChange(activeRate, priorActiveRate),
      trendLabel: `${activeRate.toFixed(1)}% of workforce`,
      badgeText: `${activeRate.toFixed(1)}% active`,
      targetText: 'Target 95%',
      progressValue: Math.min(100, Math.round(activeRate)),
      themeColor: '#10b981',
      icon: 'Heart',
      drillDown: departmentBreakdown(filtered, (e) => e.status === 'active'),
    },
    {
      id: 'new-hires',
      title: 'New Hires',
      value: newHires.length.toLocaleString(),
      rawValue: newHires.length,
      trend: pctChange(newHires.length, newHiresPrior.length),
      trendLabel: 'last 90 days',
      badgeText: `${newHires.length} onboarding`,
      targetText: 'Target 50',
      progressValue: Math.min(100, Math.round((newHires.length / 50) * 100)),
      themeColor: '#f97316',
      icon: 'UserPlus',
      drillDown: departmentBreakdown(filtered, (e) => daysAgo(e.hireDate) <= 90),
    },
    {
      id: 'attrition-rate',
      title: 'Attrition Rate',
      value: `${attritionRate.toFixed(1)}%`,
      rawValue: attritionRate,
      trend: pctChange(attritionRate, priorTerminatedRate),
      trendLabel: 'from prior period',
      badgeText: attritionRate < 5 ? 'Below industry avg' : 'Above industry avg',
      targetText: 'Target < 5%',
      progressValue: Math.min(100, Math.round((attritionRate / 5) * 100)),
      themeColor: '#ef4444',
      icon: 'UserMinus',
      drillDown: departmentBreakdown(filtered, (e) => e.status === 'terminated'),
    },
    {
      id: 'high-risk',
      title: 'High-Risk Employees',
      value: highRisk.length.toLocaleString(),
      rawValue: highRisk.length,
      trend: pctChange(highRiskRate, priorHighRiskRate),
      trendLabel: `${highRiskRate.toFixed(1)}% of workforce`,
      badgeText: `${highRisk.length} flagged`,
      targetText: 'Target < 10%',
      progressValue: Math.min(100, Math.round((highRiskRate / 10) * 100)),
      themeColor: '#dc2626',
      icon: 'AlertTriangle',
      drillDown: departmentBreakdown(filtered, (e) => e.riskLevel === 'high'),
    },
    {
      id: 'avg-performance',
      title: 'Avg Performance Score',
      value: `${avgPerformance.toFixed(1)}`,
      rawValue: avgPerformance,
      trend: pctChange(recentAvgPerf, priorAvgPerf),
      trendLabel: 'from prior cohort',
      badgeText: avgPerformance >= 75 ? 'Strong performance' : 'Needs attention',
      targetText: 'Target 80',
      progressValue: Math.min(100, Math.round((avgPerformance / 80) * 100)),
      themeColor: '#8b5cf6',
      icon: 'TrendingUp',
      drillDown: departmentBreakdown(filtered, (e) => e.performanceScore >= 80),
    },
    {
      id: 'training-completion',
      title: 'Training Completion',
      value: `${avgTraining.toFixed(1)}%`,
      rawValue: avgTraining,
      trend: pctChange(recentAvgTraining, priorAvgTraining),
      trendLabel: 'from prior cohort',
      badgeText: `${filtered.filter((e) => e.trainingCompletion >= 90).length} fully trained`,
      targetText: 'Target 95%',
      progressValue: Math.min(100, Math.round(avgTraining)),
      themeColor: '#a16207',
      icon: 'GraduationCap',
      drillDown: departmentBreakdown(filtered, (e) => e.trainingCompletion >= 90),
    },
    {
      id: 'avg-tenure',
      title: 'Avg Tenure',
      value: `${avgTenureYears.toFixed(1)} yrs`,
      rawValue: avgTenureYears,
      // No prior-period tenure snapshot exists for a single dataset pull, so we
      // compare against the implied average one quarter ago (tenure grows ~0.25yr/qtr).
      trend: pctChange(avgTenureYears, avgTenureYears - 0.25),
      trendLabel: 'organization-wide',
      badgeText: `${filtered.filter((e) => daysAgo(e.hireDate) / 365 >= 2).length} tenured 2y+`,
      targetText: 'Target 2.5 yrs',
      progressValue: Math.min(100, Math.round((avgTenureYears / 2.5) * 100)),
      themeColor: '#0ea5e9',
      icon: 'Clock',
      drillDown: departmentBreakdown(filtered, (e) => daysAgo(e.hireDate) / 365 >= 2),
    },
  ];

  return kpis;
}
