import { useQuery } from '@tanstack/react-query';
import { mockEmployees } from '../data/mockEmployees';
import { useAuth } from '../contexts/AuthContext';
import type { Employee, FetchState } from '../types';

interface UseEmployeeDataResult {
  employees: Employee[];
  state: FetchState;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
}

const fetchEmployees = async (
  simulateErrorRate: number,
  signal?: AbortSignal
): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const delay = 500 + Math.random() * 300;

    const timeout = setTimeout(() => {
      if (
        simulateErrorRate > 0 &&
        Math.random() < simulateErrorRate
      ) {
        reject(
          new Error(
            "Unable to reach the workforce data service."
          )
        );
        return;
      }

      resolve(mockEmployees);
    }, delay);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new Error("AbortError"));
    });
  });
};

export function useEmployeeData(
  simulateErrorRate = 0
): UseEmployeeDataResult {

  const { user } = useAuth();

  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Employee[], Error>({
    queryKey: ["employees", simulateErrorRate],
    queryFn: ({ signal }) =>
      fetchEmployees(simulateErrorRate, signal),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  let employees = data ?? [];

  // ===============================
  // RBAC Department Restriction
  // ===============================

  if (user) {

    switch (user.role) {

      case "Admin":
        break;

      case "HR":
        // HR can access workforce information
        break;

      case "Manager":
        employees = employees.filter(
          emp => emp.department === user.department
        );
        break;
    }
  }

  let state: FetchState = "idle";

  if (isLoading) {
    state = "loading";
  } else if (isError) {
    state = "error";
  } else if (employees.length === 0) {
    state = "empty";
  } else {
    state = "success";
  }

  return {
    employees,
    state,
    error: isError ? error?.message ?? null : null,
    refetch,
    isFetching,
  };
}