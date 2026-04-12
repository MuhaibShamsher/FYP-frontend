import type { RootState } from '@/store';
import type { ComplianceFramework } from '@/types';

import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetComplianceResultsQuery } from '@/store/apis/complianceApi';
import {
  COMPLIANCE_RESULTS_PAGE_SIZE,
  FALLBACK_COMPLIANCE_ASSESSMENT_ID,
} from '@/components/compliance/utils/constants';

function categorySearchPlaceholder(framework: ComplianceFramework): string {
  switch (framework) {
    case 'iso27001':
      return 'Filter by category (Organizational Controls)...';
    case 'nist':
      return 'Filter by family code (RA, SC, CM)...';
    case 'cis':
      return 'Filter by group number (7, 12)...';
    default:
      return 'Filter by category...';
  }
}

export default function useComplianceResultsPage() {
  const complianceId = useSelector(
    (state: RootState) => state.activeIds.complianceId
  );
  const assessmentId = complianceId ?? FALLBACK_COMPLIANCE_ASSESSMENT_ID;

  const [framework, setFramework] = useState<ComplianceFramework>('iso27001');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryInput, setCategoryInput] = useState('');
  const [debouncedCategory, setDebouncedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedCategory(categoryInput.trim()), 400);
    return () => clearTimeout(t);
  }, [categoryInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [framework, statusFilter, debouncedCategory]);

  const queryArgs = useMemo(
    () => ({
      id: assessmentId,
      framework,
      page: currentPage,
      page_size: COMPLIANCE_RESULTS_PAGE_SIZE,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(debouncedCategory ? { category: debouncedCategory } : {}),
    }),
    [assessmentId, framework, currentPage, statusFilter, debouncedCategory]
  );

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetComplianceResultsQuery(queryArgs, { skip: !assessmentId });

  const placeholder = useMemo(
    () => categorySearchPlaceholder(framework),
    [framework]
  );

  return {
    assessmentId,
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
    results: response?.data ?? [],
    pagination: response?.pagination,
    isLoading,
    isFetching,
    isError,
    hasResponse: Boolean(response),
    pageSize: COMPLIANCE_RESULTS_PAGE_SIZE,
  };
}
