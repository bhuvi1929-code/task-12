import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserRole, Department } from '../types';
import { ROLE_DEFAULT_ROUTES } from '../config/permissions';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: Department;
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (role: UserRole, username?: string, email?: string, department?: Department) => string;
  logout: () => void;
  isAuthenticated: boolean;
  expireSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: Record<UserRole, AuthUser> = {
  Admin: {
    id: 'usr-admin',
    name: 'Eleanor Vance',
    email: 'admin@enterprise.com',
    role: 'Admin',
  },
  HR: {
    id: 'usr-hr',
    name: 'Marcus Brody',
    email: 'marcus.hr@enterprise.com',
    role: 'HR',
  },
  Manager: {
    id: 'usr-mgr',
    name: 'David Kim',
    email: 'david.kim@enterprise.com',
    role: 'Manager',
    department: 'Engineering',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // Ensure role is valid UserRole
      if (['Admin', 'HR', 'Manager'].includes(parsed.role)) {
        return parsed;
      }
    } catch {
      return null;
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Returns target default route after login
  const login = (role: UserRole, username?: string, email?: string, department?: Department): string => {
    const defaults = DEFAULT_USERS[role];
    const newUser: AuthUser = {
      id: defaults.id,
      name: username || defaults.name,
      email: email || defaults.email,
      role: role,
      department: department || defaults.department,
      token: Math.random().toString(36).substring(2),
    };
    setUser(newUser);
    return ROLE_DEFAULT_ROUTES[role];
  };

  const logout = () => {
    setUser(null);
  };

  const expireSession = () => {
    setUser(null);
    window.location.href = '/session-expired';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, expireSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
