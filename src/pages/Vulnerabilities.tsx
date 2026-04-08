import { useState, useMemo, useEffect } from 'react';
import {
  useGetRiskDashboardQuery,
  useGetAssessmentVulnerabilitiesQuery
} from '@/store/apis/riskApi';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Filter,
  Zap,
  AlertTriangle,
  Info,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { LoadingState, ErrorState, EmptyState, TerminalPagination, StatCard } from '@/components/custom';
import { VulnerabilityDetailModal } from '@/components/models';
import type { Vulnerability } from '@/types';
import styles from './styles/Vulnerabilities.module.css';

export default function VulnerabilitiesPage() {
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isKevOnly, setIsKevOnly] = useState(false);
  const [isVisualFetching, setIsVisualFetching] = useState(false);

  // 1. Fetch dashboard to get latest assessment ID
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetRiskDashboardQuery();
  const assessmentId = dashboardData?.statistics?.assessment_id;

  // 2. Fetch vulnerabilities for that ID
  const {
    data: vulnResponse,
    isLoading: isVulnsLoading,
    isFetching: isVulnsFetching,
    error: isVulnsError
  } = useGetAssessmentVulnerabilitiesQuery(
    {
      assessmentId: assessmentId || '',
      page: currentPage,
      page_size: pageSize,
      severity: severityFilter === 'all' ? undefined : severityFilter,
      is_kev: isKevOnly ? true : undefined
    },
    { skip: !assessmentId }
  );

  // Minimum visual fetching time logic
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isVulnsFetching) {
      setIsVisualFetching(true);
    } else {
      // If we stop fetching, wait a bit before removing the visual state
      // to prevent "flickering" on fast responses.
      timeoutId = setTimeout(() => {
        setIsVisualFetching(false);
      }, 400);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVulnsFetching]);

  const handleSeverityChange = (severity: string) => {
    setSeverityFilter(severity);
    setCurrentPage(1); // Reset to first page
  };

  const handleKevToggle = () => {
    setIsKevOnly(!isKevOnly);
    setCurrentPage(1); // Reset to first page
  };

  // Handle both direct arrays and paginated objects
  const vulnerabilities = (Array.isArray(vulnResponse) ? vulnResponse : (vulnResponse as any)?.data) || [];
  const pagination = (vulnResponse as any)?.pagination;


  // Filter vulnerabilities
  const filteredVulns = useMemo(() => {
    return vulnerabilities.filter(v =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.cve_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vulnerabilities, searchTerm]);

  const isFiltered = searchTerm || severityFilter !== 'all' || isKevOnly;

  const VULNERABILITY_STATS = useMemo(() => [
    {
      title: "CRITICAL",
      value: dashboardData?.statistics.severity_breakdown.critical || 0,
      icon: ShieldAlert,
      iconColorClass: "text-red-500",
    },
    {
      title: "HIGH",
      value: dashboardData?.statistics.severity_breakdown.high || 0,
      icon: AlertTriangle,
      iconColorClass: "text-orange-500",
    },
    {
      title: "MEDIUM",
      value: dashboardData?.statistics.severity_breakdown.medium || 0,
      icon: Info,
      iconColorClass: "text-yellow-500",
    },
    {
      title: "CLEAN",
      value: dashboardData?.statistics.severity_breakdown.low || 0,
      icon: ShieldCheck,
      iconColorClass: "text-blue-500",
    },
  ], [dashboardData]);

  return (
    <div className={styles.pageContainer}>
      {/* Header & Title */}
      <div className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div className={styles.systemLabel}>
            <div className={styles.statusDot} />
            Unified Threat Feed
          </div>
          <h1 className={styles.pageTitle}>Security Vulnerabilities</h1>
        </div>

        {/* Quick Stats Grid */}
        <div className={styles.statsGrid}>
          {VULNERABILITY_STATS.map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColorClass={stat.iconColorClass}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area with State Handling */}
      <div className={styles.tableContainer}>
        {isVulnsLoading || isDashboardLoading ? (
          <div className={styles.loaderWrapper}>
            <LoadingState text="SYNCHRONIZING THREAT INTELLIGENCE..." />
          </div>
        ) : isVulnsError ? (
          <div className={styles.errorWrapper}>
            <ErrorState
              title="TELEMETRY FAILURE"
              message={!assessmentId ? "No active assessment detected. Launch a system scan." : "Unable to retrieve vulnerability feed."}
            />
          </div>
        ) : (
          <>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>Findings ({filteredVulns.length})</h2>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search CVE, Title, or Asset..."
                  className={styles.searchInput}
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className={styles.filtersRow}>
              <div className={styles.filterGroup}>
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className={styles.filterLabel}>Severity:</span>
                <div className="flex gap-1">
                  {['all', 'critical', 'high', 'medium', 'low', 'info'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSeverityChange(s)}
                      className={`${styles.severityFilterBtn} ${severityFilter === s ? styles.severityFilterBtnActive : ''}`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px h-6 bg-white/10 mx-2" />

              <div className={styles.filterGroup}>
                <button
                  onClick={handleKevToggle}
                  className={`${styles.kevToggle} ${isKevOnly ? styles.kevToggleActive : ''}`}
                >
                  <Zap className={`w-3.5 h-3.5 ${isKevOnly ? 'fill-orange-500' : ''}`} />
                  KEV EXPLOITS
                </button>
              </div>
            </div>

            <table className={`${styles.vulnTable} ${isVisualFetching ? styles.tableFetching : ''}`}>
              <thead>
                <tr>
                  <th className={styles.th}>Finding / CVE</th>
                  <th className={styles.th}>Severity</th>
                  <th className={styles.th}>Score</th>
                  <th className={styles.th}>Asset</th>
                  <th className={styles.th}>Source</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {filteredVulns.length > 0 ? (
                  filteredVulns.map((vuln) => (
                    <tr
                      key={vuln.id}
                      className={styles.tr}
                      onClick={() => setSelectedVuln(vuln)}
                    >
                      <td className={styles.td}>
                        <div className={styles.vulnIdInfo}>
                          <span className={styles.vulnTitle}>{vuln.title}</span>
                          <span className={styles.vulnCve}>{vuln.cve_id || 'LOCAL_FINDING'}</span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.severityBadge} ${styles[vuln.severity]}`}>
                          {vuln.severity}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.scoreBadge}>{vuln.cvss_score?.toFixed(1) || 'N/A'}</span>
                      </td>
                      <td className={styles.td}>
                        <div 
                          className={`${styles.assetCell} hover:opacity-80 transition-opacity cursor-pointer`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (vuln.asset_id) navigate(`/assets/${vuln.asset_id}`);
                          }}
                        >
                          <span className={styles.assetIp}>{vuln.asset_ip || 'N/A'}</span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.sourceTag}>{vuln.detection_source}</span>
                      </td>
                      <td className={styles.td}>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20">
                      <EmptyState
                        icon={ShieldCheck}
                        title="NO MATCHING FINDINGS"
                        message={isFiltered
                          ? "Adjust your filters or search term to discover other vulnerabilities."
                          : "No vulnerabilities were identified in the latest security assessment."}
                        actionLabel={isFiltered ? "RESET ALL FILTERS" : undefined}
                        onAction={() => {
                          setLocalSearch('');
                          setSearchTerm('');
                          setSeverityFilter('all');
                          setIsKevOnly(false);
                        }}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <TerminalPagination
              currentPage={currentPage}
              totalPages={pagination?.total_pages || 1}
              totalItems={pagination?.count}
              onPageChange={setCurrentPage}
              isFetching={isVisualFetching}
            />
          </>
        )}
      </div>

      <VulnerabilityDetailModal
        selectedVuln={selectedVuln}
        setSelectedVuln={setSelectedVuln}
      />
    </div>
  );
}
