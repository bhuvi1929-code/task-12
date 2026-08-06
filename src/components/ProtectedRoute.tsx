import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types";
import { checkRoutePermission } from "../config/permissions";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const {
    user,
    isAuthenticated,
    expireSession,
  } = useAuth();

  const location = useLocation();

  /* ===========================================
      1. User Not Logged In
  =========================================== */

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /* ===========================================
      2. Invalid Token
  =========================================== */

  if (!user.token) {
    expireSession();

    return null;
  }

  /* ===========================================
      3. Route Role Validation
  =========================================== */

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    addAuditLog(
      user.name,
      user.role,
      "ACCESS DENIED",
      location.pathname
    );

    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  /* ===========================================
      4. URL Permission Validation
  =========================================== */

  if (
    !checkRoutePermission(
      location.pathname,
      user.role
    )
  ) {
    addAuditLog(
      user.name,
      user.role,
      "URL BLOCKED",
      location.pathname
    );

    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  /* ===========================================
      5. Allow Route
  =========================================== */

  return <Outlet />;
}

/* ===============================================
      Audit Logger
================================================ */

function addAuditLog(
  username: string,
  role: UserRole,
  action: string,
  path: string
) {
  const history = JSON.parse(
    localStorage.getItem("auditLogs") || "[]"
  );

  history.unshift({
    username,
    role,
    action,
    path,
    date: new Date().toLocaleString(),
  });

  localStorage.setItem(
    "auditLogs",
    JSON.stringify(history)
  );
}