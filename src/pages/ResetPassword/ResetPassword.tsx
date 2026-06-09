import { Link, useParams } from 'react-router-dom';
import { useResetPassword } from '@/hooks';
import { Button } from '@/components/ui';
import { TypingText } from '@/components/custom';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Loader2,
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
    isTokenInvalid,
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
        {isTokenInvalid ? (
          <div className={styles.successContainer}>
            <div className={styles.successIconBox} style={{ borderColor: 'rgba(239, 68, 68, 0.25)', background: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertTriangle className={styles.successIcon} style={{ color: '#ef4444' }} />
            </div>
            <h2 className={styles.successTitle}>Link Expired or Invalid</h2>
            <p className={styles.successDesc}>
              The password reset link is invalid or has expired. Please request a new link to reset your password.
            </p>
            <Link to="/forgot-password" className={styles.backToLoginButton}>
              Request New Link
            </Link>
          </div>
        ) : !isSuccess ? (
          <>
            <div className={styles.formHeader}>
              <h2 className={styles.welcomeTitle}>
                <TypingText text="RESET PASSWORD" speed={80} />
              </h2>
              <p className={styles.formSubtitle}>
                Choose a new password to secure your account.
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className={styles.successContainer}>
            <div className={styles.successIconBox}>
              <CheckCircle className={styles.successIcon} />
            </div>
            <h2 className={styles.successTitle}>Password Reset Successful</h2>
            <p className={styles.successDesc}>
              Your password has been successfully updated. You can now log back into your account.
            </p>
            <Link to="/login" className={styles.backToLoginButton}>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
