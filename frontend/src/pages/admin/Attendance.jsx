import {
    ClipboardList,
    Eye,
    Search
} from 'lucide-react';

import {
    useCallback,
    useEffect,
    useState
} from 'react';

import {
    Link
} from 'react-router-dom';

import AttendanceStatus from '../../components/attendance/AttendanceStatus';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';

import {
    ADMIN_ROUTES
} from '../../constants/auth';

import {
    getAdminAttendance
} from '../../services/admin-attendance.service';

import {
    getAdminOffices
} from '../../services/office.service';

import {
    formatDate
} from '../../utils/formatDate';

import {
    formatTime
} from '../../utils/formatTime';

import {
    handleApiError
} from '../../utils/errorHandler';

export default function AdminAttendance() {
    const [
        draftFilters,
        setDraftFilters
    ] =
        useState({
            date: '',
            employeeId: '',
            officeId: '',
            status: ''
        });

    const [
        filters,
        setFilters
    ] =
        useState({
            date: '',
            employeeId: '',
            officeId: '',
            status: ''
        });

    const [
        page,
        setPage
    ] =
        useState(1);

    const [
        items,
        setItems
    ] =
        useState([]);

    const [
        offices,
        setOffices
    ] =
        useState([]);

    const [
        pagination,
        setPagination
    ] =
        useState({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
        });

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

    const loadAttendance =
        useCallback(
            async () => {
                setLoading(true);
                setError('');

                try {
                    const result =
                        await getAdminAttendance({
                            page,
                            limit: 10,

                            date:
                                filters.date,

                            employeeId:
                                filters.employeeId,

                            officeId:
                                filters.officeId,

                            status:
                                filters.status
                        });

                    setItems(
                        result.items
                    );

                    setPagination(
                        result.pagination
                    );
                } catch (
                requestError
                ) {
                    setError(
                        handleApiError(
                            requestError,
                            'Data attendance gagal dimuat.'
                        )
                    );
                } finally {
                    setLoading(false);
                }
            },
            [
                page,
                filters
            ]
        );

    useEffect(() => {
        loadAttendance();
    }, [loadAttendance]);

    useEffect(() => {
        getAdminOffices({
            page: 1,
            limit: 100
        })
            .then(
                result =>
                    setOffices(
                        result.items
                    )
            )
            .catch(() =>
                setOffices([])
            );
    }, []);

    return (
        <div className="space-y-5">
            <section>
                <p className="text-sm font-semibold text-primary">
                    Monitoring
                </p>

                <h2 className="mt-1 text-2xl font-bold text-text">
                    Attendance
                </h2>

                <p className="mt-2 text-sm text-muted">
                    Monitor kehadiran seluruh employee.
                </p>
            </section>

            <Card>
                <form
                    onSubmit={
                        event => {
                            event.preventDefault();

                            setFilters({
                                ...draftFilters
                            });

                            setPage(1);
                        }
                    }
                    className="
            grid
            gap-3
            md:grid-cols-2
            xl:grid-cols-[180px_1fr_220px_180px_auto]
            xl:items-end
          "
                >
                    <Input
                        label="Tanggal"
                        type="date"
                        value={
                            draftFilters.date
                        }
                        onChange={
                            event =>
                                setDraftFilters(
                                    previous => ({
                                        ...previous,
                                        date:
                                            event.target.value
                                    })
                                )
                        }
                    />

                    <Input
                        label="Employee ID"
                        placeholder="Contoh EMP001"
                        value={
                            draftFilters.employeeId
                        }
                        onChange={
                            event =>
                                setDraftFilters(
                                    previous => ({
                                        ...previous,
                                        employeeId:
                                            event.target.value
                                    })
                                )
                        }
                    />

                    <Select
                        label="Office"
                        value={
                            draftFilters.officeId
                        }
                        onChange={
                            event =>
                                setDraftFilters(
                                    previous => ({
                                        ...previous,
                                        officeId:
                                            event.target.value
                                    })
                                )
                        }
                    >
                        <option value="">
                            Semua Kantor
                        </option>

                        {offices.map(
                            office => (
                                <option
                                    key={office.id}
                                    value={office.id}
                                >
                                    {office.name}
                                </option>
                            )
                        )}
                    </Select>

                    <Select
                        label="Status"
                        value={
                            draftFilters.status
                        }
                        onChange={
                            event =>
                                setDraftFilters(
                                    previous => ({
                                        ...previous,
                                        status:
                                            event.target.value
                                    })
                                )
                        }
                    >
                        <option value="">
                            Semua Status
                        </option>

                        <option value="PRESENT">
                            Hadir
                        </option>

                        <option value="LATE">
                            Terlambat
                        </option>

                        <option value="ABSENT">
                            Tidak Hadir
                        </option>
                    </Select>

                    <Button type="submit">
                        <Search size={17} />
                        Filter
                    </Button>
                </form>
            </Card>

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <p className="text-sm text-danger">
                        {error}
                    </p>
                </Card>
            )}

            <Card
                className="
          overflow-hidden
          p-0
        "
            >
                {loading ? (
                    <div className="flex min-h-72 items-center justify-center">
                        <Spinner
                            label="Memuat attendance..."
                        />
                    </div>
                ) : items.length === 0 ? (
                    <EmptyState
                        icon={ClipboardList}
                        title="Belum ada data attendance."
                    />
                ) : (
                    <>
                        {/* Desktop */}
                        <div
                            className="
                hidden
                overflow-x-auto
                md:block
              "
                        >
                            <table
                                className="
                  w-full
                  min-w-[1000px]
                "
                            >
                                <thead className="bg-background">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Tanggal
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Employee
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Office
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Check In
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Check Out
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Jarak
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-muted">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.map(
                                        attendance => {
                                            const distance =
                                                Number(
                                                    attendance
                                                        .checkInDistance
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        attendance.id
                                                    }
                                                    className="border-t border-border"
                                                >
                                                    <td className="px-5 py-4 text-sm text-text">
                                                        {formatDate(
                                                            attendance
                                                                .attendanceDate
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="text-sm font-semibold text-text">
                                                            {attendance
                                                                .user
                                                                ?.name ??
                                                                '-'}
                                                        </p>

                                                        <p className="mt-1 text-xs text-muted">
                                                            {attendance
                                                                .user
                                                                ?.employeeId ??
                                                                '-'}
                                                        </p>
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
                                                                attendance.status
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-muted">
                                                        {Number.isFinite(
                                                            distance
                                                        )
                                                            ? `${Math.round(
                                                                distance
                                                            )} m`
                                                            : '-'}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <Link
                                                            to={`${ADMIN_ROUTES.ATTENDANCE}/${attendance.id}`}
                                                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-light"
                                                        >
                                                            <Eye size={16} />

                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div
                            className="
                space-y-3
                p-4
                md:hidden
              "
                        >
                            {items.map(
                                attendance => (
                                    <div
                                        key={
                                            attendance.id
                                        }
                                        className="
                      rounded-2xl
                      border
                      border-border
                      p-4
                    "
                                    >
                                        <div
                                            className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                                        >
                                            <div>
                                                <p className="font-semibold text-text">
                                                    {attendance
                                                        .user
                                                        ?.name ??
                                                        '-'}
                                                </p>

                                                <p className="mt-1 text-xs text-muted">
                                                    {formatDate(
                                                        attendance
                                                            .attendanceDate
                                                    )}
                                                </p>
                                            </div>

                                            <AttendanceStatus
                                                status={
                                                    attendance.status
                                                }
                                            />
                                        </div>

                                        <div
                                            className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-2
                        text-sm
                      "
                                        >
                                            <div className="rounded-xl bg-background p-3">
                                                <p className="text-xs text-muted">
                                                    Check In
                                                </p>

                                                <p className="mt-1 font-semibold">
                                                    {formatTime(
                                                        attendance
                                                            .checkInTime
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-background p-3">
                                                <p className="text-xs text-muted">
                                                    Check Out
                                                </p>

                                                <p className="mt-1 font-semibold">
                                                    {formatTime(
                                                        attendance
                                                            .checkOutTime
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            to={`${ADMIN_ROUTES.ATTENDANCE}/${attendance.id}`}
                                            className="
                        mt-4
                        inline-flex
                        min-h-10
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-border
                        font-semibold
                        text-primary
                      "
                                        >
                                            <Eye size={17} />
                                            Lihat Detail
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="border-t border-border px-5 py-4">
                            <Pagination
                                page={
                                    pagination.page
                                }
                                totalPages={
                                    pagination.totalPages
                                }
                                total={
                                    pagination.total
                                }
                                disabled={loading}
                                onPageChange={
                                    setPage
                                }
                            />
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}