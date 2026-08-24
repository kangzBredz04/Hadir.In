import { Camera, CameraOff, RefreshCw, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import Webcam from 'react-webcam';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';

const videoConstraints = {
  facingMode: 'user',
  width: { ideal: 720 },
  height: { ideal: 720 },
};

export default function CameraCapture({
  preview,
  error,
  ready,
  onCapture,
  onRetake,
  onReady,
  onError,
}) {
  const webcamRef = useRef(null);

  return (
    <section className="overflow-hidden rounded-card border border-border bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Verifikasi wajah</p>
          <h2 className="mt-1 text-sm font-bold text-primary-dark">Selfie absensi</h2>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
          <ShieldCheck aria-hidden="true" size={15} className="text-success" /> Foto dikirim aman
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-primary-dark sm:aspect-[4/3]">
          {preview ? (
            <img src={preview} alt="Preview selfie absensi" className="h-full w-full object-cover" />
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              screenshotFormat="image/jpeg"
              screenshotQuality={0.86}
              videoConstraints={videoConstraints}
              onUserMedia={onReady}
              onUserMediaError={onError}
              className="h-full w-full object-cover"
            />
          )}

          {!preview && !ready && !error && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-primary-dark text-white">
              <div className="text-center">
                <Spinner className="text-white" />
                <p className="mt-3 text-xs text-blue-100">Menyiapkan kamera...</p>
              </div>
            </div>
          )}

          {!preview && error && (
            <div className="absolute inset-0 grid place-items-center bg-primary-dark px-6 text-center text-white">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/10"><CameraOff aria-hidden="true" size={24} /></span>
                <p className="mt-4 text-sm font-semibold">Kamera tidak tersedia</p>
                <p className="mt-2 text-xs leading-5 text-blue-100">{error}</p>
              </div>
            </div>
          )}

          {!preview && ready && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="h-[58%] w-[54%] rounded-[45%] border-2 border-dashed border-white/70 shadow-[0_0_0_999px_rgba(4,36,69,0.12)]" />
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-xs leading-5 text-ink-muted">
          Posisikan wajah di tengah, gunakan pencahayaan yang cukup, dan lepaskan masker atau kacamata gelap.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {preview ? (
            <>
              <Button variant="secondary" className="w-full" onClick={onRetake}>
                <RefreshCw aria-hidden="true" size={18} /> Ambil Ulang
              </Button>
              <div className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-success-light px-4 py-2.5 text-sm font-semibold text-success">
                <ShieldCheck aria-hidden="true" size={18} /> Foto siap digunakan
              </div>
            </>
          ) : (
            <Button
              className="w-full sm:col-span-2"
              disabled={!ready || Boolean(error)}
              onClick={() => onCapture(webcamRef.current)}
            >
              <Camera aria-hidden="true" size={19} /> Ambil Foto
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
