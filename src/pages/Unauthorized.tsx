import { useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlatform } from '../contexts/PlatformContext';
import styles from '../styles/pages.module.css';
import loginStyles from '../styles/pages.module.css';

export default function Unauthorized() {
  const { user } = useAuth();
  const { addAuditLog } = usePlatform();

  useEffect(() => {
    addAuditLog(
      "Access Denied - Security Restriction",
      "Attempted manual navigation to protected role module",
      "Failure",
      user?.name || "Unauthorized Actor",
      user?.role || "System"
    );
  }, []);

  return (
    <div className={styles.stateContainer}>
      <ShieldAlert size={64} className={styles.stateIcon} />
      <h1 className={styles.stateTitle}>Access Denied</h1>
      <p className={styles.stateDesc}>
        You don't have permission to access this page. This security violation has been logged to the security audit tracker. Please contact your administrator if you believe this is a mistake.
      </p>
      <Link to="/" className={loginStyles.loginButton} style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
        Return to Dashboard
      </Link>
    </div>
  );
}

