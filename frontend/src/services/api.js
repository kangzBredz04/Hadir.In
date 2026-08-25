import {
    AUTH_UNAUTHORIZED_EVENT,
    getAccessToken
} from '../utils/authStorage';

const API_URL =
    import.meta.env.VITE_API_URL
        ?.replace(/\/+$/, '');

if (!API_URL) {
    throw new Error(
        'Konfigurasi VITE_API_URL belum tersedia.'
    );
}

export class ApiError extends Error {
    constructor(
        message,
        {
            status,
            payload
        } = {}
    ) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
        this.payload = payload;
    }
}

function buildUrl(endpoint) {
    if (endpoint.startsWith('/')) {
        return `${API_URL}${endpoint}`;
    }

    return `${API_URL}/${endpoint}`;
}

async function parseResponse(
    response
) {
    if (
        response.status === 204
    ) {
        return null;
    }

    const contentType =
        response.headers.get(
            'content-type'
        );

    if (
        contentType?.includes(
            'application/json'
        )
    ) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    const text =
        await response.text();

    return text || null;
}

export async function apiRequest(
    endpoint,
    options = {}
) {
    const {
        auth = true,
        headers: customHeaders = {},
        body,
        ...fetchOptions
    } = options;

    const token =
        getAccessToken();

    const isFormData =
        body instanceof FormData;

    const shouldSerializeJson =
        body !== undefined &&
        body !== null &&
        !isFormData &&
        typeof body !== 'string' &&
        !(body instanceof Blob);

    const requestBody =
        shouldSerializeJson
            ? JSON.stringify(body)
            : body;

    const headers = {
        Accept: 'application/json',

        ...(
            requestBody &&
                !isFormData
                ? {
                    'Content-Type':
                        'application/json'
                }
                : {}
        ),

        ...(
            auth && token
                ? {
                    Authorization:
                        `Bearer ${token}`
                }
                : {}
        ),

        ...customHeaders
    };

    let response;

    try {
        response =
            await fetch(
                buildUrl(endpoint),
                {
                    ...fetchOptions,
                    headers,
                    body: requestBody
                }
            );
    } catch {
        throw new TypeError(
            'Tidak dapat terhubung ke server.'
        );
    }

    const payload =
        await parseResponse(
            response
        );

    if (!response.ok) {
        const error =
            new ApiError(
                payload?.message ||
                'Request gagal.',
                {
                    status:
                        response.status,

                    payload
                }
            );

        /*
         * Hanya protected request
         * dengan existing token yang
         * memicu global logout.
         *
         * Login salah 401 tidak akan
         * memicu event ini karena
         * auth:false.
         */
        if (
            response.status === 401 &&
            auth &&
            token
        ) {
            window.dispatchEvent(
                new Event(
                    AUTH_UNAUTHORIZED_EVENT
                )
            );
        }

        throw error;
    }

    return payload;
}

export function getResponseData(
    payload
) {
    return payload?.data ?? null;
}

export {
    API_URL
};