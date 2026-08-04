import styles from '../styles/pages.module.css';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>{title}</h1>
      </div>
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }}>This page is currently under construction.</p>
      </div>
    </div>
  );
}
