import { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { scanStarted, scanReset } from '@/store/slices/scanSessionSlice';
import {
  useCreateScanMutation,
  useCancelScanMutation,
  useGetLastScanAssetsQuery,
} from '@/store/apis/scanApi';
import type { Asset } from '@/types';
import { toast } from 'sonner';

interface UseDashboardPageReturn {
  assets: Asset[];
  scanId: string | null;
  isScanning: boolean;
  isNewScanModalOpen: boolean;
  isLoading: boolean;
  isCreatingScan: boolean;
  isCancellingScan: boolean;
  error: any;
  openNewScanModal: () => void;
  closeNewScanModal: () => void;
  createNewScan: (
    ip_range: string,
    scan_type: 'standard' | 'comprehensive'
  ) => void;
  cancelCurrentScan: () => void;
  refreshAssets: () => void;
}

export default function useDashboardPage(): UseDashboardPageReturn {
  const dispatch = useDispatch();
  const { scanId, isScanning } = useSelector((s: RootState) => s.scanSession);
  const isScanningRef = useRef(isScanning);

  // Update ref when isScanning changes
  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  // Modal state
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState(false);

  // API queries and mutations
  const {
    data: lastScanAssetsResult,
    isLoading: lastScanLoading,
    error: lastScanError,
    refetch: refetchLastScan,
  } = useGetLastScanAssetsQuery();

  const [createScan, { isLoading: isCreatingScan }] = useCreateScanMutation();
  const [cancelScan, { isLoading: isCancellingScan }] = useCancelScanMutation();

  // Extract assets from API result
  const assets = lastScanAssetsResult?.assets ?? [];

  // Loading and error states
  const isLoading = lastScanLoading;
  const error = lastScanError;

  // Modal actions
  const openNewScanModal = useCallback(() => {
    setIsNewScanModalOpen(true);
  }, []);

  const closeNewScanModal = useCallback(() => {
    setIsNewScanModalOpen(false);
  }, []);

  // Create new scan
  const createNewScan = useCallback(
    async (ip_range: string, scan_type: 'standard' | 'comprehensive') => {
      try {
        const result = await createScan({
          ip_range,
          scan_type,
        }).unwrap();

        if (result && result.scan_id) {
          dispatch(scanStarted(result.scan_id));
          toast.success('Scan initiated successfully!');
          closeNewScanModal();
        }
      } catch (error: any) {
        console.error('Failed to create scan:', error);
        toast.error(error?.data?.message || 'Failed to initiate scan');
      }
    },
    [createScan, dispatch, closeNewScanModal]
  );

  // Cancel current scan
  const cancelCurrentScan = useCallback(async () => {
    if (!scanId) return;

    try {
      await cancelScan(scanId).unwrap();
      dispatch(scanReset());
      toast.success('Scan cancelled successfully!');
    } catch (error: any) {
      console.error('Failed to cancel scan:', error);
      toast.error(error?.data?.message || 'Failed to cancel scan');
    }
  }, [scanId, cancelScan, dispatch]);

  // Refresh assets
  const refreshAssets = useCallback(() => {
    refetchLastScan();
  }, [refetchLastScan]);

  // Handle scan completion
  useEffect(() => {
    if (isScanningRef.current && !isScanning && scanId) {
      toast.success('Scan completed successfully!');
      refreshAssets();
    }
  }, [isScanning, scanId, refreshAssets]);

  return {
    assets,
    scanId,
    isScanning,
    isNewScanModalOpen,
    isLoading,
    isCreatingScan,
    isCancellingScan,
    error,
    openNewScanModal,
    closeNewScanModal,
    createNewScan,
    cancelCurrentScan,
    refreshAssets,
  };
}
