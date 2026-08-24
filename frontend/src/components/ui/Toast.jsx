import { CheckCircle2, X, XCircle } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const showToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current.slice(-2), { id, message, type }]);
    const timer = window.setTimeout(() => {
      dismiss(id);
      timers.current.delete(id);
    }, 4000);
    timers.current.set(id, timer);
  }, [dismiss]);
  const value = useMemo(() => ({ showToast }), [showToast]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  function closeToast(id) {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    dismiss(id);
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[120] w-[calc(100%-2rem)] max-w-sm space-y-2">
        {toasts.map((toast) => {
          const Icon = toast.type === 'error' ? XCircle : CheckCircle2;
          return (
            <div key={toast.id} role={toast.type === 'error' ? 'alert' : 'status'} aria-live={toast.type === 'error' ? 'assertive' : 'polite'} className={`toast-enter flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-card ${toast.type === 'error' ? 'border-danger/20' : 'border-success/20'}`}>
              <Icon aria-hidden="true" size={20} className={toast.type === 'error' ? 'mt-0.5 text-danger' : 'mt-0.5 text-success'} />
              <p className="flex-1 text-sm font-medium text-primary-dark">{toast.message}</p>
              <button type="button" onClick={() => closeToast(toast.id)} aria-label="Tutup notifikasi" className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-background focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"><X aria-hidden="true" size={18} /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast harus digunakan di dalam ToastProvider.');
  return context;
}
