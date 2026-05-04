import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';
import RootLayout from '@/layout/Layout';
import {
  LoginPage,
  DashboardPage,
  AssetsPage,
  ScansPage,
  SettingsPage,
  AssetDetailsPage,
  VulnerabilitiesPage,
  ComplianceViolationsPage,
  ComplianceResultsPage,
  FeedManagementPage,
  UsersPage,
} from '@/pages';

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
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'assets', element: <AssetsPage /> },
          { path: 'assets/:assetId', element: <AssetDetailsPage /> },
          { path: 'scans', element: <ScansPage /> },
          { path: 'vulnerabilities', element: <VulnerabilitiesPage /> },
          { path: 'compliance/violations', element: <ComplianceViolationsPage /> },
          { path: 'compliance/results', element: <ComplianceResultsPage /> },
          { 
            element: <ProtectedRoute allowedRoles={['admin', "risk_analyzer"]} />,
            children: [{ path: 'feeds', element: <FeedManagementPage /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [{ path: 'users', element: <UsersPage /> }],
          },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
