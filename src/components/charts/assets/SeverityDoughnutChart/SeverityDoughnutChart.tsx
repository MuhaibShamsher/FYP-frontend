import { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
  Label,
} from 'recharts';

import { CalculateAssetStatistics } from '@/utils/asset';
import { getSeverityColorFallback, getGlowColor } from '@/utils/chartColors';
import type { Asset } from '@/types';
import styles from './SeverityDoughnutChart.module.css';
import { useNavigate } from 'react-router-dom';

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <filter id="doughnutActiveGlow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        filter="url(#doughnutActiveGlow)"
        className="cursor-pointer transition-all duration-300 ease-in-out"
      />
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="#ffffff"
        className={styles.activeShapeTextValue}
      >
        {payload.value}
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fill="#94a3b8"
        className={styles.activeShapeTextLabel}
      >
        {payload.name}
      </text>
    </g>
  );
};

const renderCenterLabel = (props: any) => {
  const { viewBox, payload } = props;
  if (!viewBox || !payload || !payload.length) return null;

  const total = payload.reduce((sum: number, item: any) => sum + item.value, 0);
  if (total <= 0) return null;

  const percent = Math.round((payload[0].value / total) * 100);

  return (
    <text
      x={viewBox.cx}
      y={viewBox.cy}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      <tspan x={viewBox.cx} dy="-8" className={styles.centerTextValue}>
        {percent}%
      </tspan>
      <tspan x={viewBox.cx} dy="22" className={styles.centerTextLabel}>
        TOP SHARE
      </tspan>
    </text>
  );
};

export default function DoughnutChart({ assets }: { assets: Asset[] }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(-1);

  const stats = useMemo(() => CalculateAssetStatistics(assets), [assets]);

  const data = [
    {
      name: 'Critical',
      value: stats.critical,
      color: getSeverityColorFallback('critical'),
      glowColor: getGlowColor(getSeverityColorFallback('critical'), 0.6),
    },
    {
      name: 'High',
      value: stats.high,
      color: getSeverityColorFallback('high'),
      glowColor: getGlowColor(getSeverityColorFallback('high'), 0.6),
    },
    {
      name: 'Medium',
      value: stats.medium,
      color: getSeverityColorFallback('medium'),
      glowColor: getGlowColor(getSeverityColorFallback('medium'), 0.6),
    },
    {
      name: 'Low',
      value: stats.low,
      color: getSeverityColorFallback('low'),
      glowColor: getGlowColor(getSeverityColorFallback('low'), 0.6),
    },
  ].filter((item) => item.value > 0);

  const totalAssets = useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data]
  );

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage =
        totalAssets > 0 ? ((item.value / totalAssets) * 100).toFixed(1) : '0.0';

      return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipHeader}>
            <div
              className={styles.tooltipDot}
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 15px ${item.glowColor}`,
              }}
            />
            <div className={styles.tooltipTitle}>{item.name} Severity</div>
          </div>

          <div className={styles.tooltipBody}>
            <div className={styles.tooltipDataRow}>
              <div className={styles.tooltipMetric}>
                <span className={styles.tooltipValueLarge}>{item.value}</span>
                <span className={styles.tooltipLabelSmall}>Assets Count</span>
              </div>
              <div className={styles.tooltipShareGroup}>
                <span className={styles.tooltipPercentage}>{percentage}%</span>
                <span className={styles.tooltipShareLabel}>Total Share</span>
              </div>
            </div>

            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 0 10px ${item.glowColor}`,
                }}
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      {data.length === 0 ? (
        <div className={styles.noDataContainer}>
          <p className={styles.noDataText}>No severity data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%" minHeight={400}>
          <PieChart>
            <Pie
              onClick={() => navigate('/assets')}
              {...({
                activeIndex: activeIndex,
                activeShape: renderActiveShape,
                data: data,
                cx: '50%',
                cy: '50%',
                innerRadius: 100,
                outerRadius: 135,
                paddingAngle: activeIndex !== -1 ? 8 : 4,
                dataKey: 'value',
                stroke: 'none',
                onMouseEnter: onPieEnter,
                onMouseLeave: onPieLeave,
                animationBegin: 0,
                animationDuration: 800,
                animationEasing: 'ease-out',
              } as any)}
            >
              <Label content={renderCenterLabel} position="center" />
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className={styles.cell}
                  style={{
                    filter: `drop-shadow(0 0 12px ${entry.glowColor})`,
                    opacity:
                      activeIndex === -1 || activeIndex === index ? 1 : 0.4,
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'transparent' }}
            />
            <Legend
              verticalAlign="bottom"
              height={40}
              iconType="circle"
              wrapperStyle={{
                paddingTop: '40px',
              }}
              formatter={(_value: any, entry: any) => (
                <span className={styles.legendLabel}>{entry.payload.name}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
