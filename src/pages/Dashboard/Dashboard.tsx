import { useSelector } from 'react-redux';
import {
  usePipelineStatus,
  useAssetIntelligence,
  useScanActions,
  useDashboardViewModel,
} from '@/hooks';
import {
  DashboardTopItems,
  DashboardExecutiveKpis,
  DashboardOperationalAnalytics,
  DashboardCompliancePosture,
} from '@/components/dashboard';
import { LoadingState, ErrorState, EmptyState } from '@/components/custom';
import { InitiateScanModal } from '@/components/modal';
import { Button } from '@/components/ui';
import { Server, LayoutDashboard } from 'lucide-react';
import type { RootState } from '@/store';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const {
    latestData,
    isLoading: isPipelineLoading,
    isError: isPipelineError,
    refetch: refetchPipeline,
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
  const dashboardModel = useDashboardViewModel(latestData, assets);

  const isInitialLoading = isPipelineLoading || isAssetsLoading;
  const hasError = isPipelineError || isAssetsError;

  if (isInitialLoading) {
    return <LoadingState text="LOADING DASHBOARD..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Data Sync Failure"
        message="Unable to fetch results from threat intelligence pipeline."
      />
    );
  }

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
      <div className={styles.headerSection}>
        <div className="globalPageHeader">
          <h1 className="globalPageTitle">
            <LayoutDashboard className="globalTitleIcon" />
            Dashboard
          </h1>
          <p className="globalPageSubtitle">
            Provides the overview of assets, risks and compliance.
          </p>
        </div>

        <Button onClick={openNewScanModal} className={styles.initiateScanButton}>
          {isScanning ? (
            <>
              <span className={`${styles.scanSpinner} animate-spin`}>⟳</span>
              SYSTEM SCANNING...
            </>
          ) : (
            <>
              <span className={styles.plusIcon}>+</span>
              INITIATE NEW SCAN
            </>
          )}
        </Button>
      </div>

      <div className={styles.sectionStack}>
        <DashboardExecutiveKpis model={dashboardModel} />
        <DashboardOperationalAnalytics model={dashboardModel} assets={assets} />

        <DashboardTopItems
          latestData={latestData}
          isLoading={isPipelineLoading}
          isError={isPipelineError}
          onRetry={refetchPipeline}
        />

        <DashboardCompliancePosture model={dashboardModel} />
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
