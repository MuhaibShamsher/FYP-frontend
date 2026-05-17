import { Link, useParams } from 'react-router-dom';
import { useResetPassword } from '@/hooks';
import { Button } from '@/components/ui';
import { TypingText } from '@/components/custom';
import { PasswordRequirement } from '@/components/setting/ChangePasswordManagement/PasswordRequirement/PasswordRequirement';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Zap,
  Info,
} from 'lucide-react';
import AuthLayout from '@/layout/AuthLayout/AuthLayout';
import styles from './ResetPassword.module.css';

export default function ResetPasswordPage() {
  const { userId, resetToken } = useParams<{ userId: string; resetToken: string }>();
  const {
    passwordData,
    passwordVisibility,
    passwordStrength,
    isResetting,
    isSuccess,
    setNewPassword,
    setConfirmPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    handleResetPassword,
  } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && resetToken) {
      handleResetPassword(userId, resetToken);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        {!isSuccess ? (
          <>
            <div className={styles.formHeader}>
              <h2 className={styles.welcomeTitle}>
                <TypingText text="RESET PASSWORD" speed={80} />
              </h2>
              <p className={styles.formSubtitle}>
                Please choose a strong password to secure your credentials.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* New Password */}
              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputLabel}>New Password</label>
                <div className={styles.inputGroup}>
                  <input
                    type={passwordVisibility.showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                    required
                  />
                  <Lock className={styles.inputIcon} />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!passwordVisibility.showNewPassword)}
                    className={styles.passwordToggle}
                  >
                    {passwordVisibility.showNewPassword ? (
                      <Eye className={styles.toggleIcon} />
                    ) : (
                      <EyeOff className={styles.toggleIcon} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
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

              {/* Confirm Password */}
              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputLabel}>Confirm Password</label>
                <div className={styles.inputGroup}>
                  <input
                    type={passwordVisibility.showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                    required
                  />
                  <Lock className={styles.inputIcon} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!passwordVisibility.showConfirmPassword)}
                    className={styles.passwordToggle}
                  >
                    {passwordVisibility.showConfirmPassword ? (
                      <Eye className={styles.toggleIcon} />
                    ) : (
                      <EyeOff className={styles.toggleIcon} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Match Indicator */}
              {passwordData.confirmPassword && (
                <div className={styles.matchIndicator}>
                  {passwordData.newPassword === passwordData.confirmPassword ? (
                    <>
                      <CheckCircle className={`${styles.matchIcon} ${styles.matchIconSuccess}`} />
                      <span className={styles.matchTextSuccess}>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className={`${styles.matchIcon} ${styles.matchIconError}`} />
                      <span className={styles.matchTextError}>Passwords do not match</span>
                    </>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  isResetting ||
                  !passwordStrength.isValid ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
                className={styles.submitButton}
              >
                {isResetting ? (
                  <>
                    <Zap className={`${styles.btnActionIcon} ${styles.spinningIcon}`} />
                    RESETTING CREDENTIALS...
                  </>
                ) : (
                  'RESET PASSWORD'
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className={styles.successContainer}>
            <div className={styles.successIconBox}>
              <CheckCircle className={styles.successIcon} />
            </div>
            <h2 className={styles.successTitle}>PASSWORD RESET SUCCESSFUL</h2>
            <p className={styles.successDesc}>
              Your security credentials have been updated. You may now return to the secure gateway and initiate a session.
            </p>
            <Link to="/login" className={styles.backToLoginButton}>
              BACK TO LOGIN PAGE
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
