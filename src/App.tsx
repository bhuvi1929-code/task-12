import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlatformProvider } from './contexts/PlatformContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ROLE_DEFAULT_ROUTES } from './config/permissions';
import AppLayout from './components/Layout/AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Public / State Pages
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import SessionExpired from './pages/SessionExpired';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import RolePermissions from './pages/admin/RolePermissions';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import AdminReports from './pages/admin/AdminReports';
import AuditLogs from './pages/admin/AuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import HREmployees from './pages/hr/HREmployees';
import HRRecruitment from './pages/hr/HRRecruitment';
import HRAttendance from './pages/hr/HRAttendance';
import HRLeave from './pages/hr/HRLeave';
import HRPerformance from './pages/hr/HRPerformance';
import HRAnalytics from './pages/hr/HRAnalytics';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerTeam from './pages/manager/ManagerTeam';
import ManagerAttendance from './pages/manager/ManagerAttendance';
import ManagerLeave from './pages/manager/ManagerLeave';
import ManagerPerformance from './pages/manager/ManagerPerformance';
import ManagerAnalytics from './pages/manager/ManagerAnalytics';

// Automatically redirects from root "/" to the appropriate role-based dashboard
function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const targetRoute = ROLE_DEFAULT_ROUTES[user.role] || '/admin/dashboard';
  return <Navigate to={targetRoute} replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PlatformProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/session-expired" element={<SessionExpired />} />
                
                {/* Protected Application Routes (RBAC enforced dynamically by ProtectedRoute) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<RootRedirect />} />
                  <Route element={<AppLayout />}>
                    {/* Admin Module */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/roles" element={<RolePermissions />} />
                    <Route path="/admin/departments" element={<DepartmentManagement />} />
                    <Route path="/admin/reports" element={<AdminReports />} />
                    <Route path="/admin/audit-logs" element={<AuditLogs />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    
                    {/* HR Module */}
                    <Route path="/hr/dashboard" element={<HRDashboard />} />
                    <Route path="/hr/employees" element={<HREmployees />} />
                    <Route path="/hr/recruitment" element={<HRRecruitment />} />
                    <Route path="/hr/attendance" element={<HRAttendance />} />
                    <Route path="/hr/leave" element={<HRLeave />} />
                    <Route path="/hr/performance" element={<HRPerformance />} />
                    <Route path="/hr/analytics" element={<HRAnalytics />} />
                    <Route path="/hr/reports" element={<HRAnalytics />} />
                    
                    {/* Manager Module */}
                    <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                    <Route path="/manager/team" element={<ManagerTeam />} />
                    <Route path="/manager/attendance" element={<ManagerAttendance />} />
                    <Route path="/manager/leave-requests" element={<ManagerLeave />} />
                    <Route path="/manager/leave" element={<ManagerLeave />} />
                    <Route path="/manager/performance" element={<ManagerPerformance />} />
                    <Route path="/manager/analytics" element={<ManagerAnalytics />} />
                    <Route path="/manager/reports" element={<ManagerAnalytics />} />
                  </Route>
                </Route>

                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Router>
          </PlatformProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
