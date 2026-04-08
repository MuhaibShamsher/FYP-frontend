import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetAssetByIdQuery,
  useUpdatePortMutation,
} from '@/store/apis/assetsApi';
import { PortEditModal } from '@/components/models';
import { LoadingState, ErrorState, EmptyState } from '@/components/custom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Server,
  Shield,
  Activity,
  Clock,
  Edit2,
} from 'lucide-react';
import type { Port } from '@/types';
import styles from './styles/AssetDetails.module.css';

export default function AssetDetailsPage() {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();

  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [selectedPortToEdit, setSelectedPortToEdit] = useState<Port | null>(
    null
  );

  const {
    data: asset,
    isLoading: assetLoading,
    error: assetError,
  } = useGetAssetByIdQuery(assetId as string);

  const [updatePort, { isLoading: isUpdatingPort, error: updatePortError }] =
    useUpdatePortMutation();

  if (assetLoading) {
    return <LoadingState text="LOADING ASSET DATA..." />;
  }

  if (assetError) {
    return (
      <ErrorState
        title="ERROR LOADING ASSET DATA"
        message="Unable to retrieve asset data."
      />
    );
  }

  if (!asset) {
    return (
      <EmptyState
        icon={Server}
        title="ASSET NOT FOUND"
        message="The requested asset intel could not be located in the database."
      />
    );
  }

  interface AssetField {
    label: string;
    key: string;
    icon: any;
    formatter?: (value: any) => React.ReactNode;
  }

  const getSeverityBadgeClass = (severity: string) => {
    const baseClass = styles.severityBadge;
    switch (severity) {
      case 'critical':
        return `${baseClass} ${styles.sevCritical}`;
      case 'high':
        return `${baseClass} ${styles.sevHigh}`;
      case 'medium':
        return `${baseClass} ${styles.sevMedium}`;
      default:
        return `${baseClass} ${styles.sevLow}`;
    }
  };

  const getSeverityDotClass = (severity: string) => {
    const baseClass = styles.sevDot;
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

  const assetInfoFields: AssetField[] = [
    { label: 'IP Address', key: 'ip_address', icon: Server },
    { label: 'MAC Address', key: 'mac_address', icon: Activity },
    { label: 'Hostname', key: 'hostname', icon: Server },
    { label: 'Device Type', key: 'device_type', icon: Server },
    { label: 'OS Name', key: 'os_name', icon: Server },
    {
      label: 'OS Accuracy',
      key: 'os_accuracy',
      icon: Activity,
      formatter: (value: any) => (value !== undefined ? `${value}%` : 'N/A'),
    },
    { label: 'Vendor', key: 'vendor', icon: Server },
    {
      label: 'Severity',
      key: 'severity',
      icon: Shield,
      formatter: (value: any) => (
        <span className={getSeverityBadgeClass(value)}>
          <span className={getSeverityDotClass(value)}></span>
          {value}
        </span>
      ),
    },
    {
      label: 'Is Active',
      key: 'is_active',
      icon: Activity,
      formatter: (value: any) => (
        <span className={value ? styles.statusActive : styles.statusOffline}>
          {value ? 'ACTIVE' : 'OFFLINE'}
        </span>
      ),
    },
    {
      label: 'Last Seen',
      key: 'last_seen',
      icon: Clock,
      formatter: (value: any) => new Date(value).toLocaleString(),
    },
    { label: 'Open Ports', key: 'open_ports_count', icon: Activity },
    { label: 'Filtered Ports', key: 'filtered_ports_count', icon: Activity },
  ];

  const portTableHeaders = [
    'Port',
    'Protocol',
    'Service',
    'Version',
    'State',
    'Product',
    'Control',
  ];

  const portTableColumns = [
    { key: 'port_number', mono: true },
    { key: 'protocol' },
    { key: 'service', fallback: 'N/A' },
    { key: 'version', fallback: 'N/A' },
    { key: 'state' },
    { key: 'product', fallback: 'N/A' },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.assetHostname}>
            {asset.hostname || asset.ip_address}
          </h1>
          <div className={styles.headerLabel}>Asset Detail</div>
        </div>
        <Button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
          BACK
        </Button>
      </div>

      <div className={styles.contentGrid}>
        {/* Main Info Card */}
        <Card className={styles.infoCard}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <Server className={styles.titleIcon} />
              SYSTEM IDENTITY
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.infoList}>
              {assetInfoFields.map((field) => (
                <div key={field.key} className={styles.infoField}>
                  <div className={styles.infoLabelBox}>
                    <field.icon className={styles.fieldIcon} />
                    <span className={styles.fieldLabelText}>{field.label}</span>
                  </div>
                  <div className={styles.fieldValue}>
                    {field.formatter
                      ? field.formatter((asset as any)[field.key])
                      : (asset as any)[field.key] || (
                          <span className={styles.valuePlaceholder}>N/A</span>
                        )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ports Table Card */}
        <Card className={styles.tableCard}>
          <CardHeader className={styles.cardHeader}>
            <div className={styles.portHeaderRow}>
              <CardTitle className={styles.cardTitle}>
                <Activity className={styles.titleIcon} />
                PORT ANALYTICS
              </CardTitle>
              <div className={styles.portCount}>
                {asset.ports?.length || 0} PORTS DETECTED
              </div>
            </div>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            {asset.ports && asset.ports.length > 0 ? (
              <div className={styles.tableWrapper}>
                <div className={styles.scrollContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr className={styles.tableHeadRow}>
                        {portTableHeaders.map((header) => (
                          <th key={header} className={styles.tableHeaderCell}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                      {asset.ports.map((port: Port) => (
                        <tr key={port.id} className={styles.tableRow}>
                          {portTableColumns.map((col) => (
                            <td
                              key={col.key}
                              className={`${styles.tableCell} ${col.mono ? styles.monoCell : ''}`}
                            >
                              {(port as any)[col.key] || (
                                <span className={styles.fallbackText}>
                                  {col.fallback}
                                </span>
                              )}
                            </td>
                          ))}
                          <td className={styles.tableCell}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={styles.editButton}
                              onClick={() => {
                                setSelectedPortToEdit(port);
                                setIsPortModalOpen(true);
                              }}
                            >
                              <Edit2 className={styles.editIcon} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Shield className={styles.emptyIcon} />
                <p className={styles.emptyText}>No open ports detected</p>
                <p className={styles.emptySubtext}>
                  Run a deep scan to verify connectivity
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isPortModalOpen && selectedPortToEdit && (
        <PortEditModal
          selectedPort={selectedPortToEdit}
          assetId={assetId as string}
          onClose={() => setIsPortModalOpen(false)}
          onSave={async (portId, data) => {
            await updatePort({ portId, data });
            setIsPortModalOpen(false);
          }}
          isLoading={isUpdatingPort}
          error={updatePortError}
        />
      )}
    </div>
  );
}
