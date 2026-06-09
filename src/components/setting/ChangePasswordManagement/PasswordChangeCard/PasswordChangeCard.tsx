
import { useChangePassword } from '@/hooks';
import { Button, Card, CardContent } from '@/components/ui';
import { SettingsCardHeader } from '../../CardHeader/CardHeader';
import { PasswordRequirement } from '../PasswordRequirement/PasswordRequirement';
import { PasswordField } from '../PasswordField/PasswordField';
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Info,
  Lock,
  Shield,
} from 'lucide-react';
import styles from './PasswordChangeCard.module.css';

export default function PasswordChangeCard() {
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
  } = useChangePassword();

  return (
    <Card className={styles.passwordCard}>
      <SettingsCardHeader tone="orange" title="Change Password" />
      <CardContent className={styles.cardContent}>
        <form onSubmit={handleChangePassword} className={styles.formContainer}>
          <PasswordField
            label="Current Password"
            value={passwordData.oldPassword}
            onChange={setOldPassword}
            type={passwordVisibility.showOldPassword ? 'text' : 'password'}
            placeholder="Enter current password"
            toggleIcon={
              passwordVisibility.showOldPassword ? <EyeOff /> : <Eye />
            }
            onToggle={() =>
              setShowOldPassword(!passwordVisibility.showOldPassword)
            }
            isVisible={passwordVisibility.showOldPassword}
          />

          <PasswordField
            label="New Password"
            value={passwordData.newPassword}
            onChange={setNewPassword}
            type={passwordVisibility.showNewPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            toggleIcon={
              passwordVisibility.showNewPassword ? <EyeOff /> : <Eye />
            }
            onToggle={() =>
              setShowNewPassword(!passwordVisibility.showNewPassword)
            }
            isVisible={passwordVisibility.showNewPassword}
          />

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

          <PasswordField
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={setConfirmPassword}
            type={passwordVisibility.showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter new password"
            toggleIcon={
              passwordVisibility.showConfirmPassword ? <EyeOff /> : <Eye />
            }
            onToggle={() =>
              setShowConfirmPassword(!passwordVisibility.showConfirmPassword)
            }
            isVisible={passwordVisibility.showConfirmPassword}
          />

          {passwordData.confirmPassword && (
            <div className={styles.matchIndicator}>
              {passwordData.newPassword === passwordData.confirmPassword ? (
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
            {isChangingPassword ? 'UPDATING CREDENTIALS' : 'UPDATE PASSWORD'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
