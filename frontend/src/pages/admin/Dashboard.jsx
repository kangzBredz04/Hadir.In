import {
    CheckCircle2,
    Clock3,
    UserCheck,
    Users
} from 'lucide-react';

import {
    useEffect,
    useState
} from 'react';

import {
    Link
} from 'react-router-dom';

import AttendanceStatus from '../../components/attendance/AttendanceStatus';

import Card from '../../components/ui/Card';
import {
    Skeleton,
    CardSkeleton,
    TableSkeleton
} from '../../components/ui/Skeleton';
import Spinner from '../../components/ui/Spinner';

import PWAInstallCard from '../../components/pwa/PWAInstallCard';

import {
    ADMIN_ROUTES
} from '../../constants/auth';

import {
    getAdminUsers
} from '../../services/user.service';

import {
    getAdminAttendance,
    getAdminAttendanceSummary
} from '../../services/admin-attendance.service';

import {
    getTodayDate,
    formatDate
} from '../../utils/formatDate';

import {
    formatTime
} from '../../utils/formatTime';

import {
    handleApiError
} from '../../utils/errorHandler';

function StatCard({
    icon: Icon,
    label,
    value,
    caption
}) {
    return (
        <Card>
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
              text-muted
            "
                    >
                        {label}
                    </p>

                    <p
                        className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-text
            "
                    >
                        {value}
                    </p>

                    {caption && (
                        <p
                            className="
                mt-2
                text-xs
                text-muted
              "
                        >
                            {caption}
                        </p>
                    )}
                </div>

                <div
                    className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-primary-light
            text-primary
          "
                >
                    <Icon size={21} />
                </div>
            </div>
        </Card>
    );
}

export default function AdminDashboard() {
    const [
        data,
        setData
    ] =
        useState(null);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        error,
        setError
    ] =
        useState('');

    useEffect(() => {
        let active =
            true;

        const today =
            getTodayDate();

        Promise.all([
            getAdminUsers({
                page: 1,
                limit: 1,
                role: 'EMPLOYEE',
                isActive: true
            }),

            getAdminAttendanceSummary({
                date: today
            }),

            getAdminAttendance({
                page: 1,
                limit: 5,
                date: today
            })
        ])
            .then(
                ([
                    employees,
                    summary,
                    recent
                ]) => {
                    if (!active) {
                        return;
                    }

                    const totalEmployees =
                        Number(
                            employees
                                .pagination
                                ?.total
                        ) || 0;

                    const checkedIn =
                        Number(
                            summary
                                ?.completion
                                ?.checkedIn
                        ) || 0;

                    setData({
                        totalEmployees,

                        checkedIn,

                        late:
                            Number(
                                summary
                                    ?.status
                                    ?.late
                            ) || 0,

                        notAttended:
                            Math.max(
                                totalEmployees -
                                checkedIn,
                                0
                            ),

                        recent:
                            recent.items
                    });
                }
            )
            .catch(
                requestError => {
                    if (active) {
                        setError(
                            handleApiError(
                                requestError,
                                'Dashboard admin gagal dimuat.'
                            )
                        );
                    }
                }
            )
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton
                        className="
            h-4
            w-24
          "
                    />

                    <Skeleton
                        className="
            mt-3
            h-8
            w-64
          "
                    />
                </div>

                <div
                    className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
                >
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>

                <Card
                    className="
          overflow-hidden
          p-0
        "
                >
                    <TableSkeleton
                        rows={5}
                        columns={5}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section>
                <p
                    className="
            text-sm
            font-semibold
            text-primary
          "
                >
                    Overview
                </p>

                <h2
                    className="
            mt-1
            text-2xl
            font-bold
            text-text
          "
                >
                    Ringkasan Hari Ini
                </h2>

                <p
                    className="
            mt-2
            text-sm
            text-muted
          "
                >
                    {formatDate(
                        getTodayDate()
                    )}
                </p>
            </section>

            {/* =========================
            PWA INSTALL
        ========================= */}

            <PWAInstallCard />

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
                </Card>
            )}

            <section
                className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
            >
                <StatCard
                    icon={Users}
                    label="Total Employee"
                    value={
                        data?.totalEmployees ??
                        0
                    }
                    caption="Employee aktif"
                />

                <StatCard
                    icon={UserCheck}
                    label="Hadir Hari Ini"
                    value={
                        data?.checkedIn ??
                        0
                    }
                    caption="Sudah melakukan check-in"
                />

                <StatCard
                    icon={Clock3}
                    label="Terlambat"
                    value={
                        data?.late ??
                        0
                    }
                    caption="Status LATE"
                />

                <StatCard
                    icon={CheckCircle2}
                    label="Belum Absen"
                    value={
                        data?.notAttended ??
                        0
                    }
                    caption="Belum melakukan check-in"
                />
            </section>

            <Card
                className="
          overflow-hidden
          p-0
        "
            >
                <div
                    className="
            flex
            items-center
            justify-between
            border-b
            border-border
            px-5
            py-4
          "
                >
                    <div>
                        <h3
                            className="
                font-bold
                text-text
              "
                        >
                            Absensi Terbaru
                        </h3>

                        <p
                            className="
                mt-1
                text-xs
                text-muted
              "
                        >
                            Aktivitas kehadiran hari ini.
                        </p>
                    </div>

                    <Link
                        to={
                            ADMIN_ROUTES.ATTENDANCE
                        }
                        className="
              text-sm
              font-semibold
              text-primary
            "
                    >
                        Lihat Semua
                    </Link>
                </div>

                {!data?.recent?.length ? (
                    <div
                        className="
              px-5
              py-12
              text-center
              text-sm
              text-muted
            "
                    >
                        Belum ada absensi hari ini.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table
                            className="
                w-full
                min-w-[700px]
              "
                        >
                            <thead
                                className="
                  bg-background
                "
                            >
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted">
                                        Employee
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted">
                                        Kantor
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted">
                                        Check In
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted">
                                        Check Out
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.recent.map(
                                    attendance => (
                                        <tr
                                            key={
                                                attendance.id
                                            }
                                            className="
                        border-t
                        border-border
                      "
                                        >
                                            <td className="px-5 py-4 text-sm font-medium text-text">
                                                {attendance
                                                    .user
                                                    ?.name ??
                                                    '-'}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-muted">
                                                {attendance
                                                    .office
                                                    ?.name ??
                                                    '-'}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-text">
                                                {formatTime(
                                                    attendance
                                                        .checkInTime
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-text">
                                                {formatTime(
                                                    attendance
                                                        .checkOutTime
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <AttendanceStatus
                                                    status={
                                                        attendance
                                                            .status
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}