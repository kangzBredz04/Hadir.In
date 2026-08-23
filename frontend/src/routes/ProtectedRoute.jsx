import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Melindungi route agar hanya bisa diakses user yang sudah login.
 * Selama status auth masih diverifikasi (bootstrap token dari localStorage),
 * tampilkan loader supaya user tidak "lompat" ke /login sesaat sebelum
 * ternyata dia sudah login.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) {
    return <FullScreenLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary-light border-t-primary"
        role="status"
        aria-label="Memuat"
      />
    </div>
  )
}
