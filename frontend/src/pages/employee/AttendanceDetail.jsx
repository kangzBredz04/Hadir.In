import { ArrowLeft, Building2, CalendarDays, Clock3, ExternalLink, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import PhotoViewer from '../../components/ui/PhotoViewer.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { getAttendanceHistory } from '../../services/attendance.service.js';
import { handleApiError } from '../../utils/errorHandler.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatTime } from '../../utils/formatTime.js';

function hasValue(value) {
  return value !== null && value !== undefined && value !== '';
}

function formatCoordinate(value) {
  return hasValue(value) ? Number(value).toFixed(6) : '-';
}

function formatDistance(value) {
  return hasValue(value) ? `${Math.round(Number(value))} meter` : '-';
}

function getOffice(attendance) {
  const office = attendance?.office ?? {};
  return {
    name: office.name ?? office.officeName ?? office.office_name ?? 'Kantor tidak tersedia',
    address: office.address ?? office.alamat ?? '-',
  };
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary">
        <Icon aria-hidden="true" size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-primary-dark">{value}</p>
      </div>
    </div>
  );
}

function LocationLink({ latitude, longitude }) {
  if (!hasValue(latitude) || !hasValue(longitude)) return null;
  const href = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/20 bg-primary-light px-4 text-sm font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
    >
      <ExternalLink aria-hidden="true" size={17} /> Buka lokasi di peta
    </a>
  );
}

function AttendanceMoment({ title, accent, time, latitude, longitude, distance, photoUrl, emptyMessage }) {
  const hasAttendance = Boolean(time);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className={`grid size-11 place-items-center rounded-2xl ${accent}`}>
          <Clock3 aria-hidden="true" size={21} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Catatan waktu</p>
          <h2 className="mt-0.5 font-bold text-primary-dark">{title}</h2>
        </div>
      </div>

      {!hasAttendance ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-6 text-center">
          <p className="text-sm font-semibold text-primary-dark">{emptyMessage}</p>
          <p className="mt-1 text-xs text-ink-muted">Data akan tersedia setelah absensi berhasil dicatat.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_.72fr]">
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem icon={Clock3} label="Waktu" value={formatTime(time)} />
              <DetailItem icon={MapPin} label="Jarak dari kantor" value={formatDistance(distance)} />
              <DetailItem icon={MapPin} label="Latitude" value={formatCoordinate(latitude)} />
              <DetailItem icon={MapPin} label="Longitude" value={formatCoordinate(longitude)} />
            </div>
            <LocationLink latitude={latitude} longitude={longitude} />
          </div>
          <PhotoViewer src={photoUrl} alt={`Foto ${title.toLowerCase()}`} label={`Bukti foto ${title}`} />
        </div>
      )}
    </Card>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5" aria-label="Memuat detail absensi">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function EmployeeAttendanceDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');
  const stateAttendance = location.state?.attendance;
  const initialAttendance = String(stateAttendance?.id) === String(id) ? stateAttendance : null;
  const [attendance, setAttendance] = useState(initialAttendance);
  const [loading, setLoading] = useState(Boolean(!initialAttendance && date));
  const [error, setError] = useState(
    !initialAttendance && !date ? 'Buka detail dari halaman riwayat agar data dapat ditemukan.' : '',
  );
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (attendance || !date) return undefined;
    let active = true;

    getAttendanceHistory({ page: 1, limit: 100, startDate: date, endDate: date })
      .then(({ items }) => {
        if (!active) return;
        const match = items.find((item) => String(item.id) === String(id));
        if (!match) throw new Error('NOT_FOUND');
        setAttendance(match);
      })
      .catch((requestError) => {
        if (!active) return;
        const message = requestError?.message === 'NOT_FOUND'
          ? 'Catatan absensi tidak ditemukan pada tanggal tersebut.'
          : handleApiError(requestError, 'Detail absensi belum dapat dimuat.');
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [attendance, date, id, retryKey]);

  function retry() {
    setError('');
    setLoading(true);
    setRetryKey((current) => current + 1);
  }

  if (loading) return <DetailSkeleton />;

  if (error || !attendance) {
    return (
      <div className="space-y-5">
        <Link to="/employee/history" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">
          <ArrowLeft aria-hidden="true" size={18} /> Kembali ke riwayat
        </Link>
        <ErrorState
          title="Detail tidak tersedia"
          message={error || 'Buka detail dari halaman riwayat agar data dapat ditemukan.'}
          onRetry={date ? retry : undefined}
        />
      </div>
    );
  }

  const office = getOffice(attendance);

  return (
    <div className="space-y-6">
      <Link to="/employee/history" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">
        <ArrowLeft aria-hidden="true" size={18} /> Kembali ke riwayat
      </Link>
      <PageHeader
        eyebrow="Detail kehadiran"
        title="Detail Absensi"
        description="Informasi waktu, lokasi, jarak, dan bukti foto absensi."
      />

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Ringkasan</p>
            <h2 className="mt-2 text-xl font-bold text-primary-dark">
              {formatDate(attendance.date)}
            </h2>
          </div>
          <AttendanceStatusBadge status={attendance.status} />
        </div>
        <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
          <DetailItem icon={Building2} label="Kantor" value={office.name} />
          <DetailItem icon={CalendarDays} label="Alamat kantor" value={office.address} />
        </div>
      </Card>

      <AttendanceMoment
        title="Check In"
        accent="bg-success-light text-success"
        time={attendance.checkInTime}
        latitude={attendance.checkInLatitude}
        longitude={attendance.checkInLongitude}
        distance={attendance.checkInDistance}
        photoUrl={attendance.checkInPhotoUrl}
        emptyMessage="Belum check in"
      />

      <AttendanceMoment
        title="Check Out"
        accent="bg-warning-light text-warning"
        time={attendance.checkOutTime}
        latitude={attendance.checkOutLatitude}
        longitude={attendance.checkOutLongitude}
        distance={attendance.checkOutDistance}
        photoUrl={attendance.checkOutPhotoUrl}
        emptyMessage="Belum check out"
      />
    </div>
  );
}
