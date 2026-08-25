import {
    ArrowLeft,
    Building2,
    IdCard,
    LogIn,
    LogOut,
    MapPin,
    UserRound
} from 'lucide-react';

import {
    useEffect,
    useState
} from 'react';

import {
    Link,
    useParams
} from 'react-router-dom';

import AttendanceStatus from '../../components/attendance/AttendanceStatus';

import Card from '../../components/ui/Card';
import PhotoViewer from '../../components/ui/PhotoViewer';
import Spinner from '../../components/ui/Spinner';

import {
    ADMIN_ROUTES
} from '../../constants/auth';

import {
    getAdminAttendanceById
} from '../../services/admin-attendance.service';

import {
    formatDate
} from '../../utils/formatDate';

import {
    formatTime
} from '../../utils/formatTime';

import {
    handleApiError
} from '../../utils/errorHandler';

function valueOrDash(
    value
) {
    return (
        value ??
        '-'
    );
}

function formatDistance(
    value
) {
    const number =
        Number(value);

    return Number.isFinite(
        number
    )
        ? `${Math.round(
            number
        )} meter`
        : '-';
}

function AttendanceBlock({
    title,
    icon: Icon,
    time,
    latitude,
    longitude,
    distance,
    photo
}) {
    return (
        <Card>
            <div
                className="
          flex
          items-center
          gap-3
        "
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Icon size={19} />
                </div>

                <h3 className="font-bold text-text">
                    {title}
                </h3>
            </div>

            <div
                className="
          mt-5
          grid
          gap-5
          lg:grid-cols-[1fr_0.9fr]
        "
            >
                <div
                    className="
            grid
            gap-3
            sm:grid-cols-2
          "
                >
                    <Info
                        label="Waktu"
                        value={
                            formatTime(time)
                        }
                    />

                    <Info
                        label="Jarak"
                        value={
                            formatDistance(
                                distance
                            )
                        }
                    />

                    <Info
                        label="Latitude"
                        value={
                            valueOrDash(
                                latitude
                            )
                        }
                    />

                    <Info
                        label="Longitude"
                        value={
                            valueOrDash(
                                longitude
                            )
                        }
                    />
                </div>

                <PhotoViewer
                    src={photo}
                    alt={`Foto ${title}`}
                />
            </div>
        </Card>
    );
}

function Info({
    label,
    value
}) {
    return (
        <div className="rounded-xl bg-background p-4">
            <p className="text-xs text-muted">
                {label}
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-text">
                {value}
            </p>
        </div>
    );
}

export default function AdminAttendanceDetail() {
    const {
        id
    } =
        useParams();

    const [
        attendance,
        setAttendance
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

        getAdminAttendanceById(
            id
        )
            .then(data => {
                if (active) {
                    setAttendance(
                        data
                    );
                }
            })
            .catch(
                requestError => {
                    if (active) {
                        setError(
                            handleApiError(
                                requestError,
                                'Detail attendance gagal dimuat.'
                            )
                        );
                    }
                }
            )
            .finally(() => {
                if (active) {
                    setLoading(
                        false
                    );
                }
            });

        return () => {
            active = false;
        };
    }, [id]);

    if (loading) {
        return (
            <Card>
                <div className="flex min-h-72 items-center justify-center">
                    <Spinner
                        label="Memuat detail attendance..."
                    />
                </div>
            </Card>
        );
    }

    if (
        error ||
        !attendance
    ) {
        return (
            <Card className="border-red-200 bg-red-50">
                <p className="text-sm text-danger">
                    {error ||
                        'Attendance tidak ditemukan.'}
                </p>
            </Card>
        );
    }

    const checkInPhoto =
        attendance.photos
            ?.find(
                photo =>
                    photo.type ===
                    'CHECK_IN'
            )
            ?.photoUrl;

    const checkOutPhoto =
        attendance.photos
            ?.find(
                photo =>
                    photo.type ===
                    'CHECK_OUT'
            )
            ?.photoUrl;

    return (
        <div className="space-y-5">
            <Link
                to={
                    ADMIN_ROUTES.ATTENDANCE
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
                <ArrowLeft size={17} />
                Kembali
            </Link>

            <Card>
                <div
                    className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
                >
                    <div>
                        <p className="text-xs text-muted">
                            Tanggal Absensi
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-text">
                            {formatDate(
                                attendance
                                    .attendanceDate
                            )}
                        </h2>
                    </div>

                    <AttendanceStatus
                        status={
                            attendance.status
                        }
                    />
                </div>
            </Card>

            <div
                className="
          grid
          gap-5
          lg:grid-cols-2
        "
            >
                <Card>
                    <div className="flex items-center gap-3">
                        <UserRound
                            size={20}
                            className="text-primary"
                        />

                        <h3 className="font-bold text-text">
                            Employee
                        </h3>
                    </div>

                    <div className="mt-5 space-y-3">
                        <Info
                            label="Nama"
                            value={
                                attendance
                                    .user
                                    ?.name ??
                                '-'
                            }
                        />

                        <Info
                            label="Employee ID"
                            value={
                                attendance
                                    .user
                                    ?.employeeId ??
                                '-'
                            }
                        />

                        <Info
                            label="Email"
                            value={
                                attendance
                                    .user
                                    ?.email ??
                                '-'
                            }
                        />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-3">
                        <Building2
                            size={20}
                            className="text-primary"
                        />

                        <h3 className="font-bold text-text">
                            Office
                        </h3>
                    </div>

                    <div className="mt-5 space-y-3">
                        <Info
                            label="Nama Kantor"
                            value={
                                attendance
                                    .office
                                    ?.name ??
                                '-'
                            }
                        />

                        <Info
                            label="Alamat"
                            value={
                                attendance
                                    .office
                                    ?.address ??
                                '-'
                            }
                        />

                        <Info
                            label="Radius"
                            value={
                                attendance
                                    .office
                                    ?.radiusMeter
                                    ? `${attendance.office.radiusMeter} meter`
                                    : '-'
                            }
                        />
                    </div>
                </Card>
            </div>

            <AttendanceBlock
                title="Check In"
                icon={LogIn}

                time={
                    attendance
                        .checkInTime
                }

                latitude={
                    attendance
                        .checkInLatitude
                }

                longitude={
                    attendance
                        .checkInLongitude
                }

                distance={
                    attendance
                        .checkInDistance
                }

                photo={
                    checkInPhoto
                }
            />

            <AttendanceBlock
                title="Check Out"
                icon={LogOut}

                time={
                    attendance
                        .checkOutTime
                }

                latitude={
                    attendance
                        .checkOutLatitude
                }

                longitude={
                    attendance
                        .checkOutLongitude
                }

                distance={
                    attendance
                        .checkOutDistance
                }

                photo={
                    checkOutPhoto
                }
            />
        </div>
    );
}