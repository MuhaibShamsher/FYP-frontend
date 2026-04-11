import { useMemo } from 'react';
import type { FrameworkSummary } from '@/types';
import styles from './styles/FrameworkGauge.module.css';

export interface FwGaugeProps {
  summary: FrameworkSummary;
}

export default function FrameworkGauge({ summary }: FwGaugeProps) {
  const r = 24;
  const c = 2 * Math.PI * r;
  const pct = summary.implemented_pct || 0;
  const offset = c - (pct / 100) * c;
  const stateClass = pct >= 80 ? 'Optimal' : pct >= 50 ? 'Warning' : 'Critical';

  const stats = useMemo(() => {
    return [
      { label: 'Pass', value: summary.controls_pass, cssClass: styles.colorPass },
      { label: 'Fail', value: summary.controls_fail, cssClass: styles.colorFail },
      { label: 'Partial', value: summary.controls_partial, cssClass: styles.colorPartial },
    ]
  }, [summary])

  return (
    <div className={styles.fwCard}>
      <div className={`${styles.gaugeContainer} ${styles[`container${stateClass}`]}`}>
        <svg
          className={styles.gaugeSvg}
          width="56"
          height="56"
          viewBox="0 0 56 56"
        >
          <circle className={styles.gaugeTrack} cx="28" cy="28" r={r} />
          <circle
            className={`${styles.gaugeFill} ${styles[`gaugeFill${stateClass}`]}`}
            cx="28"
            cy="28"
            r={r}
            style={{ strokeDasharray: c, strokeDashoffset: offset }}
          />
        </svg>
        <span className={styles.gaugeText}>{Math.round(pct)}%</span>
      </div>

      <div className={styles.fwDetails}>
        <span className={styles.fwName}>{summary.framework_display}</span>
        <div className={styles.fwStatsList}>
          {stats.map(stat => (
            <span key={stat.label}>
              <span className={`${styles.statVal} ${stat.cssClass}`}>
                {stat.value}
              </span>{' '}
              <span className={styles.statLabel}>{stat.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
