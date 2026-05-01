import { useNavigate } from 'react-router-dom';
import { useAssetsPage } from '@/hooks';
import { ASSETS_COLUMNS_NAME } from '@/utils/asset';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import {
  LoadingState,
  ErrorState,
  EmptyState,
  StatCard,
} from '@/components/custom';
import { Server } from 'lucide-react';
import styles from './Assets.module.css';

export default function AssetsPage() {
  const navigate = useNavigate();
  const { assets, scanId, isLoading, isError, ASSETS_STATISTICS } =
    useAssetsPage();

  if (isLoading) {
    return <LoadingState text="LOADING ASSET INVENTORY..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="ERROR LOADING ASSET DATA"
        message="Unable to retrieve asset inventory."
      />
    );
  }

  if (!scanId && assets.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="NO SCANS DETECTED"
        message="Initialize a scan to populate the asset grid."
      />
    );
  }

  const getSeverityBadgeClass = (severity: string) => {
    const baseClass = styles.severityBadge;
    switch (severity) {
      case 'critical':
        return `${baseClass} ${styles.severityCritical}`;
      case 'high':
        return `${baseClass} ${styles.severityHigh}`;
      case 'medium':
        return `${baseClass} ${styles.severityMedium}`;
      default:
        return `${baseClass} ${styles.severityLow}`;
    }
  };

  const getSeverityDotClass = (severity: string) => {
    const baseClass = styles.severityDot;
    switch (severity) {
      case 'critical':
        return `${baseClass} ${styles.dotCritical}`;
      case 'high':
        return `${baseClass} ${styles.dotHigh}`;
      case 'medium':
        return `${baseClass} ${styles.dotMedium}`;
      default:
        return `${baseClass} ${styles.dotLow}`;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Assets Statistics */}
      <div className={styles.statsGrid}>
        {ASSETS_STATISTICS.map((item, idx) => (
          <StatCard
            key={idx}
            title={item.title}
            value={item.value}
            icon={item.icon}
            iconColorClass={item.iconColorClass}
          />
        ))}
      </div>

      {/* Assets List */}
      <Card className={styles.assetsCard}>
        <CardHeader className={styles.cardHeader}>
          <div className={styles.headerContent}>
            <CardTitle className={styles.cardTitle}>
              <Server className={styles.titleIcon} />
              DETECTED ASSETS
            </CardTitle>
            <div className={styles.assetCount}>{assets.length} ASSETS</div>
          </div>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  {ASSETS_COLUMNS_NAME.map((col) => (
                    <th key={col} className={styles.tableHeaderCell}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={styles.tableRow}
                    onClick={() => navigate(`/assets/${asset.id}`)}
                  >
                    <td className={styles.cellIp}>{asset.ip_address}</td>
                    <td className={styles.cellHostname}>{asset.hostname}</td>
                    <td className={styles.cellMac}>{asset.mac_address}</td>
                    <td className={styles.cellDeviceType}>
                      {asset.device_type?.toUpperCase()}
                    </td>
                    <td className={styles.cellOs}>{asset.os_name}</td>
                    <td className={styles.cellVendor}>{asset.vendor}</td>
                    <td className={styles.cellSeverity}>
                      <span className={getSeverityBadgeClass(asset.severity)}>
                        <span
                          className={getSeverityDotClass(asset.severity)}
                        ></span>
                        {asset.severity}
                      </span>
                    </td>
                    <td className={styles.cellPorts}>
                      {asset.open_ports_count}
                    </td>
                    <td className={styles.cellPorts}>
                      {asset.filtered_ports_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
