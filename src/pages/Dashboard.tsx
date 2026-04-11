import { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import {
  scanStarted,
  scanReset,
} from '@/store/slices/scanSessionSlice';
import {
  useCreateScanMutation,
  useCancelScanMutation,
  useGetLastScanAssetsQuery,
} from '@/store/apis/scanApi';
import {
  DoughnutChart,
  AssetSeverityLineChart,
  DeviceTypePieChart,
  PortsBarChart,
} from '@/components/charts';
import { InitiateScanModal } from '@/components/models';
import { LoadingState, ErrorState, EmptyState, DashboardSummary } from '@/components/custom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Server } from 'lucide-react';
import styles from './styles/Dashboard.module.css';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { scanId, isScanning } = useSelector((s: RootState) => s.scanSession);
  const isScanningRef = useRef(isScanning);
  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  const {
    data: lastScanAssetsResult,
    isLoading: lastScanLoading,
    error: lastScanError,
  } = useGetLastScanAssetsQuery();

  const assets = lastScanAssetsResult?.assets ?? [];

  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState(false);

  const [createScan, { isLoading: isCreatingScan }] = useCreateScanMutation();
  const [cancelScan, { isLoading: isCancellingScan }] = useCancelScanMutation();

  useEffect(() => {
    if (isScanning && scanId) {
      // The scanSocketMiddleware handles the WS connection globally.
      // We just need to ensure the dashboard reflects the state from the store.
    }
  }, [isScanning, scanId]);

  const handleStartScan = useCallback(
    async (ip_range: string, scan_type: 'standard' | 'comprehensive') => {
      if (isScanning) {
        toast.warning('A scan is already running — please wait or cancel it first.');
        return;
      }
      if (!ip_range.trim()) {
        toast.error('Please enter a valid IP range.');
        return;
      }

      try {
        const response = await createScan({ ip_range, scan_type }).unwrap();
        // scanStarted will be picked up by the middleware to open the socket
        dispatch(scanStarted(String(response.scan_id)));
        toast.success(`Scan started for ${ip_range}`);
      } catch (err: any) {
        toast.error(err?.data?.error ?? 'Failed to start scan');
      }
    },
    [createScan, isScanning, dispatch]
  );

  const handleCancelScan = useCallback(
    async (id?: string) => {
      const targetId = id ?? scanId;
      if (!targetId) {
        toast.warning('No scan to cancel.');
        return;
      }
      try {
        await cancelScan(targetId).unwrap();
        toast.success('Scan cancelled');
        dispatch(scanReset());
      } catch (err) {
        toast.error('Failed to cancel scan');
      }
    },
    [cancelScan, scanId, dispatch]
  );

  if (lastScanLoading) {
    return <LoadingState text="LOADING ASSETS..." />;
  }

  if (lastScanError) {
    return (
      <ErrorState
        title="Error Loading Assets"
        message="Unable to fetch asset data. Please try again later."
      />
    );
  }

  if (!lastScanAssetsResult?.assets) {
    return (
      <EmptyState
        icon={Server}
        title="NO ASSETS AVAILABLE"
        message="Start your first scan to discover network assets."
        actionLabel="Initiate New Scan"
        onAction={() => setIsNewScanModalOpen(true)}
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <div className={styles.systemOverviewLabel}>
            <div className={styles.statusDotActive} />
            System Overview
          </div>
          <h1 className={styles.pageTitle}>DASHBOARD</h1>
        </div>

        <Button
          onClick={() => setIsNewScanModalOpen(true)}
          className={styles.initiateScanButton}
        >
          {isScanning ? (
            <>
              <span className="animate-spin mr-2">⟳</span> SYSTEM SCANNING...
            </>
          ) : (
            <>
              <span className="mr-2 text-xl font-light">+</span>
              INITIATE NEW SCAN
            </>
          )}
        </Button>
      </div>

      {/* Synchronized Mission & Compliance Briefing */}
      <DashboardSummary />

      <div className={styles.chartsGrid}>
        {/* Asset Severity Line Chart */}
        <Card className={styles.mainChartCard}>
          <div className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <div
                className={`${styles.indicatorDot} ${styles.dotPrimary}`}
              ></div>
              ASSET SEVERITY TIMELINE
            </CardTitle>
          </div>
          <CardContent className={styles.cardContent}>
            <AssetSeverityLineChart assets={assets} />
          </CardContent>
        </Card>

        {/* Severity Distribution Doughnut Chart */}
        <Card className={styles.secondaryChartCard}>
          <div className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <div className={`${styles.indicatorDot} ${styles.dotBlue}`}></div>
              SEVERITY DISTRIBUTION
            </CardTitle>
          </div>
          <CardContent className={styles.centeredCardContent}>
            <DoughnutChart assets={assets} />
          </CardContent>
        </Card>

        {/* Open Ports Bar Chart */}
        <Card className={styles.mainChartCard}>
          <div className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <div
                className={`${styles.indicatorDot} ${styles.dotPurple}`}
              ></div>
              OPEN PORTS ANALYSIS
            </CardTitle>
          </div>
          <CardContent className={styles.cardContent}>
            <PortsBarChart assets={assets} />
          </CardContent>
        </Card>

        {/* Assets by Type Pie Chart */}
        <Card className={styles.secondaryChartCard}>
          <div className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <div
                className={`${styles.indicatorDot} ${styles.dotEmerald}`}
              ></div>
              DEVICE CLASSIFICATION
            </CardTitle>
          </div>
          <CardContent className={styles.centeredCardContent}>
            <DeviceTypePieChart assets={assets} />
          </CardContent>
        </Card>
      </div>

      <InitiateScanModal
        isOpen={isNewScanModalOpen}
        onClose={() => setIsNewScanModalOpen(false)}
        onStart={handleStartScan}
        onCancel={handleCancelScan}
        isCreating={isCreatingScan}
        isCancelling={isCancellingScan}
      />
    </div>
  );
}
