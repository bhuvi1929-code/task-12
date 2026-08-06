import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  AuthProvider,
  useAuth,
} from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PlatformProvider } from "./contexts/PlatformContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ROLE_DEFAULT_ROUTES } from "./config/permissions";
import AppLayout from "./components/Layout/AppLayout";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

/* ---------------- Public Pages ---------------- */

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import SessionExpired from "./pages/SessionExpired";
import NotFound from "./pages/NotFound";

/* ---------------- Admin ---------------- */

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RolePermissions from "./pages/admin/RolePermissions";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import AdminReports from "./pages/admin/AdminReports";
import AuditLogs from "./pages/admin/AuditLogs";
import AdminSettings from "./pages/admin/AdminSettings";

/* ---------------- HR ---------------- */

import HRDashboard from "./pages/hr/HRDashboard";
import HREmployees from "./pages/hr/HREmployees";
import HRRecruitment from "./pages/hr/HRRecruitment";
import HRAttendance from "./pages/hr/HRAttendance";
import HRLeave from "./pages/hr/HRLeave";
import HRPerformance from "./pages/hr/HRPerformance";
import HRAnalytics from "./pages/hr/HRAnalytics";

/* ---------------- Manager ---------------- */

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerTeam from "./pages/manager/ManagerTeam";
import ManagerAttendance from "./pages/manager/ManagerAttendance";
import ManagerLeave from "./pages/manager/ManagerLeave";
import ManagerPerformance from "./pages/manager/ManagerPerformance";
import ManagerAnalytics from "./pages/manager/ManagerAnalytics";

/* =====================================================
   Redirect Root
===================================================== */

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!user.token) {
    return <Navigate to="/session-expired" replace />;
  }

  return (
    <Navigate
      to={ROLE_DEFAULT_ROUTES[user.role]}
      replace
    />
  );
}

/* =====================================================
   APP
===================================================== */

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PlatformProvider>
            <Router>

              <Routes>

                {/* ---------------- Public ---------------- */}

                <Route
                  path="/login"
                  element={<Login />}
                />

                <Route
                  path="/unauthorized"
                  element={<Unauthorized />}
                />

                <Route
                  path="/session-expired"
                  element={<SessionExpired />}
                />

                <Route
                  path="/404"
                  element={<NotFound />}
                />

                {/* ------------ Protected ------------ */}

                <Route element={<ProtectedRoute />}>

                  <Route
                    path="/"
                    element={<RootRedirect />}
                  />

                  <Route element={<AppLayout />}>

                    {/* ================= ADMIN ================= */}

                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={["Admin"]}
                        />
                      }
                    >
                      <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                      />

                      <Route
                        path="/admin/users"
                        element={<UserManagement />}
                      />

                      <Route
                        path="/admin/roles"
                        element={<RolePermissions />}
                      />

                      <Route
                        path="/admin/departments"
                        element={<DepartmentManagement />}
                      />

                      <Route
                        path="/admin/reports"
                        element={<AdminReports />}
                      />

                      <Route
                        path="/admin/audit-logs"
                        element={<AuditLogs />}
                      />

                      <Route
                        path="/admin/settings"
                        element={<AdminSettings />}
                      />
                    </Route>

                    {/* ================= HR ================= */}

                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={["Admin", "HR"]}
                        />
                      }
                    >
                      <Route
                        path="/hr/dashboard"
                        element={<HRDashboard />}
                      />

                      <Route
                        path="/hr/employees"
                        element={<HREmployees />}
                      />

                      <Route
                        path="/hr/recruitment"
                        element={<HRRecruitment />}
                      />

                      <Route
                        path="/hr/attendance"
                        element={<HRAttendance />}
                      />

                      <Route
                        path="/hr/leave"
                        element={<HRLeave />}
                      />

                      <Route
                        path="/hr/performance"
                        element={<HRPerformance />}
                      />

                      <Route
                        path="/hr/analytics"
                        element={<HRAnalytics />}
                      />

                      <Route
                        path="/hr/reports"
                        element={<HRAnalytics />}
                      />
                    </Route>

                    {/* ================= MANAGER ================= */}

                    <Route
                      element={
                        <ProtectedRoute
                          allowedRoles={["Admin", "Manager"]}
                        />
                      }
                    >
                      <Route
                        path="/manager/dashboard"
                        element={<ManagerDashboard />}
                      />

                      <Route
                        path="/manager/team"
                        element={<ManagerTeam />}
                      />

                      <Route
                        path="/manager/attendance"
                        element={<ManagerAttendance />}
                      />

                      <Route
                        path="/manager/leave"
                        element={<ManagerLeave />}
                      />

                      <Route
                        path="/manager/leave-requests"
                        element={<ManagerLeave />}
                      />

                      <Route
                        path="/manager/performance"
                        element={<ManagerPerformance />}
                      />

                      <Route
                        path="/manager/analytics"
                        element={<ManagerAnalytics />}
                      />

                      <Route
                        path="/manager/reports"
                        element={<ManagerAnalytics />}
                      />
                    </Route>

                  </Route>

                </Route>

                {/* ------------ 404 ------------ */}

                <Route
                  path="*"
                  element={<NotFound />}
                />

              </Routes>

            </Router>
          </PlatformProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;