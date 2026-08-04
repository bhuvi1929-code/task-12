import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import KpiCard from './KpiCard';
import { Users } from 'lucide-react';

describe('KpiCard', () => {
  const defaultProps = {
    title: "Test Metric",
    value: "123",
    icon: Users,
    trend: 5.2,
    trendLabel: "from last month",
    badgeText: "6 Departments",
    targetText: "Target 1,300",
    progressValue: 90,
    themeColor: "#3b82f6"
  };

  it('renders the title and value correctly', () => {
    render(<KpiCard {...defaultProps} />);
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('renders the positive trend correctly', () => {
    render(<KpiCard {...defaultProps} />);
    
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
  });

  it('renders the negative trend correctly', () => {
    render(<KpiCard {...defaultProps} trend={-1.5} />);
    
    expect(screen.getByText('-1.5%')).toBeInTheDocument();
  });
});
