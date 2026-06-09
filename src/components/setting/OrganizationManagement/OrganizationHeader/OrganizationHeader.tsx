import { Button, CardTitle } from '@/components/ui';
import { Loader2, Pencil, Save, X } from 'lucide-react';
import styles from './OrganizationHeader.module.css';

export function OrganizationHeader({
  canEditOrganization,
  isEditing,
  isSavingOrganization,
  onStartEditing,
  onCancelEditing,
  onSave,
}: {
  canEditOrganization: boolean;
  isEditing: boolean;
  isSavingOrganization: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSave: (e?: any) => Promise<void>;
}) {
  return (
    <div className={styles.headerRow}>
      <CardTitle className={styles.cardTitle}>
        <div
          className={`${styles.statusIndicator} ${styles.orangeIndicator}`}
        />
        Organization Details
      </CardTitle>

      <div className={styles.headerActions}>
        <span
          className={`${styles.roleBadge} ${canEditOrganization ? styles.adminBadge : styles.viewOnlyBadge}`}
        >
          {canEditOrganization ? 'ADMIN ACCESS' : 'VIEW ONLY'}
        </span>

        {canEditOrganization && !isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={onStartEditing}
            className={styles.actionButton}
          >
            <Pencil /> Edit
          </Button>
        )}

        {canEditOrganization && isEditing && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEditing}
              className={styles.actionButton}
            >
              <X /> Cancel
            </Button>
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              disabled={isSavingOrganization}
              className={styles.actionButton}
            >
              {isSavingOrganization ? (
                <Loader2 className={styles.spinner} />
              ) : (
                <Save />
              )}
              {isSavingOrganization ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
