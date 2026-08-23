import jwt from 'jsonwebtoken';

import env from '../config/env.js';

import {
    User,
    Office
} from '../models/index.js';

import AppError from '../utils/AppError.js';

const JWT_ISSUER =
    'hadir-in-api';

const extractBearerToken = (
    authorizationHeader
) => {
    if (!authorizationHeader) {
        return null;
    }

    const parts =
        authorizationHeader
            .trim()
            .split(/\s+/);

    if (
        parts.length !== 2 ||
        parts[0].toLowerCase() !==
        'bearer'
    ) {
        return null;
    }

    return parts[1];
};

const authenticate = async (
    req,
    res,
    next
) => {
    try {
        const token =
            extractBearerToken(
                req.headers.authorization
            );

        if (!token) {
            throw new AppError(
                'Token authentication diperlukan',
                401
            );
        }

        let payload;

        try {
            payload = jwt.verify(
                token,
                env.jwtSecret,
                {
                    algorithms: [
                        'HS256'
                    ],

                    issuer:
                        JWT_ISSUER
                }
            );
        } catch (error) {
            if (
                error.name ===
                'TokenExpiredError'
            ) {
                throw new AppError(
                    'Sesi login telah berakhir. Silakan login kembali.',
                    401
                );
            }

            throw new AppError(
                'Token tidak valid',
                401
            );
        }

        if (!payload.sub) {
            throw new AppError(
                'Token tidak valid',
                401
            );
        }

        /*
         * Jangan hanya percaya data role
         * yang tersimpan di JWT.
         *
         * Ambil kondisi user terbaru
         * dari database.
         */
        const user =
            await User.findByPk(
                payload.sub,
                {
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
                                'radiusMeter',
                                'isActive'
                            ],

                            required:
                                false
                        }
                    ]
                }
            );

        if (!user) {
            throw new AppError(
                'User authentication tidak ditemukan',
                401
            );
        }

        if (!user.isActive) {
            throw new AppError(
                'Akun Anda sedang tidak aktif',
                403
            );
        }

        /*
         * req.user berasal dari hasil
         * query database, bukan dari input
         * frontend.
         */
        req.user = user;

        /*
         * Bisa digunakan jika nanti
         * memerlukan raw JWT payload.
         */
        req.auth = {
            userId:
                user.id,

            tokenPayload:
                payload
        };

        next();
    } catch (error) {
        next(error);
    }
};

export {
    authenticate
};