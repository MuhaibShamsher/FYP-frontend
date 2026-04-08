import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const ProtectedRoute = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isValidAuth = Boolean(user && token);

  return isValidAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
