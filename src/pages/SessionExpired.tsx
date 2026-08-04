import { Clock, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../styles/pages.module.css';

export default function SessionExpired() {
  return (
    <div className={styles.stateContainer}>
      <div style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Clock size={64} className={styles.stateIcon} style={{ color: '#f59e0b', marginBottom: 0 }} />
        <Lock size={24} style={{ position: 'absolute', bottom: -4, right: -4, color: '#ef4444' }} />
      </div>
      <h1 className={styles.stateTitle}>Session Expired</h1>
      <p className={styles.stateDesc}>
        For your security, your authenticated session has timed out due to inactivity or token expiration. Please sign in again to resume managing workforce resources.
      </p>
      <Link 
        to="/login" 
        className={styles.loginButton} 
        style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 2rem', textDecoration: 'none', borderRadius: '10px', fontWeight: 600 }}
      >
        Sign In Again
      </Link>
    </div>
  );
}
