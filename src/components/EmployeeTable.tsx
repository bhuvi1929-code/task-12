import { useMemo, useState } from 'react';
import { ArrowUpDown, Download, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Employee } from '../types';
import { exportEmployeesToCsv } from '../utils/csvExport';
import styles from '../styles/dashboard.module.css';

interface EmployeeTableProps {
  employees: Employee[];
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  sortDir: string;
  onSortChange: (sortBy: string, sortDir: string) => void;
}

const PAGE_SIZE = 10;

const COLUMNS: { key: string; label: string }[] = [
  { key: 'name', label: 'Employee' },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: 'risk', label: 'Risk' },
  { key: 'hireDate', label: 'Hire Date' },
  { key: 'performance', label: 'Performance' },
];

function statusClass(status: Employee['status']) {
  if (status === 'active') return styles.statusActive;
  if (status === 'on-leave') return styles.statusOnLeave;
  return styles.statusTerminated;
}

function riskClass(risk: Employee['riskLevel']) {
  if (risk === 'low') return styles.riskLow;
  if (risk === 'medium') return styles.riskMedium;
  return styles.riskHigh;
}

export default function EmployeeTable({
  employees,
  search,
  onSearchChange,
  sortBy,
  sortDir,
  onSortChange,
}: EmployeeTableProps) {

  const { user } = useAuth();

  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(employees.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () =>
      employees.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [employees, currentPage]
  );

  const handleSort = (key: string) => {
    if (sortBy === key) {
      onSortChange(
        key,
        sortDir === 'asc' ? 'desc' : 'asc'
      );
    } else {
      onSortChange(key, 'asc');
    }

    setPage(1);
  };

  const handleExport = () => {
  exportEmployeesToCsv(
    employees,
    `employees-filtered-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`
  );
};

  return (
    <div>

      <div className={styles.tableToolbar}>

        <div className={styles.searchWrapper}>
          <Search
            size={16}
            className={styles.searchIcon}
          />

          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setPage(1);
            }}
            aria-label="Search employees"
          />
        </div>

        <button
          type="button"
          className={styles.exportButton}
          onClick={handleExport}
          disabled={employees.length === 0}
        >
          <Download size={16} />
          Export CSV ({employees.length})
        </button>

      </div>

      <div className={styles.tableCard}>

        {employees.length === 0 ? (
          <div className={styles.tableEmptyState}>
            No employees match the current filters and search term.
            Try adjusting your criteria.
          </div>
        ) : (
          <>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        aria-sort={
                          sortBy === col.key
                            ? sortDir === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <button
                          type="button"
                          className={styles.sortButton}
                          onClick={() =>
                            handleSort(col.key)
                          }
                        >
                          {col.label}
                          <ArrowUpDown size={12} />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {pageItems.map((emp) => (
                    <tr key={emp.id} tabIndex={0}>
                      <td>
                        <div className={styles.employeeCell}>
                          <span className={styles.employeeName}>
                            {emp.name}
                          </span>

                          <span className={styles.employeeEmail}>
                            {emp.email}
                          </span>
                        </div>
                      </td>

                      <td>{emp.department}</td>

                      <td>{emp.role}</td>

                      <td>{emp.location}</td>

                      <td>
                        <span
                          className={`${styles.statusPill} ${statusClass(
                            emp.status
                          )}`}
                        >
                          {emp.status.replace('-', ' ')}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.riskPill} ${riskClass(
                            emp.riskLevel
                          )}`}
                        >
                          {emp.riskLevel}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          emp.hireDate
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td>{emp.performanceScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.tableFooter}>
              <span>
                Showing{' '}
                {(currentPage - 1) * PAGE_SIZE + 1}
                –
                {Math.min(
                  currentPage * PAGE_SIZE,
                  employees.length
                )}{' '}
                of {employees.length}
              </span>

              <div className={styles.paginationButtons}>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() =>
                    setPage((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() =>
                    setPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}