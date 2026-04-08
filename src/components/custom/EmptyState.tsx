import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import styles from './styles/EmptyState.module.css';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title = 'NO DATA AVAILABLE',
  message = 'There is no data to display at this time.',
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(styles.container, className)}>
      {Icon && <Icon className={styles.icon} />}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className={styles.actionButton}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
