import { CircleCheck, MapPin, Navigation, TriangleAlert } from 'lucide-react';

export default function LocationStatus({ distance, allowedRadius, isWithinRadius }) {
  const hasDistance = distance !== null && distance !== undefined && distance !== '' && Number.isFinite(Number(distance));
  const hasAllowedRadius = allowedRadius !== null && allowedRadius !== undefined && allowedRadius !== '' && Number.isFinite(Number(allowedRadius));
  const withinRange = hasDistance ? isWithinRadius !== false : null;

  return (
    <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
          withinRange === true
            ? 'bg-success-light text-success'
            : withinRange === false
              ? 'bg-danger-light text-danger'
              : 'bg-primary-light text-primary'
        }`}>
          <MapPin aria-hidden="true" size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink-muted">Jarak dari kantor</p>
          <p className="mt-1 text-lg font-bold text-primary-dark">
            {hasDistance ? `${Math.round(Number(distance))} meter` : 'Belum tersedia'}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
            {withinRange === true && (
              <><CircleCheck aria-hidden="true" size={16} className="text-success" /><span className="text-success">Dalam jangkauan kantor</span></>
            )}
            {withinRange === false && (
              <><TriangleAlert aria-hidden="true" size={16} className="text-danger" /><span className="text-danger">Di luar jangkauan kantor</span></>
            )}
            {withinRange === null && (
              <><Navigation aria-hidden="true" size={16} className="text-ink-muted" /><span className="text-ink-muted">Lokasi belum diperiksa</span></>
            )}
          </div>
        </div>
        {hasAllowedRadius && (
          <span className="rounded-lg bg-background px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
            Maks. {Math.round(Number(allowedRadius))} m
          </span>
        )}
      </div>
    </div>
  );
}
