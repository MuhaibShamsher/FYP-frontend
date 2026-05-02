import type { ReactNode } from 'react';
import { Label } from '@/components/ui';
import styles from './Field.module.css';

export function Field({
  label,
  icon,
  fullWidth = false,
  children,
}: {
  label: string;
  icon: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.fieldGroup} ${fullWidth ? styles.fullWidth : ''}`}
    >
      <Label className={styles.fieldLabel}>
        <span className={styles.labelIcon}>{icon}</span>
        {label}
      </Label>
      {children}
    </div>
  );
}
