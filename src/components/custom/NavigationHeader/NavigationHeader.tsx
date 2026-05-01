import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSection } from '@/store/slices/headerSlice';
import { canAccessUsers } from '@/utils/rbac';
import {
  LayoutDashboard,
  Server,
  Radar,
  ShieldAlert,
  Database,
  Settings,
  FileText,
  Users as UsersIcon,
  type LucideIcon,
} from 'lucide-react';
import type { SectionKey } from '@/types';
import type { RootState } from '@/store';
import styles from './NavigationHeader.module.css';

export default function NavigationHeader() {
  type NavItem = {
    id: SectionKey;
    icon: LucideIcon;
    label: string;
    path: string;
  };

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
    },
    { id: 'assets', icon: Server, label: 'Assets', path: '/assets' },
    {
      id: 'vulnerabilities',
      icon: ShieldAlert,
      label: 'Vulnerabilities',
      path: '/vulnerabilities',
    },
    {
      id: 'compliance-violations',
      icon: ShieldAlert,
      label: 'Compliance Violations',
      path: '/compliance/violations',
    },
    {
      id: 'compliance-results',
      icon: FileText,
      label: 'Compliance Results',
      path: '/compliance/results',
    },
    { id: 'feeds', icon: Database, label: 'Feeds', path: '/feeds' },
    { id: 'users', icon: UsersIcon, label: 'Users', path: '/users' },
    { id: 'scans', icon: Radar, label: 'Scans', path: '/scans' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const visibleNavItems = navItems.filter(
    (item) => item.id !== 'users' || canAccessUsers(userRole)
  );

  const handleNavigation = (item: NavItem) => {
    dispatch(setActiveSection(item.id));
    navigate(item.path);
  };

  return (
    <div className={styles.navigationHeader}>
      <div className={styles.navigationContainer}>
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
            >
              <Icon className={styles.navIcon} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
