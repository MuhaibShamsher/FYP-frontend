import { useEffect } from 'react';
import { useComplianceResultsPage, useVisualFetching } from '@/hooks';
import {
  LoadingState,
  ErrorState,
  TerminalPagination,
  EmptyState,
  SearchFilterBar,
} from '@/components/custom';
import { ComplianceResultRow } from '@/components/compliance';
import { Card } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import type { ComplianceFramework } from '@/types';
import styles from './ComplianceResults.module.css';

export default function ComplianceResultsPage() {
  const {
    framework,
    setFramework,
    statusFilter,
    setStatusFilter,
    categoryInput,
    setCategoryInput,
    placeholder,
    currentPage,
    setCurrentPage,
    expandedId,
    toggleExpanded,
    results,
    pagination,
    isLoading,
    isFetching,
    isError,
    hasResponse,
    pageSize,
  } = useComplianceResultsPage();

  const { isVisualFetching, handleFetchingChange } = useVisualFetching({
    minVisibleTime: 400,
  });

  // Apply visual fetching when isFetching changes
  useEffect(() => {
    handleFetchingChange(isFetching);
  }, [isFetching, handleFetchingChange]);

  if (isLoading) {
    return <LoadingState text="LOADING COMPLIANCE RESULTS..." />;
  }

  if (isError || !hasResponse) {
    return (
      <ErrorState
        title="FAILED TO LOAD RESULTS"
        message="There was an error fetching compliance control results."
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>
            <ShieldCheck className={styles.titleIcon} aria-hidden />
            Compliance Results
          </h1>
          <p className={styles.subtitle}>
            Per-control outcomes with evidence for the active compliance
            assessment.
          </p>
        </div>

        <SearchFilterBar
          searchPlaceholder={placeholder}
          searchValue={categoryInput}
          onSearchChange={setCategoryInput}
          searchAriaLabel="Filter by framework category"
          filters={[
            {
              value: framework,
              onValueChange: (value) => {
                setFramework(value as ComplianceFramework);
              },
              placeholder: 'Framework',
              options: [
                { value: 'iso27001', label: 'ISO 27001' },
                { value: 'nist', label: 'NIST' },
                { value: 'cis', label: 'CIS' },
              ],
            },
            {
              value: statusFilter,
              onValueChange: setStatusFilter,
              placeholder: 'Status',
              options: [
                { value: 'all', label: 'All statuses' },
                { value: 'pass', label: 'Pass' },
                { value: 'fail', label: 'Fail' },
                { value: 'partial', label: 'Partial' },
              ],
            },
          ]}
          className={styles.filtersContainer}
        />
      </div>

      <Card className={styles.mainCard}>
        <div className={isVisualFetching ? styles.updating : ''}>
          {results.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="NO COMPLIANCE RESULTS"
              message="No compliance controls were found for the current assessment."
            />
          ) : (
            results.map((row, index) => (
              <ComplianceResultRow
                key={row.id}
                row={row}
                index={index}
                isOpen={expandedId === row.id}
                onToggle={() => toggleExpanded(row.id)}
              />
            ))
          )}
        </div>

        {results.length > 0 &&
          pagination &&
          (pagination.total_pages || 1) > 1 && (
            <TerminalPagination
              currentPage={pagination.page || currentPage}
              totalPages={Math.max(1, pagination.total_pages || 1)}
              totalItems={pagination.count}
              itemsPerPage={pagination.page_size || pageSize}
              onPageChange={setCurrentPage}
              isFetching={isFetching}
              itemLabel="controls"
            />
          )}
      </Card>
    </div>
  );
}
