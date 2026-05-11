import {
  buildComplianceInsightSummary,
  formatPercent,
  getComplianceRecommendation,
} from '@/utils/dashboard';
import { AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
import type { ComplianceInsightRow } from '@/types/dashboard';
import styles from './InsightsPanel.module.css';

interface InsightsPanelProps {
  rows: ComplianceInsightRow[];
  overallRiskScore: number;
  overallRiskLevel: string;
}

export default function InsightsPanel({rows, overallRiskScore, overallRiskLevel}: InsightsPanelProps) {
  if (!rows.length) {
    return (
      <div className={styles.emptyState}>No insight data available yet.</div>
    );
  }

  const summary = buildComplianceInsightSummary(rows);
  const lowest = summary.lowest ?? rows[0];
  const highest = summary.highest ?? rows[0];
  const recommendation = getComplianceRecommendation(overallRiskScore, summary.overallFailureRate);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>Compliance focus areas</h3>
        <div className={styles.riskBadge}>
          <span className={styles.riskScoreValue}>
            Overall Risk {overallRiskScore.toFixed(0)}
          </span>
          <span
            className={styles.riskLevel}
            style={{
              color:
                overallRiskScore >= 80
                  ? '#22c55e'
                  : overallRiskScore >= 60
                    ? '#f59e0b'
                    : '#ef4444',
            }}
          >
            {overallRiskLevel.toUpperCase()}
          </span>
        </div>
      </div>

      <div className={styles.cardsGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <ShieldAlert className={styles.cardHeaderIcon} style={{ color: 'rgb(252, 165, 165)' }} />
            Lowest score
          </div>
          <p className={styles.cardTitle}>{lowest.framework}</p>
          <p className={styles.cardContent}>
            <span className={styles.cardContentBoldSuccess}>
              {lowest.score.toFixed(0)}%
            </span>{' '}
            compliance score with{' '}
            <span className={styles.cardContentBoldRed}>{lowest.fail}</span>{' '}
            failed controls.
          </p>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>
              {lowest.pass + lowest.fail + lowest.partial} controls evaluated
            </span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <AlertTriangle className={styles.cardHeaderIcon} style={{ color: 'rgb(253, 224, 71)' }} />
            Highest performing
          </div>
          <p className={styles.cardTitle}>{highest.framework}</p>
          <p className={styles.cardContent}>
            <span className={styles.cardContentBoldSuccess}>
              {highest.score.toFixed(0)}%
            </span>{' '}
            compliance score with{' '}
            <span className={styles.cardContentBoldGreen}>{highest.pass}</span>{' '}
            passed controls.
          </p>
          <div className={styles.cardFooter}>
            <span className={styles.cardTag}>Best practice reference</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Sparkles className={styles.cardHeaderIcon} style={{ color: 'rgb(165, 243, 252)' }} />
            Recommendation
          </div>
          <p className={styles.recommendationContent}>{recommendation}</p>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Total evaluated</div>
              <div className={`${styles.statValue} ${styles.statValueRed}`}>
                {summary.totalControls}
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Failure rate</div>
              <div className={`${styles.statValue} ${styles.statValueAmber}`}>
                {formatPercent(summary.overallFailureRate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
