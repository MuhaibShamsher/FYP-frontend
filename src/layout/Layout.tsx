import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui';
import { LoadingState, Navbar, NavigationHeader } from '@/components/custom';
import styles from './Layout.module.css';

export default function RootLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Navbar />
        <NavigationHeader />

        <div className={styles.contentArea}>
          <div className={styles.scrollable}>
            <Suspense fallback={<LoadingState text="LOADING..." />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
