import Brand from '../layout/Brand.jsx';
import Spinner from './Spinner.jsx';

export default function FullPageLoader({ label = 'Memuat sesi...' }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="text-center" role="status" aria-live="polite">
        <Brand />
        <div className="mt-7 flex items-center justify-center gap-3 text-sm font-medium text-ink-muted">
          <Spinner className="text-primary" />
          <span>{label}</span>
        </div>
      </div>
    </main>
  );
}
