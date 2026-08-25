import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    History,
    MapPin
} from 'lucide-react';

import {
    Link
} from 'react-router-dom';

import AttendanceStatus from '../../components/attendance/AttendanceStatus';
import AttendanceSummary from '../../components/attendance/AttendanceSummary';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

import {
    EMPLOYEE_ROUTES
} from '../../constants/auth';

import useAttendance from '../../hooks/useAttendance';
import useAuth from '../../hooks/useAuth';

import {
    formatShortDate
} from '../../utils/formatDate';

import {
    getGreeting
} from '../../utils/formatTime';

export default function EmployeeDashboard() {
    const {
        user
    } =
        useAuth();

    const {
        today,
        attendance,
        loading,
        error,
        refresh
    } =
        useAttendance();

    const hasCheckedIn =
        Boolean(
            attendance?.checkInTime
        );

    const hasCheckedOut =
        Boolean(
            attendance?.checkOutTime
        );

    const actionLabel =
        !hasCheckedIn
            ? 'Check In'
            : !hasCheckedOut
                ? 'Check Out'
                : 'Absensi Selesai';

    return (
        <div
            className="
        space-y-6
      "
        >
            <section
                className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
            >
                <div>
                    <p
                        className="
              text-sm
              font-medium
              text-primary
            "
                    >
                        {getGreeting()},
                    </p>

                    <h2
                        className="
    mt-1
    text-[28px]
    font-bold
    leading-tight
    tracking-tight
    text-text
    sm:text-3xl
  "
                    >
                        {user?.name} 👋
                    </h2>

                    <div
                        className="
    mt-3
    flex
    items-center
    gap-2
    text-sm
    text-muted
  "
                    >
                        <CalendarDays
                            size={17}
                            aria-hidden="true"
                        />

                        {formatShortDate(
                            today?.date
                        )}
                    </div>
                </div>

                <Link
                    to={
                        EMPLOYEE_ROUTES
                            .ATTENDANCE
                    }
                >
                    <Button
                        className="
              w-full
              sm:w-auto
            "
                    >
                        {actionLabel}

                        <ArrowRight
                            size={17}
                            aria-hidden="true"
                        />
                    </Button>
                </Link>
            </section>

            {error && (
                <Card
                    className="
            border-red-200
            bg-red-50
          "
                >
                    <p
                        className="
              text-sm
              text-danger
            "
                    >
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={refresh}
                        className="
              mt-3
              text-sm
              font-semibold
              text-danger
              underline
            "
                    >
                        Coba lagi
                    </button>
                </Card>
            )}

            {loading ? (
                <Card>
                    <div
                        className="
              flex
              min-h-40
              items-center
              justify-center
            "
                    >
                        <Spinner
                            label="Memuat absensi..."
                        />
                    </div>
                </Card>
            ) : (
                <>
                    <section
                        className="
              grid
              gap-4
              lg:grid-cols-[0.85fr_1.15fr]
            "
                    >
                        <Card
                            className="
                relative
                overflow-hidden
                bg-primary-dark
                text-white
              "
                        >
                            <div
                                className="
    relative
    overflow-hidden
    rounded-2xl
    bg-primary-dark
    p-5
    text-white
    shadow-sm
    sm:p-6
  "
                            >
                                {/* Decorative background */}
                                <div
                                    className="
      pointer-events-none
      absolute
      -right-16
      -top-20
      h-48
      w-48
      rounded-full
      bg-primary/40
      blur-3xl
    "
                                />

                                <div
                                    className="
      pointer-events-none
      absolute
      -bottom-24
      -left-20
      h-44
      w-44
      rounded-full
      bg-blue-400/10
      blur-3xl
    "
                                />

                                <div
                                    className="
      relative
      z-10
    "
                                >
                                    <div
                                        className="
        flex
        items-start
        justify-between
        gap-4
      "
                                    >
                                        <div>
                                            <p
                                                className="
            text-sm
            font-medium
            text-blue-200
          "
                                            >
                                                Status Absensi
                                            </p>

                                            <h3
                                                className="
            mt-1
            text-xl
            font-bold
            text-white
          "
                                            >
                                                Hari Ini
                                            </h3>
                                        </div>

                                        <div
                                            className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white/10
          ring-1
          ring-white/20
        "
                                        >
                                            <CheckCircle2
                                                size={22}
                                                className="text-white"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-7">
                                        <AttendanceStatus
                                            status={
                                                attendance?.status
                                            }
                                        />
                                    </div>

                                    <div
                                        className="
        mt-6
        border-t
        border-white/10
        pt-5
      "
                                    >
                                        <p
                                            className="
          text-sm
          leading-6
          text-blue-100
        "
                                        >
                                            {!attendance
                                                ? 'Anda belum melakukan absensi hari ini.'
                                                : !hasCheckedOut
                                                    ? 'Check-in sudah tercatat. Jangan lupa melakukan check-out.'
                                                    : 'Absensi hari ini sudah lengkap.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <AttendanceSummary
                            attendance={
                                attendance
                            }
                        />
                    </section>

                    <section>
                        <div
                            className="
                mb-4
                flex
                items-center
                justify-between
              "
                        >
                            <div>
                                <h3
                                    className="
                    font-bold
                    text-text
                  "
                                >
                                    Quick Action
                                </h3>

                                <p
                                    className="
                    mt-1
                    text-xs
                    text-muted
                  "
                                >
                                    Akses fitur utama dengan cepat.
                                </p>
                            </div>
                        </div>

                        <div
                            className="
                grid
                gap-3
                sm:grid-cols-3
              "
                        >
                            <Link
                                to={
                                    EMPLOYEE_ROUTES
                                        .ATTENDANCE
                                }
                            >
                                <Card
                                    className="
                    h-full
                    cursor-pointer
                    transition
                    hover:-translate-y-0.5
                    hover:border-primary/30
                    hover:shadow-md
                  "
                                >
                                    <div
                                        className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary-light
                      text-primary
                    "
                                    >
                                        <Clock3
                                            size={20}
                                        />
                                    </div>

                                    <p
                                        className="
                      mt-4
                      font-semibold
                      text-text
                    "
                                    >
                                        {actionLabel}
                                    </p>

                                    <p
                                        className="
                      mt-1
                      text-xs
                      leading-5
                      text-muted
                    "
                                    >
                                        Buka halaman absensi.
                                    </p>
                                </Card>
                            </Link>

                            <Link
                                to={
                                    EMPLOYEE_ROUTES
                                        .HISTORY
                                }
                            >
                                <Card
                                    className="
                    h-full
                    cursor-pointer
                    transition
                    hover:-translate-y-0.5
                    hover:border-primary/30
                    hover:shadow-md
                  "
                                >
                                    <div
                                        className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary-light
                      text-primary
                    "
                                    >
                                        <History
                                            size={20}
                                        />
                                    </div>

                                    <p
                                        className="
                      mt-4
                      font-semibold
                      text-text
                    "
                                    >
                                        Lihat Riwayat
                                    </p>

                                    <p
                                        className="
                      mt-1
                      text-xs
                      leading-5
                      text-muted
                    "
                                    >
                                        Periksa riwayat kehadiran.
                                    </p>
                                </Card>
                            </Link>

                            <Card>
                                <div
                                    className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary-light
                    text-primary
                  "
                                >
                                    <MapPin
                                        size={20}
                                    />
                                </div>

                                <p
                                    className="
                    mt-4
                    font-semibold
                    text-text
                  "
                                >
                                    Kantor
                                </p>

                                <p
                                    className="
                    mt-1
                    truncate
                    text-xs
                    leading-5
                    text-muted
                  "
                                >
                                    {user?.office?.name ??
                                        'Belum terdaftar'}
                                </p>
                            </Card>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}