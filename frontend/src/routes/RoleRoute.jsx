import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

function getDashboardPath(role) {
  return role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard';
}

export default function RoleRoute({ role }) {
  const { user } = useAuth();

  if (user?.role !== role) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return <Outlet />;
}
