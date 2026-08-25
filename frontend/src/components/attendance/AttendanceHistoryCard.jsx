import {
    Clock3,
    Eye,
    LogIn,
    LogOut,
    MapPin
} from 'lucide-react';

import AttendanceStatus from './AttendanceStatus';

import {
    formatDate
} from '../../utils/formatDate';

import {
    formatTime
} from '../../utils/formatTime';

export default function AttendanceHistoryCard({
    attendance,
    onDetail
}) {
    const checkInDistance =
        Number(
            attendance
                ?.checkInDistance
        );

    return (
        <article
            className="
        rounded-2xl
        border
        border-border
        bg-surface
        p-4
        shadow-sm
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
                    <p
                        className="
              font-semibold
              text-text
            "
                    >
                        {formatDate(
                            attendance
                                ?.attendanceDate
                        )}
                    </p>

                    <p
                        className="
              mt-1
              text-xs
              text-muted
            "
                    >
                        {attendance
                            ?.office
                            ?.name ??
                            'Kantor tidak tersedia'}
                    </p>
                </div>

                <AttendanceStatus
                    status={
                        attendance
                            ?.status
                    }
                />
            </div>

            <div
                className="
          mt-5
          grid
          grid-cols-2
          gap-3
        "
            >
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
                        <LogIn
                            size={15}
                        />

                        <span
                            className="text-xs"
                        >
                            Check In
                        </span>
                    </div>

                    <p
                        className="
              mt-2
              font-semibold
              text-text
            "
                    >
                        {formatTime(
                            attendance
                                ?.checkInTime
                        )}
                    </p>
                </div>

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
                        <LogOut
                            size={15}
                        />

                        <span
                            className="text-xs"
                        >
                            Check Out
                        </span>
                    </div>

                    <p
                        className="
              mt-2
              font-semibold
              text-text
            "
                    >
                        {formatTime(
                            attendance
                                ?.checkOutTime
                        )}
                    </p>
                </div>
            </div>

            <div
                className="
          mt-3
          flex
          items-center
          gap-2
          text-xs
          text-muted
        "
            >
                <MapPin
                    size={15}
                />

                Jarak check-in:
                {' '}

                {Number.isFinite(
                    checkInDistance
                )
                    ? `${Math.round(
                        checkInDistance
                    )} m`
                    : '-'}
            </div>

            <button
                type="button"
                onClick={() =>
                    onDetail(
                        attendance
                    )
                }
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
          transition
          hover:bg-primary-light
        "
            >
                <Eye
                    size={17}
                />

                Lihat Detail
            </button>
        </article>
    );
}