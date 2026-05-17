import React from 'react';
import { CyberGrid } from '@/components/custom';
import { Server, Shield, Activity } from 'lucide-react';
import ArmorLogo from '@/assets/armor_logo.png';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.pageContainer}>
      {/* ── Left Panel — Branding & Visuals ── */}
      <div className={styles.leftPanel}>
        <CyberGrid />

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
                Next-Gen Cybersecurity Platform
              </h2>

              <div className={styles.featureList}>
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

                <div className={styles.featureItem}>
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

                <div className={styles.featureItem}>
                  <div className={styles.featureIconBox}>
                    <Activity className={styles.featureIcon} />
                  </div>
                  <div>
                    <h3 className={styles.featureTitle}>Compliance Inspection</h3>
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

      {/* ── Right Panel — Auth Form Content ── */}
      <div className={styles.rightPanel}>
        <div className={styles.panelGlow} />

        {/* Mobile Logo */}
        <div className={styles.mobileLogo}>
          <img src={ArmorLogo} alt="Armor Logo" className={styles.mobileLogoImg} />
          <h1 className={styles.mobileBrandName}>ARMOR</h1>
        </div>

        {children}
      </div>
    </div>
  );
}
