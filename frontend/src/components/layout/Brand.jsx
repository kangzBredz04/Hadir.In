import { Fingerprint } from 'lucide-react';

export default function Brand({ compact = false }) {
  return (
    <div className="inline-flex items-center gap-3" aria-label="Hadir.In">
      <span className="grid size-11 place-items-center rounded-2xl bg-primary text-white shadow-soft">
        <Fingerprint aria-hidden="true" size={24} />
      </span>
      {!compact && (
        <span>
          <span className="block text-lg font-bold leading-none text-primary-dark">Hadir.In</span>
          <span className="mt-1 block text-[11px] font-medium tracking-wide text-ink-muted">
            Absensi lebih mudah
          </span>
        </span>
      )}
    </div>
  );
}
