import {
    CheckCircle2,
    Clock3,
    FileText,
    LogIn,
    LogOut,
    Users
} from 'lucide-react';

import {
    useEffect,
    useState
} from 'react';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

import {
    getAdminAttendanceSummary
} from '../../services/admin-attendance.service';

import {
    getTodayDate
} from '../../utils/formatDate';

import {
    handleApiError
} from '../../utils/errorHandler';

function StatCard({
    icon: Icon,
    label,
    value
}) {
    return (
        <Card>
            <div
                className="
          flex
          items-center
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
              text-2xl
              font-bold
              text-text
            "
                    >
                        {value}
                    </p>
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

export default function AdminReports() {
    const today =
        getTodayDate();

    const [
        startDate,
        setStartDate
    ] =
        useState(today);

    const [
        endDate,
        setEndDate
    ] =
        useState(today);

    const [
        summary,
        setSummary
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

    const loadReport =
        async ({
            start = startDate,
            end = endDate
        } = {}) => {
            if (
                start &&
                end &&
                start > end
            ) {
                setError(
                    'Tanggal awal tidak boleh melebihi tanggal akhir.'
                );

                return;
            }

            setLoading(true);
            setError('');

            try {
                const result =
                    await getAdminAttendanceSummary({
                        startDate:
                            start,

                        endDate:
                            end
                    });

                setSummary(
                    result
                );
            } catch (
            requestError
            ) {
                setError(
                    handleApiError(
                        requestError,
                        'Laporan attendance gagal dimuat.'
                    )
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadReport({
            start: today,
            end: today
        });
    }, []);

    return (
        <div className="space-y-5">
            <section>
                <p
                    className="
            text-sm
            font-semibold
            text-primary
          "
                >
                    Report
                </p>

                <h2
                    className="
            mt-1
            text-2xl
            font-bold
            text-text
          "
                >
                    Rekap Attendance
                </h2>

                <p
                    className="
            mt-2
            text-sm
            text-muted
          "
                >
                    Lihat ringkasan kehadiran
                    berdasarkan periode.
                </p>
            </section>

            <Card>
                <form
                    className="
            grid
            gap-4
            md:grid-cols-[1fr_1fr_auto]
            md:items-end
          "
                    onSubmit={
                        event => {
                            event.preventDefault();

                            loadReport();
                        }
                    }
                >
                    <Input
                        label="Dari Tanggal"
                        type="date"
                        value={startDate}
                        onChange={
                            event =>
                                setStartDate(
                                    event.target.value
                                )
                        }
                    />

                    <Input
                        label="Sampai Tanggal"
                        type="date"
                        value={endDate}
                        onChange={
                            event =>
                                setEndDate(
                                    event.target.value
                                )
                        }
                    />

                    <Button
                        type="submit"
                        loading={loading}
                    >
                        <FileText size={17} />

                        Tampilkan
                    </Button>
                </form>

                {error && (
                    <p
                        className="
              mt-4
              text-sm
              text-danger
            "
                    >
                        {error}
                    </p>
                )}
            </Card>

            {loading &&
                !summary ? (
                <Card>
                    <div
                        className="
              flex
              min-h-56
              items-center
              justify-center
            "
                    >
                        <Spinner
                            label="Memuat laporan..."
                        />
                    </div>
                </Card>
            ) : (
                <section
                    className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-3
          "
                >
                    <StatCard
                        icon={Users}
                        label="Total Attendance"
                        value={
                            summary
                                ?.totalAttendance ??
                            0
                        }
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Hadir"
                        value={
                            summary
                                ?.status
                                ?.present ??
                            0
                        }
                    />

                    <StatCard
                        icon={Clock3}
                        label="Terlambat"
                        value={
                            summary
                                ?.status
                                ?.late ??
                            0
                        }
                    />

                    <StatCard
                        icon={LogIn}
                        label="Sudah Check In"
                        value={
                            summary
                                ?.completion
                                ?.checkedIn ??
                            0
                        }
                    />

                    <StatCard
                        icon={LogOut}
                        label="Sudah Check Out"
                        value={
                            summary
                                ?.completion
                                ?.checkedOut ??
                            0
                        }
                    />

                    <StatCard
                        icon={Clock3}
                        label="Belum Check Out"
                        value={
                            summary
                                ?.completion
                                ?.pendingCheckout ??
                            0
                        }
                    />
                </section>
            )}

            <Card
                className="
          border-blue-100
          bg-primary-light
        "
            >
                <p
                    className="
            text-sm
            leading-6
            text-primary-dark
          "
                >
                    Laporan saat ini menggunakan
                    data summary backend.
                    Export file belum ditambahkan
                    karena backend belum menyediakan
                    endpoint export khusus.
                </p>
            </Card>
        </div>
    );
}