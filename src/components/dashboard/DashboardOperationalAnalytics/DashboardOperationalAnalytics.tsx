import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import {
  AssetDeviceTypePieChart,
  AssetOpenPortsBarChart,
  AssetSeverityDoughnutChart,
} from '@/components/charts';
import { buildOperationalAnalyticsViewModel } from '@/lib/dashboardOperational';
import { formatCount } from '@/utils/dashboard';
import { BarChart3, Network, ShieldAlert, Server } from 'lucide-react';
import type { Asset } from '@/types';
import type { DashboardViewModel } from '@/lib/dashboardViewModel';
import styles from './DashboardOperationalAnalytics.module.css';

interface DashboardOperationalAnalyticsProps {
  model: DashboardViewModel;
  assets: Asset[];
}

export default function DashboardOperationalAnalytics({ model, assets }: DashboardOperationalAnalyticsProps) {
  const analyticsViewModel = buildOperationalAnalyticsViewModel(model, assets);

  return (
    <section className={styles.section} aria-labelledby="operational-analytics-title">
      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>Operational Analytics</p>
          <h2 id="operational-analytics-title" className={styles.title}>
            Exposure & Asset Risk Insights
          </h2>
          <p className={styles.description}>
            Track device distribution, network exposure, and security risks across your environment.
          </p>
        </div>

        <div className={styles.headerStats}>
          {model.severityBreakdown.slice(0, 4).map((entry) => (
            <span key={entry.label} className={styles.statChip}>
              {entry.label}: {formatCount(entry.count)}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <Card className={styles.chartCard}>
          <CardHeader className={styles.cardHeader}>
            <div>
              <CardTitle className={styles.cardTitle}>
                <ShieldAlert className={styles.cardIconCritical} />
                Severity distribution
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                Overview of asset risk levels detected in the latest scan.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContentCentered}>
            {analyticsViewModel.hasAssets ? (
              <AssetSeverityDoughnutChart assets={assets} />
            ) : (
              <div className={styles.emptyState}>
                No assets found. Run a scan to get started.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={styles.chartCard}>
          <CardHeader className={styles.cardHeader}>
            <div>
              <CardTitle className={styles.cardTitle}>
                <Network className={styles.cardIconBlue} />
                Device classification
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                Breakdown of discovered devices by system type.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContentCentered}>
            {analyticsViewModel.hasAssets ? (
              <AssetDeviceTypePieChart assets={assets} />
            ) : (
              <div className={styles.emptyState}>
                No assets found. Run a scan to get started.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={styles.chartCard}>
          <CardHeader className={styles.cardHeader}>
            <div>
              <CardTitle className={styles.cardTitle}>
                <BarChart3 className={styles.cardIconOrange} />
                Open port exposure
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                Hosts with the number of open ports.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContentTall}>
            {analyticsViewModel.hasAssets ? (
              <AssetOpenPortsBarChart assets={assets} />
            ) : (
              <div className={styles.emptyState}>
                No open port data available for these assets.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={styles.chartCard}>
          <CardHeader className={styles.cardHeader}>
            <div>
              <CardTitle className={styles.cardTitle}>
                <Server className={styles.cardIconEmerald} />
                Threat source mix
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                Top vulnerability types and where they were detected.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {analyticsViewModel.hasThreatData ? (
              <>
                <div className={styles.mixGroup}>
                  <div className={styles.mixTitle}>Top vulnerability types</div>
                  <div className={styles.breakdownList}>
                    {model.vulnTypeBreakdown.map((item) => (
                      <div key={item.label} className={styles.breakdownRow}>
                        <div className={styles.breakdownMeta}>
                          <span className={styles.breakdownLabel}>
                            {item.label}
                          </span>
                          <span className={styles.breakdownValue}>
                            {formatCount(item.count)}
                          </span>
                        </div>
                        <div className={styles.breakdownTrack}>
                          <div
                            className={styles.breakdownFillOrange}
                            style={{
                              width: `${analyticsViewModel.maxVulnType ? (item.count / analyticsViewModel.maxVulnType) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.mixGroup}>
                  <div className={styles.mixTitle}>Detection sources</div>
                  <div className={styles.breakdownList}>
                    {model.detectionSourceBreakdown.map((item, index) => (
                      <div key={item.label} className={styles.breakdownRow}>
                        <div className={styles.breakdownMeta}>
                          <span className={styles.breakdownLabel}>
                            {item.label}
                          </span>
                          <span className={styles.breakdownValue}>
                            {formatCount(item.count)}
                          </span>
                        </div>
                        <div className={styles.breakdownTrack}>
                          <div
                            className={
                              index === 0
                                ? styles.breakdownFillBlue
                                : styles.breakdownFillEmerald
                            }
                            style={{
                              width: `${analyticsViewModel.maxSource ? (item.count / analyticsViewModel.maxSource) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                No security threats detected.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
