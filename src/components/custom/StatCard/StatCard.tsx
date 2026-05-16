import { memo } from 'react';
import { Card, CardContent } from '@/components/ui';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  valueColorClass?: string;
  iconColorClass?: string;
  subtitle?: string;
}

const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  valueColorClass = 'text-white',
  iconColorClass,
  subtitle,
}: StatCardProps) {
  return (
    <Card className={styles.card}>
      <CardContent className={styles.content}>
        <div className={styles.row}>
          <div className={styles.textColumn}>
            <p className={styles.title}>{title}</p>
            <p className={`${styles.value} ${valueColorClass}`}>{value}</p>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>

          <div className={styles.iconBox}>
            <Icon
              className={`${styles.icon} ${iconColorClass || 'text-neutral-400'}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default StatCard;
