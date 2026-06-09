import { Link } from 'react-router-dom';
import { useLoginPage } from '@/hooks';
import { Button } from '@/components/ui';
import { TypingText } from '@/components/custom';
import { Lock, Eye, EyeOff, AlertTriangle, Loader2, Mail } from 'lucide-react';
import AuthLayout from '@/layout/AuthLayout/AuthLayout';
import styles from './Login.module.css';

export default function LoginPage() {
  const {
    email,
    password,
    showPassword,
    isLoginLoading,
    loginError,
    setEmail,
    setPassword,
    setShowPassword,
    handleLogin,
  } = useLoginPage();

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        {/* Form Header */}
        <div className={styles.formHeader}>
          <h2 className={styles.welcomeTitle}>
            <TypingText text="WELCOME BACK" speed={80} />
          </h2>
          <p className={styles.formSubtitle}>
            Sign in to access your Armor dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputFieldWrapper}>
            <label className={styles.inputLabel}>Email</label>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={styles.input}
                required
              />
              <Mail className={styles.inputIcon} />
            </div>
          </div>

          <div className={styles.inputFieldWrapper}>
            <label className={styles.inputLabel}>Password</label>
            <div className={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${styles.input} ${styles.inputWithToggle}`}
                required
              />
              <Lock className={styles.inputIcon} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? (
                  <Eye className={styles.toggleIcon} />
                ) : (
                  <EyeOff className={styles.toggleIcon} />
                )}
              </button>
            </div>
            <div className={styles.labelRow}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>
          </div>

          {loginError && (
            <div className={styles.errorAlert}>
              <AlertTriangle className={styles.errorIcon} />
              <span>
                {typeof loginError === 'string'
                  ? loginError
                  : (loginError as any)?.data?.message ||
                  'Authentication Failed'}
              </span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoginLoading}
            className={styles.submitButton}
          >
            {isLoginLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
