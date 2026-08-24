import { ChevronLeft, ChevronRight } from 'lucide-react';

function getVisiblePages(currentPage, totalPages) {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function Pagination({ currentPage, totalPages, total, onPageChange }) {
  if (totalPages <= 1) {
    return total > 0 ? <p className="text-xs text-ink-muted">Total {total} data</p> : null;
  }

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Pagination">
      <p className="text-xs text-ink-muted">Halaman {currentPage} dari {totalPages} · Total {total} data</p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="grid size-10 place-items-center rounded-xl border border-border bg-white text-ink-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft aria-hidden="true" size={18} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`grid size-10 place-items-center rounded-xl text-xs font-semibold transition ${
              page === currentPage
                ? 'bg-primary text-white'
                : 'border border-border bg-white text-ink-muted hover:border-primary/30 hover:text-primary'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="grid size-10 place-items-center rounded-xl border border-border bg-white text-ink-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>
    </nav>
  );
}
