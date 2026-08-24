import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/login': 'Login',
  '/employee/dashboard': 'Dashboard Employee',
  '/employee/attendance': 'Absensi',
  '/employee/history': 'Riwayat Absensi',
  '/employee/profile': 'Profil Employee',
  '/admin/dashboard': 'Dashboard Admin',
  '/admin/employees': 'Employees',
  '/admin/offices': 'Offices',
  '/admin/attendance': 'Attendance',
  '/admin/reports': 'Reports',
  '/admin/profile': 'Profil Admin',
};

function getTitle(pathname) {
  if (/^\/employee\/history\/.+/.test(pathname)) return 'Detail Absensi';
  if (/^\/admin\/employees\/.+/.test(pathname)) return 'Detail Employee';
  if (/^\/admin\/offices\/.+/.test(pathname)) return 'Detail Office';
  if (/^\/admin\/attendance\/.+/.test(pathname)) return 'Detail Attendance';
  return titles[pathname] ?? 'Hadir.In';
}

export default function RouteEffects() {
  const { pathname } = useLocation();
  const title = getTitle(pathname);

  useEffect(() => {
    document.title = title === 'Hadir.In' ? title : `${title} · Hadir.In`;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, title]);

  return <span className="sr-only" aria-live="polite" aria-atomic="true">Halaman {title}</span>;
}
