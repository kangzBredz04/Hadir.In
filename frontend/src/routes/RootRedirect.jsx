import { Navigate } from 'react-router-dom';
import FullPageLoader from '../components/ui/FullPageLoader.jsx';
import useAuth from '../hooks/useAuth.js';

export default function RootRedirect() {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Navigate
      to={user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'}
      replace
    />
  );
}
