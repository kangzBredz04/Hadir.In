import { Camera, Check, LoaderCircle, MapPin, Send, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import AttendanceCard from '../../components/attendance/AttendanceCard.jsx';
import AttendanceResult from '../../components/attendance/AttendanceResult.jsx';
import AttendanceStatusBadge from '../../components/attendance/AttendanceStatusBadge.jsx';
import CameraCapture from '../../components/attendance/CameraCapture.jsx';
import LocationPermissionCard from '../../components/attendance/LocationPermissionCard.jsx';
import LocationStatus from '../../components/attendance/LocationStatus.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import useAttendance from '../../hooks/useAttendance.js';
import useAuth from '../../hooks/useAuth.js';
import useCamera from '../../hooks/useCamera.js';
import useGeolocation from '../../hooks/useGeolocation.js';
import { handleApiError } from '../../utils/errorHandler.js';
import { dataUrlToFile } from '../../utils/file.js';
import { calculateDistanceMeters } from '../../utils/geolocation.js';

const steps = [
  { number: 1, icon: MapPin, title: 'Lokasi', description: 'GPS dan koordinat ditemukan.' },
  { number: 2, icon: Camera, title: 'Selfie', description: 'Ambil foto wajah terbaru.' },
  { number: 3, icon: Check, title: 'Konfirmasi', description: 'Kirim foto dan lokasi.' },
];

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export default function EmployeeAttendance() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    attendance,
    loading,
    error,
    refetch,
    submitting,
    submitAttendance,
  } = useAttendance();
  const camera = useCamera();
  const geolocation = useGeolocation({ auto: true });
  const [result, setResult] = useState(null);

  const completed = Boolean(attendance?.checkIn && attendance?.checkOut);
  const actionType = attendance?.checkIn ? 'check-out' : 'check-in';
  const actionLabel = actionType === 'check-out' ? 'Check Out' : 'Check In';
  const office = attendance?.office ?? user?.office ?? user?.officeAssignment?.office ?? user?.office_assignment?.office;
  const officeLatitude = numberOrNull(office?.latitude);
  const officeLongitude = numberOrNull(office?.longitude);
  const allowedRadius = numberOrNull(
    office?.radiusMeter ??
      office?.radius_meter ??
      office?.radiusMeters ??
      office?.radius_meters ??
      attendance?.allowedRadius,
  );
  const currentDistance = useMemo(
    () => calculateDistanceMeters(
      geolocation.latitude,
      geolocation.longitude,
      officeLatitude,
      officeLongitude,
    ),
    [geolocation.latitude, geolocation.longitude, officeLatitude, officeLongitude],
  );
  const isWithinRadius = currentDistance !== null && allowedRadius !== null
    ? currentDistance <= allowedRadius
    : null;
  const locationReady = geolocation.latitude !== null && geolocation.longitude !== null;
  const readyToSubmit = locationReady && Boolean(camera.preview) && !submitting && !completed;

  async function handleSubmit() {
    if (!readyToSubmit) return;

    try {
      const photo = await dataUrlToFile(
        camera.preview,
        `selfie-${actionType}-${Date.now()}.jpg`,
      );
      const submission = await submitAttendance({
        type: actionType,
        photo,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
      });
      const recorded = submission.attendance;
      const responseData = submission.response.data ?? {};
      const recordedTime = actionType === 'check-out' ? recorded?.checkOut : recorded?.checkIn;

      camera.reset();
      setResult({
        type: 'success',
        title: `${actionLabel} berhasil`,
        message: submission.response.message,
        time: recordedTime ?? responseData.time ?? responseData.timestamp,
        distance: numberOrNull(responseData.distance ?? recorded?.distance ?? currentDistance),
      });
      showToast(`${actionLabel} berhasil.`);
    } catch (requestError) {
      const rejectedDistance = numberOrNull(requestError?.data?.distance);
      const rejectedRadius = numberOrNull(requestError?.data?.allowedRadius);
      const outsideRadius =
        rejectedDistance !== null ||
        rejectedRadius !== null ||
        String(requestError?.message || '').toLowerCase().includes('luar jangkauan');

      setResult(
        outsideRadius
          ? {
              type: 'outside-radius',
              title: 'Anda berada di luar jangkauan kantor',
              message: 'Pindah ke dalam radius kantor, perbarui lokasi, lalu coba kembali.',
              distance: rejectedDistance,
              allowedRadius: rejectedRadius,
            }
          : {
              type: 'error',
              title: 'Absensi belum berhasil',
              message: handleApiError(requestError, 'Foto dan lokasi belum dapat dikirim. Silakan coba lagi.'),
            },
      );
      showToast(outsideRadius ? 'Absensi ditolak karena berada di luar jangkauan kantor.' : 'Absensi belum berhasil dikirim.', 'error');
    }
  }

  function closeResult() {
    setResult(null);
    if (result?.type !== 'success') geolocation.getLocation();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Employee attendance"
        title="Absensi"
        description="Ambil selfie dan lokasi terkini. Validasi radius akhir tetap dilakukan oleh backend."
        action={!loading && !error ? <AttendanceStatusBadge status={attendance?.status} /> : null}
      />

      {loading && <Skeleton className="h-96" />}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && result && (
        <AttendanceResult result={result} onClose={closeResult} />
      )}

      {!loading && !error && !result && completed && (
        <Card className="overflow-hidden">
          <div className="bg-success-light p-7 text-center sm:p-10">
            <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-white text-success shadow-soft"><ShieldCheck aria-hidden="true" size={30} /></span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-success">Absensi lengkap</p>
            <h2 className="mt-2 text-2xl font-bold text-primary-dark">Terima kasih, kehadiran Anda sudah tercatat</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-muted">Check-in dan check-out hari ini telah tersimpan. Anda tidak perlu melakukan absensi lagi.</p>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
            <AttendanceCard type="check-in" time={attendance?.checkIn} />
            <AttendanceCard type="check-out" time={attendance?.checkOut} />
          </div>
        </Card>
      )}

      {!loading && !error && !result && !completed && (
        <>
          <Card className="p-4 sm:p-5">
            <div className="grid gap-3 md:grid-cols-3">
              {steps.map(({ number, icon: Icon, title, description }) => {
                const done = number === 1 ? locationReady : number === 2 ? Boolean(camera.preview) : readyToSubmit;
                return (
                  <div key={number} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${done ? 'border-success/20 bg-success-light' : 'border-border bg-white'}`}>
                    <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${done ? 'bg-white text-success' : 'bg-primary-light text-primary'}`}><Icon aria-hidden="true" size={19} /></span>
                    <div><p className="text-xs font-bold text-ink-muted">Langkah {number}</p><p className="mt-0.5 text-sm font-semibold text-primary-dark">{title}</p><p className="mt-0.5 text-[11px] text-ink-muted">{description}</p></div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
            <div className="space-y-4">
              <LocationPermissionCard
                latitude={geolocation.latitude}
                longitude={geolocation.longitude}
                accuracy={geolocation.accuracy}
                loading={geolocation.loading}
                error={geolocation.error}
                onRetry={geolocation.getLocation}
              />
              <LocationStatus
                distance={currentDistance}
                allowedRadius={allowedRadius}
                isWithinRadius={isWithinRadius}
              />
              <div className="rounded-2xl border border-warning/15 bg-warning-light p-4 text-xs leading-5 text-warning">
                <strong>Catatan:</strong> Informasi jarak pada halaman ini hanya perkiraan untuk membantu Anda. Backend akan menghitung ulang jarak saat absensi dikirim.
              </div>
            </div>

            <CameraCapture
              preview={camera.preview}
              error={camera.error}
              ready={camera.ready}
              onCapture={camera.capture}
              onRetake={camera.retake}
              onReady={camera.handleReady}
              onError={camera.handleError}
            />
          </div>

          <Card className="sticky bottom-24 z-20 p-4 shadow-card lg:bottom-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Konfirmasi {actionLabel}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {!locationReady
                    ? 'Lokasi belum ditemukan.'
                    : !camera.preview
                      ? 'Ambil selfie terlebih dahulu.'
                      : 'Foto dan lokasi siap dikirim.'}
                </p>
              </div>
              <Button className="min-w-52" disabled={!readyToSubmit} onClick={handleSubmit}>
                {submitting ? (
                  <><LoaderCircle aria-hidden="true" size={19} className="animate-spin" /> Mengirim absensi...</>
                ) : (
                  <><Send aria-hidden="true" size={18} /> Gunakan & {actionLabel}</>
                )}
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
