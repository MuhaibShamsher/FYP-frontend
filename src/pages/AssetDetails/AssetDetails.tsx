import { useState } from 'react';
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
import useAssetDetailsPage from '@/hooks/useAssetDetailsPage';
import styles from './AssetDetails.module.css';

export default function AssetDetailsPage() {
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [selectedPortToEdit, setSelectedPortToEdit] = useState<Port | null>(
    null
  );

  const { asset, riskProfile, assetId, isLoading, isError, goBack } =
    useAssetDetailsPage();

  if (isLoading) {
    return <LoadingState text="LOADING ASSET DETAILS..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="ERROR LOADING ASSET DATA"
        message="Unable to retrieve asset data."
      />
    );
  }

  if (!asset) {
    return (
      <EmptyState
        icon={Server}
        title="ASSET NOT FOUND"
        message="The requested asset could not be located."
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
        <Button onClick={goBack} className={styles.backButton}>
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
          assetId={assetId || ''}
          onClose={() => setIsPortModalOpen(false)}
          onSave={async (portId, data) => {
            // Port editing functionality would need to be implemented
            setIsPortModalOpen(false);
          }}
          isLoading={false}
          error={null}
        />
      )}
    </div>
  );
}
