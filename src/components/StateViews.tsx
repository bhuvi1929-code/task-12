import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import styles from '../styles/dashboard.module.css';
import pageStyles from '../styles/pages.module.css';

export function LoadingState() {
  return (
    <div>
      <div className={pageStyles.kpiGrid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard} aria-hidden="true" />
        ))}
      </div>
      <div className={styles.inlineState} role="status" aria-live="polite">
        <div className={styles.spinner} />
        <p className={styles.inlineStateTitle}>Loading workforce data&hellip;</p>
      </div>
    </div>
  );
}

export function EmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className={styles.inlineState}>
      <Inbox size={40} className={styles.inlineStateIcon} />
      <p className={styles.inlineStateTitle}>No employees found</p>
      <p className={styles.inlineStateDesc}>
        There's no workforce data matching your current filters. Try broadening your search or resetting filters.
      </p>
      {onReset && (
        <button type="button" className={styles.retryButton} onClick={onReset}>
          Reset Filters
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={styles.inlineState} role="alert">
      <AlertCircle size={40} className={styles.inlineStateIcon} style={{ color: 'var(--danger-color)' }} />
      <p className={styles.inlineStateTitle}>Something went wrong</p>
      <p className={styles.inlineStateDesc}>{message}</p>
      <button type="button" className={styles.retryButton} onClick={onRetry}>
        <RefreshCw size={14} style={{ marginRight: '0.4rem', verticalAlign: '-2px' }} />
        Try Again
      </button>
    </div>
  );
}
