import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LoadingState, Navbar } from '@/components/custom';

const RootLayout = () => {
  const location = useLocation();
  const complianceSubNav = location.pathname.startsWith('/compliance');
  const mainTopPad = complianceSubNav ? 'pt-[7.75rem]' : 'pt-16';

  return (
    <div className="flex flex-col h-screen relative bg-background selection:bg-primary/20">
      <div className="relative z-10 flex flex-col h-full">
        <Navbar />
        <div className={`flex-1 flex flex-col ${mainTopPad}`}>
          <div className="flex-1 overflow-auto">
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

export default RootLayout;
