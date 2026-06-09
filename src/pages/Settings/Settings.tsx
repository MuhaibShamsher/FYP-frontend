import {
  UserProfileCard,
  PasswordChangeCard,
  OrganizationDetails,
} from '@/components/setting';
import { Settings } from 'lucide-react';
import styles from './Settings.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div className="globalPageHeader">
          <h1 className="globalPageTitle">
            <Settings className="globalTitleIcon" />
            Settings
          </h1>
          <p className="globalPageSubtitle">
            Allow user to update their profile information.
          </p>
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
