import { useState, useMemo, useEffect } from 'react';
import {
  useGetRiskDashboardQuery,
  useGetAssessmentVulnerabilitiesQuery,
} from '@/store/apis/riskApi';
import VulnerabilityRow from '@/components/vulnerability/VulnerabilityRow';
import Pagination from '@/components/custom/Pagination';
import { EmptyState, StatCard } from '@/components/custom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { FilterSelect, SelectItem } from '@/components/ui/filter-select';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import styles from './styles/Vulnerabilities.module.css';

export default function VulnerabilitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isKevOnly, setIsKevOnly] = useState(false);
  const [isVisualFetching, setIsVisualFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedVulnId, setExpandedVulnId] = useState<string | null>(null);

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
        search: searchTerm || undefined,
        is_kev: isKevOnly,
      } as any,
      { skip: !assessmentId }
    );

  // Minimum visual fetching time logic
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isFetching) {
      setIsVisualFetching(true);
    } else {
      // stop fetching, wait before removing the visual state to prevent flickering on fast responses
      timeoutId = setTimeout(() => {
        setIsVisualFetching(false);
      }, 400);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isFetching]);

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

  const isFiltered = searchTerm || severityFilter !== 'all' || isKevOnly;

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
      </div>

      {/* Stats Section */}
      <div className={styles.statsGrid}>
        {VULNERABILITY_STATS.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Filters Section */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchContainer}>
          <SearchInput
            placeholder="Search vulnerabilities..."
            value={searchTerm}
            onChange={setSearchTerm}
            aria-label="Search vulnerabilities"
          />
        </div>

        <FilterSelect
          value={severityFilter}
          onValueChange={handleSeverityChange}
          placeholder="Severity"
        >
          <SelectItem value="all">All Severities</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </FilterSelect>

        <Button
          onClick={handleKevToggle}
          variant={isKevOnly ? 'default' : 'outline'}
          className={`${styles.kevToggle} ${isKevOnly ? styles.kevToggleActive : ''}`}
        >
          <Zap
            className={`w-3.5 h-3.5 ${isKevOnly ? 'fill-orange-500' : ''}`}
          />
          CISA KEV
        </Button>
      </div>

      {/* Main Card Content */}
      <Card className={styles.mainCard}>
        <div
          className={`${styles.vulnerabilitiesList} ${isVisualFetching ? styles.updating : ''}`}
        >
          {vulnerabilities.length === 0 ? (
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
                setIsKevOnly(false);
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
            <Pagination
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
