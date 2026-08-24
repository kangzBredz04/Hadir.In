import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPinCheck,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import Brand from '../../components/layout/Brand.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import useAuth from '../../hooks/useAuth.js';
import { handleLoginError } from '../../utils/errorHandler.js';

const benefits = [
  { icon: Smartphone, text: 'Absensi cepat dari perangkat mobile' },
  { icon: MapPinCheck, text: 'Lokasi dan radius kantor terverifikasi' },
  { icon: ShieldCheck, text: 'Akses aman sesuai peran pengguna' },
];

function getDashboardPath(role) {
  return role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard';
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const user = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      const intendedPath = location.state?.from;
      const allowedPrefix = user.role === 'ADMIN' ? '/admin/' : '/employee/';
      const destination = intendedPath?.startsWith(allowedPrefix)
        ? intendedPath
        : getDashboardPath(user.role);

      showToast(`Login berhasil. Selamat datang, ${user.name ?? 'pengguna'}.`);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(handleLoginError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="main-content" tabIndex="-1" className="min-h-screen bg-background outline-none lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0B83C4] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute -right-24 -top-24 size-80 rounded-full border-[42px] border-white/5" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full border-[54px] border-white/5" />

        <div className="relative w-fit rounded-2xl bg-white px-4 py-3 shadow-soft">
          <Brand />
        </div>

        <div className="relative max-w-xl py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            Sistem absensi karyawan
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
            Kehadiran tercatat. Produktivitas terjaga.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-blue-50/90 xl:text-base">
            Akses absensi, pantau kehadiran, dan kelola lokasi kantor dalam satu pengalaman yang sederhana dan terpercaya.
          </p>

          <ul className="mt-9 space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium text-white/95">
                <span className="grid size-9 place-items-center rounded-xl bg-white/10 backdrop-blur">
                  <Icon aria-hidden="true" size={19} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-blue-100/80">
          © 2026 Hadir.In · Absensi lebih mudah
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex justify-center lg:hidden">
            <Brand />
          </div>

          <div className="rounded-card border border-border bg-white p-6 shadow-card sm:p-8 lg:border-0 lg:p-0 lg:shadow-none">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Selamat datang kembali
              </p>
              <h2 className="mt-3 text-2xl font-bold text-primary-dark sm:text-3xl">
                Masuk ke akun Anda
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Gunakan email dan password yang telah terdaftar.
              </p>
            </div>

            {error && (
              <div
                className="mt-6 rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm font-medium text-danger"
                role="alert"
              >
                {error}
              </div>
            )}

            <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="nama@perusahaan.com"
                autoComplete="email"
                inputMode="email"
                leadingIcon={Mail}
                value={form.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />

              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Masukkan password"
                autoComplete="current-password"
                leadingIcon={LockKeyhole}
                value={form.password}
                onChange={handleChange}
                disabled={isSubmitting}
                trailingAction={
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="grid size-9 place-items-center rounded-lg text-ink-muted transition hover:bg-primary-soft hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff aria-hidden="true" size={19} /> : <Eye aria-hidden="true" size={19} />}
                  </button>
                }
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" /> Memproses login...
                  </>
                ) : (
                  <>
                    Masuk <ArrowRight aria-hidden="true" size={18} />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-primary-soft p-3 text-xs leading-5 text-ink-muted">
              <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-primary" size={17} />
              Demi keamanan, jangan bagikan email, password, atau token login kepada siapa pun.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
