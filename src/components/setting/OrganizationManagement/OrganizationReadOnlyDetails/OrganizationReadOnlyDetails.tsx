import { InfoItem } from '../InfoItem/InfoItem';
import { ORGANIZATION_DETAILS_FIELDS } from '../constants';
import type { OrganizationLike } from '../types';
import styles from './OrganizationReadOnlyDetails.module.css';

export function OrganizationReadOnlyDetails({organization}: {organization: OrganizationLike}) {
  const inputFields = ORGANIZATION_DETAILS_FIELDS.filter(
    (field) => field.kind === 'input'
  );

  return (
    <div className={styles.infoGrid}>
      {inputFields
        .map((field) => (
          <InfoItem
            key={field.key}
            label={field.label}
            value={organization[field.field]}
            icon={<field.icon />}
          />
        ))}

      <div className={styles.frameworksBlock}>
        <p className={styles.fieldLabel}>Compliance Frameworks</p>
        <div className={styles.frameworkChips}>
          {organization.compliance_frameworks.length > 0 ? (
            organization.compliance_frameworks.map((framework) => (
              <span key={framework} className={styles.frameworkChip}>
                {framework}
              </span>
            ))
          ) : (
            <span className={styles.emptyChip}>No frameworks linked</span>
          )}
        </div>
      </div>

      <div className={styles.descriptionBlock}>
        <p className={styles.fieldLabel}>Description</p>
        <p className={styles.descriptionText}>
          {organization.description || 'No description available.'}
        </p>
      </div>
    </div>
  );
}
