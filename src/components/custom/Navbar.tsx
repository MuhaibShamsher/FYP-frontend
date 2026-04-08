import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSection } from '@/store/slices/headerSlice';
import {
  LayoutDashboard,
  Server,
  Radar,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { type RootState } from '@/store';
import armorLogo from '@/assets/armor_logo.png';
import styles from './styles/Navbar.module.css';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
  },
  { id: 'assets', icon: Server, label: 'Assets', path: '/assets' },
  { id: 'scans', icon: Radar, label: 'Scans', path: '/scans' },
  {
    id: 'vulnerabilities',
    icon: ShieldAlert,
    label: 'Vulnerabilities',
    path: '/vulnerabilities',
  },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Navbar() {
  const activeSection = useSelector(
    (state: RootState) => state.header.activeSection
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on navigation
  const handleNavigation = (item: any) => {
    dispatch(setActiveSection(item.id));
    navigate(item.path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

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

        {/* Center: Desktop Navigation Menu */}
        <div className={styles.desktopNav}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
              >
                {isActive && <span className={styles.activeDot}></span>}
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
                <div className={styles.hoverGlow}></div>
              </button>
            );
          })}
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

          {/* Mobile Menu Toggle */}
          <div className={styles.mobileControls}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={styles.menuButton}
            >
              {isMobileMenuOpen ? (
                <X className={styles.menuIcon} />
              ) : (
                <Menu className={styles.menuIcon} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}
            >
              <Icon className={styles.mobileNavIcon} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className={styles.mobileLogoutSection}>
          <button onClick={handleLogout} className={styles.mobileNavItem}>
            <LogOut className={styles.mobileLogoutIcon} />
            <span className={styles.mobileLogoutText}>Logout</span>
          </button>
        </div>
      </div>

      <div className={styles.bottomBorder}></div>
    </nav>
  );
}
