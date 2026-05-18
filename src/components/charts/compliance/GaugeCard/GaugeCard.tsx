import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { getPaletteColorFallback, hexToRgba } from '@/utils/chartColors';
import styles from './GaugeCard.module.css';

interface GaugeCardProps {
  title: string;
  value: number;
  max?: number;
  onClick?: () => void;
}

const ZONE_SEGMENTS = [
  { label: 'Healthy', value: 30, color: '#10b981' },
  { label: 'Watch', value: 30, color: '#f59e0b' },
  { label: 'Critical', value: 40, color: '#ef4444' },
];

function getGaugeColor(value: number) {
  if (value <= 30) return getPaletteColorFallback(2);
  if (value <= 60) return getPaletteColorFallback(1);
  return getPaletteColorFallback(0);
}

function getGaugeLabel(value: number) {
  if (value <= 30) return 'Low';
  if (value <= 60) return 'Moderate';
  return 'High';
}

export default function GaugeCard({ title, value, max = 100, onClick }: GaugeCardProps) {
  const safeValue = Math.max(0, Math.min(value, max));
  const gaugeColor = getGaugeColor(safeValue);
  const gaugeLabel = getGaugeLabel(safeValue);
  const valueArc = [
    { name: 'value', value: safeValue, color: gaugeColor },
    {
      name: 'remaining',
      value: Math.max(max - safeValue, 0),
      color: 'transparent',
    },
  ];

  return (
    <div className={styles.container} >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.title}>{title}</p>
          <p className={styles.subtitle}>0-100 scale</p>
        </div>
        <span
          className={styles.statusBadge}
          style={{
            borderColor: hexToRgba(gaugeColor, 0.3),
            backgroundColor: hexToRgba(gaugeColor, 0.12),
            color: gaugeColor,
          }}
        >
          {gaugeLabel}
        </span>
      </div>

      <div className={styles.chartContainer} onClick={onClick} >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ZONE_SEGMENTS}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius={72}
              outerRadius={92}
              paddingAngle={2}
              stroke="none"
              animationDuration={900}
              animationEasing="ease-out"
            >
              {ZONE_SEGMENTS.map((segment) => (
                <Cell key={segment.label} fill={segment.color} />
              ))}
            </Pie>
            <Pie
              data={valueArc}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius={55}
              outerRadius={68}
              stroke="none"
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            >
              <Cell fill={gaugeColor} />
              <Cell fill="transparent" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className={styles.chartOverlay}>
          <div className={styles.centerContent}>
            <div className={styles.valueDisplay}>
              {safeValue.toFixed(1)}
              <span className={styles.percentSign}>%</span>
            </div>
            <div className={styles.centerLabel}>{title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
