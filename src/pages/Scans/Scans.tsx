import { formatDateTime, formatDuration } from '@/utils/formatUtils';
import { getStatusColor } from '@/utils/scan';
import {
  LoadingState,
  ErrorState,
  EmptyState,
  StatCard,
} from '@/components/custom';
import { ScanDetailModal } from '@/components/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Server,
  Radar,
  CalendarDays,
  Globe,
  Hourglass,
} from 'lucide-react';
import { useScansPage } from '@/hooks';
import styles from './Scans.module.css';

export default function ScansPage() {
  const {
    scans,
    selectedScan,
    SCAN_STATISTICS,
    isError: scanError,
    selectScan,
  } = useScansPage();

  if (scans === null) {
    return <LoadingState text="LOADING SCANS..." />;
  }

  if (scanError) {
    return (
      <ErrorState
        title="ERROR LOADING SCANS"
        message="Unable to retrieve scan history."
      />
    );
  }

  if (scans?.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="NO SCANS DETECTED"
        message="Initialize a scan to populate the asset grid."
      />
    );
  }

  const getStatusIconClass = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted;
      case 'running':
        return styles.statusRunning;
      case 'failed':
        return styles.statusFailed;
      default:
        return styles.statusPending;
    }
  };

  const getProgressBarClass = (status: string) => {
    const baseClass = styles.progressBar;
    switch (status) {
      case 'failed':
        return `${baseClass} ${styles.progressBarFailed}`;
      case 'completed':
        return `${baseClass} ${styles.progressBarCompleted}`;
      default:
        return `${baseClass} ${styles.progressBarRunning}`;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Scan Statistics */}
      <div className={styles.statsGrid}>
        {SCAN_STATISTICS.map((item, idx) => (
          <StatCard
            key={idx}
            title={item.title}
            value={item.value}
            icon={item.icon}
            iconColorClass={item.iconColorClass}
          />
        ))}
      </div>

      {/* Scan Details Grid */}
      <div className={styles.scansGrid}>
        {scans &&
          scans.map((scan) => (
            <Card
              key={scan.id}
              className={styles.scanCard}
              onClick={() => selectScan(scan)}
            >
              <CardHeader className={styles.cardHeader}>
                <div className={styles.headerContent}>
                  <div
                    className={`${styles.statusIconContainer} ${getStatusIconClass(scan.status)}`}
                  >
                    {scan.status === 'running' ? (
                      <Activity className={styles.statusIcon} />
                    ) : (
                      <Radar className={styles.statusIcon} />
                    )}
                  </div>
                  <div>
                    <CardTitle className={styles.scanTitle}>
                      {scan.scan_type.toUpperCase()} SCAN
                    </CardTitle>
                    <h3 className={styles.scanIp}>{scan.ip_range}</h3>
                  </div>
                </div>
                <Badge
                  className={`${getStatusColor(scan.status)} ${styles.statusBadge}`}
                >
                  {scan.status.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className={styles.cardContent}>
                <div className={styles.timeGrid}>
                  <div className={styles.timeField}>
                    <p className={styles.timeLabel}>Started</p>
                    <div className={styles.timeValue}>
                      <CalendarDays className={styles.timeIcon} />
                      <span>{formatDateTime(scan.started_at)}</span>
                    </div>
                  </div>
                  <div className={styles.timeField}>
                    <p className={styles.timeLabel}>Duration</p>
                    <div className={styles.timeValue}>
                      <Hourglass className={styles.timeIcon} />
                      <span>{formatDuration(scan.duration_seconds)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.discoverySection}>
                  <div className={styles.discoveryRow}>
                    <span className={styles.discoveryLabel}>
                      <Globe className={styles.discoveryIcon} />
                      Asset Discovery
                    </span>
                    <span className={styles.discoveryValue}>
                      {scan.discovered_hosts} / {scan.total_hosts}
                    </span>
                  </div>

                  {/* Progress Visual */}
                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressLabel}>Completion</span>
                      <span className={styles.progressValue}>
                        {Math.round(scan.progress)}%
                      </span>
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div
                        className={getProgressBarClass(scan.status)}
                        style={{ width: `${scan.progress}%` }}
                      >
                        {scan.status === 'running' && (
                          <div className={styles.progressBarShimmer}></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Scan Detail Modal */}
      {selectedScan && (
        <ScanDetailModal
          selectedScan={selectedScan}
          setSelectedScan={selectScan}
        />
      )}
    </div>
  );
}
