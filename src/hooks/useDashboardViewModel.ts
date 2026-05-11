import { useMemo } from 'react';
import { buildDashboardViewModel } from '@/lib/dashboardViewModel';
import type { LatestPipelineResponse } from '@/apis/sharedApi';
import type { Asset } from '@/types';

export default function useDashboardViewModel(
  latestData?: LatestPipelineResponse | null,
  assets: Asset[] = []
) {
  return useMemo(
    () => buildDashboardViewModel(latestData, assets),
    [latestData, assets]
  );
}
