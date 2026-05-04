import { CardHeader, CardTitle } from '@/components/ui';
import styles from './CardHeader.module.css';

export function SettingsCardHeader({
  tone,
  title,
}: {
  tone: 'blue' | 'orange';
  title: string;
}) {
  return (
    <CardHeader className={styles.cardHeader}>
      <CardTitle className={styles.cardTitle}>
        <div
          className={`${styles.statusIndicator} ${
            tone === 'blue' ? styles.blueIndicator : styles.orangeIndicator
          }`}
        />
        {title}
      </CardTitle>
    </CardHeader>
  );
}
