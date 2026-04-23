import { Card, CardContent } from '@/components/ui/card';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  valueColorClass?: string;
  iconColorClass?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  valueColorClass = 'text-white',
  iconColorClass,
}: StatCardProps) {
  const iconBgClass = iconColorClass
    ? iconColorClass.replace('text-', 'bg-').replace('500', '500/10')
    : 'bg-white/5';

  return (
    <Card className={`group ${styles.card}`}>
      <div className={styles.hoverGradient} />

      <CardContent className={styles.content}>
        <div className={styles.row}>
          <div className={styles.textColumn}>
            <p className={styles.title}>{title}</p>
            <p className={`${styles.value} ${valueColorClass}`}>{value}</p>
          </div>

          <div className={`${styles.iconBox} ${iconBgClass}`}>
            <Icon
              className={`${styles.icon} ${iconColorClass || 'text-neutral-400'}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
