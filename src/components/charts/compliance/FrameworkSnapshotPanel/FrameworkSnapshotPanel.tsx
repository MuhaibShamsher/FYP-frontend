import { getSeverityColorFallback } from '@/utils/chartColors';
import { BarChart3 } from 'lucide-react';
import styles from './FrameworkSnapshotPanel.module.css';
import { useNavigate } from 'react-router-dom';

const mapFrameworkToId = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('iso')) return 'iso27001';
  if (n.includes('cis')) return 'cis';
  if (n.includes('nist')) return 'nist';
  return 'iso27001';
};

export interface FrameworkSnapshotData {
  framework: string;
  score: number;
  controls_evaluated: number;
  implemented_pct: number;
  partial_pct: number;
  not_implemented_pct: number;
}

interface FrameworkSnapshotPanelProps {
  rows: FrameworkSnapshotData[];
}

function getProgressColor(score: number) {
  if (score >= 80) return getSeverityColorFallback('low');
  if (score >= 60) return getSeverityColorFallback('high');
  return getSeverityColorFallback('critical');
}

export default function FrameworkSnapshotPanel({rows}: FrameworkSnapshotPanelProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <p className={styles.eyebrow}>Control posture</p>
          <h3 className={styles.title}>Framework implementation snapshot</h3>
        </div>
        <div className={styles.badge}>
          <BarChart3 className={styles.badgeIcon} />
          {rows.length}
          frameworks
        </div>
      </div>

      <div className={styles.itemsContainer}>
        {rows.map((row) => (
          <div 
            key={row.framework} 
            className={styles.row}
            onClick={() => navigate(`/compliance/results?framework=${mapFrameworkToId(row.framework)}`)}
          >
            <div className={styles.rowHeader}>
              <div className={styles.rowLabel}>{row.framework}</div>
              <div className={styles.rowControls}>
                {row.controls_evaluated.toLocaleString()} controls
              </div>
            </div>

            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{
                  width: `${row.implemented_pct}%`,
                  backgroundColor: getProgressColor(row.score),
                }}
              />
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Implemented</div>
                <div className={styles.statValue}>
                  {row.implemented_pct.toFixed(1)}%
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Partial</div>
                <div className={styles.statValue}>
                  {row.partial_pct.toFixed(1)}%
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Not met</div>
                <div className={styles.statValue}>
                  {row.not_implemented_pct.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
