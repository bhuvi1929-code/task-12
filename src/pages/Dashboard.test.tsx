import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './Dashboard';

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Dashboard />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Dashboard (integration)', () => {
  it('shows a loading state before data resolves', () => {
    renderDashboard();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders all 8 KPI cards once data has loaded', async () => {
    renderDashboard();
    await waitFor(() => expect(screen.getAllByText('Total Employees').length).toBeGreaterThan(0), { timeout: 3000 });

    expect(screen.getAllByText('Active Employees').length).toBeGreaterThan(0);
    expect(screen.getAllByText('New Hires').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Attrition Rate').length).toBeGreaterThan(0);
    expect(screen.getAllByText('High-Risk Employees').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Avg Performance Score').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Training Completion').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Avg Tenure').length).toBeGreaterThan(0);
  });

  it('renders the employee summary table once loaded', async () => {
    renderDashboard();
    await waitFor(() => expect(screen.getAllByPlaceholderText(/Search/i).length).toBeGreaterThan(0), { timeout: 3000 });
  });

  it('opens the drill-down panel when a KPI card is clicked', async () => {
    renderDashboard();
    await waitFor(() => expect(screen.getAllByText('Total Employees').length).toBeGreaterThan(0), { timeout: 3000 });

    fireEvent.click(screen.getAllByText('Total Employees')[0]);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Total Employees')).toBeInTheDocument();
    expect(within(dialog).getByText('Breakdown by department')).toBeInTheDocument();
  });

});
