import AppError from '../utils/AppError.js';

import {
    validateLoginInput,

    validateUserCreateInput,
    validateUserUpdateInput,

    validateOfficeCreateInput,
    validateOfficeUpdateInput,

    validateAttendanceLocationInput,

    isValidUUID,

    validateAttendanceHistoryQuery,
    validateAdminAttendanceQuery
} from '../utils/validation.js';

const handleValidation = (
    validator
) => {
    return (
        req,
        res,
        next
    ) => {
        const errors =
            validator(req.body);

        if (errors.length > 0) {
            return next(
                new AppError(
                    'Validasi gagal',
                    422,
                    errors
                )
            );
        }

        next();
    };
};

const validateLogin =
    handleValidation(
        validateLoginInput
    );

const validateUserCreate =
    handleValidation(
        validateUserCreateInput
    );

const validateUserUpdate =
    handleValidation(
        validateUserUpdateInput
    );

const validateOfficeCreate =
    handleValidation(
        validateOfficeCreateInput
    );

const validateOfficeUpdate =
    handleValidation(
        validateOfficeUpdateInput
    );

const validateAttendanceLocation =
    handleValidation(
        validateAttendanceLocationInput
    );

const validateIdParam = (
    req,
    res,
    next
) => {
    if (
        !isValidUUID(
            req.params.id
        )
    ) {
        return next(
            new AppError(
                'Format ID tidak valid',
                400
            )
        );
    }

    next();
};

const handleQueryValidation = (
    validator
) => {
    return (
        req,
        res,
        next
    ) => {
        const errors =
            validator(
                req.query
            );

        if (
            errors.length > 0
        ) {
            return next(
                new AppError(
                    'Validasi query gagal',
                    422,
                    errors
                )
            );
        }

        next();
    };
};

const validateAttendanceHistory =
    handleQueryValidation(
        validateAttendanceHistoryQuery
    );

const validateAdminAttendance =
    handleQueryValidation(
        validateAdminAttendanceQuery
    );

export {
    validateLogin,

    validateUserCreate,
    validateUserUpdate,

    validateOfficeCreate,
    validateOfficeUpdate,

    validateAttendanceLocation,

    validateIdParam,

    validateAttendanceHistory,
    validateAdminAttendance
};