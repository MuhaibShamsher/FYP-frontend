import type { ReactNode } from 'react';
import styles from './InfoItem.module.css';

export function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className={styles.infoItem}>
      <div className={styles.summaryIconWrap}>{icon}</div>
      <div>
        <p className={styles.summaryLabel}>{label}</p>
        <p className={styles.summaryValue}>{value || '—'}</p>
      </div>
    </div>
  );
}
