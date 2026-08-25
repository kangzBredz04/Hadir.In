import {
    apiRequest,
    getResponseData
} from './api';

import normalizeUser from '../utils/normalizeUser';

import {
    normalizeOffice
} from './office.service';

import {
    buildQueryString
} from '../utils/query';

function normalizePhoto(
    photo
) {
    return {
        id:
            photo.id,

        type:
            photo.type,

        photoUrl:
            photo.photoUrl ??
            photo.fileUrl ??
            photo.file_url ??
            null,

        filePath:
            photo.filePath ??
            photo.file_path ??
            null
    };
}

export function normalizeAdminAttendance(
    attendance
) {
    if (!attendance) {
        return null;
    }

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

        user:
            attendance.user
                ? normalizeUser(
                    attendance.user
                )
                : null,

        office:
            attendance.office
                ? normalizeOffice(
                    attendance.office
                )
                : null,

        photos:
            Array.isArray(
                attendance.photos
            )
                ? attendance.photos.map(
                    normalizePhoto
                )
                : []
    };
}

export async function getAdminAttendance({
    page = 1,
    limit = 10,
    date,
    startDate,
    endDate,
    employeeId,
    userId,
    officeId,
    status
} = {}) {
    const query =
        buildQueryString({
            page,
            limit,
            date,

            start_date:
                startDate,

            end_date:
                endDate,

            employee_id:
                employeeId,

            user_id:
                userId,

            office_id:
                officeId,

            status
        });

    const payload =
        await apiRequest(
            `/admin/attendance${query}`
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
                ? data.items
                    .map(
                        normalizeAdminAttendance
                    )
                    .filter(Boolean)
                : [],

        pagination:
            data?.pagination ?? {
                page,
                limit,
                total: 0,
                totalPages: 0
            }
    };
}

export async function getAdminAttendanceSummary({
    date,
    startDate,
    endDate,
    employeeId,
    userId,
    officeId
} = {}) {
    const query =
        buildQueryString({
            date,

            start_date:
                startDate,

            end_date:
                endDate,

            employee_id:
                employeeId,

            user_id:
                userId,

            office_id:
                officeId
        });

    const payload =
        await apiRequest(
            `/admin/attendance/summary${query}`
        );

    return (
        getResponseData(
            payload
        ) ?? {}
    );
}

export async function getAdminAttendanceById(
    id
) {
    const payload =
        await apiRequest(
            `/admin/attendance/${id}`
        );

    return normalizeAdminAttendance(
        getResponseData(
            payload
        )
    );
}