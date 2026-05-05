import {
  Server,
  Activity,
  FileText,
  ChevronDown,
  AlertTriangle,
  HardDrive,
} from 'lucide-react';
import type { RootCause } from '@/types';
import styles from './ComplianceViolationCard.module.css';

interface ComplianceViolationCardProps {
  nonCompliantAsset: any;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  getSeverityClass: (s: string | null) => string;
}

export default function ComplianceViolationCard({
  nonCompliantAsset,
  index,
  isExpanded,
  onToggle,
  getSeverityClass,
}: ComplianceViolationCardProps) {
  const controlsViolated = nonCompliantAsset.controls_violated ?? [];
  const rootCauses = nonCompliantAsset.root_causes ?? [];

  return (
    <div className={styles.assetItem} style={{ animationDelay: `${index * 30}ms` }}>
      <div className={styles.assetHeader} onClick={onToggle}>
        <div className={styles.assetIdent}>
          <div className={styles.serverIconWrapper}>
            <Server size={20} />
          </div>

          <div className={styles.assetMeta}>
            <div className={styles.headlineRow}>
              <span className={styles.hostname}>
                {nonCompliantAsset.hostname || 'Unknown Hostname'}
              </span>
              <span className={styles.ipAddressTag}>{nonCompliantAsset.ip_address}</span>
            </div>
            <div className={styles.deviceInfo}>
              {nonCompliantAsset.device_type && (
                <span className={styles.tag}>
                  <HardDrive size={12} style={{ marginRight: '6px' }} />
                  {nonCompliantAsset.device_type}
                </span>
              )}
              {nonCompliantAsset.os_name && (
                <span className={styles.tag}>
                  <Activity size={12} style={{ marginRight: '6px' }} />
                  {nonCompliantAsset.os_name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.violationInfo}>
          <div className={styles.countBadge}>
            <AlertTriangle size={14} />
            {nonCompliantAsset.violation_count} Violations
          </div>
          <ChevronDown
            className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
            size={20}
          />
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <h4 className={styles.sectionTitle}>
            <FileText className={styles.sectionIcon} />
            Controls Violated Overview
          </h4>
          <div className={styles.controlsList}>
            {controlsViolated.length > 0 ? (
              controlsViolated.map((control: string) => (
                <span key={control} className={styles.controlBadge}>
                  {control}
                </span>
              ))
            ) : (
              <span className={styles.emptyText}>
                No violated controls were provided for this asset.
              </span>
            )}
          </div>

          <h4 className={styles.sectionTitle}>
            <AlertTriangle className={styles.sectionIcon} />
            Root Causes
          </h4>
          <div className={styles.rootCausesGrid}>
            {rootCauses.length > 0 ? (
              rootCauses.map((cause: RootCause, idx: number) => {
                const severityClass = getSeverityClass(cause.severity);
                const formattedVulnType = cause.vuln_type
                  ? cause.vuln_type.replace(/_/g, ' ')
                  : 'Unknown vulnerability';
                const triggeredControls = cause.controls_violated ?? [];

                return (
                  <div key={idx} className={styles.causeCard}>
                    <div className={styles.causeHeader}>
                      <div className={styles.causeTitleGroup}>
                        <span className={styles.causeTitle}>
                          {formattedVulnType}
                        </span>
                        <span className={styles.causeService}>
                          {cause.service
                            ? `Service: ${cause.service.toUpperCase()}`
                            : 'Service not specified'}
                          {cause.port ? ` · Port ${cause.port}` : ''}
                        </span>
                      </div>
                      <span className={`${styles.severityBadge} ${styles[severityClass]}`} >
                        {(cause.severity || 'info').toUpperCase()}
                      </span>
                    </div>

                    <p className={styles.causeDescription}>
                      {cause.description || 'No description available for this finding.'}
                    </p>

                    <div className={styles.causeFooter}>
                      <span className={styles.causeFooterLabel}>
                        Controls Triggered
                      </span>
                      <div className={styles.miniControlsList}>
                        {triggeredControls.length > 0 ? (
                          triggeredControls.map((cv) => (
                            <span key={`${idx}-${cv}`} className={styles.miniControlBadge}>
                              {cv}
                            </span>
                          ))
                        ) : (
                          <span className={styles.emptyText}>
                            No triggered controls listed.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyStateCard}>
                <span className={styles.emptyStateTitle}>
                  No root causes available
                </span>
                <p className={styles.emptyStateText}>
                  This asset has violations recorded, but the detailed root
                  cause breakdown was not returned.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
