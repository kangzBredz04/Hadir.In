import { Bell, Building2, CalendarCheck2, FileBarChart, LayoutDashboard, LogOut, Menu, Search, UserRound, Users, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Brand from '../components/layout/Brand.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Button from '../components/ui/Button.jsx';
import Dialog from '../components/ui/Dialog.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import useAuth from '../hooks/useAuth.js';

const navigation = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Employees', to: '/admin/employees', icon: Users },
  { label: 'Offices', to: '/admin/offices', icon: Building2 },
  { label: 'Attendance', to: '/admin/attendance', icon: CalendarCheck2 },
  { label: 'Reports', to: '/admin/reports', icon: FileBarChart },
  { label: 'Profile', to: '/admin/profile', icon: UserRound },
];

function NavItem({ item, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
        isActive ? 'bg-primary text-white shadow-soft' : 'text-ink-muted hover:bg-primary-soft hover:text-primary-dark'
      }`}
    >
      <Icon aria-hidden="true" size={19} /> {item.label}
    </NavLink>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const displayName = user?.name || user?.fullName || user?.email || 'Administrator';

  function handleLogout() {
    logout();
    showToast('Anda berhasil logout.');
    navigate('/login', { replace: true });
  }

  function handleQuickSearch(event) {
    event.preventDefault();
    const query = quickSearch.trim();
    navigate(query ? `/admin/employees?search=${encodeURIComponent(query)}` : '/admin/employees');
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-white p-5 lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
        <Brand />
        <div className="mt-6 rounded-2xl bg-primary-soft p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Admin workspace</p>
          <p className="mt-1 text-xs leading-5 text-ink-muted">Monitoring operasional kehadiran.</p>
        </div>
        <nav className="mt-5 flex-1 space-y-1.5" aria-label="Navigasi admin">
          {navigation.map((item) => <NavItem key={item.to} item={item} />)}
        </nav>
        <Button variant="ghost" className="w-full justify-start text-danger hover:bg-danger-light hover:text-danger" onClick={() => setLogoutOpen(true)}>
          <LogOut aria-hidden="true" size={18} /> Logout
        </Button>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
            <button type="button" className="grid size-10 shrink-0 place-items-center rounded-xl text-primary-dark hover:bg-primary-soft lg:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Buka menu admin">
              <Menu aria-hidden="true" size={22} />
            </button>
            <form onSubmit={handleQuickSearch} role="search" className="relative hidden max-w-md flex-1 md:block">
              <Search aria-hidden="true" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input type="search" aria-label="Cari employee" placeholder="Cari employee..." value={quickSearch} onChange={(event) => setQuickSearch(event.target.value)} className="min-h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
            </form>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button type="button" className="relative grid size-10 place-items-center rounded-xl border border-border text-ink-muted hover:bg-primary-soft hover:text-primary" aria-label="Notifikasi admin">
                <Bell aria-hidden="true" size={19} /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-danger" />
              </button>
              <NavLink to="/admin/profile" className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-primary-soft">
                <Avatar name={displayName} size="sm" />
                <div className="hidden max-w-40 sm:block">
                  <p className="truncate text-xs font-semibold text-primary-dark">{displayName}</p>
                  <p className="text-[10px] text-ink-muted">Administrator</p>
                </div>
              </NavLink>
            </div>
          </div>
        </header>
        <main id="main-content" tabIndex="-1" className="px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8"><Outlet /></main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-primary-dark/45 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-label="Tutup menu admin" />
          <aside className="relative flex h-full w-[84%] max-w-xs flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between"><Brand /><button type="button" onClick={() => setMobileMenuOpen(false)} className="grid size-10 place-items-center rounded-xl text-ink-muted hover:bg-primary-soft" aria-label="Tutup"><X aria-hidden="true" size={21} /></button></div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary-soft p-4"><Avatar name={displayName} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-primary-dark">{displayName}</p><p className="truncate text-xs text-ink-muted">{user?.email}</p></div></div>
            <nav className="mt-6 flex-1 space-y-1.5" aria-label="Menu admin">{navigation.map((item) => <NavItem key={item.to} item={item} onNavigate={() => setMobileMenuOpen(false)} />)}</nav>
            <Button variant="ghost" className="w-full justify-start text-danger hover:bg-danger-light hover:text-danger" onClick={() => setLogoutOpen(true)}><LogOut aria-hidden="true" size={18} /> Logout</Button>
          </aside>
        </div>
      )}

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={handleLogout} title="Keluar dari aplikasi?" message="Sesi admin Anda akan diakhiri dan Anda perlu login kembali untuk mengakses dashboard." confirmLabel="Logout" />
    </div>
  );
}
