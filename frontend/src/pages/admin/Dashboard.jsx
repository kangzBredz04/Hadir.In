import { ArrowRight, CalendarCheck2, Clock3, UserMinus, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { getAdminAttendance, getAdminAttendanceSummary } from '../../services/attendance.service.js';
import { handleApiError } from '../../utils/errorHandler.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatTime } from '../../utils/formatTime.js';

const stats = [
  { key: 'totalEmployee', label: 'Total Employee', icon: Users, tone: 'bg-primary-light text-primary' },
  { key: 'present', label: 'Hadir Hari Ini', icon: CalendarCheck2, tone: 'bg-success-light text-success' },
  { key: 'late', label: 'Terlambat', icon: Clock3, tone: 'bg-warning-light text-warning' },
  { key: 'notCheckedIn', label: 'Belum Absen', icon: UserMinus, tone: 'bg-danger-light text-danger' },
];

export default function AdminDashboard() {
  const [data, setData] = useState({ summary: null, recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [summary, attendance] = await Promise.all([
        getAdminAttendanceSummary(),
        getAdminAttendance({ page: 1, limit: 5 }),
      ]);
      setData({ summary, recent: attendance.items });
    } catch (requestError) {
      setError(handleApiError(requestError, 'Dashboard admin belum dapat dimuat.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(loadData);
    return () => cancelAnimationFrame(frame);
  }, [loadData]);

  if (loading) return <div className="space-y-6"><Skeleton className="h-24" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((item) => <Skeleton key={item.key} className="h-36" />)}</div><Skeleton className="h-80" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive overview" title="Dashboard Admin" description={`Ringkasan operasional kehadiran pada ${formatDate()}.`} />
      {error ? <ErrorState message={error} onRetry={loadData} /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Statistik absensi">
            {stats.map(({ key, label, icon: Icon, tone }) => (
              <Card key={key} className="p-5">
                <div className="flex items-start justify-between"><span className={`grid size-11 place-items-center rounded-2xl ${tone}`}><Icon aria-hidden="true" size={22} /></span><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Hari ini</span></div>
                <p className="mt-5 text-3xl font-bold text-primary-dark">{data.summary?.[key] ?? 0}</p>
                <p className="mt-1 text-sm font-medium text-ink-muted">{label}</p>
              </Card>
            ))}
          </section>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Monitoring</p><h2 className="mt-1 font-bold text-primary-dark">Absensi Terbaru</h2></div><Link to="/admin/attendance" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">Lihat semua <ArrowRight aria-hidden="true" size={16} /></Link></div>
            {data.recent.length === 0 ? <p className="p-8 text-center text-sm text-ink-muted">Belum ada data absensi terbaru.</p> : (
              <div className="divide-y divide-border">
                {data.recent.map((item) => (
                  <Link key={item.id} to={`/admin/attendance/${item.id}`} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-primary-soft/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-primary-dark">{item.user?.name ?? 'Employee'}</p><p className="mt-1 text-xs text-ink-muted">{item.user?.employeeId ?? '-'} · {item.office?.name ?? 'Kantor belum tersedia'}</p></div>
                    <div className="flex items-center justify-between gap-5 sm:justify-end"><div className="text-left sm:text-right"><p className="text-xs font-semibold text-primary-dark">{formatTime(item.checkInTime)}</p><p className="text-[10px] text-ink-muted">Check In</p></div><AttendanceStatusBadge status={item.status} /></div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
