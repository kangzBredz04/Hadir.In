import {
    useState
} from 'react';

import {
    CalendarDays,
    Eye,
    Filter,
    History as HistoryIcon,
    RotateCcw
} from 'lucide-react';

import AttendanceHistoryCard from '../../components/attendance/AttendanceHistoryCard';
import AttendanceStatus from '../../components/attendance/AttendanceStatus';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';

import AttendanceDetail from './AttendanceDetail';

import useAttendanceHistory from '../../hooks/useAttendanceHistory';

import {
    formatDate
} from '../../utils/formatDate';

import {
    formatTime
} from '../../utils/formatTime';

export default function EmployeeHistory() {
    const {
        items,
        pagination,
        filters,
        loading,
        error,

        applyFilters,
        resetFilters,
        changePage,
        refresh
    } =
        useAttendanceHistory({
            initialLimit: 10
        });

    const [
        startDate,
        setStartDate
    ] =
        useState(
            filters.startDate
        );

    const [
        endDate,
        setEndDate
    ] =
        useState(
            filters.endDate
        );

    const [
        filterError,
        setFilterError
    ] =
        useState('');

    const [
        selectedAttendance,
        setSelectedAttendance
    ] =
        useState(null);

    const handleFilter =
        async event => {
            event.preventDefault();

            setFilterError('');

            if (
                startDate &&
                endDate &&
                startDate > endDate
            ) {
                setFilterError(
                    'Tanggal awal tidak boleh melebihi tanggal akhir.'
                );

                return;
            }

            await applyFilters({
                startDate,
                endDate
            });
        };

    const handleReset =
        async () => {
            setStartDate('');
            setEndDate('');
            setFilterError('');

            await resetFilters();
        };

    return (
        <div
            className="
        space-y-5
      "
        >
            <section
                className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
            >
                <div>
                    <p
                        className="
              text-sm
              font-semibold
              text-primary
            "
                    >
                        Kehadiran
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
                        Riwayat Absensi
                    </h2>

                    <p
                        className="
              mt-2
              text-sm
              text-muted
            "
                    >
                        Lihat aktivitas check-in
                        dan check-out Anda.
                    </p>
                </div>

                <Button
                    variant="outline"
                    disabled={loading}
                    onClick={refresh}
                >
                    <RotateCcw
                        size={17}
                    />

                    Refresh
                </Button>
            </section>

            <Card>
                <form
                    onSubmit={
                        handleFilter
                    }
                >
                    <div
                        className="
              flex
              items-center
              gap-2
            "
                    >
                        <Filter
                            size={18}
                            className="text-primary"
                        />

                        <h3
                            className="
                font-semibold
                text-text
              "
                        >
                            Filter Tanggal
                        </h3>
                    </div>

                    <div
                        className="
              mt-4
              grid
              gap-4
              md:grid-cols-2
              lg:grid-cols-[1fr_1fr_auto]
              lg:items-end
            "
                    >
                        <div>
                            <label
                                htmlFor="start-date"
                                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-text
                "
                            >
                                Dari Tanggal
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    size={17}
                                    className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-muted
                  "
                                />

                                <input
                                    id="start-date"
                                    type="date"
                                    value={
                                        startDate
                                    }
                                    onChange={
                                        event =>
                                            setStartDate(
                                                event.target
                                                    .value
                                            )
                                    }
                                    className="
                    min-h-11
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-surface
                    pl-10
                    pr-3
                    text-sm
                    text-text
                    outline-none
                    transition
                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                  "
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="end-date"
                                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-text
                "
                            >
                                Sampai Tanggal
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    size={17}
                                    className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-muted
                  "
                                />

                                <input
                                    id="end-date"
                                    type="date"
                                    value={
                                        endDate
                                    }
                                    onChange={
                                        event =>
                                            setEndDate(
                                                event.target
                                                    .value
                                            )
                                    }
                                    className="
                    min-h-11
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-surface
                    pl-10
                    pr-3
                    text-sm
                    text-text
                    outline-none
                    transition
                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                  "
                                />
                            </div>
                        </div>

                        <div
                            className="
                flex
                gap-2
                md:col-span-2
                lg:col-span-1
              "
                        >
                            <Button
                                type="submit"
                                loading={loading}
                                className="
                  flex-1
                  lg:flex-none
                "
                            >
                                Terapkan
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                onClick={
                                    handleReset
                                }
                            >
                                Reset
                            </Button>
                        </div>
                    </div>

                    {filterError && (
                        <p
                            className="
                mt-3
                text-sm
                text-danger
              "
                            role="alert"
                        >
                            {filterError}
                        </p>
                    )}
                </form>
            </Card>

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

            <Card
                className="
          overflow-hidden
          p-0
        "
            >
                {loading &&
                    items.length === 0 ? (
                    <div
                        className="
              flex
              min-h-72
              items-center
              justify-center
            "
                    >
                        <Spinner
                            label="Memuat riwayat..."
                        />
                    </div>
                ) : items.length === 0 ? (
                    <EmptyState
                        icon={
                            HistoryIcon
                        }
                        title="Belum ada riwayat absensi."
                        description="Data check-in dan check-out Anda akan muncul di sini."
                    />
                ) : (
                    <>
                        {/* DESKTOP */}
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
                  min-w-[760px]
                  border-collapse
                  text-left
                "
                            >
                                <thead>
                                    <tr
                                        className="
                      border-b
                      border-border
                      bg-background
                    "
                                    >
                                        <th className="px-5 py-4 text-xs font-semibold text-muted">
                                            Tanggal
                                        </th>

                                        <th className="px-5 py-4 text-xs font-semibold text-muted">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-xs font-semibold text-muted">
                                            Check In
                                        </th>

                                        <th className="px-5 py-4 text-xs font-semibold text-muted">
                                            Check Out
                                        </th>

                                        <th className="px-5 py-4 text-xs font-semibold text-muted">
                                            Jarak
                                        </th>

                                        <th className="px-5 py-4 text-xs font-semibold text-muted">
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
                                                    className="
                            border-b
                            border-border
                            last:border-b-0
                            hover:bg-background/70
                          "
                                                >
                                                    <td
                                                        className="
                              whitespace-nowrap
                              px-5
                              py-4
                              text-sm
                              font-medium
                              text-text
                            "
                                                    >
                                                        {formatDate(
                                                            attendance
                                                                .attendanceDate
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

                                                    <td
                                                        className="
                              whitespace-nowrap
                              px-5
                              py-4
                              text-sm
                              text-text
                            "
                                                    >
                                                        {formatTime(
                                                            attendance
                                                                .checkInTime
                                                        )}
                                                    </td>

                                                    <td
                                                        className="
                              whitespace-nowrap
                              px-5
                              py-4
                              text-sm
                              text-text
                            "
                                                    >
                                                        {formatTime(
                                                            attendance
                                                                .checkOutTime
                                                        )}
                                                    </td>

                                                    <td
                                                        className="
                              whitespace-nowrap
                              px-5
                              py-4
                              text-sm
                              text-muted
                            "
                                                    >
                                                        {Number.isFinite(
                                                            distance
                                                        )
                                                            ? `${Math.round(
                                                                distance
                                                            )} m`
                                                            : '-'}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedAttendance(
                                                                    attendance
                                                                )
                                                            }
                                                            className="
                                inline-flex
                                min-h-9
                                items-center
                                gap-1.5
                                rounded-lg
                                px-2.5
                                text-sm
                                font-semibold
                                text-primary
                                transition
                                hover:bg-primary-light
                              "
                                                        >
                                                            <Eye
                                                                size={16}
                                                            />

                                                            Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE */}
                        <div
                            className="
                space-y-3
                p-4
                md:hidden
              "
                        >
                            {items.map(
                                attendance => (
                                    <AttendanceHistoryCard
                                        key={
                                            attendance.id
                                        }
                                        attendance={
                                            attendance
                                        }
                                        onDetail={
                                            setSelectedAttendance
                                        }
                                    />
                                )
                            )}
                        </div>

                        <div
                            className="
                border-t
                border-border
                px-4
                py-4
                sm:px-5
              "
                        >
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

                                disabled={
                                    loading
                                }

                                onPageChange={
                                    changePage
                                }
                            />
                        </div>
                    </>
                )}
            </Card>

            <Modal
                open={
                    Boolean(
                        selectedAttendance
                    )
                }
                title="Detail Absensi"
                maxWidth="max-w-4xl"
                onClose={() =>
                    setSelectedAttendance(
                        null
                    )
                }
            >
                <AttendanceDetail
                    attendance={
                        selectedAttendance
                    }
                />
            </Modal>
        </div>
    );
}