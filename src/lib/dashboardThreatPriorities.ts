import type { LatestPipelineResponse } from '@/apis/sharedApi';

export interface DashboardThreatPrioritiesData {
  topVulnerabilities: NonNullable<
    LatestPipelineResponse['risk_assessment']
  >['statistics']['top_vulnerabilities'];
  topAssets: NonNullable<
    LatestPipelineResponse['risk_assessment']
  >['statistics']['top_assets'];
  totalVulnerabilities: number;
  totalAssets: number;
}

export function buildDashboardThreatPrioritiesData(
  latestData?: LatestPipelineResponse | null
): DashboardThreatPrioritiesData {
  const topVulnerabilities =
    latestData?.risk_assessment?.statistics?.top_vulnerabilities ?? [];
  const topAssets = latestData?.risk_assessment?.statistics?.top_assets ?? [];
  const totalVulnerabilities =
    latestData?.risk_assessment?.assessment?.total_vulnerabilities ?? 0;
  const totalAssets =
    latestData?.risk_assessment?.statistics?.total_assets ?? 0;

  return {
    topVulnerabilities,
    topAssets,
    totalVulnerabilities,
    totalAssets,
  };
}
