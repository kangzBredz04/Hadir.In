import { RefreshCw, TriangleAlert } from 'lucide-react';
import Button from './Button.jsx';

export default function ErrorState({
  title = 'Data belum dapat dimuat',
  message = 'Terjadi kendala saat mengambil data.',
  onRetry,
  compact = false,
}) {
  return (
    <div className={`rounded-card border border-danger/15 bg-danger-light text-center ${compact ? 'p-5' : 'p-8'}`}>
      <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-white text-danger shadow-soft">
        <TriangleAlert aria-hidden="true" size={22} />
      </span>
      <h3 className="mt-4 font-semibold text-primary-dark">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          <RefreshCw aria-hidden="true" size={17} /> Coba lagi
        </Button>
      )}
    </div>
  );
}
