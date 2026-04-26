import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetComplianceViolationsQuery } from '@/apis';
import { useDebouncedSearch } from '@/hooks';
import type { RootState } from '@/store';

export default function useComplianceViolationsPage() {
  const activeIds = useSelector((state: RootState) => state.activeIds);
  const targetAssessmentId =
    activeIds.complianceId || '0fbe3433-16d4-4878-835c-a85e31eb70a7';

  const {
    data: response,
    isLoading,
    isError,
  } = useGetComplianceViolationsQuery(targetAssessmentId, {
    skip: !targetAssessmentId,
  });

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
