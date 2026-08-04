import type { ReactElement, ReactNode } from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { ResponsiveContainer } from 'recharts';
import { CHART_HEIGHT } from '../../constants/chartConfig';
import styles from './ChartContainer.module.css';

export interface ChartContainerProps {
  /** Chart title, always rendered and used as the accessible name. */
  title: string;
  /** Optional supporting description shown under the title. */
  description?: string;
  /** Height (px) of the chart's plotting area. Defaults to the shared chart height. */
  height?: number;
  /** True while the underlying data is being fetched. */
  isLoading?: boolean;
  /** True when the data request failed. */
  isError?: boolean;
  /** Message shown in the error state. */
  errorMessage?: string;
  /** Called when the user presses the Retry button in the error state. */
  onRetry?: () => void;
  /** True when the request succeeded but there is no data to display. */
  isEmpty?: boolean;
  /** Message shown in the empty-data state. */
  emptyMessage?: string;
  /** Accessible label describing the chart content; falls back to `title`. */
  ariaLabel?: string;
  /** The Recharts chart element to render responsively (e.g. <LineChart>...</LineChart>). */
  children: ReactElement;
}

/**
 * Reusable wrapper for every dashboard chart. It owns consistent card
 * styling, a title/description header, responsive sizing, and the shared
 * loading / empty / error states so individual chart components only need
 * to provide their Recharts content.
 */
export default function ChartContainer({
  title,
  description,
  height = CHART_HEIGHT,
  isLoading = false,
  isError = false,
  errorMessage = 'Something went wrong while loading this chart.',
  onRetry,
  isEmpty = false,
  emptyMessage = 'No data available for the current filters.',
  ariaLabel,
  children,
}: ChartContainerProps): ReactNode {
  let body: ReactNode;

  if (isLoading) {
    body = (
      <div className={styles.loadingWrap} role="status" aria-live="polite">
        <div className={styles.spinner} aria-hidden="true" />
        <p className={styles.loadingText}>Loading chart data&hellip;</p>
      </div>
    );
  } else if (isError) {
    body = (
      <div className={styles.messageWrap} role="alert">
        <AlertCircle size={32} className={styles.messageIcon} data-variant="error" aria-hidden="true" />
        <p className={styles.messageTitle}>Unable to load chart</p>
        <p className={styles.messageDesc}>{errorMessage}</p>
        {onRetry && (
          <button type="button" className={styles.retryButton} onClick={onRetry}>
            <RefreshCw size={14} aria-hidden="true" />
            Retry
          </button>
        )}
      </div>
    );
  } else if (isEmpty) {
    body = (
      <div className={styles.messageWrap}>
        <Inbox size={32} className={styles.messageIcon} aria-hidden="true" />
        <p className={styles.messageTitle}>No data to display</p>
        <p className={styles.messageDesc}>{emptyMessage}</p>
      </div>
    );
  } else {
    body = (
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        {children}
      </ResponsiveContainer>
    );
  }

  return (
    <section className={styles.card} aria-label={ariaLabel ?? title}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </header>
      <div className={styles.body} style={{ height }}>
        {body}
      </div>
    </section>
  );
}
