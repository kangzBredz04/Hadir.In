import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Brand from '../components/layout/Brand.jsx';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-center">
      <div>
        <Brand />
        <p className="mt-10 text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold text-primary-dark">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm text-ink-muted">Alamat yang Anda buka belum tersedia.</p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <ArrowLeft aria-hidden="true" size={18} /> Kembali
        </Link>
      </div>
    </main>
  );
}
