# Workforce Analytics Dashboard — Day 7

An advanced, fully functional Workforce Analytics Dashboard built with React, TypeScript, and Vite. This extends the Day 5 design system and the Day 6 application shell/architecture into a complete, data-driven experience.

## What's new in Day 7

- **Mock workforce data layer** — 260 deterministic, seeded employee records (`src/data/mockEmployees.ts`) with department, role, location, status, risk level, hire/termination dates, performance, and training data.
- **Simulated async fetch** (`useEmployeeData`) with realistic `loading → success/empty/error` state transitions and a retry action.
- **Eight functional KPI cards**, each computed from live filtered data with genuine period-over-period trend math:
  1. Total Employees
  2. Active Employees
  3. New Hires (last 90 days)
  4. Attrition Rate
  5. High-Risk Employees
  6. Avg Performance Score
  7. Training Completion
  8. Avg Tenure
- **Six working filters** (department, role, location, status, risk, date range) synced to the URL, plus search — all combine to drive the KPIs, charts, and table together.
- **Three charts**, built as lightweight dependency-free SVG components so the project needed no new packages:
  - 12-month hires-vs-exits trend (line chart)
  - Headcount by department (bar chart)
  - Distribution by location (donut chart)
- **KPI drill-down panel** — click (or press Enter/Space on) any KPI card to open an accessible slide-over panel with a department-level breakdown.
- **Searchable, sortable, paginated employee summary table** with CSV export of exactly the currently filtered dataset.
- **Full state coverage**: loading skeletons, empty state (with a "Reset Filters" action), error state (with retry), 404, and unauthorized — all themed consistently.
- **Light/dark themes** preserved from Day 5/6 and applied to every new component via the existing CSS variable system.
- **Unit + integration tests** (Vitest + React Testing Library) covering KPI math, filtering/sorting, CSV export, the employee table, the drill-down panel, and a full Dashboard integration flow.

## Tech Stack

- React 19, TypeScript, Vite 8
- React Router DOM (routing, protected routes, role-based access)
- Vanilla CSS Modules (no Tailwind, no chart library — charts are hand-built SVG)
- Lucide React (icons)
- Vitest & React Testing Library

## Project Structure

```
src/
├── components/
│   ├── charts/            # DepartmentChart, LocationChart, WorkforceTrendChart
│   ├── DrillDownPanel.tsx
│   ├── EmployeeTable.tsx
│   ├── StateViews.tsx     # Loading / Empty / Error
│   ├── KpiCard.tsx
│   └── Layout/             # Sidebar, Header, AppLayout (Day 6)
├── contexts/                # Auth, Theme (Day 6)
├── data/
│   └── mockEmployees.ts
├── hooks/
│   ├── useEmployeeData.ts
│   └── useUrlFilters.ts    (Day 6)
├── pages/
│   └── Dashboard.tsx        # rewritten for Day 7
├── styles/
│   └── dashboard.module.css # new styles for charts/table/drilldown/states
├── types/
│   └── index.ts
└── utils/
    ├── chartData.ts
    ├── csvExport.ts
    ├── filterEmployees.ts
    └── kpiCalculations.ts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Run tests:
   ```bash
   npx vitest run
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Lint:
   ```bash
   npm run lint
   ```

## Test Results

```
Test Files  8 passed (8)
     Tests  44 passed (44)
```

Covers: `kpiCalculations` (trend math, all 8 KPIs, empty dataset), `filterEmployees` (each filter + combinations, search, sorting, immutability), `csvExport` (headers, escaping, empty list), `EmployeeTable`, `DrillDownPanel`, `KpiCard`, `useUrlFilters`, and a `Dashboard` integration suite (loading state, KPI rendering, table rendering, drill-down open flow, filter → table interaction).

`npm run lint` (oxlint): 0 errors. `tsc -b`: clean (aside from a pre-existing, unrelated Vitest/Vite config type overload warning inherited from Day 6).

## Known Notes / Design Decisions

- All data is a seeded, deterministic mock dataset (no backend). This makes trends, filters, and CSV export fully functional and testable without an API.
- KPI trends compare a recent time window (last 90 days) against the equivalent prior window from the same filtered dataset, so every trend number is derived from real data rather than hard-coded.
- Charts are custom SVG (no chart library) to avoid adding new dependencies to the Day 6 architecture; they use the same CSS variable theme as the rest of the app, so they respect light/dark mode automatically.
- The KPI drill-down panel currently breaks a KPI down by department; it's built to easily extend to other dimensions (location, risk, role) if needed.

## Individual Contribution Template

_Fill in for your team's submission:_

| Member | Responsibility | Status |
|---|---|---|
| | Filters + URL sync | |
| | KPI calculations + drill-down | |
| | Charts | |
| | Employee table + CSV export | |
| | States (loading/empty/error/404/unauthorized) + accessibility | |
| | Testing | |
| | Documentation / demo | |

## Pending / Next Steps

- Wire the `Employees`, `Departments`, and `Risk Analysis` nav pages to the same data layer (currently placeholders, unchanged from Day 6) if the team wants dedicated deep-dive pages beyond the main Dashboard.
- Add end-to-end (Playwright/Cypress) tests to complement the current unit/integration suite.
- Connect to a real workforce API in place of `mockEmployees.ts` when a backend is available.
