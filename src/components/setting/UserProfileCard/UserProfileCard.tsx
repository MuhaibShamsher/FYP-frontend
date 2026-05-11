import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui';
import { SettingsCardHeader } from '../CardHeader/CardHeader';
import { User, Shield, CheckCircle } from 'lucide-react';
import type { RootState } from '@/store';
import styles from './UserProfileCard.module.css';

export default function UserProfileCard() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Card className={styles.profileCard}>
      <SettingsCardHeader tone="blue" title="USER PROFILE" />
      <CardContent className={styles.profileCardContent}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarGlow} />
            <div className={styles.avatar}>
              <User className={styles.avatarIcon} />
            </div>
            <div className={styles.avatarBadge}>
              <CheckCircle className={styles.avatarBadgeIcon} />
            </div>
          </div>
        </div>

        <div className={styles.userInfoSection}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Email Address</label>
            <div className={styles.fieldContainer}>
              <User className={styles.fieldIcon} />
              <span className={styles.fieldValue}>
                {user?.email || 'Not available'}
              </span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Role</label>
            <div className={styles.fieldContainer}>
              <Shield className={styles.fieldIconPrimary} />
              <span className={styles.fieldValueUppercase}>
                {user?.role || 'User'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.securityStatus}>
          <div className={styles.securityStatusContent}>
            <CheckCircle className={styles.securityStatusIcon} />
            <h4 className={styles.securityStatusTitle}>ACCOUNT VERIFIED</h4>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
