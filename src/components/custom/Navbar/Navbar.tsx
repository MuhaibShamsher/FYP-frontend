import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { clearActiveIds } from '@/store/slices/activeIdsSlice';
import { LogOut } from 'lucide-react';
import armorLogo from '@/assets/armor_logo.png';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearActiveIds());
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.dynamicBg}></div>

      {/* Main Navbar Container */}
      <div className={styles.mainContainer}>
        {/* Left Side: Enterprise Logo Section */}
        <div
          className={styles.logoSection}
          onClick={() => navigate('/dashboard')}
        >
          <div className={styles.logoContainer}>
            <div className={styles.logoGlow}></div>
            <div className={styles.logoImageBox}>
              <img src={armorLogo} alt="ARMOR" className={styles.logoImage} />
            </div>
          </div>

          <div className={styles.logoTextWrapper}>
            <span className={styles.brandName}>ARMOR</span>
            <span className={styles.brandSubtitle}>Security Intelligence</span>
          </div>
        </div>

        {/* Right Side: Status Controls */}
        <div className={styles.controlsSection}>
          <div className={styles.statusIndicator}>
            <div className={styles.statusDot}></div>
            <span className={styles.statusText}>LIVE</span>
          </div>

          <div className={styles.separator}></div>

          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            title="End Session"
          >
            <div className={styles.logoutContent}>
              <LogOut className={styles.logoutIcon} />
              <span className={styles.logoutText}>Logout</span>
            </div>
          </button>
        </div>
      </div>

      <div className={styles.bottomBorder}></div>
    </nav>
  );
}
