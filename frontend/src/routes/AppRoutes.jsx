import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import Login from '../pages/auth/Login'
import EmployeeDashboard from '../pages/employee/Dashboard'
import AdminDashboard from '../pages/admin/Dashboard'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role="EMPLOYEE" />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Route>

        <Route element={<RoleRoute role="ADMIN" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

/**
 * Arahkan "/" atau URL yang tidak dikenal ke tujuan yang tepat berdasarkan
 * status login & role — bukan halaman 404 statis, karena di aplikasi ini
 * setiap user selalu punya "home" yang jelas.
 */
function RootRedirect() {
  const { isAuthenticated, isInitializing, user } = useAuth()

  if (isInitializing) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'} replace />
  )
}
