import { useGetLastScanAssetsQuery } from '@/apis';
import type { Asset } from '@/types';

interface UseAssetIntelligenceReturn {
  assets: Asset[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

// Hook to manage asset data and intelligence for the dashboard.
export default function useAssetIntelligence(): UseAssetIntelligenceReturn {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetLastScanAssetsQuery();

  return {
    assets: data?.assets ?? [],
    isLoading,
    isError,
    refetch,
  };
}
