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
import { getSeverityColorFallback, getRiskLevel } from '@/utils/chartColors';
import type { Asset } from '@/types';
import styles from './OpenPortsBarChart.module.css';
import { useNavigate } from 'react-router-dom';

export default function PortsBarChart({ assets }: { assets: Asset[] }) {
  const navigate = useNavigate();
  const dataRaw = transformAssetToBarChartData(assets);
  const maxPorts = Math.max(...dataRaw.map((d) => d.ports), 0);
  const data = dataRaw.map((d) => ({
    ...d,
    full: maxPorts + 1,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const ports = payload[0].payload.ports;
      const riskLevel = getRiskLevel(ports);
      const riskColor = getSeverityColorFallback(riskLevel);

      return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipHeader}>
            <div
              className={styles.tooltipDot}
              style={{
                backgroundColor: riskColor,
                boxShadow: `0 0 15px ${riskColor}88`,
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
                backgroundColor: `${riskColor}33`,
                color: riskColor,
              }}
            >
              {riskLevel}
            </div>
          </div>

          <div className={styles.tooltipFooter}>
            <div className={styles.riskDescription}>
              {riskLevel === 'critical'
                ? 'Critical risk - Immediate action required.'
                : riskLevel === 'high'
                  ? 'High risk - Review and remediate ports.'
                  : riskLevel === 'medium'
                    ? 'Medium risk - Monitor this host.'
                    : 'Low risk - Within safe parameters.'}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const handleClick = () => {
      const asset = data.find((d) => d.name === payload.value);
      if (asset && asset.id) {
        navigate(`/assets/${asset.id}`);
      }
    };
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
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
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
    const riskLevel = getRiskLevel(ports);
    return getSeverityColorFallback(riskLevel);
  };

  const getBarGradient = (ports: number) => {
    const riskLevel = getRiskLevel(ports);
    const levelMap = {
      critical: 'barGradientCritical',
      high: 'barGradientHigh',
      medium: 'barGradientMedium',
      low: 'barGradientLow',
    };
    return levelMap[riskLevel];
  };

  return (
    <div className={styles.chartScrollContainer}>
      {data.length === 0 ? (
        <div className={styles.noDataContainer}>
          <p className={styles.noDataText}>No port data available</p>
        </div>
      ) : (
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
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7f1d1d" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient
                  id="barGradientHigh"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#92400e" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient
                  id="barGradientMedium"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#eab308" stopOpacity={1} />
                  <stop offset="100%" stopColor="#713f12" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="barGradientLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.6} />
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
                onClick={(entry) => {
                  if (entry && entry.id) {
                    navigate(`/assets/${entry.id}`);
                  }
                }}
                style={{ cursor: 'pointer' }}
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
      )}
    </div>
  );
}
