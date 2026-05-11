import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetComplianceViolationsQuery } from '@/apis';
import { useDebouncedSearch, useVisualFetching } from '@/hooks';
import { DEFAULT_DEBOUNCE_MS, MIN_VISIBLE_LOADING_TIME_MS } from '@/constants';
import type { RootState } from '@/store';

export default function useComplianceViolationsPage() {
  const { complianceId } = useSelector((s: RootState) => s.activeIds);

  const { data, isFetching, isLoading, isError } = 
    useGetComplianceViolationsQuery(complianceId ? complianceId : skipToken);

  const { isVisualFetching, handleFetchingChange } = useVisualFetching({
    minVisibleTime: MIN_VISIBLE_LOADING_TIME_MS,
  });

  // Apply visual fetching when isFetching changes
  useEffect(() => {
    handleFetchingChange(isFetching);
  }, [isFetching, handleFetchingChange]);

  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const { searchQuery, setSearchQuery, debouncedQuery } = useDebouncedSearch({
    debounceMs: DEFAULT_DEBOUNCE_MS,
  });

  const toggleAsset = (ip: string) => {
    setExpandedAsset(expandedAsset === ip ? null : ip);
  };

  const getSeverityClass = (severity: string | null) => {
    if (!severity) return 'severityLow';
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'severityHigh';
      case 'medium':
        return 'severityMedium';
      default:
        return 'severityLow';
    }
  };

  const nonCompliantAssets = (data || []).filter((violatingAsset) => {
    const term = debouncedQuery.toLowerCase();
    return (
      (violatingAsset.ip_address && violatingAsset.ip_address.toLowerCase().includes(term)) ||
      (violatingAsset.hostname && violatingAsset.hostname.toLowerCase().includes(term)) ||
      (violatingAsset.device_type && violatingAsset.device_type.toLowerCase().includes(term))
    );
  });

  const isEmptyResult = !isLoading && nonCompliantAssets.length === 0;

  return {
    // Data
    nonCompliantAssets,

    // Loading and error states
    isLoading,
    isVisualFetching,
    isError,
    isEmptyResult,

    // Search
    searchQuery,
    setSearchQuery,

    // Expansion
    expandedAsset,
    toggleAsset,
    getSeverityClass,
  };
}
