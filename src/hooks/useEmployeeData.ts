import { useQuery } from '@tanstack/react-query';
import { mockEmployees } from '../data/mockEmployees';
import type { Employee, FetchState } from '../types';

interface UseEmployeeDataResult {
  employees: Employee[];
  state: FetchState;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
}

// Simulates an API call that returns the data, with a random delay.
const fetchEmployees = async (simulateErrorRate: number, signal?: AbortSignal): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const delay = 500 + Math.random() * 300;
    const timeout = setTimeout(() => {
      if (simulateErrorRate > 0 && Math.random() < simulateErrorRate) {
        reject(new Error('Unable to reach the workforce data service. Please try again.'));
        return;
      }
      resolve(mockEmployees);
    }, delay);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('AbortError'));
      });
    }
  });
};

export function useEmployeeData(simulateErrorRate = 0): UseEmployeeDataResult {
  const { data, error, isLoading, isError, refetch, isFetching } = useQuery<Employee[], Error>({
    queryKey: ['employees', simulateErrorRate],
    queryFn: ({ signal }) => fetchEmployees(simulateErrorRate, signal),
    staleTime: 5 * 60 * 1000, // cache for 5 mins
    retry: 2, // retry up to 2 times before failing
  });

  let state: FetchState = 'idle';
  if (isLoading) {
    state = 'loading';
  } else if (isError) {
    state = 'error';
  } else if (data && data.length === 0) {
    state = 'empty';
  } else if (data) {
    state = 'success';
  }

  return {
    employees: data || [],
    state,
    error: isError && error ? error.message : null,
    refetch,
    isFetching,
  };
}
