import {
    useState
} from 'react';

import {
    Navigate,
    useNavigate
} from 'react-router-dom';

import {
    Building2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    MapPin,
    ShieldCheck
} from 'lucide-react';

import Button from '../../components/ui/Button';

import useAuth from '../../hooks/useAuth';

import {
    getHomeRouteForRole
} from '../../constants/auth';

import {
    handleApiError
} from '../../utils/errorHandler';

export default function Login() {
    const navigate =
        useNavigate();

    const {
        login,
        user,
        isAuthenticated,
        isInitializing
    } =
        useAuth();

    const [
        email,
        setEmail
    ] =
        useState('');

    const [
        password,
        setPassword
    ] =
        useState('');

    const [
        showPassword,
        setShowPassword
    ] =
        useState(false);

    const [
        submitting,
        setSubmitting
    ] =
        useState(false);

    const [
        error,
        setError
    ] =
        useState('');

    if (
        !isInitializing &&
        isAuthenticated &&
        user
    ) {
        return (
            <Navigate
                to={getHomeRouteForRole(
                    user.role
                )}
                replace
            />
        );
    }

    const handleSubmit =
        async event => {
            event.preventDefault();

            setError('');

            if (
                !email.trim() ||
                !password
            ) {
                setError(
                    'Email dan password wajib diisi.'
                );

                return;
            }

            setSubmitting(true);

            try {
                const loggedInUser =
                    await login({
                        email:
                            email
                                .trim()
                                .toLowerCase(),

                        password
                    });

                navigate(
                    getHomeRouteForRole(
                        loggedInUser.role
                    ),
                    {
                        replace: true
                    }
                );
            } catch (requestError) {
                if (
                    requestError?.status ===
                    401
                ) {
                    setError(
                        'Email atau password salah.'
                    );
                } else {
                    setError(
                        handleApiError(
                            requestError,
                            'Login gagal. Silakan coba kembali.'
                        )
                    );
                }
            } finally {
                setSubmitting(false);
            }
        };

    return (
        <main
            className="
        min-h-screen
        bg-background
        lg:grid
        lg:grid-cols-[1.05fr_0.95fr]
      "
        >
            <section
                className="
          relative
          hidden
          overflow-hidden
          bg-primary-dark
          p-12
          text-white
          lg:flex
          lg:flex-col
          lg:justify-between
        "
            >
                <div
                    className="
            absolute
            -right-32
            -top-32
            h-96
            w-96
            rounded-full
            bg-primary/40
            blur-3xl
          "
                />

                <div
                    className="
            relative
            z-10
            flex
            items-center
            gap-3
          "
                >
                    <div
                        className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-white
              text-primary
            "
                    >
                        <Building2
                            size={25}
                        />
                    </div>

                    <div>
                        <h1
                            className="
                text-xl
                font-bold
              "
                        >
                            Hadir.In
                        </h1>

                        <p
                            className="
                text-xs
                text-blue-200
              "
                        >
                            Employee Attendance System
                        </p>
                    </div>
                </div>

                <div
                    className="
            relative
            z-10
            max-w-xl
          "
                >
                    <span
                        className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-white/10
              px-3
              py-1.5
              text-xs
              font-semibold
              text-blue-100
            "
                    >
                        <ShieldCheck
                            size={15}
                        />

                        Secure Attendance
                    </span>

                    <h2
                        className="
              text-4xl
              font-bold
              leading-tight
            "
                    >
                        Absensi lebih sederhana,
                        akurat, dan terintegrasi.
                    </h2>

                    <p
                        className="
              mt-5
              max-w-lg
              leading-7
              text-blue-100
            "
                    >
                        Kelola kehadiran karyawan
                        menggunakan verifikasi lokasi,
                        foto, dan informasi kantor
                        secara terpusat.
                    </p>

                    <div
                        className="
              mt-8
              flex
              items-center
              gap-3
              text-sm
              text-blue-100
            "
                    >
                        <MapPin
                            size={18}
                        />

                        Validasi lokasi berbasis
                        radius kantor
                    </div>
                </div>

                <p
                    className="
            relative
            z-10
            text-xs
            text-blue-300
          "
                >
                    © 2026 Hadir.In
                </p>
            </section>

            <section
                className="
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-8
          sm:px-8
        "
            >
                <div
                    className="
            w-full
            max-w-md
          "
                >
                    <div
                        className="
              mb-8
              flex
              items-center
              gap-3
              lg:hidden
            "
                    >
                        <div
                            className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-primary
                text-white
              "
                        >
                            <Building2
                                size={22}
                            />
                        </div>

                        <div>
                            <h1
                                className="
                  font-bold
                  text-primary-dark
                "
                            >
                                Hadir.In
                            </h1>

                            <p
                                className="
                  text-xs
                  text-muted
                "
                            >
                                Employee Attendance System
                            </p>
                        </div>
                    </div>

                    <div>
                        <p
                            className="
                text-sm
                font-semibold
                text-primary
              "
                        >
                            Selamat datang
                        </p>

                        <h2
                            className="
                mt-1
                text-2xl
                font-bold
                tracking-tight
                text-text
              "
                        >
                            Masuk ke akun Anda
                        </h2>

                        <p
                            className="
                mt-2
                text-sm
                leading-6
                text-muted
              "
                        >
                            Gunakan akun karyawan atau
                            administrator yang telah
                            terdaftar.
                        </p>
                    </div>

                    {error && (
                        <div
                            className="
                mt-6
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-danger
              "
                            role="alert"
                            aria-live="polite"
                        >
                            {error}
                        </div>
                    )}

                    <form
                        className="
              mt-6
              space-y-5
            "
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                Email
                            </label>

                            <div
                                className="
                  relative
                "
                            >
                                <Mail
                                    size={18}
                                    className="
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-muted
                  "
                                />

                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="nama@perusahaan.com"
                                    value={email}
                                    onChange={
                                        event =>
                                            setEmail(
                                                event.target.value
                                            )
                                    }
                                    disabled={
                                        submitting
                                    }
                                    required
                                    className="
                    min-h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-surface
                    py-3
                    pl-11
                    pr-4
                    text-sm
                    text-text
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                    disabled:opacity-60
                  "
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                Password
                            </label>

                            <div
                                className="
                  relative
                "
                            >
                                <LockKeyhole
                                    size={18}
                                    className="
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-muted
                  "
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    autoComplete="current-password"
                                    placeholder="Masukkan password"
                                    value={password}
                                    onChange={
                                        event =>
                                            setPassword(
                                                event.target.value
                                            )
                                    }
                                    disabled={
                                        submitting
                                    }
                                    required
                                    className="
                    min-h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-surface
                    py-3
                    pl-11
                    pr-12
                    text-sm
                    text-text
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                    disabled:opacity-60
                  "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            current =>
                                                !current
                                        )
                                    }
                                    className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-muted
                    transition
                    hover:bg-background
                    hover:text-text
                  "
                                    aria-label={
                                        showPassword
                                            ? 'Sembunyikan password'
                                            : 'Tampilkan password'
                                    }
                                >
                                    {showPassword
                                        ? (
                                            <EyeOff
                                                size={18}
                                            />
                                        )
                                        : (
                                            <Eye
                                                size={18}
                                            />
                                        )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            loading={
                                submitting
                            }
                            disabled={
                                submitting
                            }
                            className="
                w-full
              "
                        >
                            {submitting
                                ? 'Memproses...'
                                : 'Masuk'}
                        </Button>
                    </form>

                    <p
                        className="
              mt-8
              text-center
              text-xs
              leading-5
              text-muted
            "
                    >
                        Dengan masuk ke sistem,
                        Anda menggunakan akun yang
                        telah diberikan administrator.
                    </p>
                </div>
            </section>
        </main>
    );
}