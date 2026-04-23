import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useSettingsPage from '@/hooks/useSettingsPage';
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  User,
  Key,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type { RootState } from '@/store';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    passwordData,
    passwordVisibility,
    passwordStrength,
    isChangingPassword,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
    setShowOldPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    handleChangePassword,
  } = useSettingsPage();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.gridLayout}>
        {/* User Profile Card */}
        <Card className={styles.profileCard}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <div
                className={`${styles.statusIndicator} ${styles.blueIndicator}`}
              ></div>
              USER PROFILE
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.profileCardContent}>
            {/* Avatar */}
            <div className={styles.avatarContainer}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatarGlow}></div>
                <div className={styles.avatar}>
                  <User className={styles.avatarIcon} />
                </div>
                <div className={styles.avatarBadge}>
                  <CheckCircle className={styles.avatarBadgeIcon} />
                </div>
              </div>
            </div>

            {/* User Info */}
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

            {/* Security Status */}
            <div className={styles.securityStatus}>
              <div className={styles.securityStatusContent}>
                <CheckCircle className={styles.securityStatusIcon} />
                <h4 className={styles.securityStatusTitle}>ACCOUNT VERIFIED</h4>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className={styles.passwordCard}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <div
                className={`${styles.statusIndicator} ${styles.orangeIndicator}`}
              ></div>
              CHANGE PASSWORD
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <form
              onSubmit={handleChangePassword}
              className={styles.formContainer}
            >
              {/* Current Password */}
              <div className={styles.fieldGroup}>
                <label className={styles.formLabel}>Current Password</label>
                <div className={styles.inputGroup}>
                  <input
                    type={
                      passwordVisibility.showOldPassword ? 'text' : 'password'
                    }
                    value={passwordData.oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={styles.inputField}
                  />
                  <Lock className={styles.inputIconLeft} />
                  <button
                    type="button"
                    onClick={() =>
                      setShowOldPassword(!passwordVisibility.showOldPassword)
                    }
                    className={styles.togglePasswordButton}
                  >
                    {passwordVisibility.showOldPassword ? (
                      <EyeOff className={styles.passwordToggleIcon} />
                    ) : (
                      <Eye className={styles.passwordToggleIcon} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className={styles.fieldGroup}>
                <label className={styles.formLabel}>New Password</label>
                <div className={styles.inputGroup}>
                  <input
                    type={
                      passwordVisibility.showNewPassword ? 'text' : 'password'
                    }
                    value={passwordData.newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={styles.inputField}
                  />
                  <Key className={styles.inputIconLeft} />
                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(!passwordVisibility.showNewPassword)
                    }
                    className={styles.togglePasswordButton}
                  >
                    {passwordVisibility.showNewPassword ? (
                      <EyeOff className={styles.passwordToggleIcon} />
                    ) : (
                      <Eye className={styles.passwordToggleIcon} />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicators */}
                {passwordData.newPassword && (
                  <div className={styles.requirementsContainer}>
                    <h4 className={styles.requirementsTitle}>
                      <Info className={styles.requirementsTitleIcon} />
                      Password Requirements
                    </h4>
                    <div className={styles.requirementsGrid}>
                      <PasswordRequirement
                        met={passwordStrength.hasMinLength}
                        text="At least 8 characters"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasUpperCase}
                        text="One uppercase letter"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasLowerCase}
                        text="One lowercase letter"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasNumber}
                        text="One number"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasSpecial}
                        text="One special character"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={styles.fieldGroup}>
                <label className={styles.formLabel}>Confirm New Password</label>
                <div className={styles.inputGroup}>
                  <input
                    type={
                      passwordVisibility.showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={passwordData.confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={styles.inputField}
                  />
                  <Key className={styles.inputIconLeft} />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !passwordVisibility.showConfirmPassword
                      )
                    }
                    className={styles.togglePasswordButton}
                  >
                    {passwordVisibility.showConfirmPassword ? (
                      <EyeOff className={styles.passwordToggleIcon} />
                    ) : (
                      <Eye className={styles.passwordToggleIcon} />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {passwordData.confirmPassword && (
                  <div className={styles.matchIndicator}>
                    {passwordData.newPassword ===
                    passwordData.confirmPassword ? (
                      <>
                        <CheckCircle
                          className={`${styles.matchIcon} ${styles.matchIconSuccess}`}
                        />
                        <span className={styles.matchTextSuccess}>
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle
                          className={`${styles.matchIcon} ${styles.matchIconError}`}
                        />
                        <span className={styles.matchTextError}>
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  isChangingPassword ||
                  !passwordStrength.isValid ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
                className={styles.submitButton}
              >
                {isChangingPassword ? (
                  <Lock className={styles.buttonIconPulse} />
                ) : (
                  <Shield className={styles.buttonIcon} />
                )}
                {isChangingPassword
                  ? 'UPDATING CREDENTIALS'
                  : 'UPDATE PASSWORD'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Password Requirement Component
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={styles.requirement}>
      {met ? (
        <CheckCircle className={styles.requirementIcon} />
      ) : (
        <div className={styles.requirementIconUnmet}></div>
      )}
      <span
        className={`${styles.requirementText} ${met ? styles.requirementTextMet : styles.requirementTextUnmet}`}
      >
        {text}
      </span>
    </div>
  );
}
