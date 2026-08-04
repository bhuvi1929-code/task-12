import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { KpiDefinition } from '../types';
import styles from '../styles/dashboard.module.css';

interface DrillDownPanelProps {
  kpi: KpiDefinition | null;
  onClose: () => void;
}

export default function DrillDownPanel({ kpi, onClose }: DrillDownPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!kpi) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [kpi, onClose]);

  if (!kpi) return null;

  return (
    <>
      <div className={styles.drilldownOverlay} onClick={onClose} aria-hidden="true" />
      <div
        className={styles.drilldownPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drilldown-title"
      >
        <div className={styles.drilldownHeader}>
          <div>
            <h2 id="drilldown-title" className={styles.drilldownTitle}>{kpi.title}</h2>
            <p className={styles.drilldownSubtitle}>Breakdown by department</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className={styles.drilldownCloseButton}
            aria-label="Close drill-down panel"
          >
            <X size={20} />
          </button>
        </div>
        <div className={styles.drilldownBody}>
          <div className={styles.drilldownStat}>
            <span className={styles.drilldownStatValue}>{kpi.value}</span>
            <span className={styles.drilldownStatLabel}>{kpi.trendLabel}</span>
          </div>

          {kpi.drillDown.length === 0 ? (
            <p className={styles.drilldownRowLabel}>No records match this KPI for the current filters.</p>
          ) : (
            kpi.drillDown.map((row) => (
              <div className={styles.drilldownRow} key={row.label}>
                <span className={styles.drilldownRowLabel}>{row.label}</span>
                <span className={styles.drilldownRowValue}>{row.value}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
