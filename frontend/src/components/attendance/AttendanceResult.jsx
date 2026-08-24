import { CheckCircle2, MapPinOff, RefreshCw, XCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { formatTime } from '../../utils/formatTime.js';

function hasNumber(value) {
  return value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));
}

export default function AttendanceResult({ result, onClose }) {
  const success = result.type === 'success';
  const outsideRadius = result.type === 'outside-radius';
  const Icon = success ? CheckCircle2 : outsideRadius ? MapPinOff : XCircle;

  return (
    <section className={`overflow-hidden rounded-card border bg-white shadow-card ${
      success ? 'border-success/20' : 'border-danger/20'
    }`} role="status" aria-live="polite">
      <div className={`p-6 text-center sm:p-9 ${success ? 'bg-success-light' : 'bg-danger-light'}`}>
        <span className={`mx-auto grid size-16 place-items-center rounded-3xl bg-white shadow-soft ${success ? 'text-success' : 'text-danger'}`}>
          <Icon aria-hidden="true" size={31} />
        </span>
        <p className={`mt-5 text-xs font-semibold uppercase tracking-[0.17em] ${success ? 'text-success' : 'text-danger'}`}>
          {success ? 'Absensi tersimpan' : 'Absensi ditolak'}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-primary-dark">{result.title}</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-muted">{result.message}</p>
      </div>

      <div className="p-5 sm:p-7">
        {(success || outsideRadius) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {success && (
              <div className="rounded-2xl bg-background p-4 text-center">
                <p className="text-xs text-ink-muted">Waktu</p>
                <p className="mt-1 text-xl font-bold text-primary-dark">{formatTime(result.time)}</p>
              </div>
            )}
            {hasNumber(result.distance) && (
              <div className="rounded-2xl bg-background p-4 text-center">
                <p className="text-xs text-ink-muted">Jarak Anda</p>
                <p className="mt-1 text-xl font-bold text-primary-dark">{Math.round(Number(result.distance))} m</p>
              </div>
            )}
            {outsideRadius && hasNumber(result.allowedRadius) && (
              <div className="rounded-2xl bg-background p-4 text-center">
                <p className="text-xs text-ink-muted">Jarak maksimal</p>
                <p className="mt-1 text-xl font-bold text-primary-dark">{Math.round(Number(result.allowedRadius))} m</p>
              </div>
            )}
          </div>
        )}

        <Button className="mt-5 w-full" variant={success ? 'primary' : 'secondary'} onClick={onClose}>
          {success ? <CheckCircle2 aria-hidden="true" size={18} /> : <RefreshCw aria-hidden="true" size={18} />}
          {success ? 'Selesai' : 'Periksa dan coba lagi'}
        </Button>
      </div>
    </section>
  );
}
