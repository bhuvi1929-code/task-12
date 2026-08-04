import type { DashboardFilters } from '../types';

interface FilterSummaryProps {
  filters: DashboardFilters;
  totalMatches: number;
}

export default function FilterSummary({ filters, totalMatches }: FilterSummaryProps) {
  const selectedCounts = ['department', 'role', 'location', 'status', 'risk', 'skills'].map(key => {
    const vals = filters[key] as string[];
    return { key, count: vals ? vals.length : 0 };
  }).filter(item => item.count > 0);

  if (selectedCounts.length === 0 && (!filters.date || filters.date === 'all') && !filters.search) {
    return <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', margin: '0 0 16px 0' }}>Showing all {totalMatches} employees.</p>;
  }

  const summaryParts = selectedCounts.map(item => `${item.count} ${item.key}${item.count > 1 ? 's' : ''}`);

  if (filters.search) {
    summaryParts.push(`Search: "${filters.search}"`);
  }

  if (filters.date && filters.date !== 'all') {
    summaryParts.push(`Date: ${filters.date}`);
  }

  return (
    <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', margin: '0 0 16px 0' }}>
      Showing <strong>{totalMatches.toLocaleString()}</strong> employees matching: {summaryParts.join(', ')}
    </p>
  );
}
