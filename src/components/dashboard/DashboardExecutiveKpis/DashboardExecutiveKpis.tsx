import { StatCard } from '@/components/custom/';
import { Card, CardContent } from '@/components/ui';
import {
  ShieldAlert,
  Server,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import type { ElementType } from 'react';
import type { DashboardViewModel } from '@/lib/dashboardViewModel';
import type { DashboardKpi } from '@/types/dashboard';
import styles from './DashboardExecutiveKpis.module.css';

interface DashboardExecutiveKpisProps {
  model: DashboardViewModel;
}

const kpiIconMap: Record<DashboardKpi['key'], ElementType> = {
  assets: Server,
  'risk-score': ShieldAlert,
  'critical-vulns': AlertTriangle,
  'kev-assets': ShieldCheck,
  'compliance-average': BarChart3,
  'total-vulns': AlertCircle,
};

const kpiToneClasses: Record<DashboardKpi['tone'], { value: string; icon: string }> = {
  orange: { value: 'text-orange-200', icon: 'text-orange-400' },
  blue: { value: 'text-blue-200', icon: 'text-blue-400' },
  emerald: { value: 'text-emerald-200', icon: 'text-emerald-400' },
  amber: { value: 'text-amber-200', icon: 'text-amber-400' },
  rose: { value: 'text-rose-200', icon: 'text-rose-400' },
  slate: { value: 'text-slate-100', icon: 'text-slate-400' },
};

export default function DashboardExecutiveKpis({ model }: DashboardExecutiveKpisProps) {
  return (
    <section className={styles.section} aria-labelledby="dashboard-kpis-title">
      <Card className={styles.cardShell}>
        <CardContent className={styles.cardContent}>
          <div className={styles.grid}>
            {model.kpis.map((kpi) => {
              const Icon = kpiIconMap[kpi.key];
              const tone = kpiToneClasses[kpi.tone];

              return (
                <StatCard
                  key={kpi.key}
                  title={kpi.title}
                  value={kpi.value}
                  subtitle={kpi.subtitle}
                  icon={Icon}
                  valueColorClass={tone.value}
                  iconColorClass={tone.icon}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
