import {
    Op,
    UniqueConstraintError
} from 'sequelize';

import {
    sequelize,
    User,
    Office,
    Attendance,
    AttendancePhoto
} from '../models/index.js';

import AppError from '../utils/AppError.js';

import {
    getDateInTimezone
} from '../utils/date.js';

import {
    checkLocationAgainstOffice
} from './location.service.js';

import {
    buildAttendancePhotoPath,
    uploadFile,
    safelyDeleteFile,
    getAuthenticatedFileUrl,
    getPhotoUrlForResponse
} from './storage.service.js';

import {
    normalizePagination,
    buildPagination
} from '../utils/pagination.js';

const getEmployeeWithOffice = async (
    userId,
    transaction
) => {
    const user =
        await User.findByPk(
            userId,
            {
                include: [
                    {
                        model:
                            Office,

                        as:
                            'office',

                        required:
                            false
                    }
                ],

                transaction
            }
        );

    if (!user) {
        throw new AppError(
            'User tidak ditemukan',
            404
        );
    }

    if (!user.isActive) {
        throw new AppError(
            'Akun Anda sedang tidak aktif',
            403
        );
    }

    if (
        user.role !==
        'EMPLOYEE'
    ) {
        throw new AppError(
            'Hanya employee yang dapat melakukan absensi',
            403
        );
    }

    if (!user.officeId) {
        throw new AppError(
            'Anda belum terdaftar pada kantor',
            422
        );
    }

    if (!user.office) {
        throw new AppError(
            'Data kantor tidak ditemukan',
            404
        );
    }

    return user;
};

const checkIn = async ({
    userId,
    latitude,
    longitude,
    photo
}) => {
    let uploadedPath = null;

    let result;

    try {
        result =
            await sequelize.transaction(
                async (
                    transaction
                ) => {
                    const user =
                        await getEmployeeWithOffice(
                            userId,
                            transaction
                        );

                    const office =
                        user.office;

                    if (
                        !office.isActive
                    ) {
                        throw new AppError(
                            'Kantor sedang tidak aktif',
                            422
                        );
                    }

                    const attendanceDate =
                        getDateInTimezone();

                    const existingAttendance =
                        await Attendance.findOne({
                            where: {
                                userId,
                                attendanceDate
                            },

                            transaction
                        });

                    if (
                        existingAttendance
                    ) {
                        throw new AppError(
                            'Anda sudah melakukan check-in hari ini',
                            409
                        );
                    }

                    const locationResult =
                        checkLocationAgainstOffice({
                            latitude:
                                Number(
                                    latitude
                                ),

                            longitude:
                                Number(
                                    longitude
                                ),

                            officeLatitude:
                                office.latitude,

                            officeLongitude:
                                office.longitude,

                            radiusMeter:
                                office.radiusMeter
                        });

                    if (
                        !locationResult
                    ) {
                        throw new AppError(
                            'Anda berada di luar jangkauan kantor',
                            422,
                            [
                                {
                                    field:
                                        'location',

                                    distance:
                                        locationResult
                                            .distance,

                                    allowedRadius:
                                        locationResult
                                            .allowedRadius
                                }
                            ]
                        );
                    }

                    const attendance =
                        await Attendance.create(
                            {
                                userId:
                                    user.id,

                                officeId:
                                    office.id,

                                attendanceDate,

                                checkInTime:
                                    new Date(),

                                checkInLatitude:
                                    Number(
                                        latitude
                                    ),

                                checkInLongitude:
                                    Number(
                                        longitude
                                    ),

                                checkInDistance:
                                    locationResult
                                        .distance,

                                status:
                                    'PRESENT'
                            },
                            {
                                transaction
                            }
                        );

                    const mimeType =
                        photo.detectedMimeType;

                    const filePath =
                        buildAttendancePhotoPath({
                            attendanceDate,

                            userId:
                                user.id,

                            attendanceId:
                                attendance.id,

                            type:
                                'CHECK_IN',

                            mimeType
                        });

                    await uploadFile({
                        path:
                            filePath,

                        buffer:
                            photo.buffer,

                        contentType:
                            mimeType
                    });

                    uploadedPath =
                        filePath;

                    const fileUrl =
                        getAuthenticatedFileUrl(
                            filePath
                        );

                    await AttendancePhoto.create(
                        {
                            attendanceId:
                                attendance.id,

                            type:
                                'CHECK_IN',

                            fileUrl,

                            filePath
                        },
                        {
                            transaction
                        }
                    );

                    return {
                        attendanceId:
                            attendance.id,

                        attendanceDate:
                            attendance
                                .attendanceDate,

                        checkInTime:
                            attendance
                                .checkInTime,

                        distance:
                            Number(
                                attendance
                                    .checkInDistance
                            ),

                        radius:
                            locationResult
                                .allowedRadius,

                        office: {
                            id:
                                office.id,

                            name:
                                office.name
                        },

                        filePath,

                        fileUrl
                    };
                }
            );
    } catch (error) {
        /*
         * Kalau file berhasil upload tetapi
         * transaksi DB gagal:
         *
         * hapus kembali file Storage.
         */
        if (uploadedPath) {
            await safelyDeleteFile(
                uploadedPath
            );
        }

        if (
            error instanceof
            UniqueConstraintError
        ) {
            throw new AppError(
                'Anda sudah melakukan check-in hari ini',
                409
            );
        }

        throw error;
    }

    const photoUrl =
        await getPhotoUrlForResponse(
            result.filePath,
            result.fileUrl
        );

    return {
        attendanceId:
            result.attendanceId,

        attendanceDate:
            result.attendanceDate,

        checkInTime:
            result.checkInTime,

        distance:
            result.distance,

        radius:
            result.radius,

        office:
            result.office,

        photoUrl
    };
};

const checkOut = async ({
    userId,
    latitude,
    longitude,
    photo
}) => {
    let uploadedPath = null;

    let result;

    try {
        result =
            await sequelize.transaction(
                async (
                    transaction
                ) => {
                    const attendanceDate =
                        getDateInTimezone();

                    const attendance =
                        await Attendance.findOne({
                            where: {
                                userId,
                                attendanceDate
                            },

                            include: [
                                {
                                    model:
                                        Office,

                                    as:
                                        'office',

                                    required:
                                        true
                                }
                            ],

                            transaction,

                            lock:
                                transaction
                                    .LOCK
                                    .UPDATE
                        });

                    if (!attendance) {
                        throw new AppError(
                            'Anda belum melakukan check-in hari ini',
                            404
                        );
                    }

                    if (
                        !attendance
                            .checkInTime
                    ) {
                        throw new AppError(
                            'Anda belum melakukan check-in',
                            409
                        );
                    }

                    if (
                        attendance
                            .checkOutTime
                    ) {
                        throw new AppError(
                            'Anda sudah melakukan check-out hari ini',
                            409
                        );
                    }

                    const office =
                        attendance.office;

                    const locationResult =
                        checkLocationAgainstOffice({
                            latitude:
                                Number(
                                    latitude
                                ),

                            longitude:
                                Number(
                                    longitude
                                ),

                            officeLatitude:
                                office.latitude,

                            officeLongitude:
                                office.longitude,

                            radiusMeter:
                                office.radiusMeter
                        });

                    if (
                        !locationResult
                            .isWithinRadius
                    ) {
                        throw new AppError(
                            'Anda berada di luar jangkauan kantor',
                            422,
                            [
                                {
                                    field:
                                        'location',

                                    distance:
                                        locationResult
                                            .distance,

                                    allowedRadius:
                                        locationResult
                                            .allowedRadius
                                }
                            ]
                        );
                    }

                    const mimeType =
                        photo.detectedMimeType;

                    const filePath =
                        buildAttendancePhotoPath({
                            attendanceDate:

                                attendance
                                    .attendanceDate,

                            userId,

                            attendanceId:
                                attendance.id,

                            type:
                                'CHECK_OUT',

                            mimeType
                        });

                    /*
                     * Upload dilakukan ketika row
                     * attendance sedang ter-lock.
                     *
                     * Jadi request checkout kedua
                     * tidak bisa masuk bersamaan.
                     */
                    await uploadFile({
                        path:
                            filePath,

                        buffer:
                            photo.buffer,

                        contentType:
                            mimeType
                    });

                    uploadedPath =
                        filePath;

                    const fileUrl =
                        getAuthenticatedFileUrl(
                            filePath
                        );

                    attendance.checkOutTime =
                        new Date();

                    attendance.checkOutLatitude =
                        Number(
                            latitude
                        );

                    attendance.checkOutLongitude =
                        Number(
                            longitude
                        );

                    attendance.checkOutDistance =
                        locationResult
                            .distance;

                    await attendance.save({
                        transaction
                    });

                    await AttendancePhoto.create(
                        {
                            attendanceId:
                                attendance.id,

                            type:
                                'CHECK_OUT',

                            fileUrl,

                            filePath
                        },
                        {
                            transaction
                        }
                    );

                    return {
                        attendanceId:
                            attendance.id,

                        attendanceDate:
                            attendance
                                .attendanceDate,

                        checkOutTime:
                            attendance
                                .checkOutTime,

                        distance:
                            Number(
                                attendance
                                    .checkOutDistance
                            ),

                        radius:
                            locationResult
                                .allowedRadius,

                        office: {
                            id:
                                office.id,

                            name:
                                office.name
                        },

                        filePath,

                        fileUrl
                    };
                }
            );
    } catch (error) {
        if (uploadedPath) {
            await safelyDeleteFile(
                uploadedPath
            );
        }

        if (
            error instanceof
            UniqueConstraintError
        ) {
            throw new AppError(
                'Foto check-out sudah tersimpan',
                409
            );
        }

        throw error;
    }

    const photoUrl =
        await getPhotoUrlForResponse(
            result.filePath,
            result.fileUrl
        );

    return {
        attendanceId:
            result.attendanceId,

        attendanceDate:
            result.attendanceDate,

        checkOutTime:
            result.checkOutTime,

        distance:
            result.distance,

        radius:
            result.radius,

        office:
            result.office,

        photoUrl
    };
};

const serializeAttendancePhotos =
    async (
        photos = []
    ) => {
        return Promise.all(
            photos.map(
                async (
                    photo
                ) => {
                    const data =
                        photo.toJSON
                            ? photo.toJSON()
                            : photo;

                    const photoUrl =
                        await getPhotoUrlForResponse(
                            data.filePath,
                            data.fileUrl
                        );

                    return {
                        id:
                            data.id,

                        type:
                            data.type,

                        photoUrl,

                        createdAt:
                            data.created_at
                    };
                }
            )
        );
    };

const getAttendanceHistory = async ({
    userId,
    page,
    limit,
    startDate,
    endDate
}) => {
    const pagination =
        normalizePagination({
            page,
            limit
        });

    const where = {
        userId
    };

    if (
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
                            Office,

                        as:
                            'office',

                        attributes: [
                            'id',
                            'name',
                            'address'
                        ]
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
                        ],

                        separate:
                            true,

                        order: [
                            [
                                'created_at',
                                'ASC'
                            ]
                        ]
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

    const items =
        await Promise.all(
            rows.map(
                async (
                    attendance
                ) => {
                    const data =
                        attendance
                            .toJSON();

                    data.photos =
                        await serializeAttendancePhotos(
                            attendance.photos
                        );

                    return data;
                }
            )
        );

    return {
        items,

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

const getTodayAttendance = async (
    userId
) => {
    const attendanceDate =
        getDateInTimezone();

    const attendance =
        await Attendance.findOne({
            where: {
                userId,
                attendanceDate
            },

            include: [
                {
                    model:
                        Office,

                    as:
                        'office',

                    attributes: [
                        'id',
                        'name',
                        'address',
                        'latitude',
                        'longitude',
                        'radiusMeter'
                    ]
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
                    ],

                    required:
                        false
                }
            ]
        });

    if (!attendance) {
        return {
            date:
                attendanceDate,

            attendance:
                null
        };
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

                        createdAt:
                            photo.created_at
                    };
                }
            )
        );

    return {
        date:
            attendanceDate,

        attendance:
            data
    };
};

export {
    checkIn,
    checkOut,
    getTodayAttendance,
    getAttendanceHistory
};