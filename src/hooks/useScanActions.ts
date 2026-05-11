import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scanStarted, scanReset } from '@/store/slices/scanSessionSlice';
import { useStartPipelineMutation, useCancelScanMutation } from '@/apis';
import { toast } from 'sonner';
import type { RootState } from '@/store';

const FRAMEWORK_MAP: Record<string, string> = {
  'ISO 27001 2022': 'iso27001',
  'NIST SP 800-53 Rev 5': 'nist',
  'CIS Controls': 'cis',
};

interface UseScanActionsReturn {
  isNewScanModalOpen: boolean;
  isCreatingScan: boolean;
  isCancellingScan: boolean;
  openNewScanModal: () => void;
  closeNewScanModal: () => void;
  createNewScan: (network_range: string, scan_type: 'standard' | 'comprehensive', frameworks?: string[]) => Promise<void>;
  cancelCurrentScan: () => Promise<void>;
}

export default function useScanActions(): UseScanActionsReturn {
  const dispatch = useDispatch();
  const { scanId } = useSelector((s: RootState) => s.scanSession);
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState(false);

  const [startPipeline, { isLoading: isCreatingScan }] = useStartPipelineMutation();
  const [cancelScan, { isLoading: isCancellingScan }] = useCancelScanMutation();

  const openNewScanModal = useCallback(() => setIsNewScanModalOpen(true), []);
  const closeNewScanModal = useCallback(() => setIsNewScanModalOpen(false), []);

  const createNewScan = useCallback(
    async (network_range: string, scan_type: 'standard' | 'comprehensive', frameworks?: string[]) => {
      try {
        // Transform framework display names to API IDs
        const frameworkIds = frameworks
          ? frameworks.map(fw => FRAMEWORK_MAP[fw]).filter(Boolean)
          : undefined;

        const result = await startPipeline({ 
          network_range,
          scan_type,
          frameworks: frameworkIds && frameworkIds.length > 0 ? frameworkIds : undefined,
        }).unwrap();
        if (result?.scan_id) {
          dispatch(scanStarted(result.scan_id));
          toast.success('Scan initiated successfully!');
          closeNewScanModal();
        }
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to initiate scan');
      }
    },
    [startPipeline, dispatch, closeNewScanModal]
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
