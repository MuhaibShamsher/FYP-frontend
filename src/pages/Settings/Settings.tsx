import { 
  UserProfileCard, 
  PasswordChangeCard, 
  OrganizationDetails, 
} from '@/components/setting';
import styles from './Settings.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.pageContainer}>
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
