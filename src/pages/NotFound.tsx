import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../styles/pages.module.css';
import loginStyles from '../styles/pages.module.css';

export default function NotFound() {
  return (
    <div className={styles.stateContainer}>
      <FileQuestion size={64} className={styles.stateIcon} />
      <h1 className={styles.stateTitle}>Page Not Found</h1>
      <p className={styles.stateDesc}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className={loginStyles.loginButton} style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
        Return to Dashboard
      </Link>
    </div>
  );
}
