import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts';
import type { CategoryPoint } from '../../utils/chartData';
import ChartContainer from './ChartContainer';
import {
  CHART_ANIMATION_DURATION,
  CHART_AXIS_CONFIG,
  CHART_GRID_CONFIG,
  CHART_MARGIN,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
  CHART_TOOLTIP_ITEM_STYLE,
  getChartColor,
} from '../../constants/chartConfig';

export interface DepartmentChartProps {
  data: CategoryPoint[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function DepartmentChart({
  data,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}: DepartmentChartProps) {
  return (
    <ChartContainer
      title="Department Breakdown"
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      isEmpty={!isLoading && !isError && data.length === 0}
      emptyMessage="No department data for the current filters."
      ariaLabel="Bar chart of employee headcount by department"
    >
      <BarChart data={data} layout="vertical" margin={{ ...CHART_MARGIN, left: 12 }}>
        <CartesianGrid {...CHART_GRID_CONFIG} horizontal={false} />
        <XAxis type="number" allowDecimals={false} {...CHART_AXIS_CONFIG} />
        <YAxis type="category" dataKey="label" width={115} {...CHART_AXIS_CONFIG} />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={CHART_TOOLTIP_LABEL_STYLE}
          itemStyle={CHART_TOOLTIP_ITEM_STYLE}
          cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
        />
        <Bar dataKey="value" name="Employees" radius={[0, 4, 4, 0]} animationDuration={CHART_ANIMATION_DURATION}>
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={getChartColor(index)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
