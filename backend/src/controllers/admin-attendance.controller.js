import {
    getAdminAttendance as getAdminAttendanceService,
    getAdminAttendanceById as getAdminAttendanceByIdService,
    getAttendanceSummary as getAttendanceSummaryService
} from '../services/admin-attendance.service.js';

import {
    successResponse
} from '../utils/response.js';

const getAdminAttendance = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await getAdminAttendanceService({
                page:
                    req.query.page,

                limit:
                    req.query.limit,

                date:
                    req.query.date,

                startDate:
                    req.query.start_date,

                endDate:
                    req.query.end_date,

                userId:
                    req.query.user_id,

                employeeId:
                    req.query.employee_id,

                officeId:
                    req.query.office_id,

                status:
                    req.query.status
            });

        return successResponse(
            res,
            {
                message:
                    'Data absensi berhasil diambil',

                data:
                    result
            }
        );
    } catch (error) {
        next(error);
    }
};

const getAdminAttendanceById =
    async (
        req,
        res,
        next
    ) => {
        try {
            const attendance =
                await getAdminAttendanceByIdService(
                    req.params.id
                );

            return successResponse(
                res,
                {
                    message:
                        'Detail absensi berhasil diambil',

                    data:
                        attendance
                }
            );
        } catch (error) {
            next(error);
        }
    };

const getAttendanceSummary =
    async (
        req,
        res,
        next
    ) => {
        try {
            const result =
                await getAttendanceSummaryService({
                    date:
                        req.query.date,

                    startDate:
                        req.query.start_date,

                    endDate:
                        req.query.end_date,

                    userId:
                        req.query.user_id,

                    employeeId:
                        req.query.employee_id,

                    officeId:
                        req.query.office_id,

                    status:
                        req.query.status
                });

            return successResponse(
                res,
                {
                    message:
                        'Rekap absensi berhasil diambil',

                    data:
                        result
                }
            );
        } catch (error) {
            next(error);
        }
    };

export {
    getAdminAttendance,
    getAdminAttendanceById,
    getAttendanceSummary
};