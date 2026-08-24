import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Membatasi route berdasarkan role, dipakai BERSAMA ProtectedRoute (jadi
 * saat ini user sudah dipastikan login). Ini adalah route guard sungguhan,
 * bukan sekadar menyembunyikan menu — mengakses URL admin secara langsung
 * sebagai employee tetap akan dialihkan, bukan hanya disembunyikan di UI.
 *
 * Otorisasi final tetap ada di backend; ini murni untuk UX di sisi frontend.
 */
export function RoleRoute({ role }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    const fallback = user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
