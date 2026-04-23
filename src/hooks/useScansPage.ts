import { useState, useEffect, useCallback } from 'react';
import { useGetScansQuery } from '@/store/apis/scanApi';
import { Target, CheckCircle, Hourglass, AlertTriangle } from 'lucide-react';
import type { Scan, ScanStatistics } from '@/types';

interface UseScansPageReturn {
  // Data
  scans: Scan[];
  selectedScan: Scan | null;
  statistics: ScanStatistics | null;

  // Loading states
  isLoading: boolean;
  isError: boolean;

  // Error state
  error: any;

  // Actions
  selectScan: (scan: Scan | null) => void;
  closeScanDetails: () => void;
  refreshScans: () => void;

  // Computed data
  SCAN_STATISTICS: Array<{
    title: string;
    value: number;
    icon: any;
    iconColorClass: string;
  }>;
}

export default function useScansPage(): UseScansPageReturn {
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);

  // API query
  const {
    data: scanData,
    isLoading: scanLoading,
    isError: scanError,
    error: scanErrorData,
    refetch: refetchScans,
  } = useGetScansQuery();

  // Update scans data when API result changes
  useEffect(() => {
    if (scanData?.scans) {
      setScans(scanData.scans);
    }
  }, [scanData]);

  // Statistics data
  const statistics = scanData?.statistics || null;

  // Computed statistics array for UI
  const SCAN_STATISTICS = [
    {
      title: 'TOTAL SCANS',
      value: statistics?.total || 0,
      icon: Target,
      iconColorClass: 'text-slate-500',
    },
    {
      title: 'COMPLETED',
      value: statistics?.completed || 0,
      icon: CheckCircle,
      iconColorClass: 'text-green-500',
    },
    {
      title: 'RUNNING',
      value: statistics?.running || 0,
      icon: Hourglass,
      iconColorClass: 'text-blue-500',
    },
    {
      title: 'FAILED',
      value: statistics?.failed || 0,
      icon: AlertTriangle,
      iconColorClass: 'text-red-500',
    },
  ];

  // Actions
  const selectScan = useCallback((scan: Scan | null) => {
    setSelectedScan(scan);
  }, []);

  const closeScanDetails = useCallback(() => {
    setSelectedScan(null);
  }, []);

  const refreshScans = useCallback(() => {
    refetchScans();
  }, [refetchScans]);

  return {
    // Data
    scans,
    selectedScan,
    statistics,

    // Loading states
    isLoading: scanLoading,
    isError: scanError,

    // Error state
    error: scanErrorData,

    // Actions
    selectScan,
    closeScanDetails,
    refreshScans,

    // Computed data
    SCAN_STATISTICS,
  };
}
