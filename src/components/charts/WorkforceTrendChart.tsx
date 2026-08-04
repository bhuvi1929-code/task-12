import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import type { TrendPoint } from '../../utils/chartData';
import ChartContainer from './ChartContainer';
import {
  CHART_ANIMATION_DURATION,
  CHART_AXIS_CONFIG,
  CHART_GRID_CONFIG,
  CHART_LEGEND_STYLE,
  CHART_MARGIN,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
  getChartColor,
} from '../../constants/chartConfig';

export interface WorkforceTrendChartProps {
  data: TrendPoint[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function WorkforceTrendChart({
  data,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}: WorkforceTrendChartProps) {
  return (
    <ChartContainer
      title="12-Month Hires vs. Exits"
      description="Monthly hiring and attrition trend for the filtered workforce."
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      isEmpty={!isLoading && !isError && data.length === 0}
      emptyMessage="No trend data for the current filters."
      ariaLabel="Line chart of monthly hires versus exits over the last 12 months"
    >
      <LineChart data={data} margin={{ ...CHART_MARGIN }}>
        <CartesianGrid {...CHART_GRID_CONFIG} />
        <XAxis dataKey="label" {...CHART_AXIS_CONFIG} />
        <YAxis allowDecimals={false} {...CHART_AXIS_CONFIG} width={32} />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={CHART_TOOLTIP_LABEL_STYLE}
          cursor={{ stroke: 'var(--border-strong)' }}
        />
        <Legend wrapperStyle={CHART_LEGEND_STYLE} />
        <Line
          type="monotone"
          dataKey="hires"
          name="Hires"
          stroke={getChartColor(1)}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4 }}
          animationDuration={CHART_ANIMATION_DURATION}
        />
        <Line
          type="monotone"
          dataKey="exits"
          name="Exits"
          stroke={getChartColor(3)}
          strokeWidth={2.5}
          strokeDasharray="4 3"
          dot={false}
          activeDot={{ r: 4 }}
          animationDuration={CHART_ANIMATION_DURATION}
        />
      </LineChart>
    </ChartContainer>
  );
}
