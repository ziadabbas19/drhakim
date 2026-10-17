import { Navigate, Outlet, useLocation } from 'react-router';
import { Loader } from '../../components/Loader.jsx';
import { PATHS } from '../../config/navigation.js';
import { useAuth } from '../../hooks/useAuth.js';

export const ProtectedRoute = () => {
  const { user, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) return <Loader fullPage />;
  if (!user) return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  if (user.mustChangePassword && location.pathname !== PATHS.changePassword) {
    return <Navigate to={PATHS.changePassword} replace />;
  }

  return <Outlet />;
};
