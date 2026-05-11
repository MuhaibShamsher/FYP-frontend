import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { Asset } from '@/types';
import { transformAssetsToLineChartData } from '@/constants';
import { getSeverityColorFallback } from '@/utils/chartColors';
import styles from './SeverityLineChart.module.css';

const CustomDot = (props: any) => {
  const { cx, cy, stroke, value } = props;

  if (value === 0) return null;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill={stroke}
        fillOpacity={0.2}
        className="animate-pulse"
      />
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={stroke}
        stroke="#ffffff"
        strokeWidth={2}
      />
    </g>
  );
};

export default function AssetSeverityLineChart({
  assets,
}: {
  assets: Asset[];
}) {
  const chartData = transformAssetsToLineChartData(assets);

  const severityLabels: Record<number, string> = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Critical',
  };

  // Map severity numeric values to design token colors
  const severityColors: Record<number, string> = {
    1: getSeverityColorFallback('low'),
    2: getSeverityColorFallback('medium'),
    3: getSeverityColorFallback('high'),
    4: getSeverityColorFallback('critical'),
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const severity = payload[0].value as number;
      const color = severityColors[severity] || '#64748b';
      return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipHeader}>
            <div
              className={styles.tooltipDot}
              style={{
                backgroundColor: color,
                boxShadow: `0 0 15px ${color}88`,
              }}
            />
            <div className={styles.tooltipTitle}>Discovery: {label}</div>
          </div>

          <div className={styles.tooltipBody}>
            <div className={styles.tooltipMetric}>
              <span className={styles.tooltipValueLarge}>
                {severity.toFixed(1)}
              </span>
              <span className={styles.tooltipLabelSmall}>Severity Score</span>
            </div>
            <div
              className={styles.severityBadge}
              style={{ backgroundColor: `${color}33`, color: color }}
            >
              {severityLabels[severity] || 'Unknown'}
            </div>
          </div>

          <div className={styles.tooltipFooter}>
            <div className={styles.riskVectorText}>
              Risk Vector:{' '}
              <span className={styles.riskVectorValue}>
                {severity <= 1
                  ? 'MINIMAL'
                  : severity <= 2
                    ? 'STABLE'
                    : severity <= 3
                      ? 'ELEVATED'
                      : 'CRITICAL'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const label = severityLabels[payload.value] || '';
    const color = severityColors[payload.value] || '#64748b';

    return (
      <g>
        <text
          x={x - 12}
          y={y + 4}
          fill={color}
          textAnchor="end"
          fontSize="9px"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="900"
          className={styles.yAxisTick}
        >
          {label}
        </text>
      </g>
    );
  };

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x}
        y={y + 18}
        fill="#475569"
        textAnchor="end"
        fontSize="9px"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        transform={`rotate(-45, ${x}, ${y})`}
        className={styles.xAxisTick}
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div className={styles.chartScrollContainer}>
      {chartData.length === 0 ? (
        <div className={styles.noDataContainer}>
          <p className={styles.noDataText}>No severity data available</p>
        </div>
      ) : (
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%" minHeight={450}>
            <AreaChart
              data={chartData}
              margin={{ top: 30, right: 30, left: 45, bottom: 80 }}
            >
              <defs>
                <linearGradient
                  id="severityGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <filter
                  id="lineChartGlow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="8 8"
                stroke="#ffffff"
                strokeOpacity={0.03}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={<CustomXAxisTick />}
                stroke="#1e293b"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0.5, 4.5]}
                ticks={[1, 2, 3, 4]}
                tick={<CustomYAxisTick />}
                stroke="#1e293b"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: '#ffffff',
                  strokeOpacity: 0.1,
                  strokeWidth: 1,
                }}
              />
              <Area
                type="monotone"
                dataKey="severity"
                stroke="#f59e0b"
                strokeWidth={4}
                fill="url(#severityGradient)"
                dot={<CustomDot />}
                activeDot={{
                  r: 6,
                  fill: '#ffffff',
                  stroke: '#f59e0b',
                  strokeWidth: 3,
                }}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-in-out"
                filter="url(#lineChartGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
