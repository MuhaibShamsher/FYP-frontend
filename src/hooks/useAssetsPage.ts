import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import {
  useGetScanAssetsQuery,
  useGetLastScanAssetsQuery,
} from '@/apis';
import { usePipelineStatus } from '@/hooks';
import { CalculateAssetStatistics } from '@/utils/asset';
import {
  Shield,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import type { Asset, AssetStatistics } from '@/types';

interface UseAssetsPageReturn {
  assets: Asset[];
  assetStatistics: AssetStatistics | null;
  scanId: string | null;
  isLoading: boolean;
  isError: boolean;
  isLastScanLoading: boolean;
  isScanLoading: boolean;
  lastScanError: any;
  scanError: any;
  navigateToScan: (scanId: string) => void;
  refreshAssets: () => void;
  ASSETS_STATISTICS: Array<{
    title: string;
    value: number;
    icon: any;
    iconColorClass: string;
  }>;
}

export default function useAssetsPage(): UseAssetsPageReturn {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetStatistics, setAssetStatistics] =
    useState<AssetStatistics | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. Determine the effective scan ID
  const paramScanId = searchParams.get('scanID');
  const { latestData, isLoading: isPipelineLoading } = usePipelineStatus();
  const { scanId: persistedScanId } = useSelector((s: RootState) => s.activeIds);

  const effectiveScanId = paramScanId || latestData?.asset_scan?.scan?.id || persistedScanId;

  // API queries
  const {
    data: lastScanAssetsResult,
    isLoading: lastScanLoading,
    error: lastScanError,
    refetch: refetchLastScan,
  } = useGetLastScanAssetsQuery(undefined, {
    skip: Boolean(effectiveScanId),
  });

  const {
    data: scanAssetsResult,
    isLoading: scanLoading,
    error: scanError,
    refetch: refetchScan,
  } = useGetScanAssetsQuery(effectiveScanId || '', {
    skip: !effectiveScanId,
  });

  // Update assets data when API results change
  useEffect(() => {
    if (effectiveScanId && scanAssetsResult) {
      setAssets(scanAssetsResult.assets || []);
    } else if (!effectiveScanId && lastScanAssetsResult) {
      setAssets(lastScanAssetsResult.assets || []);
    }
  }, [effectiveScanId, scanAssetsResult, lastScanAssetsResult]);

  // Calculate statistics when assets change
  useEffect(() => {
    if (assets.length > 0) {
      const stats = CalculateAssetStatistics(assets);
      setAssetStatistics(stats);
    } else {
      setAssetStatistics(null);
    }
  }, [assets]);

  // Computed statistics array for UI
  const ASSETS_STATISTICS = [
    {
      title: 'TOTAL ASSETS',
      value: assetStatistics?.total || 0,
      icon: Server,
      iconColorClass: 'text-slate-500',
    },
    {
      title: 'CRITICAL',
      value: assetStatistics?.critical || 0,
      icon: AlertTriangle,
      iconColorClass: 'text-red-500',
    },
    {
      title: 'HIGH RISK',
      value: assetStatistics?.high || 0,
      icon: Shield,
      iconColorClass: 'text-orange-500',
    },
    {
      title: 'MEDIUM',
      value: assetStatistics?.medium || 0,
      icon: Activity,
      iconColorClass: 'text-yellow-500',
    },
    {
      title: 'LOW RISK',
      value: assetStatistics?.low || 0,
      icon: CheckCircle,
      iconColorClass: 'text-green-500',
    },
  ];

  // Navigation action
  const navigateToScan = useCallback(
    (newScanId: string) => {
      navigate(`/assets?scanID=${newScanId}`);
    },
    [navigate]
  );

  // Refresh action
  const refreshAssets = useCallback(() => {
    if (effectiveScanId) {
      refetchScan();
    } else {
      refetchLastScan();
    }
  }, [effectiveScanId, refetchScan, refetchLastScan]);

  // Loading state
  const isLoading = effectiveScanId ? (scanLoading || isPipelineLoading) : lastScanLoading;
  const isLastScanLoading = lastScanLoading;
  const isScanLoading = scanLoading;

  // Error state
  const isError = Boolean(lastScanError || scanError);

  return {
    assets,
    assetStatistics,
    scanId: effectiveScanId,
    isLoading,
    isError,
    isLastScanLoading,
    isScanLoading,
    lastScanError,
    scanError,
    navigateToScan,
    refreshAssets,
    ASSETS_STATISTICS,
  };
}
