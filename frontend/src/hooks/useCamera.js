import { useCallback, useState } from 'react';

function getCameraError(error) {
  const name = error?.name ?? String(error ?? '');

  if (name.includes('NotAllowed') || name.includes('PermissionDenied')) {
    return 'Akses kamera ditolak. Izinkan akses kamera pada browser Anda.';
  }

  if (name.includes('NotFound') || name.includes('DevicesNotFound')) {
    return 'Kamera tidak ditemukan pada perangkat ini.';
  }

  if (name.includes('NotReadable') || name.includes('TrackStart')) {
    return 'Kamera sedang digunakan aplikasi lain. Tutup aplikasi tersebut lalu coba lagi.';
  }

  return 'Kamera tidak dapat digunakan. Periksa izin browser lalu coba lagi.';
}

export default function useCamera() {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  const capture = useCallback((webcam) => {
    const image = webcam?.getScreenshot();

    if (!image) {
      setError('Foto belum berhasil diambil. Silakan coba lagi.');
      return null;
    }

    setPreview(image);
    setError('');
    return image;
  }, []);

  const retake = useCallback(() => {
    setPreview(null);
    setError('');
  }, []);

  const reset = useCallback(() => {
    setPreview(null);
    setError('');
    setReady(false);
  }, []);

  const handleReady = useCallback(() => {
    setReady(true);
    setError('');
  }, []);

  const handleError = useCallback((cameraError) => {
    setReady(false);
    setError(getCameraError(cameraError));
  }, []);

  return {
    preview,
    error,
    ready,
    capture,
    retake,
    reset,
    handleReady,
    handleError,
  };
}
