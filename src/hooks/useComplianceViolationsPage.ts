import { useState } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetComplianceViolationsQuery } from '@/apis';
import { useDebouncedSearch } from '@/hooks';
import type { RootState } from '@/store';

export default function useComplianceViolationsPage() {
  const complianceId = useSelector(
    (state: RootState) => state.activeIds.complianceId
  );

  const {
    data: response,
    isLoading,
    isError,
  } = useGetComplianceViolationsQuery(complianceId ?? skipToken);

  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const { searchQuery, setSearchQuery, debouncedQuery } = useDebouncedSearch({
    debounceMs: 500,
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

  const filteredAssets = (response || []).filter((asset) => {
    const term = debouncedQuery.toLowerCase();
    return (
      (asset.ip_address && asset.ip_address.toLowerCase().includes(term)) ||
      (asset.hostname && asset.hostname.toLowerCase().includes(term)) ||
      (asset.device_type && asset.device_type.toLowerCase().includes(term))
    );
  });

  return {
    assets: filteredAssets,
    response,
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    expandedAsset,
    toggleAsset,
    getSeverityClass,
  };
}
