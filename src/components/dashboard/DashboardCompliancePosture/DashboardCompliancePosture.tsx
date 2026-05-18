import { useMemo } from 'react';
import {
  buildComplianceDashboardData,
  buildComplianceFrameworkRows,
  buildComplianceInsightRows,
  buildComplianceSnapshotRows,
} from '@/lib/dashboardCompliance';
import {
  GaugeCard,
  FrameworkBarChart,
  FrameworkSnapshotPanel,
} from '@/components/charts';
import InsightsPanel from './ComplianceInsightsPanel/InsightsPanel';
import type { DashboardViewModel } from '@/lib/dashboardViewModel';
import styles from './DashboardCompliancePosture.module.css';
import { useNavigate } from 'react-router-dom';

const mapFrameworkToId = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('iso')) return 'iso27001';
  if (n.includes('cis')) return 'cis';
  if (n.includes('nist')) return 'nist';
  return 'iso27001';
};

interface DashboardCompliancePostureProps {
  model: DashboardViewModel;
}

export default function DashboardCompliancePosture({model}: DashboardCompliancePostureProps) {
  const navigate = useNavigate();

  const complianceData = useMemo(
    () => buildComplianceDashboardData(model),
    [model]
  );
  const frameworkRows = useMemo(
    () => buildComplianceFrameworkRows(complianceData),
    [complianceData]
  );
  const insightRows = useMemo(
    () => buildComplianceInsightRows(complianceData),
    [complianceData]
  );
  const snapshotRows = useMemo(
    () => buildComplianceSnapshotRows(complianceData),
    [complianceData]
  );

  const gaugeCards = useMemo(
    () => [
      { title: 'Overall Risk Score', value: complianceData.overallRiskScore },
      { title: 'ISO 27001 Score', value: complianceData.frameworkSnapshots.iso27001.score},
      { title: 'CIS Score', value: complianceData.frameworkSnapshots.cis.score },
      { title: 'NIST Score', value: complianceData.frameworkSnapshots.nist.score},
    ],
    [complianceData]
  );

  return (
    <section className={styles.section} aria-labelledby="compliance-posture-title">
      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>Operational Analytics</p>
          <h2 id="operational-analytics-title" className={styles.title}>
            Compliance Insights
          </h2>
          <p className={styles.description}>
            A consolidated view of framework coverage across ISO 27001 2022,
            NIST SP-800 53 Rev 5, and CIS.
          </p>
        </div>
      </div>

      <div className={styles.gaugeCardsGrid}>
        {gaugeCards.map((gauge) => (
          <GaugeCard
            key={gauge.title}
            title={gauge.title}
            value={gauge.value}
            max={100}
            onClick={() => {
              if (gauge.title !== 'Overall Risk Score') {
                navigate(`/compliance/results?framework=${mapFrameworkToId(gauge.title)}`);
              } else {
                navigate('/compliance/results');
              }
            }}
          />
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <FrameworkBarChart data={frameworkRows} />
        <FrameworkSnapshotPanel rows={snapshotRows} />
      </div>

      <InsightsPanel
        rows={insightRows}
        overallRiskScore={complianceData.overallRiskScore}
        overallRiskLevel={complianceData.overallRiskLevel}
      />
    </section>
  );
}
