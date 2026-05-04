import { useMemo } from 'react';
import { FrameworkGauge } from '@/components/custom';
import { fmtNum, getRiskClassLabel } from '@/utils/formatters';
import { Activity, FileCheck } from 'lucide-react';
import styles from './DashboardSummary.module.css';

const SUPPORTED_FRAMEWORKS = ['iso27001', 'cis', 'nist'] as const;

import type { LatestPipelineResponse } from '@/apis/sharedApi';

interface DashboardSummaryProps {
  latestData?: LatestPipelineResponse;
  isLoading?: boolean;
}

export default function DashboardSummary({ latestData, isLoading }: DashboardSummaryProps) {
  const latestScan = latestData?.asset_scan?.scan;
  const latestScanSummary = latestData?.asset_scan?.summary;
  const riskAssessment = latestData?.risk_assessment?.assessment;
  const complianceAssessment = latestData?.compliance?.compliance_assessment;

  const avgCompliance = useMemo(() => {
    // Note: If the backend includes summaries in the shared/latest response, 
    // we would use them here. For now, we derive from available scores.
    const scores = [
      complianceAssessment?.iso_score,
      complianceAssessment?.cis_score,
      complianceAssessment?.nist_score,
    ].filter((s): s is number => s !== null && s !== undefined);

    if (scores.length === 0) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [complianceAssessment]);

  const frameworks = useMemo(() => {
    if (!complianceAssessment) return [];
    
    // Convert scores to a format FrameworkGauge can display
    return (complianceAssessment.frameworks || [])
      .filter((fw) => SUPPORTED_FRAMEWORKS.includes(fw as any))
      .map((fw) => {
        const score = (complianceAssessment as any)[`${fw}_score`] || 0;
        return {
          framework: fw as any,
          framework_display: fw.toUpperCase(),
          score: score,
          implemented_pct: score,
          partial_pct: 0,
          not_implemented_pct: 100 - score,
          controls_pass: 0,
          controls_fail: 0,
          controls_partial: 0,
          controls_not_applicable: 0,
          controls_needs_review: 0,
          controls_evaluated: 0,
        };
      });
  }, [complianceAssessment]);

  // risk assessment vulnerabilities data
  const vulnData = useMemo(() => {
    return [
      {
        id: 'crit',
        label: 'Critical',
        count: riskAssessment?.critical_count,
        dotStyle: styles.dotcritical,
      },
      {
        id: 'high',
        label: 'High',
        count: riskAssessment?.high_count,
        dotStyle: styles.dothigh,
      },
      {
        id: 'med',
        label: 'Medium',
        count: riskAssessment?.medium_count,
        dotStyle: styles.dotmedium,
      },
      {
        id: 'low',
        label: 'Low',
        count: riskAssessment?.low_count,
        dotStyle: styles.dotlow,
      },
    ];
  }, [riskAssessment]);

  // Aggregate passed/failed controls
  const complianceTotals = useMemo(() => {
    let pass = 0,
      fail = 0,
      partial = 0;
    frameworks.forEach((s) => {
      pass += s.controls_pass || 0;
      fail += s.controls_fail || 0;
      partial += s.controls_partial || 0;
    });
    return [
      { label: 'Pass', count: pass, cssClass: styles.pass },
      { label: 'Fail', count: fail, cssClass: styles.fail },
      { label: 'Partial', count: partial, cssClass: styles.partial },
    ];
  }, [frameworks]);

  // Derived colors for consistency
  const compColor =
    avgCompliance >= 80
      ? 'rgb(16, 185, 129)'
      : avgCompliance >= 50
        ? 'rgb(245, 158, 11)'
        : 'rgb(239, 68, 68)';

  if (isLoading) {
    return <div className={styles.loading}>Updating intelligence briefing...</div>;
  }

  return (
    <div className={styles.splitContainer}>
      {/* LEFT PANEL: RISK ASSESSMENT */}
      <div className={styles.panelCard}>
        <div className={styles.header}>
          <Activity className={styles.titleIcon} size={18} />
          <span className={styles.title}>Risk Assessment</span>
        </div>

        {/* Using flex-grow to ensure it stretches full internal height */}
        <div className={styles.panelBody}>
          <div className={styles.podsGrid}>
            <div className={styles.metricBlock}>
              <div className={styles.metricTitle}>Assets Discovered</div>
              <div className={styles.metricValue}>
                {fmtNum(latestScanSummary?.total_assets)}
              </div>
              <div className={styles.metricSub}>
                IP Range: {latestScan?.ip_range || '—'}
              </div>
            </div>

            <div className={styles.metricBlock}>
              <div className={styles.metricTitle}>System Risk Score</div>
              <div className={styles.metricValue}>
                {riskAssessment?.overall_risk_score?.toFixed(1) || '0.0'}
              </div>
              <div className={styles.metricSub}>
                Overall Risk Level:
                <span
                  className={`${styles.riskLevelBadge} ${styles[getRiskClassLabel(riskAssessment?.overall_risk_level)] || ''}`}
                >
                  {riskAssessment?.overall_risk_level || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Vulnerability Data distributed evenly via flex-grow */}
          <div className={styles.payloadSection}>
            <div className={styles.payloadHeader}>
              <div className={styles.payloadTitle}>
                Vulnerabilities Distribution
              </div>
              <div className={styles.payloadTotal}>
                Total: {fmtNum(riskAssessment?.total_vulnerabilities)}
              </div>
            </div>

            <div className={styles.vulnList}>
              {vulnData.map((row) => (
                <div key={row.id} className={styles.vulnRow}>
                  <div className={styles.vulnRowLeft}>
                    <div className={`${styles.vulnDot} ${row.dotStyle}`} />
                    <span className={styles.vulnLabel}>{row.label}</span>
                  </div>
                  <span className={styles.vulnValue}>{fmtNum(row.count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: COMPLIANCE */}
      <div className={styles.panelCard}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <FileCheck
              className={`${styles.titleIcon} ${styles.iconEmerald}`}
              size={18}
            />
            <span className={styles.title}>Compliance</span>
          </div>
        </div>

        <div className={styles.panelBody}>
          {/* Static Clean Compliance Posture Area (Mirrors Left Side) */}
          <div className={styles.podsGrid}>
            <div className={styles.metricBlock}>
              <div className={styles.metricTitle}>Overall Compliance</div>
              <div className={styles.metricValue}>
                {Math.round(avgCompliance)}
                <span className={styles.metricUnit}>%</span>
              </div>
              <div className={styles.metricSub}>
                Status:{' '}
                <span
                  style={{ color: compColor }}
                  className={styles.compStatusTag}
                >
                  {avgCompliance >= 80
                    ? 'Optimal'
                    : avgCompliance >= 50
                      ? 'Warning'
                      : 'Critical'}
                </span>
              </div>
            </div>

            <div className={`${styles.metricBlock} ${styles.alignRight}`}>
              <div className={styles.metricTitle}>Total Controls</div>
              <div className={styles.compFilterValues}>
                {complianceTotals.map((stat) => (
                  <div key={stat.label} className={styles.compStatBlock}>
                    <span className={`${styles.compStatNum} ${stat.cssClass}`}>
                      {fmtNum(stat.count)}
                    </span>
                    <span className={styles.compStatLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.frameworksList}>
            <div className={styles.payloadHeader}>
              <div className={styles.payloadTitle}>
                {frameworks.length} Active Frameworks
              </div>
            </div>
            <div className={styles.frameworksListContainer}>
              {frameworks.length > 0 ? (
                frameworks.map((fw) => (
                  <FrameworkGauge key={fw.framework} summary={fw} />
                ))
              ) : (
                <div className={styles.frameworksEmpty}>
                  No active frameworks detected.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
