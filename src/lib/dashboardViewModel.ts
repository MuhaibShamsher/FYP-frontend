import type { LatestPipelineResponse } from '@/apis/sharedApi';
import type { Asset, FrameworkSummary } from '@/types';
import { formatDate, formatPercent, safeNumber } from '@/utils/dashboard';
import type { DashboardKpi, DashboardKpiTone } from '@/types/dashboard';

export interface DashboardViewModel {
  kpis: DashboardKpi[];
  snapshotLabel: string;
  riskLevel: string;
  overallRiskScore: number;
  complianceAverage: number;
  totalAssets: number;
  totalVulnerabilities: number;
  severityBreakdown: Array<{ label: string; count: number }>;
  deviceTypeBreakdown: Array<{ label: string; count: number }>;
  openPortExposure: Array<{ id: string; label: string; count: number }>;
  vulnTypeBreakdown: Array<{ label: string; count: number }>;
  detectionSourceBreakdown: Array<{ label: string; count: number }>;
  frameworkSummaries: FrameworkSummary[];
}

export function buildDashboardViewModel(
  latestData?: LatestPipelineResponse | null,
  assets: Asset[] = []
): DashboardViewModel {
  const latestScan = latestData?.asset_scan?.scan ?? null;
  const latestScanSummary = latestData?.asset_scan?.summary ?? null;
  const riskAssessment = latestData?.risk_assessment?.assessment ?? null;
  const riskStatistics = latestData?.risk_assessment?.statistics ?? null;
  const complianceAssessment =
    latestData?.compliance?.compliance_assessment ?? null;

  const complianceScores = [
    complianceAssessment?.iso_score,
    complianceAssessment?.cis_score,
    complianceAssessment?.nist_score,
  ].filter((s): s is number => typeof s === 'number' && Number.isFinite(s));

  const complianceAverage =
    complianceScores.length > 0
      ? complianceScores.reduce((t, s) => t + s, 0) / complianceScores.length
      : 0;

  const totalAssets =
    latestScanSummary?.total_assets ??
    (Array.isArray(assets) ? assets.length : 0);
  const totalVulnerabilities = safeNumber(
    riskAssessment?.total_vulnerabilities,
    0
  );

  const snapshotLabel = formatDate(
    riskAssessment?.completed_at ??
      latestScan?.completed_at ??
      latestScan?.updated_at ??
      latestScan?.created_at
  );

  const kpis: DashboardKpi[] = [
    {
      key: 'assets',
      title: 'Total Assets',
      value: totalAssets.toLocaleString(),
      subtitle: 'Discovered in the latest pipeline snapshot',
      tone: 'blue' as DashboardKpiTone,
    },
    {
      key: 'risk-score',
      title: 'Overall Risk Score',
      value: riskAssessment
        ? safeNumber(riskAssessment.overall_risk_score, 0).toFixed(1)
        : '0.0',
      subtitle: riskAssessment
        ? `Risk level ${String(riskAssessment.overall_risk_level ?? 'unknown').toUpperCase()}`
        : 'No active assessment',
      tone: 'orange' as DashboardKpiTone,
    },
    {
      key: 'critical-vulns',
      title: 'Critical Vulnerabilities',
      value: (riskAssessment?.critical_count ?? 0).toLocaleString(),
      subtitle: 'Immediate attention required',
      tone: 'rose' as DashboardKpiTone,
    },
    {
      key: 'kev-assets',
      title: 'KEV-affected Assets',
      value: (riskStatistics?.kev_affected_count ?? 0).toLocaleString(),
      subtitle: 'Assets with known exploited vulnerabilities',
      tone: 'amber' as DashboardKpiTone,
    },
    {
      key: 'compliance-average',
      title: 'Compliance Average',
      value: formatPercent(complianceAverage),
      subtitle: 'ISO, CIS, and NIST combined posture',
      tone: 'emerald' as DashboardKpiTone,
    },
    {
      key: 'total-vulns',
      title: 'Total Vulnerabilities',
      value: totalVulnerabilities.toLocaleString(),
      subtitle: 'Across all discovered assets',
      tone: 'slate' as DashboardKpiTone,
    },
  ];

  const severityBreakdown = Array.isArray(latestScanSummary?.severities)
    ? latestScanSummary!.severities.map((item) => ({
        label: String(item.severity).toUpperCase(),
        count: safeNumber(item.count, 0),
      }))
    : [];

  const deviceTypeBreakdown = Array.isArray(latestScanSummary?.device_types)
    ? latestScanSummary!.device_types.map((item) => ({
        label: String(item.device_type).toUpperCase(),
        count: safeNumber(item.count, 0),
      }))
    : [];

  const openPortExposure = (Array.isArray(assets) ? assets.slice() : [])
    .sort(
      (a, b) =>
        safeNumber(b.open_ports_count, 0) - safeNumber(a.open_ports_count, 0)
    )
    .slice(0, 5)
    .map((asset) => ({
      id: String(asset.id ?? ''),
      label: String(asset.hostname ?? asset.ip_address ?? ''),
      count: safeNumber(asset.open_ports_count, 0),
    }));

  const vulnTypeEntries = Array.isArray(
    Object.entries(riskStatistics?.vuln_type_breakdown ?? {})
  )
    ? Object.entries(riskStatistics?.vuln_type_breakdown ?? {})
    : [];

  const vulnTypeBreakdown = vulnTypeEntries
    .filter(([, count]) => safeNumber(count, 0) > 0)
    .sort((l, r) => safeNumber(r[1], 0) - safeNumber(l[1], 0))
    .slice(0, 6)
    .map(([label, count]) => ({
      label: String(label).replaceAll('_', ' ').toUpperCase(),
      count: safeNumber(count, 0),
    }));

  const detectionSourceEntries = Array.isArray(
    Object.entries(riskStatistics?.detection_source_breakdown ?? {})
  )
    ? Object.entries(riskStatistics?.detection_source_breakdown ?? {})
    : [];

  const detectionSourceBreakdown = detectionSourceEntries
    .filter(([, count]) => safeNumber(count, 0) > 0)
    .sort((l, r) => safeNumber(r[1], 0) - safeNumber(l[1], 0))
    .map(([label, count]) => ({
      label: String(label).replaceAll('_', ' ').toUpperCase(),
      count: safeNumber(count, 0),
    }));

  const frameworkSummaries: FrameworkSummary[] =
    complianceAssessment?.frameworks_summary
      ? (Object.values(complianceAssessment.frameworks_summary).filter(
          Boolean
        ) as FrameworkSummary[])
      : Array.isArray(complianceAssessment?.frameworks)
        ? complianceAssessment!.frameworks.map((framework) => {
            const score =
              framework === 'iso27001'
                ? (complianceAssessment!.iso_score ?? 0)
                : framework === 'cis'
                  ? (complianceAssessment!.cis_score ?? 0)
                  : (complianceAssessment!.nist_score ?? 0);

            const frameworkDisplayMap: Record<string, string> = {
              iso27001: 'ISO 27001:2022',
              cis: 'CIS Controls v8.1',
              nist: 'NIST SP 800-53 Rev5',
            };

            const pass =
              framework === 'iso27001'
                ? (complianceAssessment!.iso_pass ?? 0)
                : framework === 'cis'
                  ? (complianceAssessment!.cis_pass ?? 0)
                  : (complianceAssessment!.nist_pass ?? 0);

            const fail =
              framework === 'iso27001'
                ? (complianceAssessment!.iso_fail ?? 0)
                : framework === 'cis'
                  ? (complianceAssessment!.cis_fail ?? 0)
                  : (complianceAssessment!.nist_fail ?? 0);

            const partial =
              framework === 'iso27001'
                ? (complianceAssessment!.iso_partial ?? 0)
                : framework === 'cis'
                  ? (complianceAssessment!.cis_partial ?? 0)
                  : (complianceAssessment!.nist_partial ?? 0);

            const notApplicable =
              framework === 'iso27001'
                ? (complianceAssessment!.iso_not_applicable ?? 0)
                : framework === 'cis'
                  ? (complianceAssessment!.cis_not_applicable ?? 0)
                  : (complianceAssessment!.nist_not_applicable ?? 0);

            const needsReview =
              framework === 'iso27001'
                ? (complianceAssessment!.iso_needs_review ?? 0)
                : framework === 'cis'
                  ? (complianceAssessment!.cis_needs_review ?? 0)
                  : (complianceAssessment!.nist_needs_review ?? 0);

            const evaluated =
              pass + fail + partial + notApplicable + needsReview;
            const implementedPct = score ?? 0;

            return {
              framework,
              framework_display:
                frameworkDisplayMap[framework] ?? framework.toUpperCase(),
              controls_pass: pass,
              controls_fail: fail,
              controls_partial: partial,
              controls_not_applicable: notApplicable,
              controls_needs_review: needsReview,
              controls_evaluated: evaluated,
              score: score ?? 0,
              implemented_pct: implementedPct,
              partial_pct: evaluated > 0 ? (partial / evaluated) * 100 : 0,
              not_implemented_pct: evaluated > 0 ? (fail / evaluated) * 100 : 0,
            } as FrameworkSummary;
          })
        : [];

  return {
    kpis,
    snapshotLabel,
    riskLevel: String(riskAssessment?.overall_risk_level ?? 'unknown'),
    overallRiskScore: safeNumber(riskAssessment?.overall_risk_score, 0),
    complianceAverage,
    totalAssets,
    totalVulnerabilities,
    severityBreakdown,
    deviceTypeBreakdown,
    openPortExposure,
    vulnTypeBreakdown,
    detectionSourceBreakdown,
    frameworkSummaries,
  };
}
