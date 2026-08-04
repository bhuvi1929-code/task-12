import type { CSSProperties } from 'react';

/**
 * Single source of truth for chart appearance across the Workforce Analytics
 * Dashboard. Every chart must read colours, spacing and theme styling from
 * here instead of hard-coding values, so the whole dashboard stays visually
 * consistent and easy to re-theme.
 */

export type ChartThemeName = 'light' | 'dark';

/** Ordered series palette. Charts pick colours via `getChartColor(index)`. */
export const CHART_COLORS: readonly string[] = [
  'var(--chart-series-1)',
  'var(--chart-series-2)',
  'var(--chart-series-3)',
  'var(--chart-series-4)',
  'var(--chart-series-5)',
  'var(--chart-series-6)',
];

/** Returns a series colour, cycling through the palette for extra categories. */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/** Default chart plotting area height (px) used by ChartContainer. */
export const CHART_HEIGHT = 300;

/** Compact height for smaller/secondary chart cards. */
export const CHART_HEIGHT_COMPACT = 240;

/** Shared margins for Recharts plotting areas. */
export const CHART_MARGIN = { top: 8, right: 16, bottom: 4, left: 0 } as const;

/** Shared animation duration (ms) for chart transitions. */
export const CHART_ANIMATION_DURATION = 400;

export interface ChartGridConfig {
  strokeDasharray: string;
  stroke: string;
  vertical: boolean;
}

/** Shared Cartesian grid appearance. */
export const CHART_GRID_CONFIG: ChartGridConfig = {
  strokeDasharray: '3 3',
  stroke: 'var(--chart-grid-color)',
  vertical: false,
};

export interface ChartAxisConfig {
  stroke: string;
  tickLine: boolean;
  axisLine: boolean;
  fontSize: number;
}

/** Shared axis appearance for XAxis / YAxis. */
export const CHART_AXIS_CONFIG: ChartAxisConfig = {
  stroke: 'var(--chart-axis-color)',
  tickLine: false,
  axisLine: false,
  fontSize: 12,
};

/** Shared tooltip container styling. */
export const CHART_TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: '#0f172a',
  border: '1px solid #38bdf8',
  borderRadius: '12px',
  boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
  color: '#ffffff',
  fontSize: '0.9rem',
  fontWeight: 700,
  padding: '10px 14px',
  opacity: 1,
};

/** Shared tooltip label styling. */
export const CHART_TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: '#38bdf8',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '0.35rem',
};

/** Shared tooltip item styling for crisp high-contrast text. */
export const CHART_TOOLTIP_ITEM_STYLE: CSSProperties = {
  color: '#ffffff',
  fontWeight: 700,
};

/** Shared legend wrapper styling. */
export const CHART_LEGEND_STYLE: CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
};

export interface ChartThemeStyles {
  gridStroke: string;
  axisStroke: string;
  tooltipBackground: string;
  tooltipBorder: string;
}

/**
 * Concrete (non CSS-variable) theme values, for the rare cases where a chart
 * needs a literal colour in JS rather than an inline style/attribute (e.g.
 * computing a gradient stop). Prefer the CSS custom properties above whenever
 * possible; fall back to these only when a literal value is required.
 */
export const CHART_THEME_STYLES: Record<ChartThemeName, ChartThemeStyles> = {
  light: {
    gridStroke: '#e4e8f2',
    axisStroke: '#64748b',
    tooltipBackground: '#ffffff',
    tooltipBorder: '#e4e8f2',
  },
  dark: {
    gridStroke: 'rgba(148, 163, 184, 0.14)',
    axisStroke: '#8390a8',
    tooltipBackground: '#17223a',
    tooltipBorder: 'rgba(148, 163, 184, 0.14)',
  },
};
