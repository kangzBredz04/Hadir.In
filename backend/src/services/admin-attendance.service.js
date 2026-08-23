import {
    Op
} from 'sequelize';

import {
    Attendance,
    AttendancePhoto,
    User,
    Office
} from '../models/index.js';

import AppError from '../utils/AppError.js';

import {
    getDateInTimezone
} from '../utils/date.js';

import {
    normalizePagination,
    buildPagination
} from '../utils/pagination.js';

import {
    getPhotoUrlForResponse
} from './storage.service.js';

const userAttributes = [
    'id',
    'employeeId',
    'name',
    'email',
    'role',
    'isActive'
];

const officeAttributes = [
    'id',
    'name',
    'address',
    'latitude',
    'longitude',
    'radiusMeter',
    'isActive'
];

const resolveUserFilter = async ({
    userId,
    employeeId
}) => {
    if (userId) {
        return userId;
    }

    if (!employeeId) {
        return null;
    }

    const user =
        await User.findOne({
            where: {
                employeeId: {
                    [Op.iLike]:
                        employeeId.trim()
                }
            },

            attributes: [
                'id'
            ]
        });

    if (!user) {
        return false;
    }

    return user.id;
};

const buildAttendanceWhere = async ({
    date,
    startDate,
    endDate,
    userId,
    employeeId,
    officeId,
    status,
    defaultToday = false
}) => {
    const where = {};

    if (date) {
        where.attendanceDate =
            date;
    } else if (
        startDate &&
        endDate
    ) {
        where.attendanceDate = {
            [Op.between]: [
                startDate,
                endDate
            ]
        };
    } else if (startDate) {
        where.attendanceDate = {
            [Op.gte]:
                startDate
        };
    } else if (endDate) {
        where.attendanceDate = {
            [Op.lte]:
                endDate
        };
    } else if (defaultToday) {
        where.attendanceDate =
            getDateInTimezone();
    }

    if (officeId) {
        where.officeId =
            officeId;
    }

    if (status) {
        where.status =
            status;
    }

    const resolvedUserId =
        await resolveUserFilter({
            userId,
            employeeId
        });

    if (
        resolvedUserId ===
        false
    ) {
        return {
            where,
            noMatch:
                true
        };
    }

    if (resolvedUserId) {
        where.userId =
            resolvedUserId;
    }

    return {
        where,
        noMatch:
            false
    };
};

const getAdminAttendance = async ({
    page,
    limit,
    date,
    startDate,
    endDate,
    userId,
    employeeId,
    officeId,
    status
}) => {
    const pagination =
        normalizePagination({
            page,
            limit
        });

    const {
        where,
        noMatch
    } =
        await buildAttendanceWhere({
            date,
            startDate,
            endDate,
            userId,
            employeeId,
            officeId,
            status
        });

    if (noMatch) {
        return {
            items: [],

            pagination:
                buildPagination({
                    page:
                        pagination.page,

                    limit:
                        pagination.limit,

                    total:
                        0
                })
        };
    }

    const {
        rows,
        count
    } =
        await Attendance
            .findAndCountAll({
                where,

                include: [
                    {
                        model:
                            User,

                        as:
                            'user',

                        attributes:
                            userAttributes
                    },

                    {
                        model:
                            Office,

                        as:
                            'office',

                        attributes:
                            officeAttributes
                    }
                ],

                limit:
                    pagination.limit,

                offset:
                    pagination.offset,

                distinct:
                    true,

                order: [
                    [
                        'attendanceDate',
                        'DESC'
                    ],

                    [
                        'checkInTime',
                        'DESC'
                    ]
                ]
            });

    return {
        items:
            rows,

        pagination:
            buildPagination({
                page:
                    pagination.page,

                limit:
                    pagination.limit,

                total:
                    count
            })
    };
};

const getAdminAttendanceById =
    async (
        id
    ) => {
        const attendance =
            await Attendance.findByPk(
                id,
                {
                    include: [
                        {
                            model:
                                User,

                            as:
                                'user',

                            attributes:
                                userAttributes
                        },

                        {
                            model:
                                Office,

                            as:
                                'office',

                            attributes:
                                officeAttributes
                        },

                        {
                            model:
                                AttendancePhoto,

                            as:
                                'photos',

                            attributes: [
                                'id',
                                'type',
                                'fileUrl',
                                'filePath',
                                'created_at'
                            ]
                        }
                    ]
                }
            );

        if (!attendance) {
            throw new AppError(
                'Data absensi tidak ditemukan',
                404
            );
        }

        const data =
            attendance.toJSON();

        data.photos =
            await Promise.all(
                data.photos.map(
                    async (
                        photo
                    ) => {
                        const photoUrl =
                            await getPhotoUrlForResponse(
                                photo.filePath,
                                photo.fileUrl
                            );

                        return {
                            id:
                                photo.id,

                            type:
                                photo.type,

                            photoUrl,

                            filePath:
                                photo.filePath,

                            createdAt:
                                photo.created_at
                        };
                    }
                )
            );

        return data;
    };

const getAttendanceSummary = async ({
    date,
    startDate,
    endDate,
    userId,
    employeeId,
    officeId,
    status
}) => {
    const {
        where,
        noMatch
    } =
        await buildAttendanceWhere({
            date,
            startDate,
            endDate,
            userId,
            employeeId,
            officeId,
            status,

            /*
             * Dashboard summary tanpa
             * filter tanggal berarti
             * summary hari ini.
             */
            defaultToday:
                true
        });

    if (noMatch) {
        return {
            period: {
                date:
                    date ||
                    (
                        !startDate &&
                            !endDate
                            ? getDateInTimezone()
                            : null
                    ),

                startDate:
                    startDate ||
                    null,

                endDate:
                    endDate ||
                    null
            },

            totalAttendance:
                0,

            status: {
                present:
                    0,

                late:
                    0,

                absent:
                    0
            },

            completion: {
                checkedIn:
                    0,

                checkedOut:
                    0,

                pendingCheckout:
                    0
            }
        };
    }

    const statusWhere = (
        attendanceStatus
    ) => {
        return {
            ...where,

            status:
                attendanceStatus
        };
    };

    const [
        totalAttendance,
        present,
        late,
        absent,
        checkedIn,
        checkedOut,
        pendingCheckout
    ] =
        await Promise.all([
            Attendance.count({
                where
            }),

            Attendance.count({
                where:
                    statusWhere(
                        'PRESENT'
                    )
            }),

            Attendance.count({
                where:
                    statusWhere(
                        'LATE'
                    )
            }),

            Attendance.count({
                where:
                    statusWhere(
                        'ABSENT'
                    )
            }),

            Attendance.count({
                where: {
                    ...where,

                    checkInTime: {
                        [Op.ne]:
                            null
                    }
                }
            }),

            Attendance.count({
                where: {
                    ...where,

                    checkOutTime: {
                        [Op.ne]:
                            null
                    }
                }
            }),

            Attendance.count({
                where: {
                    ...where,

                    checkInTime: {
                        [Op.ne]:
                            null
                    },

                    checkOutTime:
                        null
                }
            })
        ]);

    return {
        period: {
            date:
                date ||
                (
                    !startDate &&
                        !endDate
                        ? getDateInTimezone()
                        : null
                ),

            startDate:
                startDate ||
                null,

            endDate:
                endDate ||
                null
        },

        totalAttendance,

        status: {
            present,
            late,
            absent
        },

        completion: {
            checkedIn,
            checkedOut,
            pendingCheckout
        }
    };
};

export {
    getAdminAttendance,
    getAdminAttendanceById,
    getAttendanceSummary
};