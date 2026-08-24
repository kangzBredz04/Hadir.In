import { Component } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import Brand from '../layout/Brand.jsx';

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-background px-4 py-10 text-center">
        <div className="w-full max-w-md rounded-card border border-danger/15 bg-white p-7 shadow-card sm:p-9">
          <div className="flex justify-center"><Brand /></div>
          <span className="mx-auto mt-8 grid size-14 place-items-center rounded-2xl bg-danger-light text-danger"><TriangleAlert aria-hidden="true" size={27} /></span>
          <h1 className="mt-5 text-xl font-bold text-primary-dark">Aplikasi mengalami kendala</h1>
          <p className="mt-2 text-sm leading-6 text-ink-muted">Muat ulang halaman untuk memulihkan aplikasi. Data yang sudah tersimpan di backend tidak akan terhapus.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30">
            <RefreshCw aria-hidden="true" size={18} /> Muat ulang aplikasi
          </button>
        </div>
      </main>
    );
  }
}
