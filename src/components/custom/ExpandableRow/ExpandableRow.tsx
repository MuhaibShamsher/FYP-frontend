import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './ExpandableRow.module.css';

interface ExpandableRowProps {
  isOpen: boolean;
  onToggle: () => void;
  expandedContent?: React.ReactNode;
  headerContent: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function ExpandableRow({
  isOpen,
  onToggle,
  expandedContent,
  headerContent,
  onKeyDown,
}: ExpandableRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
    onKeyDown?.(e);
  };

  return (
    <div className={styles.expandableRow}>
      <div
        className={styles.rowHeader}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.headerContent}>
          {headerContent}
        </div>

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
