import { useState, useMemo, useEffect } from 'react';
import {
  useGetRiskDashboardQuery,
  useGetAssessmentVulnerabilitiesQuery,
} from '@/store/apis/riskApi';
import useDebouncedSearch from './useDebouncedSearch';
import useVisualFetching from './useVisualFetching';
import { ShieldAlert, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

export default function useVulnerabilitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isKevOnly, setIsKevOnly] = useState(false);
  const [expandedVulnId, setExpandedVulnId] = useState<string | null>(null);

  const {
    searchQuery: searchTerm,
    setSearchQuery: setSearchTerm,
    debouncedQuery,
  } = useDebouncedSearch({ debounceMs: 500 });
  const { isVisualFetching, handleFetchingChange } = useVisualFetching({
    minVisibleTime: 400,
  });

  // 1. Fetch dashboard to get latest assessment ID
  const { data: dashboardData } = useGetRiskDashboardQuery();
  const assessmentId = dashboardData?.statistics?.assessment_id;

  // 2. Fetch vulnerabilities for that ID
  const { data: vulnResponse, isFetching } =
    useGetAssessmentVulnerabilitiesQuery(
      {
        assessmentId: assessmentId || '',
        page: currentPage,
        page_size: pageSize,
        severity: severityFilter === 'all' ? undefined : severityFilter,
        search: debouncedQuery || undefined,
        is_kev: isKevOnly,
      } as any,
      { skip: !assessmentId }
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

  const VULNERABILITY_STATS = useMemo(
    () => [
      {
        title: 'CRITICAL',
        value: dashboardData?.statistics.severity_breakdown.critical || 0,
        icon: ShieldAlert,
        iconColorClass: 'text-red-500',
      },
      {
        title: 'HIGH',
        value: dashboardData?.statistics.severity_breakdown.high || 0,
        icon: AlertTriangle,
        iconColorClass: 'text-orange-500',
      },
      {
        title: 'MEDIUM',
        value: dashboardData?.statistics.severity_breakdown.medium || 0,
        icon: Info,
        iconColorClass: 'text-yellow-500',
      },
      {
        title: 'CLEAN',
        value: dashboardData?.statistics.severity_breakdown.low || 0,
        icon: ShieldCheck,
        iconColorClass: 'text-blue-500',
      },
    ],
    [dashboardData]
  );

  return {
    // Data
    vulnerabilities,
    pagination,
    vulnerabilityStats: VULNERABILITY_STATS,

    // Loading states
    isVisualFetching,

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
    pageSize,

    // Expansion
    expandedVulnId,
    toggleVulnExpansion,
  };
}
