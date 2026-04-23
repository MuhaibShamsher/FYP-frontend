import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  title?: string;
  message?: string;
  className?: string;
  showIcon?: boolean;
}

export default function ErrorState({
  title = 'ERROR',
  message = 'Unable to load data. Please try again later.',
  className,
  showIcon = true,
}: ErrorStateProps) {
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.errorBox}>
        {showIcon && (
          <div className={styles.iconContainer}>
            <AlertTriangle className={styles.icon} />
          </div>
        )}
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
