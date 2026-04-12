import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetComplianceViolationsQuery } from '@/store/apis/complianceApi';
import {
  ShieldAlert,
  Server,
  Activity,
  FileText,
  ChevronDown,
  AlertTriangle,
  HardDrive,
  Search
} from 'lucide-react';
import LoadingState from '@/components/custom/LoadingState';
import ErrorState from '@/components/custom/ErrorState';
import styles from './styles/ComplianceViolations.module.css';
import type { RootCause } from '@/types';
import { type RootState } from '@/store';

export default function ComplianceViolationsPage() {
  const activeIds = useSelector((state: RootState) => state.activeIds);
  const targetAssessmentId = activeIds.complianceId || '0fbe3433-16d4-4878-835c-a85e31eb70a7';

  const { data: response, isLoading, isError } = useGetComplianceViolationsQuery(
    targetAssessmentId,
    { skip: !targetAssessmentId }
  );

  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const toggleAsset = (ip: string) => {
    setExpandedAsset(expandedAsset === ip ? null : ip);
  };

  const getSeverityClass = (severity: string | null) => {
    if (!severity) return styles.severityLow;
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return styles.severityHigh;
      case 'medium':
        return styles.severityMedium;
      default:
        return styles.severityLow;
    }
  };

  if (isLoading) {
    return <LoadingState text="LOADING VIOLATIONS..." />;
  }

  if (isError || !response) {
    return (
      <ErrorState 
        title="FAILED TO LOAD VIOLATIONS" 
        message="There was an error fetching the compliance violation data." 
      />
    );
  }

  const allAssets = response || [];
  
  const assets = allAssets.filter(asset => {
    const term = debouncedQuery.toLowerCase();
    return (
      (asset.ip_address && asset.ip_address.toLowerCase().includes(term)) ||
      (asset.hostname && asset.hostname.toLowerCase().includes(term)) ||
      (asset.device_type && asset.device_type.toLowerCase().includes(term))
    );
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>
            <ShieldAlert className={styles.titleIcon} />
            Compliance Violations
          </h1>
          <p className={styles.subtitle}>
            Assets that failed one or more compliance controls, sorted by violation count.
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
          <ShieldAlert size={48} style={{ color: '#22c55e', marginBottom: '1rem' }} />
          <h2 style={{ color: 'white', fontSize: '1.25rem' }}>No Violations Found</h2>
          <p>All assets are fully compliant with the assessed frameworks.</p>
        </div>
      ) : (
        <div className={styles.mainCard}>
          <div className={styles.assetsList}>
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
                              <HardDrive size={12} style={{ marginRight: '6px' }} />
                              {asset.device_type}
                            </span>
                          )}
                          {asset.os_name && (
                            <span className={styles.tag}>
                              <Activity size={12} style={{ marginRight: '6px' }} />
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
                        {asset.root_causes.map((cause: RootCause, idx: number) => (
                          <div key={idx} className={styles.causeCard}>
                            <div className={styles.causeHeader}>
                              <div className={styles.causeTitleGroup}>
                                <span className={styles.causeTitle}>
                                  {cause.vuln_type ? cause.vuln_type.replace(/_/g, ' ') : 'Unknown vulnerability'}
                                </span>
                                <span className={styles.causeService}>
                                  {cause.service ? `Service: ${cause.service.toUpperCase()}` : ''}
                                  {cause.port ? ` (Port ${cause.port})` : ''}
                                </span>
                              </div>
                              <span className={`${styles.severityBadge} ${getSeverityClass(cause.severity)}`}>
                                {(cause.severity || 'info').toUpperCase()}
                              </span>
                            </div>

                            <p className={styles.causeDescription}>
                              {cause.description || 'No description available for this finding.'}
                            </p>

                            <div className={styles.causeFooter}>
                              <span className={styles.causeFooterLabel}>Controls Triggered</span>
                              <div className={styles.miniControlsList}>
                                {cause.controls_violated.map((cv) => (
                                  <span key={`${idx}-${cv}`} className={styles.miniControlBadge}>
                                    {cv}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
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
