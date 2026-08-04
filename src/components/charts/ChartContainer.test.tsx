import type { ReactNode } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChartContainer from './ChartContainer';

// jsdom reports 0x0 layout dimensions, so Recharts' real ResponsiveContainer
// never renders its children. Replace it with a deterministic stand-in that
// always renders its children, so these tests exercise ChartContainer's own
// state logic rather than Recharts' resize-observer behaviour.
vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

describe('ChartContainer', () => {
  it('renders the title, description and chart content when data is available', () => {
    render(
      <ChartContainer title="Headcount by Department" description="Employees per department">
        <div data-testid="chart-content">chart</div>
      </ChartContainer>
    );

    expect(screen.getByText('Headcount by Department')).toBeInTheDocument();
    expect(screen.getByText('Employees per department')).toBeInTheDocument();
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('uses the title as the accessible name when no aria label is provided', () => {
    render(
      <ChartContainer title="Distribution by Location">
        <div>chart</div>
      </ChartContainer>
    );

    expect(screen.getByRole('region', { name: 'Distribution by Location' })).toBeInTheDocument();
  });

  it('shows a loading indicator and hides chart content while loading', () => {
    render(
      <ChartContainer title="Trend" isLoading>
        <div data-testid="chart-content">chart</div>
      </ChartContainer>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading chart data/i)).toBeInTheDocument();
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument();
  });

  it('shows an empty-data message when there is no data', () => {
    render(
      <ChartContainer title="Trend" isEmpty emptyMessage="No trend data for the current filters.">
        <div data-testid="chart-content">chart</div>
      </ChartContainer>
    );

    expect(screen.getByText('No data to display')).toBeInTheDocument();
    expect(screen.getByText('No trend data for the current filters.')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument();
  });

  it('shows an error message with a working retry button', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ChartContainer title="Trend" isError errorMessage="Unable to reach the data service." onRetry={onRetry}>
        <div data-testid="chart-content">chart</div>
      </ChartContainer>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Unable to reach the data service.')).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument();
  });

  it('prioritises the loading state over error and empty states', () => {
    render(
      <ChartContainer title="Trend" isLoading isError isEmpty>
        <div data-testid="chart-content">chart</div>
      </ChartContainer>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders correctly regardless of the active theme attribute', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const { rerender } = render(
      <ChartContainer title="Trend">
        <div data-testid="chart-content">chart</div>
      </ChartContainer>
    );
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();

    document.documentElement.setAttribute('data-theme', 'light');
    rerender(
      <ChartContainer title="Trend">
        <div data-testid="chart-content">chart</div>
      </ChartContainer>
    );
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });

  it('applies a custom plotting-area height', () => {
    render(
      <ChartContainer title="Trend" height={360}>
        <div data-testid="chart-content">chart</div>
      </ChartContainer>
    );

    const body = screen.getByTestId('chart-content').parentElement?.parentElement;
    expect(body).toHaveStyle({ height: '360px' });
  });
});
