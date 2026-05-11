import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Server, Activity, Shield, Clock } from 'lucide-react';
import styles from './SystemIdentity.module.css';

interface AssetField {
  label: string;
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  formatter?: (value: any) => React.ReactNode;
}

interface SystemIdentityProps {
  asset: any;
  getSeverityBadgeClass: (severity: string) => string;
  getSeverityDotClass: (severity: string) => string;
}

const SystemIdentity: React.FC<SystemIdentityProps> = ({
  asset,
  getSeverityBadgeClass,
  getSeverityDotClass,
}) => {
  const assetInfoFields: AssetField[] = [
    { label: 'IP Address', key: 'ip_address', icon: Server },
    { label: 'Hostname', key: 'hostname', icon: Server },
    { label: 'Device Type', key: 'device_type', icon: Server },
    { label: 'OS Name', key: 'os_name', icon: Server },
    {
      label: 'Status',
      key: 'is_active',
      icon: Activity,
      formatter: (value: any) => (
        <span className={value ? styles.statusActive : styles.statusOffline}>
          {value ? 'ACTIVE' : 'OFFLINE'}
        </span>
      ),
    },
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
      label: 'Last Seen',
      key: 'last_seen',
      icon: Clock,
      formatter: (value: any) => new Date(value).toLocaleString(),
    },
  ];

  return (
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
  );
};

export default SystemIdentity;
