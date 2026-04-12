import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoutes';
import RootLayout from '@/Layout';
import LoginPage from '@/pages/Login';

const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const AssetsPage = lazy(() => import('@/pages/Assets'));
const ScansPage = lazy(() => import('@/pages/Scans'));
const SettingsPage = lazy(() => import('@/pages/Settings'));
const AssetDetailsPage = lazy(() => import('@/pages/AssetDetails'));
const VulnerabilitiesPage = lazy(() => import('@/pages/Vulnerabilities'));
const ComplianceViolationsPage = lazy(() => import('@/pages/ComplianceViolations'));
const ComplianceResultsPage = lazy(() => import('@/pages/ComplianceResults'));


export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: (<DashboardPage />) },
          { path: 'assets', element: (<AssetsPage />) },
          { path: 'assets/:assetId', element: (<AssetDetailsPage />) },
          { path: 'scans', element: (<ScansPage />) },
          { path: 'vulnerabilities', element: (<VulnerabilitiesPage />) },
          { path: 'compliance/violations', element: (<ComplianceViolationsPage />) },
          { path: 'compliance/results', element: (<ComplianceResultsPage />) },
          { path: 'settings', element: (<SettingsPage />) },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
