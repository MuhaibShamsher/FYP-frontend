import { cn } from '@/lib/utils';
import styles from './LoadingState.module.css';

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export default function LoadingState({
  text = 'LOADING...',
  className,
}: LoadingStateProps) {
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.content}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
