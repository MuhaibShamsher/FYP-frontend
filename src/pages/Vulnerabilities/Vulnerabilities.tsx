import { useVulnerabilitiesPage } from '@/hooks';
import {
  TerminalPagination,
  EmptyState,
  ErrorState,
  LoadingState,
  SearchFilterBar,
} from '@/components/custom';
import { VulnerabilityRow } from '@/components/vulnerability';
import { Card } from '@/components/ui';
import { ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import styles from './Vulnerabilities.module.css';

export default function VulnerabilitiesPage() {
  const {
    vulnerabilities,
    pagination,
    isLoading,
    isVisualFetching,
    isError,
    isEmptyResult,
    searchTerm,
    setSearchTerm,
    severityFilter,
    setSeverityFilter,
    isKevOnly,
    setIsKevOnly,
    isFiltered,
    currentPage,
    setCurrentPage,
    pageSize,
    expandedVulnId,
    toggleVulnExpansion,
  } = useVulnerabilitiesPage();

  if (isLoading) {
    return <LoadingState text="LOADING VULNERABILITIES..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="FAILED TO LOAD RESULTS"
        message="There was an error fetching vulnerabilities."
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>
            <ShieldAlert className={styles.titleIcon} aria-hidden />
            Vulnerabilities
          </h1>
          <p className={styles.subtitle}>
            Security vulnerabilities identified in the latest assessment
          </p>
        </div>

        <SearchFilterBar
          searchPlaceholder="Search vulnerabilities..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchAriaLabel="Search vulnerabilities"
          filters={[
            {
              value: severityFilter,
              onValueChange: setSeverityFilter,
              placeholder: 'Severity',
              options: [
                { value: 'all', label: 'All Severities' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ],
            },
          ]}
          toggles={[
            {
              label: 'CISA KEV',
              isActive: isKevOnly,
              onToggle: () => setIsKevOnly(),
              icon: (
                <Zap
                  className={`w-3.5 h-3.5 ${isKevOnly ? 'fill-orange-500' : ''}`}
                />
              ),
              className: `${styles.kevToggle} ${isKevOnly ? styles.kevToggleActive : ''}`,
            },
          ]}
          className={styles.filtersContainer}
        />
      </div>

      <Card className={styles.mainCard}>
        <div className={`${styles.vulnerabilitiesList} ${isVisualFetching ? styles.updating : ''}`}>
          {isEmptyResult ? (
            <EmptyState
              icon={ShieldCheck}
              title="NO VULNERABILITIES FOUND"
              message={
                isFiltered
                  ? 'Adjust your filters or search term to discover other vulnerabilities.'
                  : 'No vulnerabilities were identified in the latest security assessment.'
              }
              actionLabel={isFiltered ? 'RESET ALL FILTERS' : undefined}
              onAction={() => {
                setSearchTerm('');
                setSeverityFilter('all');
                setIsKevOnly();
              }}
            />
          ) : (
            vulnerabilities.map((vuln: any, index: number) => (
              <VulnerabilityRow
                key={vuln.id}
                vuln={vuln}
                index={index}
                isOpen={expandedVulnId === vuln.id}
                onToggle={() => toggleVulnExpansion(vuln.id)}
              />
            ))
          )}
        </div>

        {vulnerabilities.length > 0 &&
          pagination &&
          (pagination.total_pages || 1) > 1 && (
            <TerminalPagination
              currentPage={pagination.page || currentPage}
              totalPages={Math.max(1, pagination.total_pages || 1)}
              totalItems={pagination.count}
              itemsPerPage={pagination.page_size || pageSize}
              onPageChange={setCurrentPage}
              isFetching={isVisualFetching}
              itemLabel="vulnerabilities"
            />
          )}
      </Card>
    </div>
  );
}
