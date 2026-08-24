import {
  Bell,
  ClipboardCheck,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Brand from '../components/layout/Brand.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Button from '../components/ui/Button.jsx';
import Dialog from '../components/ui/Dialog.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import useAuth from '../hooks/useAuth.js';

const navigation = [
  { label: 'Dashboard', to: '/employee/dashboard', icon: LayoutDashboard },
  { label: 'Absensi', to: '/employee/attendance', icon: ClipboardCheck },
  { label: 'Riwayat', to: '/employee/history', icon: History },
  { label: 'Profil', to: '/employee/profile', icon: UserRound },
];

function NavItem({ item, mobile = false, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        mobile
          ? `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition ${
              isActive ? 'bg-primary-light text-primary-dark' : 'text-ink-muted'
            }`
          : `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
              isActive
                ? 'bg-primary text-white shadow-soft'
                : 'text-ink-muted hover:bg-primary-soft hover:text-primary-dark'
            }`
      }
    >
      <Icon aria-hidden="true" size={mobile ? 20 : 19} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  function handleLogout() {
    logout();
    showToast('Anda berhasil logout.');
    navigate('/login', { replace: true });
  }

  const displayName = user?.name || user?.fullName || user?.email || 'Employee';

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-white p-5 lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
        <Brand />
        <nav className="mt-9 flex-1 space-y-1.5" aria-label="Navigasi employee">
          {navigation.map((item) => <NavItem key={item.to} item={item} />)}
        </nav>

        <div className="border-t border-border pt-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-primary-soft p-3">
            <Avatar name={displayName} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-primary-dark">{displayName}</p>
              <p className="mt-0.5 truncate text-[11px] text-ink-muted">Employee</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-danger hover:bg-danger-light hover:text-danger" onClick={() => setLogoutOpen(true)}>
            <LogOut aria-hidden="true" size={18} /> Logout
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                className="grid size-10 place-items-center rounded-xl text-primary-dark transition hover:bg-primary-soft focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Buka menu"
              >
                <Menu aria-hidden="true" size={22} />
              </button>
              <Brand compact />
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-ink-muted">Employee Portal</p>
              <p className="mt-0.5 text-sm font-semibold text-primary-dark">Kelola kehadiran Anda</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="relative grid size-10 place-items-center rounded-xl border border-border text-ink-muted transition hover:border-primary/30 hover:bg-primary-soft hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                aria-label="Notifikasi"
              >
                <Bell aria-hidden="true" size={19} />
                <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-danger" />
              </button>
              <NavLink to="/employee/profile" className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-primary-soft focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
                <Avatar name={displayName} size="sm" />
                <span className="hidden max-w-36 truncate text-xs font-semibold text-primary-dark sm:block">{displayName}</span>
              </NavLink>
            </div>
          </div>
        </header>

        <main id="main-content" tabIndex="-1" className="px-4 pb-28 pt-6 outline-none sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <Outlet />
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-primary-dark/45 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-label="Tutup menu" />
          <aside className="relative flex h-full w-[82%] max-w-xs flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="grid size-10 place-items-center rounded-xl text-ink-muted hover:bg-primary-soft" aria-label="Tutup menu">
                <X aria-hidden="true" size={21} />
              </button>
            </div>
            <div className="mt-7 flex items-center gap-3 rounded-2xl bg-primary-soft p-4">
              <Avatar name={displayName} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary-dark">{displayName}</p>
                <p className="mt-1 truncate text-xs text-ink-muted">{user?.email}</p>
              </div>
            </div>
            <nav className="mt-6 flex-1 space-y-1.5" aria-label="Menu employee">
              {navigation.map((item) => <NavItem key={item.to} item={item} onNavigate={() => setMobileMenuOpen(false)} />)}
            </nav>
            <Button variant="ghost" className="w-full justify-start text-danger hover:bg-danger-light hover:text-danger" onClick={() => { setMobileMenuOpen(false); setLogoutOpen(true); }}>
              <LogOut aria-hidden="true" size={18} /> Logout
            </Button>
          </aside>
        </div>
      )}

      <nav className="mobile-safe-bottom fixed inset-x-3 z-40 flex rounded-2xl border border-border bg-white/95 p-1.5 shadow-card backdrop-blur lg:hidden" aria-label="Navigasi bawah">
        {navigation.map((item) => <NavItem key={item.to} item={item} mobile />)}
      </nav>
      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={handleLogout} title="Keluar dari aplikasi?" message="Sesi Anda akan diakhiri dan Anda perlu login kembali untuk melakukan absensi." confirmLabel="Logout" />
    </div>
  );
}
