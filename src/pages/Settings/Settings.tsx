import {
  UserProfileCard,
  PasswordChangeCard,
  OrganizationDetails,
} from '@/components/setting';
import styles from './Settings.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div>
          <div className={styles.headerLabel}>
            <div className={styles.statusDotActive} />
            GLOBAL CONFIGURATION & SECURITY POLICIES
          </div>
          <h1 className={styles.pageTitle}>Settings</h1>
        </div>
      </div>

      <div className={styles.gridLayout}>
        <UserProfileCard />
        <PasswordChangeCard />
        <div className={styles.organizationSection}>
          <OrganizationDetails />
        </div>
      </div>
    </div>
  );
}
