import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import type { CategoryPoint } from '../../utils/chartData';
import ChartContainer from './ChartContainer';
import {
  CHART_ANIMATION_DURATION,
  CHART_LEGEND_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
  getChartColor,
} from '../../constants/chartConfig';

export interface LocationChartProps {
  data: CategoryPoint[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function LocationChart({
  data,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}: LocationChartProps) {
  return (
    <ChartContainer
      title="Distribution by Location"
      description="Share of the filtered workforce by office location."
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      onRetry={onRetry}
      isEmpty={!isLoading && !isError && data.length === 0}
      emptyMessage="No location data for the current filters."
      ariaLabel="Donut chart of employee distribution by location"
    >
      <PieChart>
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={CHART_TOOLTIP_LABEL_STYLE} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={CHART_LEGEND_STYLE}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          animationDuration={CHART_ANIMATION_DURATION}
        >
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={getChartColor(index)} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
