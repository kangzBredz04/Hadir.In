import {
    apiRequest,
    getResponseData
} from './api';

import normalizeUser from '../utils/normalizeUser';

export async function loginUser({
    email,
    password
}) {
    const payload =
        await apiRequest(
            '/auth/login',
            {
                method: 'POST',

                auth: false,

                body: {
                    email,
                    password
                }
            }
        );

    const data =
        getResponseData(
            payload
        );

    if (!data?.token) {
        throw new Error(
            'Token login tidak tersedia.'
        );
    }

    const user =
        normalizeUser(
            data.user ??
            data.profile
        );

    if (!user) {
        throw new Error(
            'Data user login tidak tersedia.'
        );
    }

    return {
        token:
            data.token,

        tokenType:
            data.tokenType ??
            'Bearer',

        expiresIn:
            data.expiresIn ??
            null,

        user
    };
}

export async function getCurrentUser() {
    /*
     * ENDPOINT BACKEND KITA:
     *
     * GET /api/users/me
     *
     * BUKAN:
     * GET /api/auth/me
     */
    const payload =
        await apiRequest(
            '/users/me'
        );

    const data =
        getResponseData(
            payload
        );

    return normalizeUser(
        data?.user ??
        data?.profile ??
        data
    );
}