import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import {
  usePipelineStatus,
  useAssetIntelligence,
  useScanActions,
} from '@/hooks';
import {
  AssetSeverityDoughnutChart,
  AssetSeverityLineChart,
  AssetDeviceTypePieChart,
  AssetOpenPortsBarChart,
} from '@/components/charts';
import {
  LoadingState,
  ErrorState,
  EmptyState,
  DashboardSummary,
} from '@/components/custom';
import { InitiateScanModal } from '@/components/modal';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import { Server } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const {
    latestData,
    isLoading: isPipelineLoading,
    isError: isPipelineError,
  } = usePipelineStatus();

  const {
    assets,
    isLoading: isAssetsLoading,
    isError: isAssetsError,
  } = useAssetIntelligence();

  const {
    isNewScanModalOpen,
    isCreatingScan,
    isCancellingScan,
    openNewScanModal,
    closeNewScanModal,
    createNewScan,
    cancelCurrentScan,
  } = useScanActions();

  const { isScanning } = useSelector((s: RootState) => s.scanSession);

  // Unified loading and error handling
  const isInitialLoading = isPipelineLoading || isAssetsLoading;
  const hasError = isPipelineError || isAssetsError;

  if (isInitialLoading) {
    return <LoadingState text="SYNCHRONIZING INTELLIGENCE BRIEFING..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Intelligence Sync Failure"
        message="Unable to establish a secure connection to the threat intelligence pipeline."
      />
    );
  }

  // Use latestData to determine if system is empty
  if (!latestData && assets.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="NO ASSETS AVAILABLE"
        message="Start your first scan to discover network assets."
        actionLabel="Initiate New Scan"
        onAction={openNewScanModal}
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
          onClick={openNewScanModal}
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
      <DashboardSummary latestData={latestData} isLoading={isPipelineLoading} />

      <div className={styles.chartsGrid}>
        {/* Asset Severity Line Chart */}
        <Card className={`${styles.chartCard} ${styles.mainChartCard}`}>
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
        <Card className={`${styles.chartCard} ${styles.secondaryChartCard}`}>
          <div className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <div className={`${styles.indicatorDot} ${styles.dotBlue}`}></div>
              SEVERITY DISTRIBUTION
            </CardTitle>
          </div>
          <CardContent className={styles.centeredCardContent}>
            <AssetSeverityDoughnutChart assets={assets} />
          </CardContent>
        </Card>

        {/* Open Ports Bar Chart */}
        <Card className={`${styles.chartCard} ${styles.mainChartCard}`}>
          <div className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <div
                className={`${styles.indicatorDot} ${styles.dotPurple}`}
              ></div>
              OPEN PORTS ANALYSIS
            </CardTitle>
          </div>
          <CardContent className={styles.cardContent}>
            <AssetOpenPortsBarChart assets={assets} />
          </CardContent>
        </Card>

        {/* Assets by Type Pie Chart */}
        <Card className={`${styles.chartCard} ${styles.secondaryChartCard}`}>
          <div className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <div
                className={`${styles.indicatorDot} ${styles.dotEmerald}`}
              ></div>
              DEVICE CLASSIFICATION
            </CardTitle>
          </div>
          <CardContent className={styles.centeredCardContent}>
            <AssetDeviceTypePieChart assets={assets} />
          </CardContent>
        </Card>
      </div>

      <InitiateScanModal
        isOpen={isNewScanModalOpen}
        onClose={closeNewScanModal}
        onStart={createNewScan}
        onCancel={cancelCurrentScan}
        isCreating={isCreatingScan}
        isCancelling={isCancellingScan}
      />
    </div>
  );
}
