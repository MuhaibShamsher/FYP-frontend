import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scanStarted, scanReset } from '@/store/slices/scanSessionSlice';
import { useCreateScanMutation, useCancelScanMutation } from '@/apis';
import { toast } from 'sonner';
import type { RootState } from '@/store';

interface UseScanActionsReturn {
  isNewScanModalOpen: boolean;
  isCreatingScan: boolean;
  isCancellingScan: boolean;
  openNewScanModal: () => void;
  closeNewScanModal: () => void;
  createNewScan: (ip_range: string, scan_type: 'standard' | 'comprehensive') => Promise<void>;
  cancelCurrentScan: () => Promise<void>;
}

// Hook to manage scan-related UI states and mutations.
export default function useScanActions(): UseScanActionsReturn {
  const dispatch = useDispatch();
  const { scanId } = useSelector((s: RootState) => s.scanSession);
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState(false);

  const [createScan, { isLoading: isCreatingScan }] = useCreateScanMutation();
  const [cancelScan, { isLoading: isCancellingScan }] = useCancelScanMutation();

  const openNewScanModal = useCallback(() => setIsNewScanModalOpen(true), []);
  const closeNewScanModal = useCallback(() => setIsNewScanModalOpen(false), []);

  const createNewScan = useCallback(
    async (ip_range: string, scan_type: 'standard' | 'comprehensive') => {
      try {
        const result = await createScan({ ip_range, scan_type }).unwrap();
        if (result?.scan_id) {
          dispatch(scanStarted(result.scan_id));
          toast.success('Scan initiated successfully!');
          closeNewScanModal();
        }
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to initiate scan');
      }
    },
    [createScan, dispatch, closeNewScanModal]
  );

  const cancelCurrentScan = useCallback(async () => {
    if (!scanId) return;
    try {
      await cancelScan(scanId).unwrap();
      dispatch(scanReset());
      toast.success('Scan cancelled successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to cancel scan');
    }
  }, [scanId, cancelScan, dispatch]);

  return {
    isNewScanModalOpen,
    isCreatingScan,
    isCancellingScan,
    openNewScanModal,
    closeNewScanModal,
    createNewScan,
    cancelCurrentScan,
  };
}
