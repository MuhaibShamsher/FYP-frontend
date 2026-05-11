import { useOrganization } from '@/hooks';
import { Button, Card, CardContent, CardHeader } from '@/components/ui';
import { EmptyState, ErrorState, LoadingState } from '@/components/custom';
import { Building2, RefreshCw } from 'lucide-react';
import { OrganizationHeader } from '../OrganizationHeader/OrganizationHeader';
import { OrganizationFields } from '../OrganizationFields/OrganizationFields';
import { OrganizationReadOnlyDetails } from '../OrganizationReadOnlyDetails/OrganizationReadOnlyDetails';
import { SummaryItem } from '../SummaryItem/SummaryItem';
import { ORGANIZATION_SUMMARY_FIELDS } from '../constants';
import styles from './OrganizationDetails.module.css';

export default function OrganizationDetails() {
  const {
    organization,
    organizationForm,
    canEditOrganization,
    isEditing,
    isLoadingOrganization,
    isSavingOrganization,
    isError,
    errorMessage,
    startEditing,
    cancelEditing,
    setField,
    saveOrganization,
    refetchOrganization,
  } = useOrganization();

  if (isLoadingOrganization) {
    return <LoadingState text="LOADING ORGANIZATION DETAILS..." />;
  }

  if (isError) {
    return (
      <div className={styles.stateWrapper}>
        <ErrorState
          title="ORGANIZATION LOAD FAILED"
          message={errorMessage || 'Please try again later.'}
          className={styles.inlineState}
        />
        <Button
          type="button"
          variant="outline"
          onClick={refetchOrganization}
          className={styles.retryButton}
        >
          <RefreshCw />
          Retry
        </Button>
      </div>
    );
  }

  if (!organization) {
    return (
      <EmptyState
        icon={Building2}
        title="NO ORGANIZATION DATA"
        message="Organization information is not available yet."
        actionLabel="Retry"
        onAction={refetchOrganization}
        className={styles.inlineState}
      />
    );
  }

  return (
    <Card className={styles.organizationCard}>
      <CardHeader className={styles.cardHeader}>
        <OrganizationHeader
          canEditOrganization={canEditOrganization}
          isEditing={isEditing}
          isSavingOrganization={isSavingOrganization}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSave={saveOrganization}
        />
      </CardHeader>

      <CardContent className={styles.cardContent}>
        <div className={styles.summaryRow}>
          {ORGANIZATION_SUMMARY_FIELDS.map((item) => (
            <SummaryItem
              key={item.key}
              label={item.label}
              value={item.value(organization)}
              icon={item.icon}
            />
          ))}
        </div>

        {isEditing ? (
          <form className={styles.formGrid} onSubmit={saveOrganization}>
            <OrganizationFields values={organizationForm} onChange={setField} />
          </form>
        ) : (
          <OrganizationReadOnlyDetails organization={organization} />
        )}
      </CardContent>
    </Card>
  );
}
