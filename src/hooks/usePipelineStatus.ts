import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setActiveScanId,
  setActiveRiskAssessmentId,
  setActiveComplianceId,
} from '@/store/slices/activeIdsSlice';
import { useGetLatestPipelineQuery } from '@/apis';
import type { LatestPipelineResponse } from '@/apis/sharedApi';
import { DASHBOARD_POLLING_INTERVAL } from '@/constants';

interface UsePipelineStatusReturn {
  latestData: LatestPipelineResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
}

// Hook to manage the latest security pipeline status and persist IDs to Redux.
export default function usePipelineStatus(): UsePipelineStatusReturn {
  const dispatch = useDispatch();

  const {
    data: latestData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetLatestPipelineQuery(undefined, {
    // Poll to keep the dashboard live
    pollingInterval: DASHBOARD_POLLING_INTERVAL,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Sync latest IDs to Redux Persist for cross-module usage
  useEffect(() => {
    if (latestData) {
      const scanId = latestData.asset_scan?.scan?.id;
      const riskId = latestData.risk_assessment?.assessment?.id;
      const complianceId = latestData.compliance?.compliance_assessment?.id;

      if (scanId) dispatch(setActiveScanId(scanId));
      if (riskId) dispatch(setActiveRiskAssessmentId(riskId));
      if (complianceId) dispatch(setActiveComplianceId(complianceId));
    }
  }, [latestData, dispatch]);

  return {
    latestData,
    isLoading,
    isError,
    error,
    refetch,
  };
}
