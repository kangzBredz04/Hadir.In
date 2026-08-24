import {
    Clock3,
    LogIn,
    LogOut,
    MapPin
} from 'lucide-react';

import Card from '../ui/Card';

import {
    formatTime
} from '../../utils/formatTime';

function SummaryItem({
    icon: Icon,
    label,
    value,
    caption
}) {
    return (
        <div
            className="
        flex
        min-w-0
        items-start
        gap-3
      "
        >
            <div
                className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-primary-light
          text-primary
        "
            >
                <Icon
                    size={19}
                    aria-hidden="true"
                />
            </div>

            <div className="min-w-0">
                <p
                    className="
            text-xs
            font-medium
            text-muted
          "
                >
                    {label}
                </p>

                <p
                    className="
            mt-1
            truncate
            font-semibold
            text-text
          "
                >
                    {value}
                </p>

                {caption && (
                    <p
                        className="
              mt-1
              text-xs
              text-muted
            "
                    >
                        {caption}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function AttendanceSummary({
    attendance
}) {
    const distance =
        attendance
            ?.checkInDistance;

    const radius =
        attendance
            ?.office
            ?.radiusMeter;

    const numericDistance =
        distance !==
            null &&
            distance !==
            undefined
            ? Number(distance)
            : null;

    const numericRadius =
        radius !==
            null &&
            radius !==
            undefined
            ? Number(radius)
            : null;

    const withinRadius =
        numericDistance !==
            null &&
            numericRadius !==
            null
            ? numericDistance <=
            numericRadius
            : null;

    return (
        <Card>
            <div
                className="
          grid
          gap-6
          sm:grid-cols-2
        "
            >
                <SummaryItem
                    icon={LogIn}
                    label="Check In"
                    value={
                        formatTime(
                            attendance
                                ?.checkInTime,

                            'Belum Check In'
                        )
                    }
                />

                <SummaryItem
                    icon={LogOut}
                    label="Check Out"
                    value={
                        formatTime(
                            attendance
                                ?.checkOutTime,

                            'Belum Check Out'
                        )
                    }
                />

                <SummaryItem
                    icon={MapPin}
                    label="Jarak saat Check In"
                    value={
                        numericDistance !==
                            null
                            ? `${numericDistance.toFixed(
                                0
                            )} meter`
                            : 'Belum tersedia'
                    }
                    caption={
                        withinRadius ===
                            true
                            ? 'Dalam jangkauan kantor'
                            : withinRadius ===
                                false
                                ? 'Di luar jangkauan kantor'
                                : null
                    }
                />

                <SummaryItem
                    icon={Clock3}
                    label="Kantor"
                    value={
                        attendance
                            ?.office
                            ?.name ??
                        'Belum tersedia'
                    }
                    caption={
                        numericRadius !==
                            null
                            ? `Radius ${numericRadius} meter`
                            : null
                    }
                />
            </div>
        </Card>
    );
}