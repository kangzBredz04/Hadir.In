import { CalendarDays, Eye, Filter, History, MapPin, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Input from '../../components/ui/Input.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import useAttendanceHistory from '../../hooks/useAttendanceHistory.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatTime } from '../../utils/formatTime.js';

const PAGE_LIMIT = 10;

function getOfficeName(attendance) {
  return attendance.office?.name ?? attendance.office?.officeName ?? attendance.office?.office_name ?? '-';
}

function getDetailPath(attendance) {
  const date = String(attendance.date ?? '').slice(0, 10);
  return `/employee/history/${attendance.id}${date ? `?date=${date}` : ''}`;
}

function formatDistance(value) {
  return value === null || value === undefined ? '-' : `${Math.round(value)} m`;
}

function HistorySkeleton() {
  return (
    <div className="space-y-3" aria-label="Memuat riwayat absensi">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-28 w-full md:h-16" />
      ))}
    </div>
  );
}

function MobileHistoryCard({ attendance }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-ink-muted">Tanggal</p>
          <p className="mt-1 text-sm font-bold text-primary-dark">
            {formatDate(attendance.date, { weekday: undefined })}
          </p>
        </div>
        <AttendanceStatusBadge status={attendance.status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-background p-3">
        <div>
          <p className="text-[11px] text-ink-muted">Check In</p>
          <p className="mt-1 text-sm font-semibold text-primary-dark">{formatTime(attendance.checkInTime)}</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-muted">Check Out</p>
          <p className="mt-1 text-sm font-semibold text-primary-dark">{formatTime(attendance.checkOutTime)}</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-muted">Jarak check in</p>
          <p className="mt-1 text-sm font-semibold text-primary-dark">{formatDistance(attendance.checkInDistance)}</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-muted">Kantor</p>
          <p className="mt-1 truncate text-sm font-semibold text-primary-dark">{getOfficeName(attendance)}</p>
        </div>
      </div>
      <Link
        to={getDetailPath(attendance)}
        state={{ attendance }}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary-light px-4 text-sm font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        <Eye aria-hidden="true" size={17} /> Lihat detail
      </Link>
    </Card>
  );
}

export default function EmployeeHistory() {
  const [draftFilters, setDraftFilters] = useState({ startDate: '', endDate: '' });
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const [filterError, setFilterError] = useState('');
  const [page, setPage] = useState(1);
  const { items, pagination, loading, error, refetch } = useAttendanceHistory({
    page,
    limit: PAGE_LIMIT,
    ...filters,
  });

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setDraftFilters((current) => ({ ...current, [name]: value }));
    setFilterError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (draftFilters.startDate && draftFilters.endDate && draftFilters.startDate > draftFilters.endDate) {
      setFilterError('Tanggal mulai tidak boleh melebihi tanggal akhir.');
      return;
    }

    setFilters(draftFilters);
    setPage(1);
  }

  function handleReset() {
    const emptyFilters = { startDate: '', endDate: '' };
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
    setFilterError('');
    setPage(1);
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kehadiran employee"
        title="Riwayat Absensi"
        description="Lihat waktu, status, lokasi, dan bukti foto kehadiran Anda."
      />

      <Card className="p-4 sm:p-5">
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <Input
            id="history-start-date"
            name="startDate"
            type="date"
            label="Dari tanggal"
            leadingIcon={CalendarDays}
            value={draftFilters.startDate}
            onChange={handleFilterChange}
          />
          <Input
            id="history-end-date"
            name="endDate"
            type="date"
            label="Sampai tanggal"
            leadingIcon={CalendarDays}
            value={draftFilters.endDate}
            onChange={handleFilterChange}
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 lg:flex-none">
              <Filter aria-hidden="true" size={17} /> Terapkan
            </Button>
            <Button type="button" variant="secondary" className="flex-1 lg:flex-none" onClick={handleReset}>
              <RotateCcw aria-hidden="true" size={17} /> Reset
            </Button>
          </div>
        </form>
        {filterError && <p className="mt-3 text-sm font-medium text-danger" role="alert">{filterError}</p>}
      </Card>

      {loading ? (
        <HistorySkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={History}
          title="Belum ada riwayat absensi"
          message="Catatan check in dan check out Anda akan muncul di halaman ini."
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {items.map((attendance) => <MobileHistoryCard key={attendance.id} attendance={attendance} />)}
          </div>

          <Card className="hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <caption className="sr-only">Riwayat absensi employee</caption>
                <thead className="border-b border-border bg-background text-xs uppercase tracking-wide text-ink-muted">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">Tanggal</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Status</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Check In</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Check Out</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Jarak</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Kantor</th>
                    <th scope="col" className="px-5 py-4 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((attendance) => (
                    <tr key={attendance.id} className="transition hover:bg-primary-soft/50">
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-primary-dark">
                        {formatDate(attendance.date, { weekday: undefined })}
                      </td>
                      <td className="px-5 py-4"><AttendanceStatusBadge status={attendance.status} /></td>
                      <td className="px-5 py-4 font-medium text-ink">{formatTime(attendance.checkInTime)}</td>
                      <td className="px-5 py-4 font-medium text-ink">{formatTime(attendance.checkOutTime)}</td>
                      <td className="px-5 py-4 text-ink-muted">
                        <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" size={15} />{formatDistance(attendance.checkInDistance)}</span>
                      </td>
                      <td className="max-w-52 truncate px-5 py-4 text-ink-muted">{getOfficeName(attendance)}</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={getDetailPath(attendance)}
                          state={{ attendance }}
                          className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 font-semibold text-primary transition hover:bg-primary-light focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                        >
                          <Eye aria-hidden="true" size={17} /> Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
