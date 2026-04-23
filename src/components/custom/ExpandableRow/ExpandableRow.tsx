import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './ExpandableRow.module.css';

type ExpandableRowTheme = 'dark' | 'light' | 'default';

interface ExpandableRowProps {
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  animationDelay?: number;
  expandedContent?: React.ReactNode;
  headerContent: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  theme?: ExpandableRowTheme;
}

export default function ExpandableRow({
  index,
  isOpen,
  onToggle,
  className,
  animationDelay = 50,
  expandedContent,
  headerContent,
  onKeyDown,
  theme = 'default',
}: ExpandableRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
    onKeyDown?.(e);
  };

  return (
    <div
      className={cn(styles.expandableRow, styles[`theme-${theme}`], className)}
      style={{ animationDelay: `${index * animationDelay}ms` }}
    >
      <div
        className={styles.rowHeader}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={handleKeyDown}
      >
        {headerContent}

        <div className={styles.chevronContainer}>
          <ChevronDown
            className={cn(styles.chevron, isOpen && styles.chevronExpanded)}
            size={20}
            aria-hidden
          />
        </div>
      </div>

      {isOpen && expandedContent && (
        <div className={styles.expandedContent}>{expandedContent}</div>
      )}
    </div>
  );
}
