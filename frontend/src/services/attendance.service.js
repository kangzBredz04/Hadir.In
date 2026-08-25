import {
    apiRequest,
    getResponseData
} from './api';

/*
 * Digunakan untuk mencegah request
 * /attendance/today identik berjalan
 * bersamaan, terutama saat development
 * dengan React StrictMode.
 */
let todayRequestPromise = null;

/**
 * Normalisasi object office dari backend.
 */
function normalizeOffice(office) {
    if (!office) {
        return null;
    }

    return {
        id:
            office.id ?? null,

        name:
            office.name ?? '',

        address:
            office.address ?? '',

        latitude:
            office.latitude !== undefined &&
                office.latitude !== null
                ? Number(office.latitude)
                : null,

        longitude:
            office.longitude !== undefined &&
                office.longitude !== null
                ? Number(office.longitude)
                : null,

        radiusMeter:
            office.radiusMeter ??
            office.radius_meter ??
            null
    };
}

/**
 * Normalisasi photo attendance.
 *
 * Backend kita mengirim photoUrl
 * berupa signed URL/private URL.
 */
function normalizePhoto(photo) {
    if (!photo) {
        return null;
    }

    return {
        id:
            photo.id ?? null,

        type:
            photo.type ?? null,

        photoUrl:
            photo.photoUrl ??
            photo.fileUrl ??
            photo.file_url ??
            null,

        createdAt:
            photo.createdAt ??
            photo.created_at ??
            null
    };
}

/**
 * Normalisasi object attendance.
 *
 * Dibuat toleran terhadap camelCase
 * maupun snake_case.
 */
function normalizeAttendance(attendance) {
    if (!attendance) {
        return null;
    }

    return {
        id:
            attendance.id ??
            attendance.attendanceId ??
            attendance.attendance_id ??
            null,

        attendanceDate:
            attendance.attendanceDate ??
            attendance.attendance_date ??
            null,

        status:
            attendance.status ?? null,

        checkInTime:
            attendance.checkInTime ??
            attendance.check_in_time ??
            null,

        checkInLatitude:
            attendance.checkInLatitude ??
            attendance.check_in_latitude ??
            null,

        checkInLongitude:
            attendance.checkInLongitude ??
            attendance.check_in_longitude ??
            null,

        checkInDistance:
            attendance.checkInDistance ??
            attendance.check_in_distance ??
            null,

        checkOutTime:
            attendance.checkOutTime ??
            attendance.check_out_time ??
            null,

        checkOutLatitude:
            attendance.checkOutLatitude ??
            attendance.check_out_latitude ??
            null,

        checkOutLongitude:
            attendance.checkOutLongitude ??
            attendance.check_out_longitude ??
            null,

        checkOutDistance:
            attendance.checkOutDistance ??
            attendance.check_out_distance ??
            null,

        office:
            normalizeOffice(
                attendance.office
            ),

        photos:
            Array.isArray(
                attendance.photos
            )
                ? attendance.photos
                    .map(normalizePhoto)
                    .filter(Boolean)
                : []
    };
}

/**
 * GET /api/attendance/today
 *
 * Digunakan oleh:
 * - Employee Dashboard
 * - Attendance Page
 */
async function getTodayAttendance({
    force = false
} = {}) {
    /*
     * Kalau request sebelumnya masih berjalan,
     * gunakan promise yang sama.
     */
    if (
        !force &&
        todayRequestPromise
    ) {
        return todayRequestPromise;
    }

    const request =
        apiRequest(
            '/attendance/today'
        )
            .then(payload => {
                const data =
                    getResponseData(
                        payload
                    );

                return {
                    date:
                        data?.date ??
                        null,

                    attendance:
                        normalizeAttendance(
                            data?.attendance
                        )
                };
            });

    todayRequestPromise =
        request.finally(() => {
            todayRequestPromise =
                null;
        });

    return todayRequestPromise;
}

/**
 * Membuat FormData untuk
 * Check-In dan Check-Out.
 *
 * Frontend hanya mengirim:
 * - photo
 * - latitude
 * - longitude
 *
 * Jangan mengirim user_id.
 */
function createAttendanceFormData({
    photo,
    latitude,
    longitude
}) {
    if (
        !(photo instanceof Blob)
    ) {
        throw new Error(
            'Foto absensi belum tersedia.'
        );
    }

    if (
        latitude === undefined ||
        latitude === null ||
        longitude === undefined ||
        longitude === null
    ) {
        throw new Error(
            'Lokasi absensi belum tersedia.'
        );
    }

    const parsedLatitude =
        Number(latitude);

    const parsedLongitude =
        Number(longitude);

    if (
        !Number.isFinite(
            parsedLatitude
        ) ||
        !Number.isFinite(
            parsedLongitude
        )
    ) {
        throw new Error(
            'Koordinat lokasi tidak valid.'
        );
    }

    const formData =
        new FormData();

    formData.append(
        'photo',
        photo
    );

    formData.append(
        'latitude',
        String(parsedLatitude)
    );

    formData.append(
        'longitude',
        String(parsedLongitude)
    );

    return formData;
}

/**
 * POST /api/attendance/check-in
 */
async function checkInAttendance({
    photo,
    latitude,
    longitude
}) {
    const formData =
        createAttendanceFormData({
            photo,
            latitude,
            longitude
        });

    const payload =
        await apiRequest(
            '/attendance/check-in',
            {
                method: 'POST',

                /*
                 * Jangan set Content-Type manual.
                 * Browser akan membuat:
                 *
                 * multipart/form-data;
                 * boundary=...
                 */
                body:
                    formData
            }
        );

    const data =
        getResponseData(
            payload
        );

    return {
        attendanceId:
            data?.attendanceId ??
            data?.attendance_id ??
            null,

        attendanceDate:
            data?.attendanceDate ??
            data?.attendance_date ??
            null,

        checkInTime:
            data?.checkInTime ??
            data?.check_in_time ??
            null,

        distance:
            data?.distance ??
            null,

        radius:
            data?.radius ??
            null,

        office:
            normalizeOffice(
                data?.office
            ),

        photoUrl:
            data?.photoUrl ??
            data?.photo_url ??
            null
    };
}

/**
 * POST /api/attendance/check-out
 */
async function checkOutAttendance({
    photo,
    latitude,
    longitude
}) {
    const formData =
        createAttendanceFormData({
            photo,
            latitude,
            longitude
        });

    const payload =
        await apiRequest(
            '/attendance/check-out',
            {
                method: 'POST',
                body: formData
            }
        );

    const data =
        getResponseData(
            payload
        );

    return {
        attendanceId:
            data?.attendanceId ??
            data?.attendance_id ??
            null,

        attendanceDate:
            data?.attendanceDate ??
            data?.attendance_date ??
            null,

        checkOutTime:
            data?.checkOutTime ??
            data?.check_out_time ??
            null,

        distance:
            data?.distance ??
            null,

        radius:
            data?.radius ??
            null,

        office:
            normalizeOffice(
                data?.office
            ),

        photoUrl:
            data?.photoUrl ??
            data?.photo_url ??
            null
    };
}

/**
 * GET /api/attendance/history
 *
 * Query:
 * page
 * limit
 * start_date
 * end_date
 */
async function getAttendanceHistory({
    page = 1,
    limit = 10,
    startDate = '',
    endDate = ''
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

    const pagination =
        data?.pagination ??
        {};

    return {
        items:
            Array.isArray(
                data?.items
            )
                ? data.items
                    .map(
                        normalizeAttendance
                    )
                    .filter(Boolean)
                : [],

        pagination: {
            page:
                Number(
                    pagination.page
                ) || 1,

            limit:
                Number(
                    pagination.limit
                ) || limit,

            total:
                Number(
                    pagination.total
                ) || 0,

            totalPages:
                Number(
                    pagination.totalPages ??
                    pagination.total_pages
                ) || 0
        }
    };
}

/*
 * NAMED EXPORT
 *
 * Bagian ini penting supaya import:
 *
 * import {
 *   getTodayAttendance
 * } from '../services/attendance.service';
 *
 * dapat bekerja.
 */
export {
    getTodayAttendance,
    checkInAttendance,
    checkOutAttendance,
    getAttendanceHistory
};