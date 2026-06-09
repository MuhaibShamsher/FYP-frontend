import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { buildDashboardThreatPrioritiesData } from '@/lib/dashboardThreatPriorities';
import { formatCount } from '@/utils/dashboard';
import { TopAssetsList } from './TopAssetsList/TopAssetsList';
import { TopVulnerabilitiesList } from './TopVulnerabilitiesList/TopVulnerabilitiesList';
import { AlertTriangle, ShieldAlert, Server } from 'lucide-react';
import type { LatestPipelineResponse } from '@/apis/sharedApi';
import styles from './DashboardTopItems.module.css';

interface DashboardTopItemsProps {
  latestData?: LatestPipelineResponse;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export default function DashboardTopItems({latestData}: DashboardTopItemsProps) {
  const threatPriorities = buildDashboardThreatPrioritiesData(latestData);

  return (
    <section className={styles.section} aria-labelledby="top-priorities-title">
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionEyebrow}>Threat Priorities</p>
          <h2 id="top-priorities-title" className={styles.sectionTitle}>
            Top Vulnerabilities & Critical Assets
          </h2>
          <p className={styles.sectionDescription}>
            Vulnerabilities and affected devices that require immediate attention.
          </p>
        </div>

        <div className={styles.sectionStats}>
          <div className={styles.statChip}>
            <AlertTriangle className={styles.statIconCritical} />
            <span>
              {formatCount(threatPriorities.totalVulnerabilities)}{' '}
              vulnerabilities
            </span>
          </div>
          <div className={styles.statChip}>
            <Server className={styles.statIconPrimary} />
            <span>{formatCount(threatPriorities.totalAssets)} assets</span>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <Card className={styles.panelCard}>
          <CardHeader className={styles.panelHeader}>
            <div>
              <CardTitle className={styles.panelTitle}>
                <ShieldAlert className={styles.panelTitleIcon} />
                Highest-risk vulnerabilities
              </CardTitle>
              <CardDescription className={styles.panelDescription}>
                Vulnerabilities sorted by risk score and impact.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className={styles.panelContent}>
            <TopVulnerabilitiesList items={threatPriorities.topVulnerabilities.slice(0, 5)} />
          </CardContent>
        </Card>

        <Card className={styles.panelCard}>
          <CardHeader className={styles.panelHeader}>
            <div>
              <CardTitle className={styles.panelTitle}>
                <Server className={styles.panelTitleIconAsset} />
                Most critical assets
              </CardTitle>
              <CardDescription className={styles.panelDescription}>
                Hosts with the highest vulnerability counts and risk levels.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className={styles.panelContent}>
            <TopAssetsList items={threatPriorities.topAssets.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
