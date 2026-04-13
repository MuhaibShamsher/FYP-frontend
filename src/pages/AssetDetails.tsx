import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetAssetByIdQuery,
  useUpdatePortMutation,
} from '@/store/apis/assetsApi';
import {
  useGetRiskDashboardQuery,
  useGetAssetRiskProfileQuery,
} from '@/store/apis/riskApi';
import {
  SystemIdentity,
  RiskProfile,
  PortAnalytics,
  VulnerabilityDetails,
} from '@/components/asset';
import { PortEditModal } from '@/components/models';
import { LoadingState, ErrorState, EmptyState } from '@/components/custom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Server } from 'lucide-react';
import type { Port } from '@/types';
import styles from './styles/AssetDetails.module.css';


export default function AssetDetailsPage() {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();

  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [selectedPortToEdit, setSelectedPortToEdit] = useState<Port | null>(
    null
  );

  // 1. Fetch dashboard to get latest assessment ID
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useGetRiskDashboardQuery();
  const assessmentId = dashboardData?.statistics?.assessment_id;

  // 2. Fetch asset data
  const {
    data: asset,
    isLoading: assetLoading,
    error: assetError,
  } = useGetAssetByIdQuery(assetId as string);

  // 3. Fetch asset risk profile
  const {
    data: riskProfile,
    isLoading: riskProfileLoading,
    error: riskProfileError,
  } = useGetAssetRiskProfileQuery(
    { assessmentId: assessmentId || '', assetId: assetId || '' },
    { skip: !assessmentId || !assetId }
  );

  const [updatePort, { isLoading: isUpdatingPort, error: updatePortError }] =
    useUpdatePortMutation();

  const isAnyLoading = dashboardLoading || assetLoading || riskProfileLoading;
  const hasAnyError = dashboardError || assetError || riskProfileError;

  const isRiskProfileComplete =
    riskProfile &&
    (!riskProfile.vulnerabilities ||
      Array.isArray(riskProfile.vulnerabilities));

  if (isAnyLoading || (riskProfile && !isRiskProfileComplete)) {
    return <LoadingState text="LOADING ASSET DETAILS..." />;
  }

  if (hasAnyError) {
    return (
      <ErrorState
        title="ERROR LOADING ASSET DATA"
        message="Unable to retrieve asset, or risk profile data."
      />
    );
  }

  if (!asset) {
    return (
      <EmptyState
        icon={Server}
        title="ASSET NOT FOUND"
        message="The requested asset intel could not be located in the database."
      />
    );
  }

  const getSeverityBadgeClass = (severity: string) => {
    const baseClass = styles.severityBadge;
    switch (severity) {
      case 'critical':
        return `${baseClass} ${styles.sevCritical}`;
      case 'high':
        return `${baseClass} ${styles.sevHigh}`;
      case 'medium':
        return `${baseClass} ${styles.sevMedium}`;
      default:
        return `${baseClass} ${styles.sevLow}`;
    }
  };

  const getSeverityDotClass = (severity: string) => {
    const baseClass = styles.sevDot;
    switch (severity) {
      case 'critical':
        return `${baseClass} ${styles.dotCritical}`;
      case 'high':
        return `${baseClass} ${styles.dotHigh}`;
      case 'medium':
        return `${baseClass} ${styles.dotMedium}`;
      default:
        return `${baseClass} ${styles.dotLow}`;
    }
  };

  const formatScore = (score?: number | null) => score?.toFixed(2) || '0.00';

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.assetHostname}>
            {asset.hostname || asset.ip_address}
          </h1>
          <div className={styles.headerLabel}>Asset Detail</div>
        </div>
        <Button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
          BACK
        </Button>
      </div>

      <div className={styles.horizontalLayout}>
        {/* System Identity Card */}
        <SystemIdentity
          asset={asset}
          getSeverityBadgeClass={getSeverityBadgeClass}
          getSeverityDotClass={getSeverityDotClass}
        />

        {/* Risk Profile Card */}
        {riskProfile && (
          <RiskProfile riskProfile={riskProfile} formatScore={formatScore} />
        )}

        {/* Port Analytics Card */}
        <PortAnalytics
          ports={asset.ports}
          onPortEdit={(port) => {
            setSelectedPortToEdit(port);
            setIsPortModalOpen(true);
          }}
        />

        {/* Vulnerability Details Card */}
        {riskProfile && (
          <VulnerabilityDetails
            riskProfile={riskProfile}
            formatScore={formatScore}
            getSeverityBadgeClass={getSeverityBadgeClass}
            getSeverityDotClass={getSeverityDotClass}
          />
        )}
      </div>

      {isPortModalOpen && selectedPortToEdit && (
        <PortEditModal
          selectedPort={selectedPortToEdit}
          assetId={assetId as string}
          onClose={() => setIsPortModalOpen(false)}
          onSave={async (portId, data) => {
            await updatePort({ portId, data });
            setIsPortModalOpen(false);
          }}
          isLoading={isUpdatingPort}
          error={updatePortError}
        />
      )}
    </div>
  );
}
