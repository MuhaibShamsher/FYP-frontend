import type { ReactNode } from 'react';

interface TopPriorityListProps<T> {
  items: T[];
  emptyMessage: string;
  styles: Record<string, string>;
  getKey: (item: T, index: number) => string;
  renderTitle: (item: T) => ReactNode;
  renderSubline: (item: T) => ReactNode;
  renderMeta: (item: T) => ReactNode;
}

export function TopPriorityList<T>({
  items,
  emptyMessage,
  styles,
  getKey,
  renderTitle,
  renderSubline,
  renderMeta,
}: TopPriorityListProps<T>) {
  if (!items || items.length === 0) {
    return <div className={styles.emptyState}>{emptyMessage}</div>;
  }

  return (
    <ul className={styles.itemList}>
      {items.map((item, index) => (
        <li key={getKey(item, index)} className={styles.priorityRow}>
          <div className={styles.rankBadge}>{index + 1}</div>
          <div className={styles.priorityBody}>
            {renderTitle(item)}
            <div className={styles.itemSubline}>{renderSubline(item)}</div>
          </div>
          <div className={styles.priorityMeta}>{renderMeta(item)}</div>
        </li>
      ))}
    </ul>
  );
}
