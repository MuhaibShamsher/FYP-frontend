import type { Asset } from '@/types';
import type { DashboardViewModel } from '@/lib/dashboardViewModel';

export interface OperationalAnalyticsViewModel {
  maxVulnType: number;
  maxSource: number;
  hasAssets: boolean;
  hasThreatData: boolean;
}

export function buildOperationalAnalyticsViewModel(
  model: DashboardViewModel,
  assets: Asset[]
): OperationalAnalyticsViewModel {
  const maxVulnType = model.vulnTypeBreakdown.reduce(
    (max, item) => Math.max(max, item.count), 0
  );

  const maxSource = model.detectionSourceBreakdown.reduce(
    (max, item) => Math.max(max, item.count), 0
  );

  return {
    maxVulnType,
    maxSource,
    hasAssets: assets.length > 0,
    hasThreatData:
      model.vulnTypeBreakdown.length > 0 ||
      model.detectionSourceBreakdown.length > 0,
  };
}
