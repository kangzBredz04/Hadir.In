import { LocateFixed, MapPinCheck, Navigation, RefreshCw, TriangleAlert } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function LocationPermissionCard({
  latitude,
  longitude,
  accuracy,
  loading,
  error,
  onRetry,
}) {
  const found = latitude !== null && longitude !== null;
  const hasAccuracy = accuracy !== null && accuracy !== undefined && accuracy !== '' && Number.isFinite(Number(accuracy));

  return (
    <section className={`rounded-card border p-4 shadow-soft sm:p-5 ${
      error ? 'border-danger/20 bg-danger-light' : found ? 'border-success/20 bg-success-light' : 'border-border bg-white'
    }`}>
      <div className="flex items-start gap-3">
        <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
          error ? 'bg-white text-danger' : found ? 'bg-white text-success' : 'bg-primary-light text-primary'
        }`}>
          {loading ? <Spinner size="sm" /> : error ? <TriangleAlert aria-hidden="true" size={22} /> : found ? <MapPinCheck aria-hidden="true" size={22} /> : <LocateFixed aria-hidden="true" size={22} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted">Lokasi perangkat</p>
          <h2 className="mt-1 text-sm font-bold text-primary-dark">
            {loading ? 'Mencari lokasi...' : error ? 'Lokasi tidak tersedia' : found ? 'Lokasi ditemukan' : 'Lokasi belum diperiksa'}
          </h2>
          {error && <p className="mt-2 text-xs leading-5 text-danger">{error.message}</p>}
          {found && !error && (
            <div className="mt-2 space-y-1 text-xs text-ink-muted">
              <p className="flex items-center gap-1.5"><Navigation aria-hidden="true" size={14} /> {latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
              {hasAccuracy && <p>Akurasi GPS sekitar ±{Math.round(Number(accuracy))} meter</p>}
            </div>
          )}
        </div>
      </div>

      {!loading && (error || !found) && (
        <Button variant="secondary" className="mt-4 w-full" onClick={onRetry}>
          <RefreshCw aria-hidden="true" size={17} /> Coba Dapatkan Lokasi
        </Button>
      )}
    </section>
  );
}
