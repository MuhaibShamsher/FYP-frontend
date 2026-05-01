import { useLoginPage } from '@/hooks';
import { Button } from '@/components/ui';
import { CyberGrid, TypingText } from '@/components/custom';
import {
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Zap,
  Server,
  Shield,
  Activity,
} from 'lucide-react';
import ArmorLogo from '@/assets/armor_logo.png';
import styles from './Login.module.css';

export default function LoginPage() {
  const {
    email,
    password,
    showPassword,
    scanProgress,
    isLoginLoading,
    loginError,
    setEmail,
    setPassword,
    setShowPassword,
    handleLogin,
  } = useLoginPage();

  return (
    <div className={styles.pageContainer}>
      {/* Left Panel - Branding & Visuals (Hidden on mobile) */}
      <div className={styles.leftPanel}>
        <CyberGrid />

        {/* Content Wrapper */}
        <div className={styles.leftContentWrapper}>
          {/* Brand Header */}
          <div className={styles.brandHeader}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoContainer}>
                <div className={styles.logoGlow} />
                <img src={ArmorLogo} alt="Armor Logo" className={styles.logo} />
              </div>
              <div>
                <h1 className={styles.brandName}>ARMOR</h1>
                <p className={styles.brandSubtitle}>Enterprise Security</p>
              </div>
            </div>

            <div className={styles.featuresWrapper}>
              <h2 className={styles.featuresTitle}>
                Next-Gen CyberSecurity Platform
              </h2>

              <div className={styles.featureList}>
                {/* Feature 1: Asset Management */}
                <div className={styles.featureItem}>
                  <div className={styles.featureIconBox}>
                    <Server className={styles.featureIcon} />
                  </div>
                  <div>
                    <h3 className={styles.featureTitle}>Asset Management</h3>
                    <p className={styles.featureDesc}>
                      Complete visibility and control over your digital
                      infrastructure inventory.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Risk Assessment */}
                <div className={`${styles.featureItem} ${styles.riskFeature}`}>
                  <div className={styles.featureIconBox}>
                    <Shield className={styles.featureIcon} />
                  </div>
                  <div>
                    <h3 className={styles.featureTitle}>Risk Assessment</h3>
                    <p className={styles.featureDesc}>
                      Continuous vulnerability scanning and automated threat
                      prioritization.
                    </p>
                  </div>
                </div>

                {/* Feature 3: Compliance Inspection */}
                <div
                  className={`${styles.featureItem} ${styles.complianceFeature}`}
                >
                  <div className={styles.featureIconBox}>
                    <Activity className={styles.featureIcon} />
                  </div>
                  <div>
                    <h3 className={styles.featureTitle}>
                      Compliance Inspection
                    </h3>
                    <p className={styles.featureDesc}>
                      Automated regulatory adherence checks and real-time
                      reporting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className={styles.rightPanel}>
        {/* Subtle Background Glow */}
        <div className={styles.panelGlow} />

        {/* Mobile Logo (Visible only on mobile) */}
        <div className={styles.mobileLogo}>
          <img
            src={ArmorLogo}
            alt="Armor Logo"
            className={styles.mobileLogoImg}
          />
          <h1 className={styles.mobileBrandName}>ARMOR</h1>
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2 className={styles.welcomeTitle}>
              <TypingText text="WELCOME BACK" speed={80} />
            </h2>
            <p className={styles.formSubtitle}>
              Enter your credentials to access the Application.
            </p>
          </div>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputFieldWrapper}>
              <label className={styles.inputLabel}>Username / Email</label>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={styles.input}
                />
                <Lock className={styles.inputIcon} />
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
                />
                <Lock className={styles.inputIcon} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? (
                    <EyeOff className={styles.toggleIcon} />
                  ) : (
                    <Eye className={styles.toggleIcon} />
                  )}
                </button>
              </div>
            </div>

            {isLoginLoading && (
              <div className={styles.loadingSection}>
                <div className={styles.loadingHeader}>
                  <span>Establishing Secure Handshake...</span>
                  <span>{Math.round(scanProgress)}%</span>
                </div>
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

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
                  <Zap
                    className={`${styles.btnActionIcon} ${styles.spinningIcon}`}
                  />
                  AUTHENTICATING
                </>
              ) : (
                'INITIATE SESSION'
              )}
            </Button>
          </form>

          <div className={styles.footerSection}>
            <div className={styles.footerDivider}></div>
            <p className={styles.footerText}>
              Restricted Access • All attempts are monitored
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
