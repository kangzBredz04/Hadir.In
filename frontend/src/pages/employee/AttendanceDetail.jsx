import {
    Building2,
    Clock3,
    LogIn,
    LogOut,
    MapPin
} from 'lucide-react';

import AttendanceStatus from '../../components/attendance/AttendanceStatus';

import PhotoViewer from '../../components/ui/PhotoViewer';

import {
    formatDate
} from '../../utils/formatDate';

import {
    formatTime
} from '../../utils/formatTime';

function formatCoordinate(
    value
) {
    const number =
        Number(value);

    return Number.isFinite(
        number
    )
        ? number.toFixed(7)
        : '-';
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

function AttendanceSection({
    title,
    icon: Icon,
    time,
    latitude,
    longitude,
    distance,
    photo
}) {
    return (
        <section
            className="
        rounded-2xl
        border
        border-border
        p-4
        sm:p-5
      "
        >
            <div
                className="
          flex
          items-center
          gap-3
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
                    <Icon
                        size={19}
                    />
                </div>

                <h3
                    className="
            font-bold
            text-text
          "
                >
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
                    <DetailItem
                        icon={Clock3}
                        label="Waktu"
                        value={
                            formatTime(
                                time
                            )
                        }
                    />

                    <DetailItem
                        icon={MapPin}
                        label="Jarak"
                        value={
                            formatDistance(
                                distance
                            )
                        }
                    />

                    <DetailItem
                        icon={MapPin}
                        label="Latitude"
                        value={
                            formatCoordinate(
                                latitude
                            )
                        }
                    />

                    <DetailItem
                        icon={MapPin}
                        label="Longitude"
                        value={
                            formatCoordinate(
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
        </section>
    );
}

function DetailItem({
    icon: Icon,
    label,
    value
}) {
    return (
        <div
            className="
        rounded-xl
        bg-background
        p-3
      "
        >
            <div
                className="
          flex
          items-center
          gap-2
          text-muted
        "
            >
                <Icon
                    size={15}
                />

                <span
                    className="text-xs"
                >
                    {label}
                </span>
            </div>

            <p
                className="
          mt-2
          break-all
          text-sm
          font-semibold
          text-text
        "
            >
                {value}
            </p>
        </div>
    );
}

export default function AttendanceDetail({
    attendance
}) {
    if (!attendance) {
        return null;
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
        <div
            className="
        space-y-5
      "
        >
            <section
                className="
          rounded-2xl
          bg-background
          p-4
        "
            >
                <div
                    className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
                >
                    <div>
                        <p
                            className="
                text-xs
                font-medium
                text-muted
              "
                        >
                            Tanggal Absensi
                        </p>

                        <h3
                            className="
                mt-1
                font-bold
                text-text
              "
                        >
                            {formatDate(
                                attendance
                                    .attendanceDate
                            )}
                        </h3>
                    </div>

                    <AttendanceStatus
                        status={
                            attendance.status
                        }
                    />
                </div>
            </section>

            <section
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
            gap-3
          "
                >
                    <Building2
                        size={20}
                        className="
              mt-0.5
              shrink-0
              text-primary
            "
                    />

                    <div>
                        <p
                            className="
                text-xs
                text-muted
              "
                        >
                            Kantor
                        </p>

                        <p
                            className="
                mt-1
                font-semibold
                text-text
              "
                        >
                            {attendance
                                .office
                                ?.name ??
                                '-'}
                        </p>

                        <p
                            className="
                mt-1
                text-sm
                leading-6
                text-muted
              "
                        >
                            {attendance
                                .office
                                ?.address ??
                                '-'}
                        </p>

                        {attendance
                            .office
                            ?.radiusMeter && (
                                <p
                                    className="
                  mt-2
                  text-xs
                  text-muted
                "
                                >
                                    Radius absensi:
                                    {' '}
                                    {attendance
                                        .office
                                        .radiusMeter}
                                    {' '}
                                    meter
                                </p>
                            )}
                    </div>
                </div>
            </section>

            <AttendanceSection
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

            <AttendanceSection
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