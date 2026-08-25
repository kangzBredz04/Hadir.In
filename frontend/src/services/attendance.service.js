export async function getAttendanceHistory({
    page = 1,
    limit = 10,
    startDate,
    endDate
} = {}) {
    const params =
        new URLSearchParams();

    params.set(
        'page',
        String(page)
    );

    params.set(
        'limit',
        String(limit)
    );

    if (startDate) {
        params.set(
            'start_date',
            startDate
        );
    }

    if (endDate) {
        params.set(
            'end_date',
            endDate
        );
    }

    const payload =
        await apiRequest(
            `/attendance/history?${params.toString()}`
        );

    const data =
        getResponseData(
            payload
        );

    return {
        items:
            Array.isArray(
                data?.items
            )
                ? data.items.map(
                    normalizeAttendanceHistory
                )
                : [],

        pagination: {
            page:
                Number(
                    data?.pagination
                        ?.page
                ) || 1,

            limit:
                Number(
                    data?.pagination
                        ?.limit
                ) || limit,

            total:
                Number(
                    data?.pagination
                        ?.total
                ) || 0,

            totalPages:
                Number(
                    data?.pagination
                        ?.totalPages
                ) || 0
        }
    };
}

function normalizeAttendanceHistory(
    attendance
) {
    if (!attendance) {
        return null;
    }

    const photos =
        Array.isArray(
            attendance.photos
        )
            ? attendance.photos.map(
                photo => ({
                    id:
                        photo.id,

                    type:
                        photo.type,

                    photoUrl:
                        photo.photoUrl ??
                        photo.fileUrl ??
                        photo.file_url ??
                        null
                })
            )
            : [];

    return {
        id:
            attendance.id,

        attendanceDate:
            attendance.attendanceDate ??
            attendance.attendance_date,

        status:
            attendance.status,

        checkInTime:
            attendance.checkInTime ??
            attendance.check_in_time,

        checkInLatitude:
            attendance.checkInLatitude ??
            attendance.check_in_latitude,

        checkInLongitude:
            attendance.checkInLongitude ??
            attendance.check_in_longitude,

        checkInDistance:
            attendance.checkInDistance ??
            attendance.check_in_distance,

        checkOutTime:
            attendance.checkOutTime ??
            attendance.check_out_time,

        checkOutLatitude:
            attendance.checkOutLatitude ??
            attendance.check_out_latitude,

        checkOutLongitude:
            attendance.checkOutLongitude ??
            attendance.check_out_longitude,

        checkOutDistance:
            attendance.checkOutDistance ??
            attendance.check_out_distance,

        office:
            attendance.office
                ? {
                    id:
                        attendance.office.id,

                    name:
                        attendance.office.name,

                    address:
                        attendance.office.address,

                    radiusMeter:
                        attendance.office.radiusMeter ??
                        attendance.office.radius_meter
                }
                : null,

        photos
    };
}