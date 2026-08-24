import { Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import AuthenticatedPlaceholder from '../pages/AuthenticatedPlaceholder.jsx';
import NotFound from '../pages/NotFound.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import PublicRoute from './PublicRoute.jsx';
import RoleRoute from './RoleRoute.jsx';
import RootRedirect from './RootRedirect.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role="EMPLOYEE" />}>
          <Route
            path="/employee/dashboard"
            element={<AuthenticatedPlaceholder role="EMPLOYEE" />}
          />
        </Route>

        <Route element={<RoleRoute role="ADMIN" />}>
          <Route
            path="/admin/dashboard"
            element={<AuthenticatedPlaceholder role="ADMIN" />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
