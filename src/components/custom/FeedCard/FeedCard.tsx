import { Badge, Card, Button } from '@/components/ui';
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from 'lucide-react';
import type { FeedStatus } from '@/types';
import styles from './FeedCard.module.css';

const FEED_CONFIGS = {
  nvd: {
    name: 'NVD CVE Database',
    description: 'National Vulnerability Database CVE feeds',
    icon: 'database',
    color: 'blue',
  },
  epss: {
    name: 'EPSS Scores',
    description: 'Exploit Prediction Scoring System data',
    icon: 'activity',
    color: 'green',
  },
  cisa_kev: {
    name: 'CISA KEV Catalog',
    description: 'Known Exploited Vulnerabilities catalog',
    icon: 'alert-triangle',
    color: 'red',
  },
} as const;

interface FeedCardProps {
  feed: FeedStatus;
  onSync: () => void;
}

export default function FeedCard({ feed, onSync }: FeedCardProps) {
  const config = FEED_CONFIGS[feed.feed_type];
  const isRunning = feed.is_running;
  const hasErrors = feed.records_errors > 0;

  const lastSyncDate = new Date(feed.last_successful_run);
  const formattedDate = lastSyncDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className={styles.feedCard}>
      {/* Subtle pulse effect when running */}
      {isRunning && <div className={styles.pulseEffect} />}

      <div className={styles.feedCardContent}>
        {/* Header Section */}
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleSection}>
            <h3 className={styles.cardTitle}>{config.name}</h3>
            <p className={styles.cardDescription}>{config.description}</p>
          </div>

          {/* Status Badge */}
          <div className={styles.statusBadges}>
            {isRunning && (
              <Badge
                variant="outline"
                className={`${styles.statusBadge} ${styles.running}`}
              >
                <RefreshCw
                  className={`${styles.statusIcon} ${styles.spinning}`}
                />
                Running
              </Badge>
            )}
            {feed.is_stale && !isRunning && (
              <Badge
                variant="outline"
                className={`${styles.statusBadge} ${styles.stale}`}
              >
                <AlertTriangle className={styles.statusIcon} />
                Stale
              </Badge>
            )}
            {!isRunning && !feed.is_stale && (
              <Badge
                variant="outline"
                className={`${styles.statusBadge} ${styles.updated}`}
              >
                <CheckCircle className={styles.statusIcon} />
                Updated
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <Clock className="w-3 h-3" />
              Last Sync
            </div>
            <div className={styles.statValue}>{formattedDate}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <Activity className="w-3 h-3" />
              Records
            </div>
            <div className="text-sm">
              <span className={`${styles.statValue} ${styles.processed}`}>
                {feed.records_processed.toLocaleString()}
              </span>
              {hasErrors && (
                <span className={`${styles.statValue} ${styles.errors}`}>
                  +{feed.records_errors} errors
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className={styles.additionalInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Mode</span>
            <Badge variant="secondary" className={styles.infoBadge}>
              {feed.mode}
            </Badge>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Source</span>
            <span className={styles.infoValue}>{feed.source_name}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Since</span>
            <span className={styles.infoValue}>
              {feed.metadata.since
                ? new Date(feed.metadata.since).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Sync Button */}
        <div className={styles.syncButtonSection}>
          <Button
            onClick={onSync}
            disabled={isRunning}
            className={styles.syncButton}
          >
            <RefreshCw
              className={`${styles.syncButtonIcon} ${isRunning ? styles.spinning : ''}`}
            />
            {isRunning ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
