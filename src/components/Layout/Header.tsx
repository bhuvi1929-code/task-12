import { Menu, ChevronRight, Sun, Moon, Bell } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

import styles from '../../styles/layout.module.css';
import { Fragment } from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const location = useLocation();

  // Simple breadcrumb logic based on pathname
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button 
          onClick={onMenuToggle} 
          className={`${styles.iconButton} md:hidden`}
          aria-label="Open mobile menu"
          style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}
        >
          <Menu size={20} />
        </button>
        
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          {(() => {
            const userRole = user?.role;
            const portalTitle = userRole === 'Admin' ? 'Admin Portal' : userRole === 'HR' ? 'HR Portal' : userRole === 'Manager' ? 'Manager Portal' : 'HCM Portal';
            const portalHomeRoute = userRole === 'Admin' ? '/admin/dashboard' : userRole === 'HR' ? '/hr/dashboard' : userRole === 'Manager' ? '/manager/dashboard' : '/';

            return (
              <>
                <Link to={portalHomeRoute} className={styles.breadcrumbItem}>{portalTitle}</Link>
                <ChevronRight size={14} />
                <Link to={portalHomeRoute} className={styles.breadcrumbItem}>Home</Link>
                {pathnames.map((value, index, arr) => {
                  // Skip root section segment if it matches 'admin', 'hr', or 'manager' and it's the first segment
                  if (index === 0 && ['admin', 'hr', 'manager'].includes(value)) {
                    return null;
                  }
                  const isLast = index === arr.length - 1;
                  const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                  const title = value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  return (
                    <Fragment key={to}>
                      <ChevronRight size={14} />
                      {isLast ? (
                        <span className={styles.breadcrumbActive} aria-current="page">
                          {title}
                        </span>
                      ) : (
                        <Link to={to} className={styles.breadcrumbItem}>
                          {title}
                        </Link>
                      )}
                    </Fragment>
                  );
                })}
              </>
            );
          })()}
        </nav>
      </div>

      <div className={styles.headerRight}>
        <button 
          onClick={toggleTheme} 
          className={styles.iconButton}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className={styles.iconButton} aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className={styles.headerDivider} aria-hidden="true" />
        <div className={styles.headerAvatar} aria-label="User profile" title={user?.name ?? 'User'}>
          {initials}
        </div>
      </div>
    </header>
  );
}
