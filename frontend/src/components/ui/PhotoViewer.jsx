import { ExternalLink, ImageOff, Maximize2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function PhotoViewer({ src, alt, label }) {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const triggerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab') return;
      const focusable = viewerRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    const focusFrame = requestAnimationFrame(() => viewerRef.current?.querySelector('[data-close-viewer]')?.focus());

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  if (!src || imageError) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-border bg-background text-center">
        <div>
          <ImageOff aria-hidden="true" size={25} className="mx-auto text-ink-muted" />
          <p className="mt-2 text-xs font-medium text-ink-muted">{label || 'Foto belum tersedia'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
        aria-label={`Perbesar ${label || alt}`}
      >
        <img src={src} alt={alt} onError={() => setImageError(true)} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-xl bg-primary-dark/75 text-white backdrop-blur">
          <Maximize2 aria-hidden="true" size={18} />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-primary-dark/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={label || alt}>
          <button type="button" tabIndex="-1" className="absolute inset-0" onClick={() => setOpen(false)} aria-label="Tutup foto" />
          <div ref={viewerRef} className="relative z-10 max-h-[90vh] max-w-5xl">
            <img src={src} alt={alt} className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl" />
            <div className="mt-3 flex items-center justify-between gap-3 text-white">
              <p className="text-sm font-medium">{label || alt}</p>
              <div className="flex items-center gap-2">
                <a href={src} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-xl bg-white/10 hover:bg-white/20" aria-label="Buka foto di tab baru"><ExternalLink aria-hidden="true" size={18} /></a>
                <button type="button" data-close-viewer onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-xl bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30" aria-label="Tutup foto"><X aria-hidden="true" size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
