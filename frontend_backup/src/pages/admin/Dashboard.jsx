import { LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'

/**
 * Placeholder — dashboard admin lengkap dibangun di Tahap 6.
 * Halaman ini hanya untuk memverifikasi alur login + route guard berjalan.
 */
export default function AdminDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      <span className="text-caption rounded-full bg-primary-light px-3 py-1 font-medium text-primary-dark">
        Admin Dashboard — dibangun penuh di Tahap 6
      </span>
      <h1 className="text-heading">Selamat datang, {user?.name ?? 'Admin'} 👋</h1>
      <p className="text-body text-muted">
        Role: <span className="font-medium text-text">{user?.role}</span>
      </p>
      <Button variant="secondary" onClick={logout} className="mt-2">
        <LogOut size={16} />
        Logout
      </Button>
    </div>
  )
}
