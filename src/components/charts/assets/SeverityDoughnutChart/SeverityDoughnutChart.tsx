import { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
} from 'recharts';

import { CalculateAssetStatistics } from '@/utils/asset';
import type { Asset } from '@/types';
import styles from './SeverityDoughnutChart.module.css';

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

export default function DoughnutChart({ assets }: { assets: Asset[] }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const stats = useMemo(() => CalculateAssetStatistics(assets), [assets]);

  const data = [
    {
      name: 'Critical',
      value: stats.critical,
      color: '#ff4d4d',
      glowColor: 'rgba(255, 77, 77, 0.6)',
    },
    {
      name: 'High',
      value: stats.high,
      color: '#ff944d',
      glowColor: 'rgba(255, 148, 77, 0.6)',
    },
    {
      name: 'Medium',
      value: stats.medium,
      color: '#4da6ff',
      glowColor: 'rgba(77, 166, 255, 0.6)',
    },
    {
      name: 'Low',
      value: stats.low,
      color: '#4dffb8',
      glowColor: 'rgba(77, 255, 184, 0.6)',
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
      const data = payload[0].payload;
      const percentage = ((data.value / totalAssets) * 100).toFixed(1);

      return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipHeader}>
            <div
              className={styles.tooltipDot}
              style={{
                backgroundColor: data.color,
                boxShadow: `0 0 15px ${data.glowColor}`,
              }}
            />
            <div className={styles.tooltipTitle}>{data.name} Severity</div>
          </div>

          <div className={styles.tooltipBody}>
            <div className={styles.tooltipDataRow}>
              <div className={styles.tooltipMetric}>
                <span className={styles.tooltipValueLarge}>{data.value}</span>
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
                  backgroundColor: data.color,
                  boxShadow: `0 0 10px ${data.glowColor}`,
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
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <PieChart>
          <Pie
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
              animationDuration: 1500,
              animationEasing: 'ease-out',
            } as any)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className={styles.cell}
                style={{
                  filter: `drop-shadow(0 0 12px ${entry.glowColor})`,
                  opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.4,
                }}
              />
            ))}
          </Pie>
          {activeIndex === -1 && (
            <g>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan x="50%" dy="-10" className={styles.centerTextValue}>
                  {totalAssets}
                </tspan>
                <tspan x="50%" dy="25" className={styles.centerTextLabel}>
                  TOTAL ASSETS
                </tspan>
              </text>
            </g>
          )}
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
    </div>
  );
}
