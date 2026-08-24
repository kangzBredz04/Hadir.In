import { LogIn, LogOut } from 'lucide-react';
import { formatTime } from '../../utils/formatTime.js';

export default function AttendanceCard({ type, time, subtitle }) {
  const isCheckIn = type === 'check-in';
  const Icon = isCheckIn ? LogIn : LogOut;

  return (
    <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`grid size-10 place-items-center rounded-xl ${isCheckIn ? 'bg-primary-light text-primary' : 'bg-warning-light text-warning'}`}>
          <Icon aria-hidden="true" size={20} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          {isCheckIn ? 'Masuk' : 'Pulang'}
        </span>
      </div>
      <p className="mt-5 text-xs text-ink-muted">{isCheckIn ? 'Check In' : 'Check Out'}</p>
      <p className="mt-1 text-xl font-bold text-primary-dark">
        {time ? formatTime(time) : isCheckIn ? 'Belum check in' : 'Belum check out'}
      </p>
      {subtitle && <p className="mt-2 text-xs text-ink-muted">{subtitle}</p>}
    </div>
  );
}
