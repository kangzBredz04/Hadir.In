import {
    checkIn as checkInService,
    checkOut as checkOutService,
    getTodayAttendance as getTodayAttendanceService,
    getAttendanceHistory as getAttendanceHistoryService
} from '../services/attendance.service.js';

import {
    successResponse
} from '../utils/response.js';

const checkIn = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await checkInService({
                userId:
                    req.user.id,

                latitude:
                    req.body.latitude,

                longitude:
                    req.body.longitude,

                photo:
                    req.file
            });

        return successResponse(
            res,
            {
                statusCode:
                    201,

                message:
                    'Check-in berhasil',

                data:
                    result
            }
        );
    } catch (error) {
        next(error);
    }
};

const checkOut = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await checkOutService({
                userId:
                    req.user.id,

                latitude:
                    req.body.latitude,

                longitude:
                    req.body.longitude,

                photo:
                    req.file
            });

        return successResponse(
            res,
            {
                statusCode:
                    200,

                message:
                    'Check-out berhasil',

                data:
                    result
            }
        );
    } catch (error) {
        next(error);
    }
};

const getTodayAttendance = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await getTodayAttendanceService(
                req.user.id
            );

        return successResponse(
            res,
            {
                message:
                    'Data absensi hari ini berhasil diambil',

                data:
                    result
            }
        );
    } catch (error) {
        next(error);
    }
};

const getAttendanceHistory = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await getAttendanceHistoryService({
                userId:
                    req.user.id,

                page:
                    req.query.page,

                limit:
                    req.query.limit,

                startDate:
                    req.query.start_date,

                endDate:
                    req.query.end_date
            });

        return successResponse(
            res,
            {
                message:
                    'Riwayat absensi berhasil diambil',

                data:
                    result
            }
        );
    } catch (error) {
        next(error);
    }
};

export {
    checkIn,
    checkOut,
    getTodayAttendance,
    getAttendanceHistory
};