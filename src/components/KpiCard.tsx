import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import styles from '../styles/components.module.css';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: number;
  trendLabel: string;
  badgeText: string;
  targetText: string;
  progressValue: number;
  themeColor: string; // e.g. '#3b82f6'
  onClick?: () => void;
}

export default function KpiCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel, 
  badgeText, 
  targetText, 
  progressValue, 
  themeColor,
  onClick,
}: KpiCardProps) {
  const isPositive = trend >= 0;

  // Convert hex color to rgba for backgrounds
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const softBg = hexToRgba(themeColor, 0.1);

  return (
    <div
      className={styles.kpiCard}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      style={{ ...(onClick ? { cursor: 'pointer' } : {}), '--kpi-accent': themeColor } as CSSProperties}
      aria-label={onClick ? `View drill-down details for ${title}` : undefined}
    >
      <div className={styles.kpiHeader}>
        <div className={styles.kpiHeaderLeft}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: softBg, color: themeColor }}>
            <Icon size={16} />
          </div>
          <h3 className={styles.kpiTitle}>{title}</h3>
        </div>
        <Info size={16} className={styles.infoIcon} />
      </div>

      <div className={styles.kpiMain}>
        <span className={styles.kpiValue}>{value}</span>
        <div className={`${styles.kpiTrendPill} ${isPositive ? styles.trendPositive : styles.trendNegative}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{isPositive ? '+' : ''}{trend}%</span>
        </div>
      </div>

      <div className={styles.kpiSub}>
        <span className={styles.kpiSubtitle}>{trendLabel}</span>
        <span className={styles.kpiBadge} style={{ backgroundColor: softBg, color: themeColor }}>
          {badgeText}
        </span>
      </div>

      <div className={styles.sparklineContainer}>
        <svg className={styles.sparklineSvg} preserveAspectRatio="none" viewBox="0 0 100 40">
          <defs>
            <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={themeColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={themeColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d={isPositive ? "M0,35 Q25,35 50,25 T100,10" : "M0,10 Q25,10 50,20 T100,35"} 
            fill={`url(#grad-${title.replace(/\s+/g, '')})`} 
          />
          <path 
            d={isPositive ? "M0,35 Q25,35 50,25 T100,10" : "M0,10 Q25,10 50,20 T100,35"} 
            fill="none" 
            stroke={themeColor} 
            strokeWidth="2" 
          />
          <circle 
            cx="100" 
            cy={isPositive ? "10" : "35"} 
            r="3" 
            fill={themeColor} 
          />
        </svg>
      </div>

      <div className={styles.kpiFooter}>
        <div className={styles.kpiFooterText}>
          <span>GOAL PROGRESS</span>
          <span className={styles.targetText}>{targetText}</span>
        </div>
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progressValue}%`, backgroundColor: themeColor }}
          />
        </div>
      </div>
    </div>
  );
}
