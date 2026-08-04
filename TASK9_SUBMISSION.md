# Task 9 — Reusable Chart Wrapper (Workforce Analytics Dashboard)

## Suggested branch names
```
git switch -c feature/team1-task9-chart-wrapper
git switch -c feature/team2-task9-chart-wrapper
```

## 1. Chart library decision
The project had **no chart library installed** (the three dashboard charts were
hand-rolled inline SVG). Per requirement #3, **Recharts** (`^3.10.1`) was
installed and is now the **only** chart library used across the project.

## 2. Files created
```
src/constants/chartConfig.ts
src/components/charts/ChartContainer.tsx
src/components/charts/ChartContainer.module.css   (companion styling, no inline/hard-coded values)
src/components/charts/ChartContainer.test.tsx
```

## 3. Files modified
```
src/components/charts/WorkforceTrendChart.tsx   -> now a Recharts <LineChart> wrapped in ChartContainer
src/components/charts/DepartmentChart.tsx       -> now a Recharts <BarChart> wrapped in ChartContainer
src/components/charts/LocationChart.tsx         -> now a Recharts <PieChart> (donut) wrapped in ChartContainer
src/pages/Dashboard.tsx                         -> wires shared fetch state (loading/error/retry) into each chart
src/index.css                                   -> adds chart series / grid / tooltip CSS variables for light & dark themes
package.json                                    -> adds recharts + @testing-library/user-event deps, adds "test" script
.gitignore                                      -> added (was missing from the uploaded project)
```

## 4. `chartConfig.ts` — shared configuration
Central source of truth for every chart:
- `CHART_COLORS` / `getChartColor(i)` — series palette (as CSS variables, so it
  re-colors automatically with the theme)
- `CHART_HEIGHT`, `CHART_HEIGHT_COMPACT` — default heights (no hard-coded chart heights anywhere else)
- `CHART_MARGIN` — shared plotting margins
- `CHART_GRID_CONFIG` — shared `CartesianGrid` appearance
- `CHART_AXIS_CONFIG` — shared axis styling
- `CHART_TOOLTIP_STYLE` / `CHART_TOOLTIP_LABEL_STYLE` — shared tooltip styling
- `CHART_LEGEND_STYLE` — shared legend styling
- `CHART_ANIMATION_DURATION` — shared animation timing
- `CHART_THEME_STYLES` — concrete light/dark fallback values for the rare case
  a chart needs a literal (non CSS-var) color in JS

## 5. `ChartContainer.tsx` — the reusable wrapper
Typed props (no `any`): `title`, `description?`, `height?`, `isLoading?`,
`isError?`, `errorMessage?`, `onRetry?`, `isEmpty?`, `emptyMessage?`,
`ariaLabel?`, `children` (a single Recharts element).

It renders, in priority order: **loading → error → empty → chart**, always
inside a titled `<section aria-label>` card, with the chart body sized to
`height` and made responsive via Recharts' `ResponsiveContainer`. The error
state includes a **Retry** button that calls `onRetry`.

## 6. Charts integrated (3 of 3 required)
1. **Workforce trend chart** — `WorkforceTrendChart.tsx` (hires vs. exits line chart)
2. **Department distribution chart** — `DepartmentChart.tsx` (headcount bar chart)
3. **Location chart** — `LocationChart.tsx` (donut chart)

All three consume the same `filteredEmployees` derived data
(`departmentChartData`, `locationChartData`, `workforceTrendData` from the
existing `src/utils/chartData.ts`), so when dashboard filters change, all
three charts update together automatically (React re-render from shared
`useMemo` state in `Dashboard.tsx`).

## 7. Loading / empty / error wiring
`Dashboard.tsx` passes the shared `useEmployeeData()` fetch state down to
every chart:
- `isLoading` = `state === 'loading'`
- `isError` = `state === 'error'`
- `errorMessage` = the hook's error message
- `onRetry` = `refetch` (shared data refetch — same as the dashboard's own Refresh button)
- `isEmpty` is computed per-chart from that chart's own derived data length

## 8. Theming
No colors are hard-coded. `chartConfig.ts` and `ChartContainer.module.css`
read exclusively from CSS custom properties (`--chart-series-*`,
`--chart-grid-color`, `--chart-axis-color`, `--chart-tooltip-*`,
`--bg-*`, `--text-*`, etc.), which are already toggled by the existing
`ThemeContext` (`data-theme="light" | "dark"` on `<html>`). No per-chart theme
logic was needed — flipping the app theme re-themes every chart automatically.

## 9. Responsiveness
`ChartContainer` uses Recharts' `ResponsiveContainer` (`width="100%" height="100%"`)
inside a card with `min-width: 0`, and the dashboard's existing CSS grid
(`.chartsGrid`) already reflows from 1 column (mobile/tablet) to a 2-column
grid at `min-width: 1024px` (desktop), with the trend chart spanning full width.

## 10. Testing
`ChartContainer.test.tsx` (8 tests, all passing):
- renders title, description, and chart content with valid data
- accessible name via `aria-label`
- loading state shown / chart hidden
- empty-data state shown / chart hidden
- error state shown with working **Retry** button (`vi.fn()` assertion)
- loading takes priority over error/empty
- renders correctly under both `data-theme="dark"` and `"light"`
- custom `height` prop is applied to the chart body

Recharts' `ResponsiveContainer` was mocked in the test file (jsdom reports
0×0 layout, so Recharts' real resize-observer logic never renders children in
a test environment) — this is the standard approach for unit-testing
Recharts-based components.

## 11. Verified command results
```
npm install                 # recharts + @testing-library/user-event added
npm run lint                # oxlint -> 0 errors, 4 pre-existing warnings (unrelated files, not touched by Task 9)
npm run build               # tsc -b && vite build -> succeeds
npm test -- --run           # vitest -> 9 test files, 56/56 tests passed
```

## 12. Remaining limitations / notes for the demo
- The pre-existing warnings from `oxlint` (react-refresh export-shape hints in
  `AuthContext.tsx`/`ThemeContext.tsx`, and `exhaustive-deps` in
  `useUrlFilters.ts`) are outside Task 9's scope and were left untouched.
- `node_modules` and `dist` are excluded from this archive — run `npm install`
  after unzipping, then `npm run dev` / `npm run build` as usual.
- Desktop/mobile screenshots and the 5-minute live demo are best captured by
  each team from their own running `npm run dev` instance, since screenshots
  from this environment couldn't be generated headlessly here.
