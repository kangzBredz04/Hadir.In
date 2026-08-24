import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';

export default function Modal({ open, onClose, title, description, children, size = 'lg' }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    function handleKeyDown(event) {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    const focusFrame = requestAnimationFrame(() => dialogRef.current?.querySelector('button, input, select, textarea, a[href]')?.focus());
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [open]);

  if (!open) return null;
  const widths = { sm: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}>
      <button type="button" tabIndex="-1" className="absolute inset-0 bg-primary-dark/55 backdrop-blur-sm" onClick={onClose} aria-label="Tutup modal" />
      <section ref={dialogRef} className={`relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[1.5rem] bg-white shadow-2xl sm:rounded-[1.5rem] ${widths[size] ?? widths.lg}`}>
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-primary-dark">{title}</h2>
            {description && <p id={descriptionId} className="mt-1 text-xs leading-5 text-ink-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-xl text-ink-muted transition hover:bg-primary-soft" aria-label="Tutup">
            <X aria-hidden="true" size={21} />
          </button>
        </header>
        <div className="p-5 sm:p-6">{children}</div>
      </section>
    </div>
  );
}
