import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Brand from '../components/layout/Brand.jsx';

const features = [
  { icon: MapPin, title: 'Lokasi terverifikasi', description: 'Informasi radius kantor tampil jelas sebelum absensi.' },
  { icon: Camera, title: 'Selfie langsung', description: 'Alur pengambilan foto dirancang cepat untuk perangkat mobile.' },
  { icon: ShieldCheck, title: 'Akses berbasis role', description: 'Fondasi siap dikembangkan untuk employee dan admin.' },
];

export default function Foundation() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-ink">
      <div className="absolute inset-x-0 top-0 -z-0 h-[420px] bg-gradient-to-br from-primary-dark via-primary to-[#1188C7]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur sm:px-5">
          <div className="rounded-xl bg-white px-3 py-2">
            <Brand />
          </div>
          <span className="hidden text-sm font-medium text-white/85 sm:block">Sistem Absensi Karyawan</span>
          <Badge variant="success">Tahap 1 siap</Badge>
        </header>

        <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur">
              <Smartphone aria-hidden="true" size={16} />
              Mobile-first employee experience
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Absensi kerja yang cepat, jelas, dan terpercaya.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-blue-50 sm:text-base">
              Fondasi frontend Hadir.In telah menggunakan design system corporate bernuansa biru, komponen reusable, dan struktur modular untuk pengembangan bertahap.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button className="bg-white text-primary-dark hover:bg-primary-light">
                Lihat fondasi UI <ArrowRight aria-hidden="true" size={18} />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                React + Vite + Tailwind
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden p-5 sm:p-6">
            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-primary-light" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Status hari ini</p>
                <h2 className="mt-2 text-xl font-bold text-primary-dark">Selamat pagi, Wahyu 👋</h2>
                <p className="mt-1 text-sm text-ink-muted">Senin, 24 Agustus 2026</p>
              </div>
              <Badge variant="success">Dalam jangkauan</Badge>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-primary-soft p-4">
                <Clock3 className="text-primary" aria-hidden="true" size={20} />
                <p className="mt-5 text-xs text-ink-muted">Check In</p>
                <p className="mt-1 text-2xl font-bold text-primary-dark">07:58</p>
              </div>
              <div className="rounded-2xl border border-dashed border-border p-4">
                <CheckCircle2 className="text-ink-muted" aria-hidden="true" size={20} />
                <p className="mt-5 text-xs text-ink-muted">Check Out</p>
                <p className="mt-1 text-sm font-semibold text-ink">Belum check out</p>
              </div>
            </div>

            <div className="relative mt-3 flex items-center gap-3 rounded-2xl border border-border p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success-light text-success">
                <MapPin aria-hidden="true" size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-ink-muted">Jarak dari kantor</p>
                <p className="mt-0.5 font-semibold text-ink">73 meter</p>
              </div>
              <span className="text-xs font-semibold text-success">Aman</span>
            </div>
          </Card>
        </section>

        <section aria-labelledby="foundation-title" className="relative">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Design foundation</p>
            <h2 id="foundation-title" className="mt-2 text-2xl font-bold text-primary-dark">
              Siap dikembangkan per tahap
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-5 transition hover:-translate-y-0.5 hover:shadow-card">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary-light text-primary">
                  <Icon aria-hidden="true" size={22} />
                </span>
                <h3 className="mt-4 font-semibold text-primary-dark">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
