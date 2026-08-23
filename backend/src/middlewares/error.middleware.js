import multer from 'multer';

import {
    ValidationError,
    UniqueConstraintError
} from 'sequelize';

const notFoundHandler = (
    req,
    res
) => {
    return res
        .status(404)
        .json({
            success: false,

            message:
                `Route ${req.method} ${req.originalUrl} tidak ditemukan`,

            errors: []
        });
};

const errorHandler = (
    err,
    req,
    res,
    next
) => {
    if (
        err instanceof
        multer.MulterError
    ) {
        if (
            err.code ===
            'LIMIT_FILE_SIZE'
        ) {
            return res
                .status(413)
                .json({
                    success:
                        false,

                    message:
                        'Ukuran foto maksimal 5 MB',

                    errors: [
                        {
                            field:
                                'photo',

                            message:
                                'Ukuran foto maksimal 5 MB'
                        }
                    ]
                });
        }

        if (
            err.code ===
            'LIMIT_UNEXPECTED_FILE'
        ) {
            return res
                .status(422)
                .json({
                    success:
                        false,

                    message:
                        'Field upload tidak valid',

                    errors: []
                });
        }

        return res
            .status(422)
            .json({
                success:
                    false,

                message:
                    'Upload file tidak valid',

                errors:
                    []
            });
    }

    if (
        err instanceof
        UniqueConstraintError
    ) {
        return res
            .status(409)
            .json({
                success:
                    false,

                message:
                    'Data sudah digunakan',

                errors:
                    err.errors.map(
                        (
                            error
                        ) => ({
                            field:
                                error.path,

                            message:
                                error.message
                        })
                    )
            });
    }

    if (
        err instanceof
        ValidationError
    ) {
        return res
            .status(422)
            .json({
                success:
                    false,

                message:
                    'Validasi database gagal',

                errors:
                    err.errors.map(
                        (
                            error
                        ) => ({
                            field:
                                error.path,

                            message:
                                error.message
                        })
                    )
            });
    }

    const statusCode =
        err.statusCode || 500;

    if (
        statusCode >= 500
    ) {
        console.error(
            'Unhandled error:',
            err
        );
    }

    return res
        .status(statusCode)
        .json({
            success:
                false,

            message:
                statusCode === 500
                    ? 'Terjadi kesalahan pada server'
                    : err.message,

            errors:
                err.errors || []
        });
};

export {
    notFoundHandler,
    errorHandler
};