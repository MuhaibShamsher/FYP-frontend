import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetComplianceResultsQuery } from '@/apis';
import { useDebouncedSearch, useVisualFetching } from '@/hooks';
import { 
  DEFAULT_PAGE_SIZE, 
  DEFAULT_DEBOUNCE_MS, 
  MIN_VISIBLE_LOADING_TIME_MS, 
} from '@/constants';
import type { RootState } from '@/store';
import type { ComplianceFramework } from '@/types';

function categorySearchPlaceholder(framework: ComplianceFramework): string {
  switch (framework) {
    case 'iso27001':
      return 'Filter by category (Org Controls)...';
    case 'nist':
      return 'Filter by family code (RA, SC, CM)...';
    case 'cis':
      return 'Filter by group number (7, 12)...';
    default:
      return 'Filter by category...';
  }
}

export default function useComplianceResultsPage() {
  const { complianceId } = useSelector((s: RootState) => s.activeIds);

  const [framework, setFramework] = useState<ComplianceFramework>('iso27001');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    searchQuery: categoryInput,
    setSearchQuery: setCategoryInput,
    debouncedQuery: debouncedCategory,
  } = useDebouncedSearch({ initialValue: '', debounceMs: DEFAULT_DEBOUNCE_MS });

  const { isVisualFetching, handleFetchingChange } = useVisualFetching({
    minVisibleTime: MIN_VISIBLE_LOADING_TIME_MS,
  });

  const queryArgs = useMemo(
    () => ({
      id: complianceId as string,
      framework,
      page: currentPage,
      page_size: DEFAULT_PAGE_SIZE,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(debouncedCategory ? { category: debouncedCategory } : {}),
    }),
    [complianceId, framework, currentPage, statusFilter, debouncedCategory]
  );

  const { data: response, isFetching, isLoading, isError } = useGetComplianceResultsQuery(
    complianceId ? queryArgs : skipToken
  );

  // Apply visual fetching when isFetching changes
  useEffect(() => {
    handleFetchingChange(isFetching);
  }, [isFetching, handleFetchingChange]);

  const placeholder = useMemo(
    () => categorySearchPlaceholder(framework), [framework]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [framework, statusFilter, debouncedCategory]);

  const results = response?.data ?? [];
  const isEmptyResult = !isLoading && results.length === 0;
  const isFiltered = statusFilter !== 'all' || categoryInput || framework !== 'iso27001';

  return {
    complianceId,
    framework,
    setFramework,
    statusFilter,
    setStatusFilter,
    categoryInput,
    setCategoryInput,
    currentPage,
    setCurrentPage,
    expandedId,
    toggleExpanded: (id: string) =>
      setExpandedId((prev) => (prev === id ? null : id)),
    placeholder,
    results,
    pagination: response?.pagination,
    isLoading,
    isVisualFetching,
    isError,
    isEmptyResult,
    isFiltered,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}
