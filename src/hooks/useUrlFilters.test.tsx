import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useUrlFilters } from './useUrlFilters';

describe('useUrlFilters', () => {
  it('returns default filters when no search params are present', () => {
    const defaultFilters = { department: 'all', role: 'manager' };
    
    const { result } = renderHook(() => useUrlFilters(defaultFilters), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    
    expect(result.current.getFilter('department')).toBe('all');
    expect(result.current.getFilter('role')).toBe('manager');
  });

  it('updates search params correctly', () => {
    const defaultFilters = { department: 'all' };
    
    const { result } = renderHook(() => useUrlFilters(defaultFilters), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    
    act(() => {
      result.current.setFilter('department', 'engineering');
    });
    
    expect(result.current.getFilter('department')).toBe('engineering');
  });

  it('clears all filters correctly', () => {
    const defaultFilters = { department: 'all' };
    
    const { result } = renderHook(() => useUrlFilters(defaultFilters), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/?department=engineering']}>{children}</MemoryRouter>,
    });
    
    expect(result.current.getFilter('department')).toBe('engineering');

    act(() => {
      result.current.clearFilters();
    });
    
    expect(result.current.getFilter('department')).toBe('all');
  });
});
