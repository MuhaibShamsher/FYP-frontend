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

import { transformAssetsToDeviceTypeData } from '@/constants/transform_data/transformToPieChartData';
import type { Asset } from '@/types';
import styles from './DeviceTypePieChart.module.css';

interface DeviceTypePieChartProps {
  assets: Asset[];
}

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
    index,
  } = props;

  return (
    <g>
      <defs>
        <filter id={`activePieGlow-${index}`}>
          <feGaussianBlur stdDeviation="12" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 6}
        outerRadius={outerRadius + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={12}
        filter={`url(#activePieGlow-${index})`}
        className="cursor-pointer transition-all duration-500 ease-in-out"
      />
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fill="#ffffff"
        className={styles.activeShapeTextValue}
      >
        {payload.value}
      </text>
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fill="#00d2ff"
        className={styles.activeShapeTextLabel}
      >
        {payload.name}
      </text>
    </g>
  );
};

export default function DeviceTypePieChart({
  assets,
}: DeviceTypePieChartProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const chartDataRaw = useMemo(
    () => transformAssetsToDeviceTypeData(assets),
    [assets]
  );

  const cyberCyanPalette = [
    '#00d2ff', // Cyber Cyan
    '#00b4db', // Deep Cyan
    '#00a2ff', // Brighter Blue
    '#00d2ff', // Light Blue
    '#0575e6', // Royal Blue
    '#00f260', // Neon Green (Accent)
    '#00d2ff', // Back to Cyan
    '#3a7bd5', // Electric Blue
  ];

  const data = (chartDataRaw.labels || [])
    .map((label, index) => ({
      name: label,
      value: chartDataRaw.datasets?.[0]?.data?.[index] || 0,
      color: cyberCyanPalette[index % cyberCyanPalette.length],
      glowColor: `${cyberCyanPalette[index % cyberCyanPalette.length]}66`,
    }))
    .filter((item) => item.value > 0);

  const totalDevices = useMemo(
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
      const percentage = ((data.value / totalDevices) * 100).toFixed(1);

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
            <div className={styles.tooltipTitle}>{data.name}</div>
          </div>

          <div className={styles.tooltipBody}>
            <div className={styles.tooltipDataRow}>
              <div className={styles.tooltipMetric}>
                <span className={styles.tooltipValueLarge}>{data.value}</span>
                <span className={styles.tooltipLabelSmall}>
                  Active Detections
                </span>
              </div>
              <div className={styles.tooltipShareGroup}>
                <span className={styles.tooltipPercentage}>{percentage}%</span>
                <span className={styles.tooltipShareLabel}>Share</span>
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
      <ResponsiveContainer width="100%" height="100%" minHeight={420}>
        <PieChart>
          <defs />
          <Pie
            {...({
              activeIndex: activeIndex,
              activeShape: renderActiveShape,
              data: data,
              cx: '50%',
              cy: '50%',
              outerRadius: activeIndex !== -1 ? 140 : 130,
              innerRadius: activeIndex !== -1 ? 85 : 95,
              paddingAngle: activeIndex !== -1 ? 10 : 4,
              cornerRadius: activeIndex !== -1 ? 12 : 8,
              dataKey: 'value',
              stroke: 'none',
              onMouseEnter: onPieEnter,
              onMouseLeave: onPieLeave,
              animationBegin: 0,
              animationDuration: 1800,
              animationEasing: 'ease-out',
            } as any)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className={styles.cell}
                style={{
                  filter:
                    activeIndex === index
                      ? `drop-shadow(0 0 20px ${entry.glowColor})`
                      : 'none',
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
                  {totalDevices}
                </tspan>
                <tspan x="50%" dy="28" className={styles.centerTextLabel}>
                  NET_SCAN
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
            iconType="rect"
            wrapperStyle={{
              paddingTop: '60px',
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
