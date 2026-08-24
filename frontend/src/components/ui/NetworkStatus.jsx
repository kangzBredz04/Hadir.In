import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NetworkStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    function handleOnline() { setOnline(true); }
    function handleOffline() { setOnline(false); }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed inset-x-3 top-3 z-[150] mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl border border-warning/20 bg-warning-light px-4 py-3 text-sm font-semibold text-warning shadow-card" role="alert">
      <WifiOff aria-hidden="true" size={18} /> Anda sedang offline. Periksa koneksi internet.
    </div>
  );
}
