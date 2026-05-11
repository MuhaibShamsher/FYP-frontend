import type { LucideIcon } from 'lucide-react';
import styles from './SummaryItem.module.css';

export function SummaryItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  const Icon = icon;

  return (
    <div className={styles.summaryBlock}>
      <Icon className={styles.summaryIcon} />
      <div>
        <p className={styles.summaryLabel}>{label}</p>
        <p className={styles.summaryValue}>{value || '—'}</p>
      </div>
    </div>
  );
}
