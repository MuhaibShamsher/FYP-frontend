import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getSeverityColorFallback } from '@/utils/chartColors';
import styles from './FrameworkBarChart.module.css';
import { useNavigate } from 'react-router-dom';

const mapFrameworkToId = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('iso')) return 'iso27001';
  if (n.includes('cis')) return 'cis';
  if (n.includes('nist')) return 'nist';
  return 'iso27001';
};

export interface FrameworkBarData {
  name: string;
  pass: number;
  fail: number;
  partial: number;
}

interface FrameworkBarChartProps {
  data: FrameworkBarData[];
}

const BAR_COLORS = {
  pass: getSeverityColorFallback('low'),
  partial: getSeverityColorFallback('medium'),
  fail: getSeverityColorFallback('critical'),
};

const BAR_GRADIENTS = {
  pass: {start: '#3b82f6', end: '#1e3a8a'},
  partial: { start: '#eab308', end: '#713f12'},
  fail: {start: '#ef4444', end: '#7f1d1d'},
} as const;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <div className={styles.tooltipContent}>
        {payload.map((item: any) => (
          <div key={item.name} className={styles.tooltipItem}>
            <span className={styles.tooltipItemLabel}>
              <span
                className={styles.tooltipItemColor}
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className={styles.tooltipItemValue}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <div className={styles.legendChip}>
      <span className={styles.legendDot} style={{ backgroundColor: color }} />
      {label}
    </div>
  );
}

export default function FrameworkBarChart({ data }: FrameworkBarChartProps) {
  const navigate = useNavigate();

  const handleBarClick = (entry: any) => {
    if (entry && entry.name) {
      navigate(`/compliance/results?framework=${mapFrameworkToId(entry.name)}`);
    }
  };

  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>No framework data available yet.</div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <p className={styles.eyebrow}>Framework breakdown</p>
          <h3 className={styles.title}>
            Pass, fail, and partial control posture
          </h3>
        </div>
        <div className={styles.legendContainer}>
          <LegendChip color={BAR_COLORS.pass} label="Pass" />
          <LegendChip color={BAR_COLORS.partial} label="Partial" />
          <LegendChip color={BAR_COLORS.fail} label="Fail" />
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 8, left: 0, bottom: 8 }}
            barCategoryGap="22%"
          >
            <defs>
              <linearGradient
                id="frameworkBarGradientPass"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={BAR_GRADIENTS.pass.start}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={BAR_GRADIENTS.pass.end}
                  stopOpacity={0.6}
                />
              </linearGradient>
              <linearGradient
                id="frameworkBarGradientPartial"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={BAR_GRADIENTS.partial.start}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={BAR_GRADIENTS.partial.end}
                  stopOpacity={0.6}
                />
              </linearGradient>
              <linearGradient
                id="frameworkBarGradientFail"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={BAR_GRADIENTS.fail.start}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={BAR_GRADIENTS.fail.end}
                  stopOpacity={0.6}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="8 8"
              stroke="#ffffff"
              strokeOpacity={0.03}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#475569',
                fontSize: 12,
                fontWeight: 800,
              }}
              stroke="#1e293b"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 12 }}
              allowDecimals={false}
              stroke="#1e293b"
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
            />
            <Legend verticalAlign="top" height={0} />
            <Bar
              dataKey="pass"
              stackId="controls"
              fill="url(#frameworkBarGradientPass)"
              radius={[0, 0, 0, 0]}
              animationDuration={900}
              barSize={100}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            />
            <Bar
              dataKey="partial"
              stackId="controls"
              fill="url(#frameworkBarGradientPartial)"
              radius={[0, 0, 0, 0]}
              animationDuration={900}
              barSize={100}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            />
            <Bar
              dataKey="fail"
              stackId="controls"
              fill="url(#frameworkBarGradientFail)"
              radius={[8, 8, 0, 0]}
              animationDuration={900}
              barSize={100}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
