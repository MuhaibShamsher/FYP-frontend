import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { UserRole } from '@/types/auth';
import { hasAnyRole } from '@/utils/rbac';

interface ProtectedRouteProps {
  allowedRoles?: readonly UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isValidAuth = Boolean(user && token);
  const hasRoleAccess =
    !allowedRoles || allowedRoles.length === 0
      ? true
      : hasAnyRole(user?.role, allowedRoles);

  if (!isValidAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRoleAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
