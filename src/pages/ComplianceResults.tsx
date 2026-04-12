import LoadingState from '@/components/custom/LoadingState';
import ErrorState from '@/components/custom/ErrorState';
import Pagination from '@/components/custom/Pagination';
import EmptyState from '@/components/custom/EmptyState';
import ComplianceResultRow from '@/components/compliance/ComplianceResultRow';
import useComplianceResultsPage from '@/hooks/useComplianceResultsPage';

import { Card } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search-input';
import { FilterSelect, SelectItem } from '@/components/ui/filter-select';
import { ShieldCheck } from 'lucide-react';

import type { ComplianceFramework } from '@/types';
import styles from '@/components/compliance/styles/ComplianceResults.module.css';


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
            Per-control outcomes with evidence for the active compliance assessment.
          </p>
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <SearchInput
              placeholder={placeholder}
              value={categoryInput}
              onChange={setCategoryInput}
              aria-label="Filter by framework category"
            />
          </div>
    
          <FilterSelect
            value={framework}
            onValueChange={(value) => {
              setFramework(value as ComplianceFramework);
            }}
            placeholder="Framework"
          >
            <SelectItem value="iso27001">ISO 27001</SelectItem>
            <SelectItem value="nist">NIST</SelectItem>
            <SelectItem value="cis">CIS</SelectItem>
          </FilterSelect>
    
          <FilterSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            placeholder="Status"
          >
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pass">Pass</SelectItem>
            <SelectItem value="fail">Fail</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </FilterSelect>
        </div>
      </div>

      <Card className={styles.mainCard}>
        <div
          className={`${styles.resultsList} ${isFetching ? styles.updating : ''}`}
        >
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

        {results.length > 0 && pagination && (pagination.total_pages || 1) > 1 && (
          <Pagination
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
