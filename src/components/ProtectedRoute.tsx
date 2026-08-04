import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { checkRoutePermission } from '../config/permissions';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 1. Check explicit prop role permissions if provided on the route
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 2. Check centralized path-prefix permissions (protects against direct browser URL entry)
  if (!checkRoutePermission(location.pathname, user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
