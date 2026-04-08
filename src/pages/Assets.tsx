import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  useGetScanAssetsQuery,
  useGetLastScanAssetsQuery,
} from '@/store/apis/scanApi';
import { ASSETS_COLUMNS_NAME, CalculateAssetStatistics } from '@/utils/asset';
import {
  LoadingState,
  ErrorState,
  EmptyState,
  StatCard,
} from '@/components/custom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import type { Asset, AssetStatistics } from '@/types';
import styles from './styles/Assets.module.css';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[] | []>([]);
  const [scanId, setScanId] = useState<string | null>(null);
  const [assetStatistics, setAssetStatistics] =
    useState<AssetStatistics | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paramScanId = searchParams.get('scanID');
    setScanId(paramScanId);
  }, [searchParams]);

  const {
    data: lastScanAssetsResult,
    isLoading: lastScanLoading,
    error: lastScanError,
  } = useGetLastScanAssetsQuery(undefined, {
    skip: Boolean(scanId),
  });

  const {
    data: scanAssetsResult,
    isLoading: scanAssetsLoading,
    error: scanAssetsError,
  } = useGetScanAssetsQuery(scanId as string, {
    skip: !scanId,
  });

  useEffect(() => {
    const assetsData = scanId
      ? scanAssetsResult?.assets
      : lastScanAssetsResult?.assets;
    setAssets(assetsData || []);
    const stats = CalculateAssetStatistics(assetsData || []);
    setAssetStatistics(stats);
  }, [scanAssetsResult, lastScanAssetsResult, scanId]);

  const ASSETS_STATISTICS = [
    {
      title: 'TOTAL ASSETS',
      value: assetStatistics?.total || 0,
      icon: Server,
      iconColorClass: 'text-slate-500',
    },
    {
      title: 'CRITICAL',
      value: assetStatistics?.critical || 0,
      icon: AlertTriangle,
      iconColorClass: 'text-red-500',
    },
    {
      title: 'HIGH RISK',
      value: assetStatistics?.high || 0,
      icon: Shield,
      iconColorClass: 'text-orange-500',
    },
    {
      title: 'MEDIUM',
      value: assetStatistics?.medium || 0,
      icon: Activity,
      iconColorClass: 'text-yellow-500',
    },
    {
      title: 'LOW RISK',
      value: assetStatistics?.low || 0,
      icon: CheckCircle,
      iconColorClass: 'text-green-500',
    },
  ];

  const isLoading = scanId ? scanAssetsLoading : lastScanLoading;
  const error = scanId ? scanAssetsError : lastScanError;

  if (isLoading) {
    return <LoadingState text="LOADING ASSET INVENTORY..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="ERROR LOADING ASSET DATA"
        message="Unable to retrieve asset inventory."
      />
    );
  }

  if (!scanId && !lastScanAssetsResult?.assets) {
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
