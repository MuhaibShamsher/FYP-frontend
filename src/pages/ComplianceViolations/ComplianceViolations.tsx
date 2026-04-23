import { useEffect } from 'react';
import {
  ShieldAlert,
  Server,
  Activity,
  FileText,
  ChevronDown,
  AlertTriangle,
  HardDrive,
  Search,
} from 'lucide-react';
import { LoadingState, ErrorState } from '@/components/custom';
import useComplianceViolationsPage from '@/hooks/useComplianceViolationsPage';
import useVisualFetching from '@/hooks/useVisualFetching';
import type { RootCause } from '@/types';
import styles from './ComplianceViolations.module.css';

export default function ComplianceViolationsPage() {
  const {
    assets,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    expandedAsset,
    toggleAsset,
    getSeverityClass,
  } = useComplianceViolationsPage();

  const { isVisualFetching, handleFetchingChange } = useVisualFetching({
    minVisibleTime: 400,
  });

  // Apply visual fetching when loading changes
  useEffect(() => {
    handleFetchingChange(isLoading);
  }, [isLoading, handleFetchingChange]);

  if (isLoading) {
    return <LoadingState text="LOADING VIOLATIONS..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="FAILED TO LOAD VIOLATIONS"
        message="There was an error fetching the compliance violation data."
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>
            <ShieldAlert className={styles.titleIcon} />
            Compliance Violations
          </h1>
          <p className={styles.subtitle}>
            Assets that failed one or more compliance controls, sorted by
            violation count.
          </p>
        </div>

        <div className={styles.controlsContainer}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by IP, hostname, or device type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className={styles.centerContent}>
          <ShieldAlert
            size={48}
            style={{ color: '#22c55e', marginBottom: '1rem' }}
          />
          <h2 style={{ color: 'white', fontSize: '1.25rem' }}>
            No Violations Found
          </h2>
          <p>All assets are fully compliant with the assessed frameworks.</p>
        </div>
      ) : (
        <div className={styles.mainCard}>
          <div
            className={`${styles.assetsList} ${isVisualFetching ? styles.updating : ''}`}
          >
            {assets.map((asset, index) => {
              const isExpanded = expandedAsset === asset.ip_address;
              return (
                <div
                  key={asset.ip_address}
                  className={styles.assetItem}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Asset Header */}
                  <div
                    className={styles.assetHeader}
                    onClick={() => toggleAsset(asset.ip_address)}
                  >
                    <div className={styles.assetIdent}>
                      <div className={styles.serverIconWrapper}>
                        <Server size={20} />
                      </div>

                      <div className={styles.assetMeta}>
                        <div className={styles.headlineRow}>
                          <span className={styles.hostname}>
                            {asset.hostname || 'Unknown Hostname'}
                          </span>
                          <span className={styles.ipAddressTag}>
                            {asset.ip_address}
                          </span>
                        </div>
                        <div className={styles.deviceInfo}>
                          {asset.device_type && (
                            <span className={styles.tag}>
                              <HardDrive
                                size={12}
                                style={{ marginRight: '6px' }}
                              />
                              {asset.device_type}
                            </span>
                          )}
                          {asset.os_name && (
                            <span className={styles.tag}>
                              <Activity
                                size={12}
                                style={{ marginRight: '6px' }}
                              />
                              {asset.os_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.violationInfo}>
                      <div className={styles.countBadge}>
                        <AlertTriangle size={14} />
                        {asset.violation_count} Violations
                      </div>
                      <ChevronDown
                        className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
                        size={20}
                      />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className={styles.expandedContent}>
                      {/* Controls Violated Overview */}
                      <h4 className={styles.sectionTitle}>
                        <FileText className={styles.sectionIcon} />
                        Controls Violated Overview
                      </h4>
                      <div className={styles.controlsList}>
                        {asset.controls_violated.map((control) => (
                          <span key={control} className={styles.controlBadge}>
                            {control}
                          </span>
                        ))}
                      </div>

                      {/* Root Causes */}
                      <h4 className={styles.sectionTitle}>
                        <AlertTriangle className={styles.sectionIcon} />
                        Root Causes
                      </h4>
                      <div className={styles.rootCausesGrid}>
                        {asset.root_causes.map(
                          (cause: RootCause, idx: number) => (
                            <div key={idx} className={styles.causeCard}>
                              <div className={styles.causeHeader}>
                                <div className={styles.causeTitleGroup}>
                                  <span className={styles.causeTitle}>
                                    {cause.vuln_type
                                      ? cause.vuln_type.replace(/_/g, ' ')
                                      : 'Unknown vulnerability'}
                                  </span>
                                  <span className={styles.causeService}>
                                    {cause.service
                                      ? `Service: ${cause.service.toUpperCase()}`
                                      : ''}
                                    {cause.port ? ` (Port ${cause.port})` : ''}
                                  </span>
                                </div>
                                <span
                                  className={`${styles.severityBadge} ${styles[getSeverityClass(cause.severity)]}`}
                                >
                                  {(cause.severity || 'info').toUpperCase()}
                                </span>
                              </div>

                              <p className={styles.causeDescription}>
                                {cause.description ||
                                  'No description available for this finding.'}
                              </p>

                              <div className={styles.causeFooter}>
                                <span className={styles.causeFooterLabel}>
                                  Controls Triggered
                                </span>
                                <div className={styles.miniControlsList}>
                                  {cause.controls_violated.map((cv) => (
                                    <span
                                      key={`${idx}-${cv}`}
                                      className={styles.miniControlBadge}
                                    >
                                      {cv}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
