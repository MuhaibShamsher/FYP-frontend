import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  useGetScanAssetsQuery,
  useGetLastScanAssetsQuery,
} from '@/store/apis/scanApi';
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
  const [scanId, setScanId] = useState<string | null>(null);
  const [assetStatistics, setAssetStatistics] =
    useState<AssetStatistics | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract scanId from URL params
  useEffect(() => {
    const paramScanId = searchParams.get('scanID');
    setScanId(paramScanId);
  }, [searchParams]);

  // API queries
  const {
    data: lastScanAssetsResult,
    isLoading: lastScanLoading,
    error: lastScanError,
    refetch: refetchLastScan,
  } = useGetLastScanAssetsQuery(undefined, {
    skip: Boolean(scanId),
  });

  const {
    data: scanAssetsResult,
    isLoading: scanLoading,
    error: scanError,
    refetch: refetchScan,
  } = useGetScanAssetsQuery(scanId || '', {
    skip: !scanId,
  });

  // Update assets data when API results change
  useEffect(() => {
    if (scanId && scanAssetsResult) {
      setAssets(scanAssetsResult.assets || []);
    } else if (!scanId && lastScanAssetsResult) {
      setAssets(lastScanAssetsResult.assets || []);
    }
  }, [scanId, scanAssetsResult, lastScanAssetsResult]);

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
    if (scanId) {
      refetchScan();
    } else {
      refetchLastScan();
    }
  }, [scanId, refetchScan, refetchLastScan]);

  // Loading state
  const isLoading = scanId ? scanLoading : lastScanLoading;
  const isLastScanLoading = lastScanLoading;
  const isScanLoading = scanLoading;

  // Error state
  const isError = Boolean(lastScanError || scanError);

  return {
    assets,
    assetStatistics,
    scanId,
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
