import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type { UserRole, Department } from "../types";
import { ROLE_DEFAULT_ROUTES } from "../config/permissions";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: Department;
  token: string;
  loginTime: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;

  login: (
    role: UserRole,
    username?: string,
    email?: string,
    department?: Department
  ) => string;

  logout: () => void;

  expireSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "workforce-auth";

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 Hour

const DEFAULT_USERS: Record<UserRole, AuthUser> = {
  Admin: {
    id: "admin001",
    name: "Enterprise Admin",
    email: "admin@company.com",
    role: "Admin",
    token: "",
    loginTime: 0,
  },

  HR: {
    id: "hr001",
    name: "HR Executive",
    email: "hr@company.com",
    role: "HR",
    token: "",
    loginTime: 0,
  },

  Manager: {
    id: "mgr001",
    name: "Department Manager",
    email: "manager@company.com",
    role: "Manager",
    department: "Engineering",
    token: "",
    loginTime: 0,
  },
};

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const parsed: AuthUser = JSON.parse(saved);

      const expired =
        Date.now() - parsed.loginTime > SESSION_TIMEOUT;

      if (expired) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = "/session-expired";
        return;
      }

      setUser(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const addAudit = (
    action: string,
    username: string,
    role: UserRole
  ) => {
    const history =
      JSON.parse(localStorage.getItem("auditLogs") || "[]");

    history.unshift({
      action,
      username,
      role,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem(
      "auditLogs",
      JSON.stringify(history)
    );
  };

  const login = (
    role: UserRole,
    username?: string,
    email?: string,
    department?: Department
  ) => {
    const defaults = DEFAULT_USERS[role];

    const authUser: AuthUser = {
      ...defaults,
      role,

      name: username || defaults.name,

      email: email || defaults.email,

      department: department || defaults.department,

      token: crypto.randomUUID(),

      loginTime: Date.now(),
    };

    setUser(authUser);

    addAudit("LOGIN", authUser.name, authUser.role);

    return ROLE_DEFAULT_ROUTES[role];
  };

  const logout = () => {
    if (user) {
      addAudit("LOGOUT", user.name, user.role);
    }

    setUser(null);

    localStorage.removeItem(STORAGE_KEY);

    window.location.href = "/";
  };

  const expireSession = () => {
    if (user) {
      addAudit("SESSION EXPIRED", user.name, user.role);
    }

    setUser(null);

    localStorage.removeItem(STORAGE_KEY);

    window.location.href = "/session-expired";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        expireSession,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}