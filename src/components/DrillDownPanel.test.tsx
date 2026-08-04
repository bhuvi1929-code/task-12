import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DrillDownPanel from './DrillDownPanel';
import type { KpiDefinition } from '../types';

const kpi: KpiDefinition = {
  id: 'total-employees',
  title: 'Total Employees',
  value: '260',
  rawValue: 260,
  trend: 5.2,
  trendLabel: 'headcount growth (90d)',
  badgeText: '6 departments',
  targetText: 'Target 300',
  progressValue: 86,
  themeColor: '#3b82f6',
  icon: 'Users',
  drillDown: [
    { label: 'Engineering', value: 60 },
    { label: 'Sales', value: 40 },
  ],
};

describe('DrillDownPanel', () => {
  it('renders nothing when no KPI is selected', () => {
    const { container } = render(<DrillDownPanel kpi={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the KPI title and breakdown rows when a KPI is selected', () => {
    render(<DrillDownPanel kpi={kpi} onClose={vi.fn()} />);
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<DrillDownPanel kpi={kpi} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText(/Close drill-down panel/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<DrillDownPanel kpi={kpi} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
