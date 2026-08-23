import AppError from '../utils/AppError.js';

const authorize = (
    ...allowedRoles
) => {
    const roles =
        allowedRoles.flat();

    return (
        req,
        res,
        next
    ) => {
        if (!req.user) {
            return next(
                new AppError(
                    'Authentication diperlukan',
                    401
                )
            );
        }

        if (
            !roles.includes(
                req.user.role
            )
        ) {
            return next(
                new AppError(
                    'Anda tidak memiliki akses ke resource ini',
                    403
                )
            );
        }

        next();
    };
};

export {
    authorize
};