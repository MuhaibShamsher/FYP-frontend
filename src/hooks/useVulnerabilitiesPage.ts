import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetAssessmentVulnerabilitiesQuery } from '@/apis';
import { useDebouncedSearch, useVisualFetching } from '@/hooks';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_DEBOUNCE_MS,
  MIN_VISIBLE_LOADING_TIME_MS,
} from '@/constants';
import type { RootState } from '@/store';

export default function useVulnerabilitiesPage() {
  const { riskAssessmentId } = useSelector((s: RootState) => s.activeIds);

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isKevOnly, setIsKevOnly] = useState(false);
  const [expandedVulnId, setExpandedVulnId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    searchQuery: searchTerm,
    setSearchQuery: setSearchTerm,
    debouncedQuery,
  } = useDebouncedSearch({ debounceMs: DEFAULT_DEBOUNCE_MS });

  const { isVisualFetching, handleFetchingChange } = useVisualFetching({
    minVisibleTime: MIN_VISIBLE_LOADING_TIME_MS,
  });

  const queryArgs = useMemo(
    () => ({
      assessmentId: riskAssessmentId,
      page: currentPage,
      page_size: DEFAULT_PAGE_SIZE,
      ...(severityFilter !== 'all' ? { severity: severityFilter } : {}),
      ...(debouncedQuery ? { search: debouncedQuery } : {}),
      is_kev: isKevOnly,
    }),
    [riskAssessmentId, severityFilter, currentPage, isKevOnly, debouncedQuery]
  );

  const {
    data: vulnResponse,
    isFetching,
    isLoading,
    isError,
  } = useGetAssessmentVulnerabilitiesQuery(
    riskAssessmentId ? (queryArgs as any) : skipToken
  );

  // Apply visual fetching when isFetching changes
  useEffect(() => {
    handleFetchingChange(isFetching);
  }, [isFetching, handleFetchingChange]);

  const handleSeverityChange = (severity: string) => {
    setSeverityFilter(severity);
    setCurrentPage(1);
  };

  const handleKevToggle = () => {
    setIsKevOnly(!isKevOnly);
    setCurrentPage(1);
  };

  const toggleVulnExpansion = (vulnId: string) => {
    setExpandedVulnId(expandedVulnId === vulnId ? null : vulnId);
  };

  const vulnerabilities =
    (Array.isArray(vulnResponse)
      ? vulnResponse
      : (vulnResponse as any)?.data) || [];

  const pagination = (vulnResponse as any)?.pagination;

  const isFiltered = debouncedQuery || severityFilter !== 'all' || isKevOnly;
  const isEmptyResult = !isLoading && vulnerabilities.length === 0;

  return {
    // Data
    vulnerabilities,
    pagination,

    // Loading and error states
    isLoading,
    isVisualFetching,
    isError,
    isEmptyResult,

    // Search and filters
    searchTerm,
    setSearchTerm,
    severityFilter,
    setSeverityFilter: handleSeverityChange,
    isKevOnly,
    setIsKevOnly: handleKevToggle,
    isFiltered,

    // Pagination
    currentPage,
    setCurrentPage,
    pageSize: DEFAULT_PAGE_SIZE,

    // Expansion
    expandedVulnId,
    toggleVulnExpansion,
  };
}
