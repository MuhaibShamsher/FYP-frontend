import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LoadingState, Navbar } from '@/components/custom';

const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen relative bg-background selection:bg-primary/20">
      <div className="relative z-10 flex flex-col h-full">
        <Navbar />
        <div className={`flex-1 flex flex-col pt-16`}>
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
