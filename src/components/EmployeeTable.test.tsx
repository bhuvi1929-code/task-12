import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeTable from './EmployeeTable';
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

const employees: Employee[] = [
  makeEmployee({ id: 'EMP-0001', name: 'Alice Johnson' }),
  makeEmployee({ id: 'EMP-0002', name: 'Bob Smith', status: 'terminated' }),
];

const defaultProps = {
  employees,
  search: '',
  onSearchChange: vi.fn(),
  sortBy: 'name',
  sortDir: 'asc',
  onSortChange: vi.fn(),
};

describe('EmployeeTable', () => {
  it('renders a row for each employee', () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  it('renders the empty state when there are no employees', () => {
    render(<EmployeeTable {...defaultProps} employees={[]} />);
    expect(screen.getByText(/No employees match/i)).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in the search box', () => {
    const onSearchChange = vi.fn();
    render(<EmployeeTable {...defaultProps} onSearchChange={onSearchChange} />);
    fireEvent.change(screen.getByPlaceholderText(/Search by name/i), { target: { value: 'bob' } });
    expect(onSearchChange).toHaveBeenCalledWith('bob');
  });

  it('calls onSortChange when a column header is clicked', () => {
    const onSortChange = vi.fn();
    render(<EmployeeTable {...defaultProps} onSortChange={onSortChange} />);
    fireEvent.click(screen.getByText('Department'));
    expect(onSortChange).toHaveBeenCalledWith('department', 'asc');
  });

  it('disables the export button when there are no employees', () => {
    render(<EmployeeTable {...defaultProps} employees={[]} />);
    expect(screen.getByText(/Export CSV/i).closest('button')).toBeDisabled();
  });
});
