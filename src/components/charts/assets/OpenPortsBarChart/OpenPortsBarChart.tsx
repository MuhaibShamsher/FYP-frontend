import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { transformAssetToBarChartData } from '@/constants';
import type { Asset } from '@/types';
import styles from './OpenPortsBarChart.module.css';

export default function PortsBarChart({ assets }: { assets: Asset[] }) {
  const dataRaw = transformAssetToBarChartData(assets);
  const maxPorts = Math.max(...dataRaw.map((d) => d.ports), 0);
  const data = dataRaw.map((d) => ({
    ...d,
    full: maxPorts + 1,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const ports = payload[0].payload.ports;
      const riskLevel =
        ports > 20
          ? 'critical'
          : ports > 10
            ? 'high'
            : ports > 5
              ? 'medium'
              : 'low';
      const riskColors = {
        critical: '#ff4d4d',
        high: '#ff944d',
        medium: '#4da6ff',
        low: '#4dffb8',
      };

      return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipHeader}>
            <div
              className={styles.tooltipDot}
              style={{
                backgroundColor: riskColors[riskLevel],
                boxShadow: `0 0 15px ${riskColors[riskLevel]}88`,
              }}
            />
            <div className={styles.tooltipTitle}>{label}</div>
          </div>

          <div className={styles.tooltipBody}>
            <div className={styles.tooltipMetric}>
              <span className={styles.tooltipValueLarge}>{ports}</span>
              <span className={styles.tooltipLabelSmall}>Active Ports</span>
            </div>
            <div
              className={styles.riskBadge}
              style={{
                backgroundColor: `${riskColors[riskLevel]}33`,
                color: riskColors[riskLevel],
              }}
            >
              {riskLevel}
            </div>
          </div>

          <div className={styles.tooltipFooter}>
            <div className={styles.riskDescription}>
              {riskLevel === 'critical'
                ? 'High security risk identified for this host.'
                : riskLevel === 'high'
                  ? 'Significant number of open ports detected.'
                  : riskLevel === 'medium'
                    ? 'Standard monitoring recommended.'
                    : 'System is within secure parameters.'}
            </div>
          </div>
        </div>
      );
    }
    return null;
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

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x - 12}
        y={y + 4}
        fill="#475569"
        textAnchor="end"
        fontSize="10px"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="900"
        className={styles.yAxisTick}
      >
        {payload.value}
      </text>
    );
  };

  const getBarColor = (ports: number) => {
    if (ports > 20) return '#ff4d4d';
    if (ports > 10) return '#ff944d';
    if (ports > 5) return '#4da6ff';
    return '#4dffb8';
  };

  const getBarGradient = (ports: number) => {
    if (ports > 20) return 'barGradientCritical';
    if (ports > 10) return 'barGradientHigh';
    if (ports > 5) return 'barGradientMedium';
    return 'barGradientLow';
  };

  return (
    <div className={styles.chartScrollContainer}>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%" minHeight={450}>
          <BarChart
            data={data}
            margin={{ top: 40, right: 30, left: 45, bottom: 85 }}
            barSize={36}
          >
            <defs>
              <linearGradient
                id="barGradientCritical"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#ff4d4d" stopOpacity={1} />
                <stop offset="100%" stopColor="#cc0000" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGradientHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff944d" stopOpacity={1} />
                <stop offset="100%" stopColor="#cc5200" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGradientMedium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4da6ff" stopOpacity={1} />
                <stop offset="100%" stopColor="#0066cc" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="barGradientLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4dffb8" stopOpacity={1} />
                <stop offset="100%" stopColor="#00cc7a" stopOpacity={0.6} />
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
              tick={<CustomXAxisTick />}
              stroke="#1e293b"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, maxPorts + 1]}
              tick={<CustomYAxisTick />}
              stroke="#1e293b"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
            />
            {/* Background Ghost Bar */}
            <Bar
              dataKey="full"
              fill="#ffffff"
              fillOpacity={0.03}
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
              xAxisId={0}
            />
            <Bar
              dataKey="ports"
              radius={[6, 6, 0, 0]}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => {
                const color = getBarColor(entry.ports);
                const gradientId = getBarGradient(entry.ports);

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${gradientId})`}
                    className={styles.barCell}
                    style={{
                      filter: `drop-shadow(0 0 10px ${color}33)`,
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
