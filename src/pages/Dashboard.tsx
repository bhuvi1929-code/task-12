import { useState, useEffect, useMemo } from 'react';
import {
  Users, UserMinus, UserPlus, AlertTriangle, TrendingUp, GraduationCap, Clock, Heart,
  Download, RefreshCw, LayoutDashboard, LayoutTemplate, ShieldAlert, ShieldCheck, Save
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Components
import KpiCard from '../components/KpiCard';
import DrillDownPanel from '../components/DrillDownPanel';
import EmployeeTable from '../components/EmployeeTable';
import DepartmentChart from '../components/charts/DepartmentChart';
import LocationChart from '../components/charts/LocationChart';
import WorkforceTrendChart from '../components/charts/WorkforceTrendChart';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
import FilterPanel from '../components/FilterPanel';
import FilterSummary from '../components/FilterSummary';
import SaveViewModal from '../components/SaveViewModal';

// Custom Hooks & Utilities
import { useUrlFilters } from '../hooks/useUrlFilters';
import { useEmployeeData } from '../hooks/useEmployeeData';
import { useFilterHistory } from '../hooks/useFilterHistory';
import { useSavedViews } from '../hooks/useSavedViews';
import { applyFilters, sortEmployees } from '../utils/filterEmployees';
import { computeKpis } from '../utils/kpiCalculations';
import { departmentChartData, locationChartData, workforceTrendData } from '../utils/chartData';
import { exportToCsv } from '../utils/csvExport';

// Types & Styles
import type { DashboardFilters, KpiDefinition, Employee } from '../types';
import pageStyles from '../styles/pages.module.css';
import dashStyles from '../styles/dashboard.module.css';

/* ==========================================================================
   CONSTANTS & MAPS
   ========================================================================== */
const ICON_MAP: Record<string, LucideIcon> = {
  Users, UserMinus, UserPlus, AlertTriangle, TrendingUp, GraduationCap, Clock, Heart,
};

const DEFAULT_FILTERS: DashboardFilters = {
  department: [],
  role: [],
  location: [],
  status: [],
  risk: [],
  skills: [],
  experience: [],
  date: 'all',
  search: '',
  sortBy: 'name',
  sortDir: 'asc',
};

/* ==========================================================================
   COMPONENT: DashboardView (Encapsulates a single panel in normal or compare mode)
   ========================================================================== */
interface DashboardViewProps {
  prefix?: string;
  isAdminFocus?: boolean;
  title?: string;
  employeesData: Employee[];
  onRefresh: () => void;
  lastUpdated: Date | null;
  isChartDataLoading: boolean;
  isChartDataError: boolean;
  chartErrorMessage: string | null;
}

function DashboardView({
  prefix = '',
  isAdminFocus = false,
  title = "Overview",
  employeesData,
  onRefresh,
  lastUpdated,
  isChartDataLoading,
  isChartDataError,
  chartErrorMessage,
}: DashboardViewProps) {
  // 1. URL & Filter State
  const { getFilter, setFilter, setAllFilters, clearFilters, searchInputValue, handleSearchChange } = useUrlFilters(DEFAULT_FILTERS, prefix);
  
  const filters: DashboardFilters = useMemo(() => {
    const f: DashboardFilters = {
      department: getFilter('department'),
      role: getFilter('role'),
      location: getFilter('location'),
      status: getFilter('status'),
      risk: getFilter('risk'),
      skills: getFilter('skills'),
      experience: getFilter('experience'),
      date: getFilter('date'),
      dateStart: getFilter('dateStart'),
      dateEnd: getFilter('dateEnd'),
      search: getFilter('search'),
      sortBy: getFilter('sortBy'),
      sortDir: getFilter('sortDir'),
    };
    if (isAdminFocus) {
      f.department = ['Operations', 'HR', 'Engineering']; // Filter to Admin & HR Core Operations
    }
    return f;
  }, [getFilter, isAdminFocus]);

  // 2. Filter History & Saved Views
  const { undo, canUndo } = useFilterHistory(filters, setAllFilters);
  const { views, saveView } = useSavedViews<DashboardFilters>();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeKpi, setActiveKpi] = useState<KpiDefinition | null>(null);

  // 3. Filtered & Computed Data
  const filteredEmployees = useMemo(() => applyFilters(employeesData, filters), [employeesData, filters]);
  const sortedEmployees = useMemo(
    () => sortEmployees(filteredEmployees, filters.sortBy as string, filters.sortDir as string),
    [filteredEmployees, filters.sortBy, filters.sortDir]
  );

  const kpis = useMemo(() => computeKpis(filteredEmployees), [filteredEmployees]);
  const deptData = useMemo(() => departmentChartData(filteredEmployees), [filteredEmployees]);
  const locData = useMemo(() => locationChartData(filteredEmployees), [filteredEmployees]);
  const trendData = useMemo(() => workforceTrendData(filteredEmployees), [filteredEmployees]);

  // 4. Handlers
  const handleExport = () => {
    exportToCsv(filteredEmployees, `workforce_export_${new Date().getTime()}.csv`);
  };

  return (
    <div style={{ flex: 1, minWidth: '380px' }}>
      {/* Panel Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: "var(--text-primary)", margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{title}</h2>
        {isAdminFocus && (
           <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, marginTop: 4 }}>
             <ShieldCheck size={16} color="#6366f1" /> Admin & HR Executive Operations Focus
           </span>
        )}
      </div>

      {/* Toolbar Row: Updated timestamp, Preset Selector, Save, Refresh, Export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.875rem', color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Updated: <span style={{ fontWeight: 500, color: "var(--text-secondary)" }}>{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Just now'}</span>
        </span>

        <select 
          style={{ fontSize: '0.875rem', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', backgroundColor:"var(--bg-primary)", color:"var(--text-primary)", minWidth: '160px', flex: 1, maxWidth: '200px', cursor: 'pointer', outline: 'none' }}
          onChange={(e) => {
            if (e.target.value) {
              const view = views.find(v => v.id === e.target.value);
              if (view) setAllFilters(view.filters);
              e.target.value = "";
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>Load Saved View...</option>
          {views.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>

        <button 
          type="button" 
          onClick={() => setIsSaveModalOpen(true)} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', fontWeight: 600, color: '#334155', backgroundColor: "var(--bg-secondary)", border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', flexShrink: 0 }}
          title="Save Current Filters"
        >
          <Save size={16} />
          Save View
        </button>

        <button 
          type="button" 
          onClick={onRefresh} 
          aria-label="Refresh"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '8px', backgroundColor: '#f1f5f9', border: 'none', cursor: 'pointer', flexShrink: 0, color: "var(--text-secondary)" }}
          title="Refresh Data"
        >
          <RefreshCw size={16} />
        </button>

        <button 
          type="button" 
          onClick={handleExport}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', fontWeight: 600, color: '#4f46e5', backgroundColor: '#eef2ff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', flexShrink: 0 }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filter Control Panel */}
      <FilterPanel 
        filters={filters} 
        setFilter={setFilter} 
        clearFilters={clearFilters} 
        undo={undo}
        canUndo={canUndo}
        isAdminFocus={isAdminFocus}
      />
      
      {/* Active Criteria & Matches Banner */}
      <FilterSummary filters={filters} totalMatches={filteredEmployees.length} />

      {/* Dynamic Content Views */}
      {filteredEmployees.length === 0 ? (
        <EmptyState onReset={clearFilters} />
      ) : (
        <>
          {/* KPI Cards Grid */}
          <div className={pageStyles.kpiGrid}>
            {kpis.map((kpi) => (
              <KpiCard
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                icon={ICON_MAP[kpi.icon] ?? Users}
                trend={kpi.trend}
                trendLabel={kpi.trendLabel}
                badgeText={kpi.badgeText}
                targetText={kpi.targetText}
                progressValue={kpi.progressValue}
                themeColor={kpi.themeColor}
                onClick={() => setActiveKpi(kpi as KpiDefinition)}
              />
            ))}
          </div>

          {/* Interactive Charts Grid - each chart integrates the shared ChartContainer wrapper */}
          <div className={dashStyles.chartsGrid} style={{ marginTop: 24, marginBottom: 24 }}>
            <div className={dashStyles.chartCardWide}>
              <WorkforceTrendChart
                data={trendData}
                isLoading={isChartDataLoading}
                isError={isChartDataError}
                errorMessage={chartErrorMessage ?? undefined}
                onRetry={onRefresh}
              />
            </div>
            <DepartmentChart
              data={deptData}
              isLoading={isChartDataLoading}
              isError={isChartDataError}
              errorMessage={chartErrorMessage ?? undefined}
              onRetry={onRefresh}
            />
            <LocationChart
              data={locData}
              isLoading={isChartDataLoading}
              isError={isChartDataError}
              errorMessage={chartErrorMessage ?? undefined}
              onRetry={onRefresh}
            />
          </div>

          {/* Employee Summary Table */}
          <EmployeeTable
            employees={sortedEmployees}
            search={searchInputValue}
            onSearchChange={handleSearchChange}
            sortBy={filters.sortBy as string}
            sortDir={filters.sortDir as string}
            onSortChange={(sb, sd) => {
              setFilter('sortBy' as keyof DashboardFilters, sb);
              setFilter('sortDir' as keyof DashboardFilters, sd);
            }}
          />
        </>
      )}

      {/* KPI DrillDown Modal */}
      <DrillDownPanel kpi={activeKpi} onClose={() => setActiveKpi(null)} />
      
      {/* Save View Modal Popover */}
      <SaveViewModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
        onSave={(name) => saveView(name, filters)} 
        filters={filters} 
      />
    </div>
  );
}

/* ==========================================================================
   ROOT COMPONENT: Dashboard (Main Page Route)
   ========================================================================== */
export default function Dashboard() {
  const [comparisonMode, setComparisonMode] = useState(false);
  const [isAdminFocus, setIsAdminFocus] = useState(false);
  const { employees, state, error, refetch, isFetching } = useEmployeeData();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (state === 'success' && !isFetching) {
      setLastUpdated(new Date());
    }
  }, [state, isFetching]);

  if (state === 'loading' && !employees.length) return <LoadingState />;
  if (state === 'error' && !employees.length) return <ErrorState message={error ?? 'Unknown error occurred.'} onRetry={refetch} />;

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Global Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: "var(--bg-primary)", padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Global Workforce & Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input 
              type="checkbox" 
              checked={isAdminFocus} 
              onChange={(e) => setIsAdminFocus(e.target.checked)} 
            />
            Simulate Admin & HR Operations View
          </label>
          <div style={{ width: 1, height: 24, background: '#e5e7eb' }}></div>
          <button 
            type="button" 
            onClick={() => setComparisonMode(!comparisonMode)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: comparisonMode ? '#eef2ff' : 'white', border: "1px solid var(--border-color)", padding: '6px 12px', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', color: comparisonMode ? '#4f46e5' : '#374151' }}
          >
            {comparisonMode ? <LayoutDashboard size={16} /> : <LayoutTemplate size={16} />}
            {comparisonMode ? 'Disable Comparison' : 'Compare Views'}
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout (Single view or side-by-side comparison mode) */}
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <DashboardView
          prefix={comparisonMode ? 'a_' : ''}
          isAdminFocus={isAdminFocus}
          title={comparisonMode ? "View A" : "Overview"}
          employeesData={employees}
          onRefresh={refetch}
          lastUpdated={lastUpdated}
          isChartDataLoading={state === 'loading'}
          isChartDataError={state === 'error'}
          chartErrorMessage={error}
        />
        {comparisonMode && (
          <DashboardView
            prefix="b_"
            isAdminFocus={isAdminFocus}
            title="View B"
            employeesData={employees}
            onRefresh={refetch}
            lastUpdated={lastUpdated}
            isChartDataLoading={state === 'loading'}
            isChartDataError={state === 'error'}
            chartErrorMessage={error}
          />
        )}
      </div>
    </div>
  );
}
