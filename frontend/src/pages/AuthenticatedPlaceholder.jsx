import { Building2, LogOut, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Brand from '../components/layout/Brand.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import useAuth from '../hooks/useAuth.js';

export default function AuthenticatedPlaceholder({ role }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = role === 'ADMIN';

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 shadow-soft sm:px-5">
          <Brand />
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut aria-hidden="true" size={18} /> Logout
          </Button>
        </header>

        <Card className="mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-dark to-primary p-6 text-white sm:p-9">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/15">
              {isAdmin ? <Building2 aria-hidden="true" /> : <UserRound aria-hidden="true" />}
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
              Login berhasil · {role}
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Halo, {user?.name || user?.fullName || user?.email}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
              Authentication, pemulihan sesi, dan perlindungan route sudah aktif. Dashboard lengkap akan dibuat pada tahap berikutnya.
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <div className="rounded-2xl bg-primary-soft p-4">
              <p className="text-xs text-ink-muted">Email</p>
              <p className="mt-1 break-all text-sm font-semibold text-primary-dark">{user?.email || '-'}</p>
            </div>
            <div className="rounded-2xl bg-primary-soft p-4">
              <p className="text-xs text-ink-muted">Role terverifikasi</p>
              <p className="mt-1 text-sm font-semibold text-primary-dark">{user?.role}</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
