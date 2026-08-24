import { Navigate, Outlet } from 'react-router-dom';
import FullPageLoader from '../components/ui/FullPageLoader.jsx';
import useAuth from '../hooks/useAuth.js';

function getDashboardPath(role) {
  return role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard';
}

export default function PublicRoute() {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) return <FullPageLoader />;

  if (isAuthenticated) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}
