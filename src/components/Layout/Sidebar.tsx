import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, UserCheck, ShieldCheck, Building2, FileSpreadsheet, FileText, 
  Settings, Users, UserPlus, Clock, CalendarDays, TrendingUp, PieChart, 
  CalendarCheck, BarChart3, LogOut, Menu, FolderKanban, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import { NAVIGATION_ITEMS, NavItemConfig } from '../../config/permissions';
import styles from '../../styles/layout.module.css';
import { clsx } from 'clsx';
import React from 'react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  UserCheck,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  FileText,
  Settings,
  Users,
  UserPlus,
  Clock,
  CalendarDays,
  TrendingUp,
  PieChart,
  CalendarCheck,
  BarChart3,
  FolderKanban,
  ShieldAlert,
};

export default function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const { logout, user } = useAuth();
  const { addAuditLog } = usePlatform();

  const userRole = user?.role || 'Manager';
  
  // Filter navigation items permitted for active user role
  const permittedItems = NAVIGATION_ITEMS.filter(item => item.allowedRoles.includes(userRole));

  // Strictly display only the module items corresponding to the logged in role
  const groupedNav: Record<string, NavItemConfig[]> = {
    Admin: userRole === 'Admin' ? permittedItems.filter(i => i.section === 'Admin') : [],
    HR: userRole === 'HR' ? permittedItems.filter(i => i.section === 'HR') : [],
    Manager: userRole === 'Manager' ? permittedItems.filter(i => i.section === 'Manager') : [],
  };

  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className={clsx(styles.sidebar, isOpenMobile && styles.sidebarOpen)}>
      <div
        className={styles.sidebarHeader}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className={styles.brandMark} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: userRole === 'Admin' ? 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' : userRole === 'HR' ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#ffffff',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: userRole === 'Admin' ? '0 4px 14px -3px rgba(99, 102, 241, 0.45)' : userRole === 'HR' ? '0 4px 14px -3px rgba(16, 185, 129, 0.45)' : '0 4px 14px -3px rgba(59, 130, 246, 0.45)',
            flexShrink: 0
          }}>
            {userRole === 'Admin' ? <ShieldCheck size={22} /> : userRole === 'HR' ? <Users size={22} /> : <FolderKanban size={22} />}
          </div>
          <div>
            <div className={styles.sidebarTitle} style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>Workforce</div>
            <div style={{ marginTop: '3px' }}>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                padding: '2px 7px', 
                borderRadius: '10px', 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                letterSpacing: '0.04em',
                background: userRole === 'Admin' ? 'rgba(99, 102, 241, 0.15)' : userRole === 'HR' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                color: userRole === 'Admin' ? '#6366f1' : userRole === 'HR' ? '#10b981' : '#3b82f6',
                border: userRole === 'Admin' ? '1px solid rgba(99, 102, 241, 0.3)' : userRole === 'HR' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                {userRole === 'Admin' ? 'ADMIN PORTAL' : userRole === 'HR' ? 'HR PORTAL' : 'MANAGER PORTAL'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className={styles.iconButton}
          aria-label="Close mobile menu"
          style={{ display: window.innerWidth <= 768 ? "flex" : "none" }}
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className={styles.sidebarNav} aria-label="Main Navigation">
        {(['Admin', 'HR', 'Manager'] as const).map(sectionKey => {
          const items = groupedNav[sectionKey];
          if (!items || items.length === 0) return null;

          return (
            <div key={sectionKey} style={{ marginBottom: '1.25rem' }}>
              <div className={styles.navSectionLabel} style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', opacity: 0.6, marginBottom: '0.4rem', paddingLeft: '0.75rem' }}>
                {sectionKey} Module
              </div>
              {items.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth <= 768) onCloseMobile();
                    }}
                    className={({ isActive }) =>
                      clsx(styles.navItem, isActive && styles.active)
                    }
                  >
                    <IconComponent size={19} />
                    <span className={styles.navLabel}>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.userCard}>
          <div className={styles.userAvatar} style={{ background: userRole === 'Admin' ? '#ef4444' : userRole === 'HR' ? '#10b981' : '#3b82f6', color: '#ffffff', fontWeight: 700 }}>
            {initials}
          </div>
          <div className={styles.userMeta}>
            <div
  style={{
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "4px",
  }}
>
  Session Active
</div>
            <div className={styles.userName} style={{ fontWeight: 600 }}>{user?.name ?? "User"}</div>
            <div className={styles.userRole} style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'capitalize' }}>
              <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
    marginTop: "4px",
  }}
>
  <span>{user?.role}</span>

  {user?.department && (
    <span
      style={{
        background: "#0ea5e9",
        color: "white",
        padding: "2px 8px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
      }}
    >
      {user.department}
    </span>
  )}
</div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            addAuditLog("User Authentication Logout", "Session Terminated", "Success", user?.name ?? "User", user?.role ?? "System");
            const ok = window.confirm(
  "Are you sure you want to logout?"
);

if (!ok) return;

logout();
          }}
          className={styles.logoutBtn}
          title="Sign out of HCM Platform"
        >
          <span className={styles.logoutIcon}>
            <LogOut size={18} />
          </span>
          <span className={styles.logoutText}>Logout</span>
          <span className={styles.logoutArrow}>→</span>
        </button>
      </div>
    </aside>
  );
}
