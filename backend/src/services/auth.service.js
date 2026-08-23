import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import env from '../config/env.js';

import {
    User,
    Office
} from '../models/index.js';

import AppError from '../utils/AppError.js';

const JWT_ISSUER = 'hadir-in-api';

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            role: user.role,

            employeeId:
                user.employeeId
        },
        env.jwtSecret,
        {
            algorithm: 'HS256',

            expiresIn:
                env.jwtExpiresIn,

            subject:
                user.id,

            issuer:
                JWT_ISSUER
        }
    );
};

const login = async ({
    email,
    password
}) => {
    const normalizedEmail =
        email
            .trim()
            .toLowerCase();

    /*
     * Login membutuhkan password.
     *
     * Karena default scope User menyembunyikan
     * password, kita gunakan unscoped()
     * khusus pada proses authentication.
     */
    const user =
        await User
            .unscoped()
            .findOne({
                where: {
                    email:
                        normalizedEmail
                },

                include: [
                    {
                        model: Office,

                        as: 'office',

                        attributes: [
                            'id',
                            'name',
                            'address',
                            'latitude',
                            'longitude',
                            'radiusMeter',
                            'isActive'
                        ],

                        required: false
                    }
                ]
            });

    /*
     * Jangan memberitahu apakah email
     * yang salah atau password yang salah.
     */
    if (!user) {
        throw new AppError(
            'Email atau password salah',
            401
        );
    }

    let passwordValid = false;

    try {
        passwordValid =
            await argon2.verify(
                user.password,
                password
            );
    } catch {
        passwordValid = false;
    }

    if (!passwordValid) {
        throw new AppError(
            'Email atau password salah',
            401
        );
    }

    /*
     * Cek akun setelah password benar.
     */
    if (!user.isActive) {
        throw new AppError(
            'Akun Anda sedang tidak aktif',
            403
        );
    }

    const token =
        generateAccessToken(user);

    /*
     * User.toJSON() yang dibuat pada
     * Tahap 2 otomatis menghapus password.
     */
    const safeUser =
        user.toJSON();

    return {
        token,

        tokenType: 'Bearer',

        expiresIn:
            env.jwtExpiresIn,

        user:
            safeUser
    };
};

export {
    login,
    generateAccessToken
};