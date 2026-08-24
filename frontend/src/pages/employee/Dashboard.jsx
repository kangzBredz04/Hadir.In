import { ArrowRight, CalendarDays, ClipboardCheck, History, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';
import AttendanceCard from '../../components/attendance/AttendanceCard.jsx';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge.jsx';
import LocationStatus from '../../components/attendance/LocationStatus.jsx';
import Card from '../../components/ui/Card.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import useAttendance from '../../hooks/useAttendance.js';
import useAuth from '../../hooks/useAuth.js';
import { formatDate } from '../../utils/formatDate.js';

function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    }).format(new Date()),
  );

  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-52 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40 sm:col-span-2 lg:col-span-1" />
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { attendance, loading, error, refetch } = useAttendance();
  const displayName = user?.name || user?.fullName || 'Wahyu';
  const firstName = displayName.split(' ')[0];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary-dark via-primary to-[#0D83C1] p-5 text-white shadow-card sm:p-7">
        <div className="absolute -right-10 -top-14 size-48 rounded-full border-[28px] border-white/5" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium text-blue-100">
              <CalendarDays aria-hidden="true" size={16} /> {formatDate()}
            </p>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{getGreeting()}, {firstName} 👋</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50/90">
              Pastikan lokasi dan foto Anda siap sebelum mencatat kehadiran hari ini.
            </p>
          </div>
          <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:w-auto sm:min-w-60">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-blue-100">Status absensi</p>
                <p className="mt-1 font-semibold">Hari ini</p>
              </div>
              <AttendanceStatusBadge status={attendance?.status} />
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <>
          <section aria-labelledby="today-title">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Ringkasan</p>
                <h2 id="today-title" className="mt-1 text-xl font-bold text-primary-dark">Kehadiran hari ini</h2>
              </div>
              <Link to="/employee/attendance" className="hidden items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark sm:flex">
                Buka absensi <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[.8fr_.8fr_1.4fr]">
              <AttendanceCard type="check-in" time={attendance?.checkIn} subtitle={attendance?.checkIn ? 'Berhasil tercatat' : 'Belum melakukan absensi'} />
              <AttendanceCard type="check-out" time={attendance?.checkOut} subtitle={attendance?.checkOut ? 'Berhasil tercatat' : 'Menunggu check out'} />
              <LocationStatus distance={attendance?.distance} allowedRadius={attendance?.allowedRadius} isWithinRadius={attendance?.isWithinRadius} />
            </div>
          </section>

          <section aria-labelledby="quick-action-title">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Akses cepat</p>
              <h2 id="quick-action-title" className="mt-1 text-xl font-bold text-primary-dark">Apa yang ingin Anda lakukan?</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link to="/employee/attendance" className="group rounded-card border border-primary/15 bg-primary p-5 text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-dark">
                <span className="grid size-11 place-items-center rounded-2xl bg-white/15"><ClipboardCheck aria-hidden="true" size={22} /></span>
                <h3 className="mt-5 font-semibold">{attendance?.checkIn ? attendance?.checkOut ? 'Absensi selesai' : 'Check Out' : 'Check In'}</h3>
                <p className="mt-2 text-xs leading-5 text-blue-50">Buka halaman utama absensi karyawan.</p>
                <span className="mt-5 flex items-center gap-1.5 text-xs font-semibold">Buka <ArrowRight aria-hidden="true" size={15} className="transition group-hover:translate-x-1" /></span>
              </Link>
              <Link to="/employee/history" className="group rounded-card border border-border bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary-light text-primary"><History aria-hidden="true" size={22} /></span>
                <h3 className="mt-5 font-semibold text-primary-dark">Lihat Riwayat</h3>
                <p className="mt-2 text-xs leading-5 text-ink-muted">Periksa catatan kehadiran sebelumnya.</p>
                <span className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary">Lihat <ArrowRight aria-hidden="true" size={15} className="transition group-hover:translate-x-1" /></span>
              </Link>
              <Card className="p-5 sm:col-span-2 lg:col-span-1">
                <span className="grid size-11 place-items-center rounded-2xl bg-success-light text-success"><MapPinned aria-hidden="true" size={22} /></span>
                <h3 className="mt-5 font-semibold text-primary-dark">Kantor Anda</h3>
                <p className="mt-2 text-sm font-medium text-ink">{attendance?.office?.name || user?.office?.name || 'Belum ditentukan'}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-muted">{attendance?.office?.address || user?.office?.address || 'Hubungi admin jika kantor belum terdaftar.'}</p>
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
