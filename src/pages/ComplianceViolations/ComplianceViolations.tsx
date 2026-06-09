import { useComplianceViolationsPage } from '@/hooks';
import { LoadingState, ErrorState, EmptyState } from '@/components/custom';
import { ComplianceViolationCard } from '@/components/compliance';
import { Card } from '@/components/ui';
import { ShieldAlert, ShieldCheck, Search } from 'lucide-react';
import styles from './ComplianceViolations.module.css';

export default function ComplianceViolationsPage() {
  const {
    nonCompliantAssets,
    searchQuery,
    setSearchQuery,
    isLoading,
    isError,
    isEmptyResult,
    expandedAsset,
    toggleAsset,
    getSeverityClass,
  } = useComplianceViolationsPage();

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
        <div className="globalPageHeader">
          <h1 className="globalPageTitle">
            <ShieldAlert className="globalTitleIcon" />
            Compliance Violations
          </h1>
          <p className="globalPageSubtitle">
            Provides the results which assets are violating which compliance controls with evidences.
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

      <Card className={styles.mainCard}>
        {isEmptyResult ? (
          <EmptyState
            icon={ShieldCheck}
            title="NO VIOLATIONS FOUND"
            message={
              searchQuery
                ? 'Adjust your search term to discover other violations.'
                : 'All nonCompliantAssets are fully compliant with the assessed frameworks.'
            }
            actionLabel={searchQuery ? 'RESET SEARCH' : undefined}
            onAction={() => setSearchQuery('')}
          />
        ) : (
          nonCompliantAssets.map((asset, index) => (
            <ComplianceViolationCard
              key={asset.ip_address}
              nonCompliantAsset={asset}
              index={index}
              isExpanded={expandedAsset === asset.ip_address}
              onToggle={() => toggleAsset(asset.ip_address)}
              getSeverityClass={getSeverityClass}
            />
          ))
        )}
      </Card>
    </div>
  );
}
