import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAssetByIdQuery } from '@/store/apis/assetsApi';
import {
  useGetRiskDashboardQuery,
  useGetAssetRiskProfileQuery,
} from '@/store/apis/riskApi';
import type { Asset, AssetRiskProfileDetail } from '@/types';

interface UseAssetDetailsPageReturn {
  asset: Asset | null;
  riskProfile: AssetRiskProfileDetail | null;
  assetId: string | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
  goBack: () => void;
  refreshAssetDetails: () => void;
  hasVulnerabilities: boolean;
  hasComplianceIssues: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export default function useAssetDetailsPage(): UseAssetDetailsPageReturn {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();

  // 1. Fetch dashboard to get latest assessment ID
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useGetRiskDashboardQuery();
  const assessmentId = dashboardData?.statistics?.assessment_id;

  // 2. Fetch asset data
  const {
    data: asset,
    isLoading: assetLoading,
    error: assetError,
  } = useGetAssetByIdQuery(assetId || '', {
    skip: !assetId,
  });

  // 3. Fetch asset risk profile
  const {
    data: riskProfile,
    isLoading: riskProfileLoading,
    error: riskProfileError,
    refetch: refetchAssetDetails,
  } = useGetAssetRiskProfileQuery(
    { assessmentId: assessmentId || '', assetId: assetId || '' },
    { skip: !assessmentId || !assetId }
  );

  // Loading states
  const isLoading = dashboardLoading || assetLoading || riskProfileLoading;
  const isError = Boolean(dashboardError || assetError || riskProfileError);
  const error = dashboardError || assetError || riskProfileError;

  // Computed states
  const hasVulnerabilities = Boolean(riskProfile?.vulnerabilities?.length);
  const hasComplianceIssues = Boolean(riskProfile?.complianceIssues?.length);

  const riskLevel = (() => {
    if (!riskProfile) return 'low';

    const criticalVulns =
      riskProfile.vulnerabilities?.filter((v) => v.severity === 'critical')
        .length || 0;
    const highVulns =
      riskProfile.vulnerabilities?.filter((v) => v.severity === 'high')
        .length || 0;
    const failedCompliance =
      riskProfile.complianceIssues?.filter(
        (c: { status?: string }) => c.status === 'fail'
      ).length || 0;

    if (criticalVulns > 0 || failedCompliance > 5) return 'critical';
    if (highVulns > 3 || failedCompliance > 2) return 'high';
    if (highVulns > 0 || failedCompliance > 0) return 'medium';
    return 'low';
  })();

  // Actions
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const refreshAssetDetails = useCallback(() => {
    refetchAssetDetails();
  }, [refetchAssetDetails]);

  return {
    asset: asset || null,
    riskProfile: riskProfile || null,
    assetId: assetId || null,
    isLoading,
    isError,
    error,
    goBack,
    refreshAssetDetails,
    hasVulnerabilities,
    hasComplianceIssues,
    riskLevel,
  };
}
